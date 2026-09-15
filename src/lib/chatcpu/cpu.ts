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

  readWord(address: number): number {
    const a = address & 0xffff;
    const lo = this.ram[a];
    const hi = this.ram[(a + 1) & 0xffff];
    return lo | (hi << 8);
  }

  writeWord(address: number, value: number) {
    const a = address & 0xffff;
    const word = value & 0xffff;
    this.ram[a] = word & 0xff;
    this.ram[(a + 1) & 0xffff] = (word >> 8) & 0xff;
  }

  pushWord(value: number) {
    this.SP = (this.SP - 2) & 0xffff;
    this.writeWord(this.SP, value);
  }

  popWord(): number {
    const value = this.readWord(this.SP);
    this.SP = (this.SP + 2) & 0xffff;
    return value;
  }

  private imm16() {
    const lo = this.rom[this.PC];
    const hi = this.rom[(this.PC + 1) & 0xffff];
    this.PC = (this.PC + 2) & 0xffff;
    return lo | (hi << 8);
  }

  private flagsFrom(value: number) {
    const word = value & 0xffff;
    this.Z = word === 0 ? 1 : 0;
    this.N = word & 0x8000 ? 1 : 0;
  }

  private compareAB() {
    const result = this.A - this.B;
    const word = result & 0xffff;
    this.Z = word === 0 ? 1 : 0;
    this.CF = result < 0 ? 1 : 0;
    this.N = word & 0x8000 ? 1 : 0;
  }

  step() {
    const opAddress = this.PC;
    const op = this.rom[this.PC];
    this.PC = (this.PC + 1) & 0xffff;

    if (op === OPS.NOP) {
      /* no-op */
    } else if (op === OPS.LDIA) {
      this.A = this.imm16();
      this.flagsFrom(this.A);
    } else if (op === OPS.LDIB) {
      this.B = this.imm16();
    } else if (op === OPS.ADD) {
      const result = this.A + this.B;
      this.CF = result > 0xffff ? 1 : 0;
      this.A = result & 0xffff;
      this.flagsFrom(this.A);
    } else if (op === OPS.SUB) {
      const result = this.A - this.B;
      this.CF = result < 0 ? 1 : 0;
      this.A = result & 0xffff;
      this.flagsFrom(this.A);
    } else if (op === OPS.INC) {
      this.CF = this.A === 0xffff ? 1 : 0;
      this.A = (this.A + 1) & 0xffff;
      this.flagsFrom(this.A);
    } else if (op === OPS.DEC) {
      this.CF = this.A === 0 ? 1 : 0;
      this.A = (this.A - 1) & 0xffff;
      this.flagsFrom(this.A);
    } else if (op === OPS.CMP) {
      this.compareAB();
    } else if (op === OPS.LDA) {
      this.A = this.readWord(this.imm16());
      this.flagsFrom(this.A);
    } else if (op === OPS.STA) {
      this.writeWord(this.imm16(), this.A);
    } else if (op === OPS.JMP) {
      this.PC = this.imm16();
    } else if (op === OPS.JZ) {
      const target = this.imm16();
      if (this.Z) this.PC = target;
    } else if (op === OPS.JNZ) {
      const target = this.imm16();
      if (!this.Z) this.PC = target;
    } else if (op === OPS.PUSH) {
      this.pushWord(this.A);
    } else if (op === OPS.POP) {
      this.A = this.popWord();
      this.flagsFrom(this.A);
    } else if (op === OPS.CALL) {
      const target = this.imm16();
      this.pushWord(this.PC);
      this.PC = target;
    } else if (op === OPS.IN) {
      const port = this.imm16() & 0xff;
      if (port === PORT_KEY || port === 0) {
        this.A = this.keyQueue.length ? (this.keyQueue.shift() as number) : 0;
      } else if (port === PORT_RANDOM) {
        this.A = Math.floor(Math.random() * 0x10000);
      } else {
        this.A = 0;
      }
      this.flagsFrom(this.A);
    } else if (op === OPS.OUT) {
      this.outputBuffer.push(String.fromCharCode(this.A & 0xff));
    } else if (op === OPS.RET) {
      this.PC = this.popWord();
    } else if (op === OPS.HLT) {
      this.running = false;
    } else {
      this.running = false;
      this.lastError = `Unknown opcode ${op.toString(16).padStart(2, "0").toUpperCase()} at ${opAddress
        .toString(16)
        .padStart(4, "0")
        .toUpperCase()}`;
      throw new Error(this.lastError);
    }

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
