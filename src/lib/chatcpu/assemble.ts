import { OP_HAS_IMM, OPS } from "./isa";

function stripComment(raw: string): string {
  let inQuote = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (ch === "'") inQuote = !inQuote;
    else if (ch === ";" && !inQuote) return raw.slice(0, i);
  }
  return raw;
}

function number(raw: string): number {
  const x = raw.trim();
  if (x.toLowerCase().startsWith("0x")) return parseInt(x, 16);
  if (x.toLowerCase().startsWith("0b")) return parseInt(x.slice(2), 2);
  if (x.length >= 3 && x.startsWith("'") && x.endsWith("'")) {
    return x.charCodeAt(1);
  }
  return parseInt(x, 10);
}

export function assemble(source: string): Uint8Array {
  const program: number[] = [];

  for (const raw of source.split(/\r?\n/)) {
    const line = stripComment(raw).trim();
    if (!line) continue;
    const sp = line.search(/\s/);
    const op = (sp < 0 ? line : line.slice(0, sp)).toUpperCase();
    const operand = sp < 0 ? "" : line.slice(sp).trim().replace(/,$/, "");
    if (!(op in OPS)) {
      throw new Error(`Unknown instruction: ${op}`);
    }
    program.push(OPS[op as keyof typeof OPS]);
    if (OP_HAS_IMM.has(op)) {
      if (!operand) throw new Error(`${op} needs an operand`);
      const value = number(operand);
      if (Number.isNaN(value)) throw new Error(`Bad operand: ${operand}`);
      program.push(value & 0xff);
      program.push((value >> 8) & 0xff);
    }
  }

  return Uint8Array.from(program);
}

export function hexDump(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0").toUpperCase())
    .join(" ");
}
