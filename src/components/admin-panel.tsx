import { useMemo, useState } from "react";
import * as disk from "@/lib/chatcpu/disk";
import { useMachine } from "@/lib/chatcpu/store";

export function AdminPanel() {
  const open = useMachine((s) => s.adminOpen);
  const setAdmin = useMachine((s) => s.setAdmin);
  const setAsm = useMachine((s) => s.setAsm);
  const boot = useMachine((s) => s.boot);
  const files = useMemo(() => disk.listFiles(), [open]);
  const [selected, setSelected] = useState("/minios/kernel.py");
  const [body, setBody] = useState(() => {
    try {
      return disk.readFile("/minios/kernel.py");
    } catch {
      return "";
    }
  });

  if (!open) return null;

  function load(path: string) {
    setSelected(path);
    try {
      setBody(disk.readFile(path));
    } catch (err) {
      setBody(String(err));
    }
  }

  return (
    <section className="rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-xs tracking-[0.18em] text-muted uppercase">Admin disk</span>
        <button
          type="button"
          className="h-11 px-2 font-mono text-xs text-dim"
          onClick={() => setAdmin(false)}
        >
          Hide
        </button>
      </div>
      <p className="mb-3 font-mono text-xs text-muted">
        Inherited MiniOS image. Write rights on every file.
      </p>
      <div className="grid gap-3 md:grid-cols-[180px_1fr]">
        <ul className="max-h-56 overflow-auto rounded-md bg-bg p-2 font-mono text-[12px]">
          {files.map((f) => (
            <li key={f}>
              <button
                type="button"
                onClick={() => load(f)}
                className={`block w-full truncate rounded-sm px-2 py-2 text-left ${
                  selected === f ? "bg-chassis text-phosphor" : "text-fg"
                }`}
              >
                {f}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-40 min-w-0 flex-1 rounded-md bg-bg p-3 font-mono text-[12px] text-fg outline-none ring-1 ring-line"
            spellCheck={false}
            suppressHydrationWarning
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="h-11 rounded-md bg-phosphor px-3 font-medium text-bg"
              onClick={() => {
                disk.writeFile(selected, body);
                if (selected.endsWith(".asm")) setAsm(selected, body);
              }}
            >
              Write file
            </button>
            <button
              type="button"
              className="h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line"
              onClick={() => {
                disk.installFactory();
                boot();
                load("/minios/kernel.py");
              }}
            >
              Factory install
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
