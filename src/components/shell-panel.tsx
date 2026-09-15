import { useEffect, useRef } from "react";
import { useMachine } from "@/lib/chatcpu/store";

export function ShellPanel() {
  const lines = useMachine((s) => s.lines);
  const input = useMachine((s) => s.input);
  const typeInput = useMachine((s) => s.typeInput);
  const submit = useMachine((s) => s.submit);
  const mode = useMachine((s) => s.mode);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  return (
    <section className="flex min-h-[240px] flex-col rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
      <div className="mb-2 font-mono text-xs tracking-[0.18em] text-muted uppercase">Shell</div>
      <div className="min-h-0 flex-1 overflow-auto font-mono text-[13px] leading-relaxed text-fg">
        {lines.map((line, i) => (
          <pre
            key={i}
            className={
              line.kind === "in"
                ? "whitespace-pre-wrap text-phosphor"
                : line.kind === "sys"
                  ? "whitespace-pre-wrap text-muted"
                  : "whitespace-pre-wrap text-fg"
            }
          >
            {line.kind === "in" ? `> ${line.text}` : line.text}
          </pre>
        ))}
        <div ref={end} />
      </div>
      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <span className="self-center font-mono text-phosphor">›</span>
        <input
          value={input}
          onChange={(e) => typeInput(e.target.value)}
          placeholder={mode === "snake" ? "Esc to leave snake" : "help ls run /minios/programs/hello.asm"}
          className="h-11 min-w-0 flex-1 rounded-md bg-bg px-3 font-mono text-sm text-fg outline-none ring-1 ring-line focus:ring-phosphor"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          suppressHydrationWarning
          disabled={mode === "snake"}
        />
        <button
          type="submit"
          className="h-11 rounded-md bg-phosphor px-4 font-medium text-bg transition-transform duration-150 active:scale-[0.98]"
        >
          Enter
        </button>
      </form>
    </section>
  );
}
