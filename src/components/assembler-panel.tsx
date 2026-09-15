import { useMachine } from "@/lib/chatcpu/store";

export function AssemblerPanel() {
  const asmPath = useMachine((s) => s.asmPath);
  const asmSource = useMachine((s) => s.asmSource);
  const asmHex = useMachine((s) => s.asmHex);
  const setAsm = useMachine((s) => s.setAsm);
  const saveAsm = useMachine((s) => s.saveAsm);
  const runSource = useMachine((s) => s.runSource);

  return (
    <section className="flex min-h-[280px] flex-col rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="font-mono text-xs tracking-[0.18em] text-muted uppercase">Assembler</span>
        <input
          value={asmPath}
          onChange={(e) => setAsm(e.target.value, asmSource)}
          className="h-9 min-w-0 flex-1 rounded-sm bg-bg px-2 font-mono text-xs text-phosphor outline-none ring-1 ring-line"
          suppressHydrationWarning
        />
      </div>
      <textarea
        value={asmSource}
        onChange={(e) => setAsm(asmPath, e.target.value)}
        className="min-h-[180px] min-w-0 flex-1 resize-y rounded-md bg-bg p-3 font-mono text-[13px] leading-relaxed text-fg outline-none ring-1 ring-line focus:ring-phosphor"
        spellCheck={false}
        suppressHydrationWarning
        aria-label="Assembly source"
      />
      {asmHex ? (
        <p className="mt-2 truncate font-mono text-[11px] text-dim" title={asmHex}>
          {asmHex}
        </p>
      ) : null}
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={saveAsm}
          className="h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => runSource(asmSource, asmPath)}
          className="h-11 rounded-md bg-phosphor px-3 font-medium text-bg"
        >
          Save and run
        </button>
        <button
          type="button"
          onClick={() => runSource(asmSource)}
          className="h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line"
        >
          Assemble
        </button>
      </div>
    </section>
  );
}
