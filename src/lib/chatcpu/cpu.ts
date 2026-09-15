import {
  CYCLE_LIMIT,
  OPS,
  PORT_KEY,
  PORT_RANDOM,
  RAM_SIZE,
  ROM_SIZE,
} from "./isa";

export type CpuRegs = {
  A: number;
  B: number;
  C: number;
  D: number;
  PC: number;
  SP: number;
  Z: number;
  CF: number;
  N: number;
  cycles: number;
  running: boolean;
};

export class ChatCPU {
  A = 0;
  B = 0;
  C = 0;
  D = 0;
  PC = 0;
  SP = 0xffff;
  Z = 0;
  CF = 0;
  N = 0;
  cycles = 0;
  ram: Uint8Array;
  rom: Uint8Array;
  running = false;
  outputBuffer: string[] = [];
  keyQueue: number[] = [];
  lastError: string | null = null;

  constructor() {
    this.ram = new Uint8Array(RAM_SIZE);
    this.rom = new Uint8Array(ROM_SIZE);
  }

  snapshot(): CpuRegs {
    return {
      A: this.A,
      B: this.B,
      C: this.C,
      D: this.D,
      PC: this.PC,
      SP: this.SP,
      Z: this.Z,
      CF: this.CF,
      N: this.N,
      cycles: this.cycles,
      running: this.running,
    };
  }

  reset() {
    this.A = 0;
    this.B = 0;
    this.C = 0;
    this.D = 0;
    this.PC = 0;
    this.SP = 0xffff;
    this.Z = 0;
    this.CF = 0;
    this.N = 0;
    this.cycles = 0;
    this.ram.fill(0);
    this.rom.fill(0);
    this.running = false;
    this.outputBuffer = [];
    this.keyQueue = [];
    this.lastError = null;
  }

  load(program: Uint8Array) {
    this.reset();
    this.rom.set(program.subarray(0, ROM_SIZE));
  }

  pushKey(code: number) {
    this.keyQueue.push(code & 0xff);
  }

  private imm16() {
    const lo = this.rom[this.PC];
    const hi = this.rom[(this.PC + 1) & 0xffff];
    this.PC = (this.PC + 2) & 0xffff;
    return lo | (hi << 8);
  }

  private flags() {
    this.Z = this.A === 0 ? 1 : 0;
    this.N = this.A & 0x8000 ? 1 : 0;
  }

  step() {
    const op = this.rom[this.PC];
    this.PC = (this.PC + 1) & 0xffff;

    if (op === OPS.NOP) {
      /* */
    } else if (op === OPS.LDIA) {
      this.A = this.imm16();
    } else if (op === OPS.LDIB) {
      this.B = this.imm16();
    } else if (op === OPS.ADD) {
      const result = this.A + this.B;
      this.CF = result > 0xffff ? 1 : 0;
      this.A = result & 0xffff;
    } else if (op === OPS.SUB) {
      const result = this.A - this.B;
      this.CF = result < 0 ? 1 : 0;
      this.A = result & 0xffff;
    } else if (op === OPS.INC) {
      this.A = (this.A + 1) & 0xffff;
    } else if (op === OPS.DEC) {
      this.A = (this.A - 1) & 0xffff;
    } else if (op === OPS.IN) {
      const port = this.imm16() & 0xff;
      if (port === PORT_KEY || port === 0) {
        this.A = this.keyQueue.length ? (this.keyQueue.shift() as number) : 0;
      } else if (port === PORT_RANDOM) {
        this.A = Math.floor(Math.random() * 0x10000);
      } else {
        this.A = 0;
      }
    } else if (op === OPS.OUT) {
      this.outputBuffer.push(String.fromCharCode(this.A & 0xff));
    } else if (op === OPS.HLT) {
      this.running = false;
    } else {
      this.running = false;
      this.lastError = `Unknown opcode ${op.toString(16).padStart(2, "0").toUpperCase()} at ${((this.PC - 1) & 0xffff).toString(16).padStart(4, "0").toUpperCase()}`;
      throw new Error(this.lastError);
    }

    this.flags();
    this.cycles += 1;
  }

  run(limit = CYCLE_LIMIT): string {
    this.running = true;
    this.lastError = null;
    try {
      while (this.running) {
        if (this.cycles >= limit) {
          this.running = false;
          throw new Error("CPU cycle limit reached");
        }
        this.step();
      }
    } catch (err) {
      this.running = false;
      this.lastError = err instanceof Error ? err.message : String(err);
      throw err;
    }
    return this.output();
  }

  output() {
    return this.outputBuffer.join("");
  }
}
