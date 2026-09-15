import { create } from "zustand";
import { assemble } from "./assemble";
import { ChatCPU } from "./cpu";
import * as disk from "./disk";
import { BOOT_LINES, HELLO } from "./image";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "./isa";
import { runCommand } from "./shell";
import {
  defaultSnake,
  parseSnake,
  renderSnake,
  stepSnake,
  turnSnake,
  type SnakeState,
} from "./snake";

export type Mode = "shell" | "snake";
export type Line = { kind: "in" | "out" | "sys"; text: string };

function blankCrt(): string[] {
  return Array.from({ length: SCREEN_HEIGHT }, () => " ".repeat(SCREEN_WIDTH));
}

function paintCrt(text: string): string[] {
  const rows = blankCrt();
  let x = 0;
  let y = 0;
  for (const ch of text) {
    if (ch === "\n") {
      x = 0;
      y = Math.min(SCREEN_HEIGHT - 1, y + 1);
      continue;
    }
    const row = rows[y].split("");
    row[x] = ch;
    rows[y] = row.join("");
    x += 1;
    if (x >= SCREEN_WIDTH) {
      x = 0;
      y += 1;
      if (y >= SCREEN_HEIGHT) break;
    }
  }
  return rows;
}

const cpu = new ChatCPU();

type Machine = {
  crt: string[];
  status: "HALT" | "RUN" | "ERR";
  cycles: number;
  keys: number;
  lines: Line[];
  input: string;
  mode: Mode;
  snake: SnakeState;
  adminOpen: boolean;
  asmPath: string;
  asmSource: string;
  asmHex: string;
  lastError: string | null;
  boot: () => void;
  typeInput: (v: string) => void;
  submit: () => void;
  runSource: (source: string, path?: string) => void;
  saveAsm: () => void;
  resetMachine: () => void;
  clearCrt: () => void;
  setAdmin: (open: boolean) => void;
  setAsm: (path: string, source: string) => void;
  key: (code: string) => void;
  tickSnake: () => void;
  refreshRegs: () => { label: string; value: string }[];
};

function push(lines: Line[], line: Line): Line[] {
  const next = [...lines, line];
  return next.length > 200 ? next.slice(-200) : next;
}

export const useMachine = create<Machine>((set, get) => ({
  crt: blankCrt(),
  status: "HALT",
  cycles: 0,
  keys: 0,
  lines: BOOT_LINES.map((text) => ({ kind: "sys" as const, text })),
  input: "",
  mode: "shell",
  snake: defaultSnake(),
  adminOpen: true,
  asmPath: "/minios/programs/hello.asm",
  asmSource: HELLO,
  asmHex: "",
  lastError: null,

  boot: () => {
    disk.ensureDisk();
    try {
      const source = disk.readFile("/minios/programs/hello.asm");
      set({
        crt: blankCrt(),
        lines: BOOT_LINES.map((text) => ({ kind: "sys", text })),
        asmPath: "/minios/programs/hello.asm",
        asmSource: source,
        status: "HALT",
        cycles: 0,
        lastError: null,
        mode: "shell",
      });
    } catch {
      set({ lines: BOOT_LINES.map((text) => ({ kind: "sys", text })) });
    }
    cpu.reset();
  },

  typeInput: (v) => set({ input: v }),

  submit: () => {
    const { input, mode } = get();
    const line = input.trim();
    if (!line) return;
    if (mode === "snake") {
      if (line === "q" || line === "exit") {
        set({ mode: "shell", input: "", crt: blankCrt() });
      }
      return;
    }
    const result = runCommand(cpu, line);
    let lines = push(get().lines, { kind: "in", text: line });
    if (result.text === "__CLEAR__") {
      set({ lines: [], input: "", crt: blankCrt() });
      return;
    }
    if (result.text === "__REBOOT__") {
      get().boot();
      set({ input: "" });
      return;
    }
    if (result.text) lines = push(lines, { kind: "out", text: result.text });
    const patch: Partial<Machine> = {
      lines,
      input: "",
      cycles: cpu.cycles,
      status: cpu.lastError ? "ERR" : "HALT",
      lastError: cpu.lastError,
      keys: cpu.keyQueue.length,
    };
    if (result.crt) patch.crt = paintCrt(result.crt);
    if (result.admin) patch.adminOpen = true;
    if (result.mode === "snake" && result.snake) {
      patch.mode = "snake";
      patch.snake = result.snake;
      patch.crt = renderSnake(result.snake);
    }
    set(patch);
  },

  runSource: (source, path) => {
    try {
      if (path) disk.writeFile(path, source);
      const program = assemble(source);
      cpu.load(program);
      const out = cpu.run();
      set({
        asmSource: source,
        asmHex: Array.from(program)
          .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
          .join(" "),
        crt: paintCrt(out),
        cycles: cpu.cycles,
        status: "HALT",
        lastError: null,
        lines: push(get().lines, {
          kind: "out",
          text: `HALTED (${cpu.cycles} cycles)\n${out}`,
        }),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error("runSource failed", message, source?.slice?.(0, 120));
      set({
        status: "ERR",
        lastError: message,
        lines: push(get().lines, { kind: "out", text: message }),
      });
    }
  },

  saveAsm: () => {
    const { asmPath, asmSource } = get();
    disk.writeFile(asmPath, asmSource);
    set({
      lines: push(get().lines, { kind: "out", text: `WROTE ${asmPath}` }),
    });
  },

  resetMachine: () => {
    cpu.reset();
    set({
      crt: blankCrt(),
      status: "HALT",
      cycles: 0,
      keys: 0,
      lastError: null,
      mode: "shell",
    });
  },

  clearCrt: () => set({ crt: blankCrt() }),

  setAdmin: (open) => set({ adminOpen: open }),

  setAsm: (path, source) => set({ asmPath: path, asmSource: source }),

  key: (code) => {
    const { mode, snake } = get();
    if (mode === "snake") {
      if (code === "Escape") {
        disk.writeFile("/minios/snake.save", JSON.stringify(snake, null, 2));
        set({ mode: "shell" });
        return;
      }
      set({ snake: turnSnake(snake, code), keys: get().keys + 1 });
      return;
    }
    cpu.pushKey(code.charCodeAt(0));
    set({ keys: cpu.keyQueue.length });
  },

  tickSnake: () => {
    const { mode, snake } = get();
    if (mode !== "snake") return;
    const next = stepSnake(snake);
    disk.writeFile("/minios/snake.save", JSON.stringify(next, null, 2));
    set({
      snake: next,
      crt: renderSnake(next),
      status: next.alive ? "RUN" : "HALT",
    });
  },

  refreshRegs: () => {
    const snap = cpu.snapshot();
    const h = (n: number) => n.toString(16).padStart(4, "0").toUpperCase();
    return [
      { label: "A", value: h(snap.A) },
      { label: "B", value: h(snap.B) },
      { label: "C", value: h(snap.C) },
      { label: "D", value: h(snap.D) },
      { label: "PC", value: h(snap.PC) },
      { label: "SP", value: h(snap.SP) },
      { label: "Z", value: String(snap.Z) },
      { label: "CF", value: String(snap.CF) },
      { label: "N", value: String(snap.N) },
      { label: "CYC", value: String(snap.cycles) },
    ];
  },
}));
