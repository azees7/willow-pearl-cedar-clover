import { assemble, hexDump } from "./assemble";
import { ChatCPU } from "./cpu";
import * as disk from "./disk";
import { HELLO } from "./image";
import { curate, pulse, stats, allBeliefs } from "@/lib/helix/mini";
import { clearCustomizationProfile, customizationStats } from "@/lib/customization/store";
import { desktopMcpConfig, MCP_SERVERS } from "@/lib/mcp/registry";
import { defaultSnake, parseSnake } from "./snake";

function splitArgs(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quote: string | null = null;
  for (const ch of line) {
    if (quote) {
      if (ch === quote) quote = null;
      else cur += ch;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (/\s/.test(ch)) {
      if (cur) out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

function formatRegs(cpu: ChatCPU) {
  const h = (n: number) => n.toString(16).padStart(4, "0").toUpperCase();
  return [
    `A  = ${h(cpu.A)} (${cpu.A})`,
    `B  = ${h(cpu.B)} (${cpu.B})`,
    `C  = ${h(cpu.C)} (${cpu.C})`,
    `D  = ${h(cpu.D)} (${cpu.D})`,
    `PC = ${h(cpu.PC)} (${cpu.PC})`,
    `SP = ${h(cpu.SP)} (${cpu.SP})`,
    `Z  = ${cpu.Z}`,
    `CF = ${cpu.CF}`,
    `N  = ${cpu.N}`,
    `CYCLES = ${cpu.cycles}`,
  ].join("\n");
}

export type ShellResult = {
  text: string;
  crt?: string;
  mode?: "shell" | "snake";
  snake?: ReturnType<typeof defaultSnake>;
  admin?: boolean;
};

export function runCommand(cpu: ChatCPU, line: string): ShellResult {
  const parts = splitArgs(line);
  if (!parts.length) return { text: "" };
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  if (cmd === "help") {
    return {
      text: `ChatCPU MiniOS 4.0

SYSTEM
  help            version         clear
  admin           setup           reboot

FILES
  ls              cat <file>
  disk            write <file>    (admin)

CPU
  regs            reset
  mem <addr> [n]

CONTEXT
  custom          custom clear

MCP BUS
  mcp             mcp config

HELIX MINI 4.0
  helix [msg]     pulse [msg]
  beliefs         curate

PROGRAMS
  asm <file>      run <file>
  demo

GAMES
  snake

ISA
  NOP LDIA LDIB ADD SUB INC DEC CMP LDA STA JMP JZ JNZ PUSH POP CALL IN OUT RET HLT`,
    };
  }

  if (cmd === "version") {
    try {
      return { text: disk.readFile("/minios/version.txt") };
    } catch (err) {
      return { text: String(err) };
    }
  }

  if (cmd === "ls") {
    const prefix = args[0] || "";
    const files = disk.listFiles().filter((p) => p.startsWith(prefix) || p.startsWith("/" + prefix));
    return { text: files.join("\n") || "(empty disk)" };
  }

  if (cmd === "disk") {
    const st = disk.diskStatus();
    return {
      text: `ChatCPU persistent disk\n${st.count} files\nbackend ${st.backend}\n\n${st.files.join("\n")}`,
    };
  }

  if (cmd === "cat") {
    if (!args[0]) return { text: "usage: cat <file>" };
    try {
      return { text: disk.readFile(args[0]) };
    } catch (err) {
      return { text: String(err) };
    }
  }

  if (cmd === "write") {
    if (args.length < 2) return { text: "usage: write <file> <text>" };
    disk.writeFile(args[0], args.slice(1).join(" "));
    return { text: `WROTE ${args[0]}` };
  }

  if (cmd === "asm") {
    if (!args[0]) return { text: "usage: asm <file>" };
    try {
      const source = disk.readFile(args[0]);
      const program = assemble(source);
      return {
        text: `ASSEMBLED ${program.length} BYTES\n\n${hexDump(program)}`,
      };
    } catch (err) {
      return { text: String(err) };
    }
  }

  if (cmd === "run") {
    if (!args[0]) return { text: "usage: run <file>" };
    try {
      const source = disk.readFile(args[0]);
      const program = assemble(source);
      cpu.load(program);
      const out = cpu.run();
      return {
        text: `HALTED (${cpu.cycles} cycles)\n\n${out}`,
        crt: out,
      };
    } catch (err) {
      return { text: cpu.lastError || String(err) };
    }
  }

  if (cmd === "demo") {
    try {
      disk.writeFile("/minios/programs/demo.asm", HELLO);
      const program = assemble(HELLO);
      cpu.load(program);
      const out = cpu.run();
      return {
        text: `HALTED (${cpu.cycles} cycles)\n\n${out}`,
        crt: out,
      };
    } catch (err) {
      return { text: String(err) };
    }
  }

  if (cmd === "regs") return { text: formatRegs(cpu) };

  if (cmd === "reset") {
    cpu.reset();
    return { text: "ChatCPU RESET OK" };
  }

  if (cmd === "mem") {
    const address = args[0] ? parseInt(args[0], args[0].startsWith("0x") ? 16 : 10) : 0;
    const length = args[1] ? parseInt(args[1], 10) : 64;
    const slice = cpu.ram.subarray(address, address + length);
    const hex = Array.from(slice)
      .map((x) => x.toString(16).padStart(2, "0").toUpperCase())
      .join(" ");
    return {
      text: `${address.toString(16).padStart(4, "0").toUpperCase()}: ${hex || "(empty)"}`,
    };
  }

  if (cmd === "clear") return { text: "__CLEAR__" };

  if (cmd === "snake") {
    let state = defaultSnake();
    try {
      state = parseSnake(disk.readFile("/minios/snake.save"));
    } catch {
      /* factory */
    }
    return {
      text: "SNAKE · WASD / arrows · eat * · hit a wall and it ends · Esc shell",
      mode: "snake",
      snake: state,
    };
  }

  if (cmd === "admin") {
    return { text: "ADMIN · disk, ROM, factory install", admin: true };
  }

  if (cmd === "custom") {
    if (args[0]?.toLowerCase() === "clear") {
      clearCustomizationProfile();
      return { text: "CUSTOMIZATION PROFILE CLEARED" };
    }
    return {
      text: `${customizationStats()}\nimporter=ready gzip+tar+jsonl\nstorage=aggregate-only local`,
    };
  }

  if (cmd === "mcp") {
    if (args[0]?.toLowerCase() === "config") {
      return { text: JSON.stringify(desktopMcpConfig(), null, 2) };
    }
    return {
      text:
        "MiniOS MCP bus\n" +
        MCP_SERVERS.map(
          (server) =>
            `${server.id}\t${server.role}\t${server.transport}\t${server.enabledByDefault ? "default-on" : "default-off"}\t${server.endpoint}`,
        ).join("\n"),
    };
  }

  if (cmd === "helix" || cmd === "pulse") {
    const q = args.join(" ") || "status";
    const sta = pulse(q, `cpu cycles=${cpu.cycles}`);
    return {
      text: `${sta.response.answer}\nnext_action: ${sta.response.next_action}\nvoice_line: ${sta.response.voice_line}`,
    };
  }

  if (cmd === "beliefs") {
    const rows = allBeliefs();
    return {
      text: `${stats()}\n\n` + rows.map((b) => `${b.category}\t${b.content}`).join("\n"),
    };
  }

  if (cmd === "curate") {
    return { text: curate() };
  }

  if (cmd === "setup") {
    disk.installFactory();
    return { text: "SETUP COMPLETE\nMiniOS 4.0 factory image installed.\nNext: helix status · run /minios/programs/hello.asm" };
  }

  if (cmd === "reboot") {
    return { text: "__REBOOT__" };
  }

  return { text: `${cmd}: command not found` };
}
