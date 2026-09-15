import { OP_HAS_IMM, OPS, ROM_SIZE } from "./isa";

type ParsedInstruction = {
  op: keyof typeof OPS;
  operand: string;
  lineNumber: number;
};

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
  if (/^0x[0-9a-f]+$/i.test(x)) return parseInt(x.slice(2), 16);
  if (/^0b[01]+$/i.test(x)) return parseInt(x.slice(2), 2);
  if (/^-?\d+$/.test(x)) return parseInt(x, 10);
  if (x.length === 3 && x.startsWith("'") && x.endsWith("'")) {
    return x.charCodeAt(1);
  }
  return Number.NaN;
}

function labelKey(raw: string): string {
  return raw.trim().toUpperCase();
}

function parse(source: string) {
  const labels = new Map<string, number>();
  const instructions: ParsedInstruction[] = [];
  let pc = 0;

  for (const [index, raw] of source.split(/\r?\n/).entries()) {
    let line = stripComment(raw).trim();
    if (!line) continue;

    while (line) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_.]*)\s*:\s*(.*)$/);
      if (!match) break;
      const key = labelKey(match[1]);
      if (labels.has(key)) {
        throw new Error(`Duplicate label ${match[1]} on line ${index + 1}`);
      }
      labels.set(key, pc);
      line = match[2].trim();
    }

    if (!line) continue;

    const sp = line.search(/\s/);
    const opText = (sp < 0 ? line : line.slice(0, sp)).toUpperCase();
    const operand = sp < 0 ? "" : line.slice(sp).trim().replace(/,$/, "");

    if (!(opText in OPS)) {
      throw new Error(`Unknown instruction: ${opText} on line ${index + 1}`);
    }

    const op = opText as keyof typeof OPS;
    if (OP_HAS_IMM.has(op) && !operand) {
      throw new Error(`${op} needs an operand on line ${index + 1}`);
    }
    if (!OP_HAS_IMM.has(op) && operand) {
      throw new Error(`${op} does not take an operand on line ${index + 1}`);
    }

    instructions.push({ op, operand, lineNumber: index + 1 });
    pc += OP_HAS_IMM.has(op) ? 3 : 1;

    if (pc > ROM_SIZE) {
      throw new Error(`Program exceeds ${ROM_SIZE} byte ROM`);
    }
  }

  return { labels, instructions };
}

function resolveOperand(raw: string, labels: Map<string, number>, lineNumber: number): number {
  const label = labels.get(labelKey(raw));
  if (label !== undefined) return label;

  const value = number(raw);
  if (Number.isNaN(value)) {
    throw new Error(`Bad operand: ${raw} on line ${lineNumber}`);
  }
  return value & 0xffff;
}

export function assemble(source: string): Uint8Array {
  const { labels, instructions } = parse(source);
  const program: number[] = [];

  for (const { op, operand, lineNumber } of instructions) {
    program.push(OPS[op]);
    if (OP_HAS_IMM.has(op)) {
      const value = resolveOperand(operand, labels, lineNumber);
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
