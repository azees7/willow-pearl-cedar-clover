import { useMachine } from "@/lib/chatcpu/store";

export function RegsPanel() {
  const cycles = useMachine((s) => s.cycles);
  const status = useMachine((s) => s.status);
  const refreshRegs = useMachine((s) => s.refreshRegs);
  const regs = refreshRegs();

  return (
    <section className="rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
      <div className="mb-2 flex items-baseline justify-between font-mono text-xs tracking-[0.18em] text-muted uppercase">
        <span>Registers</span>
        <span className="tabular-nums text-phosphor">{status}</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-5">
        {regs.map((r) => (
          <div key={r.label} className="rounded-sm bg-bg px-2 py-1.5">
            <dt className="font-mono text-[10px] tracking-[0.16em] text-dim">{r.label}</dt>
            <dd className="font-mono text-sm tabular-nums text-phosphor">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 hidden font-mono text-[11px] text-dim sm:block">{cycles} cycles retired</p>
    </section>
  );
}
