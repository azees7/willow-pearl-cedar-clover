import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { assemble } from "./assemble.ts";
import { ChatCPU } from "./cpu.ts";

function run(source: string) {
  const cpu = new ChatCPU();
  cpu.load(assemble(source));
  const output = cpu.run();
  return { cpu, output };
}

describe("ChatCPU 4.1 core", () => {
  it("loads and stores 16-bit words in RAM", () => {
    const { cpu } = run(`
      LDIA 0xBEEF
      STA 0x2000
      LDIA 0
      LDA 0x2000
      HLT
    `);

    assert.equal(cpu.A, 0xbeef);
    assert.equal(cpu.readWord(0x2000), 0xbeef);
  });

  it("assembles labels and executes a conditional loop", () => {
    const { cpu } = run(`
      LDIA 0
      LDIB 3

    loop:
      INC
      CMP
      JNZ loop
      HLT
    `);

    assert.equal(cpu.A, 3);
    assert.equal(cpu.Z, 1);
  });

  it("CALL and RET preserve control flow through the stack", () => {
    const { cpu, output } = run(`
      LDIA 'A'
      CALL emit
      LDIA 'B'
      CALL emit
      HLT

    emit:
      PUSH
      OUT
      POP
      RET
    `);

    assert.equal(output, "AB");
    assert.equal(cpu.A, "B".charCodeAt(0));
    assert.equal(cpu.SP, 0xffff);
  });

  it("supports memory-driven branching", () => {
    const { cpu } = run(`
      LDIA 2
      STA 0x3000

    loop:
      LDA 0x3000
      DEC
      STA 0x3000
      JNZ loop
      HLT
    `);

    assert.equal(cpu.readWord(0x3000), 0);
    assert.equal(cpu.Z, 1);
  });
});
