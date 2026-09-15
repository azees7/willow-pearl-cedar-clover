import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/lib/chatcpu/isa";
import { useMachine } from "@/lib/chatcpu/store";

export function CrtScreen() {
  const crt = useMachine((s) => s.crt);
  const status = useMachine((s) => s.status);
  const mode = useMachine((s) => s.mode);
  const key = useMachine((s) => s.key);

  return (
    <section
      className="min-w-0 rounded-xl bg-bg p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
      onKeyDown={(e) => {
        if (mode === "snake") {
          e.preventDefault();
          key(e.key);
        }
      }}
      tabIndex={0}
      aria-label="CRT 32 by 16"
    >
      <div className="mb-2 flex items-baseline justify-between font-mono text-xs tracking-[0.18em] text-muted uppercase">
        <span>CRT {SCREEN_WIDTH}×{SCREEN_HEIGHT}</span>
        <span className={status === "ERR" ? "text-danger" : "text-phosphor"}>
          {mode === "snake" ? "SNAKE" : "VIDEO"}
        </span>
      </div>
      <div className="relative overflow-hidden rounded-md bg-[#070806]">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.45) 3px)",
          }}
        />
        <pre className="relative z-10 overflow-x-auto p-3 font-mono text-[10px] leading-[1.35] whitespace-pre text-phosphor sm:text-[13px]">
          {crt.join("\n")}
        </pre>
      </div>
      <p className="mt-2 font-mono text-xs text-dim">
        {mode === "snake"
          ? "Focus · WASD / arrows · Esc returns to shell"
          : "Focus and type in the shell to queue keys"}
      </p>
    </section>
  );
}
