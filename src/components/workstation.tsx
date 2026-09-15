import { useEffect } from "react";
import { AdminPanel } from "@/components/admin-panel";
import { AssemblerPanel } from "@/components/assembler-panel";
import { CrtScreen } from "@/components/crt-screen";
import { RegsPanel } from "@/components/regs-panel";
import { ShellPanel } from "@/components/shell-panel";
import { HelixPanel } from "@/components/helix-panel";
import { useMachine } from "@/lib/chatcpu/store";

export function Workstation() {
  const boot = useMachine((s) => s.boot);
  const status = useMachine((s) => s.status);
  const cycles = useMachine((s) => s.cycles);
  const keys = useMachine((s) => s.keys);
  const lastError = useMachine((s) => s.lastError);
  const runSource = useMachine((s) => s.runSource);
  const asmSource = useMachine((s) => s.asmSource);
  const clearCrt = useMachine((s) => s.clearCrt);
  const resetMachine = useMachine((s) => s.resetMachine);
  const setAdmin = useMachine((s) => s.setAdmin);
  const adminOpen = useMachine((s) => s.adminOpen);
  const tickSnake = useMachine((s) => s.tickSnake);
  const mode = useMachine((s) => s.mode);
  const snake = useMachine((s) => s.snake);
  const submit = useMachine((s) => s.submit);
  const typeInput = useMachine((s) => s.typeInput);

  useEffect(() => {
    boot();
  }, [boot]);

  useEffect(() => {
    if (mode !== "snake" || !snake.alive) return;
    const id = window.setInterval(() => tickSnake(), 140);
    return () => window.clearInterval(id);
  }, [mode, snake.alive, tickSnake]);

  return (
    <div className="min-h-dvh overflow-x-hidden bg-bg px-3 py-4 sm:px-6 sm:py-6">
      <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] tracking-[0.22em] text-phosphor uppercase">
              MiniCPU · 64 KiB · MiniOS 4.0 · Helix Mini
            </p>
            <h1 className="text-balance text-3xl font-medium tracking-tight text-fg sm:text-4xl">
              ChatCPU MiniOS
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs tabular-nums text-muted">
            <span className={status === "ERR" ? "text-danger" : "text-phosphor"}>{status}</span>
            <span>CYC {cycles}</span>
            <span>KEYS {keys}</span>
            {mode === "snake" ? <span>SCORE {snake.score}</span> : null}
          </div>
        </header>

        {lastError ? (
          <p data-testid="last-error" className="rounded-md bg-plate px-3 py-2 font-mono text-sm text-danger">
            {lastError}
          </p>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="h-11 rounded-md bg-phosphor px-3 font-medium text-bg"
            onClick={() => runSource(asmSource, "/minios/programs/hello.asm")}
          >
            Run demo
          </button>
          <button
            type="button"
            className="h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line"
            onClick={() => {
              typeInput("snake");
              submit();
            }}
          >
            Snake
          </button>
          <button
            type="button"
            className="h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line"
            onClick={clearCrt}
          >
            Clear CRT
          </button>
          <button
            type="button"
            className="h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line"
            onClick={resetMachine}
          >
            Reset
          </button>
          <button
            type="button"
            className="h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line"
            onClick={() => setAdmin(!adminOpen)}
          >
            {adminOpen ? "Hide admin" : "Admin"}
          </button>
        </div>

        <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
          <div className="flex min-w-0 flex-col gap-4">
            <CrtScreen />
            <ShellPanel />
          </div>
          <div className="flex min-w-0 flex-col gap-4">
            <RegsPanel />
            <HelixPanel />
            <AssemblerPanel />
            <AdminPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
