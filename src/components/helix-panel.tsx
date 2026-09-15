import { useEffect } from "react";
import { useHelix } from "@/lib/helix/store";

export function HelixPanel() {
  const state = useHelix((s) => s.state);
  const input = useHelix((s) => s.input);
  const setInput = useHelix((s) => s.setInput);
  const pulse = useHelix((s) => s.pulse);
  const curate = useHelix((s) => s.curate);
  const last = useHelix((s) => s.last);
  const stats = useHelix((s) => s.stats);
  const beliefs = useHelix((s) => s.beliefs);
  const hydrate = useHelix((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <section className="flex min-h-[220px] min-w-0 flex-col rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
      <div className="mb-2 flex items-baseline justify-between gap-2 font-mono text-xs tracking-[0.18em] text-muted uppercase">
        <span>Helix Mini 4.0</span>
        <span className="tabular-nums text-phosphor">{state}</span>
      </div>
      <p className="mb-2 font-mono text-[11px] text-dim">{stats()}</p>
      <ul className="mb-2 max-h-20 overflow-auto font-mono text-[11px] leading-relaxed text-muted">
        {beliefs.slice(0, 6).map((b) => (
          <li key={b.id} className="truncate">
            {b.category}: {b.content}
          </li>
        ))}
      </ul>
      {last ? (
        <div className="mb-2 rounded-md bg-bg p-2 font-mono text-[12px] text-fg">
          <p>{last.response.answer}</p>
          <p className="mt-1 text-phosphor">{last.response.next_action}</p>
        </div>
      ) : (
        <p className="mb-2 font-mono text-[12px] text-dim">
          Pulse ranks beliefs by gravity F = T m / d². STA keys stay answer / next_action / voice_line.
        </p>
      )}
      <form
        className="mt-auto flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          pulse();
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="pulse Helix Mini"
          className="h-11 min-w-0 flex-1 rounded-md bg-bg px-3 font-mono text-sm text-fg outline-none ring-1 ring-line focus:ring-phosphor"
          suppressHydrationWarning
        />
        <button type="submit" className="h-11 rounded-md bg-phosphor px-3 font-medium text-bg">
          Pulse
        </button>
        <button
          type="button"
          className="h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line"
          onClick={() => curate()}
        >
          Curate
        </button>
      </form>
    </section>
  );
}
