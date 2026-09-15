/** ChatCPU MiniOS ISA — 16-bit core. */

export const RAM_SIZE = 65536;
export const ROM_SIZE = 65536;
export const SCREEN_WIDTH = 32;
export const SCREEN_HEIGHT = 16;
export const CYCLE_LIMIT = 1_000_000;

export const PORT_KEY = 0x00;
export const PORT_KEY_STATE = 0x01;
export const PORT_SCREEN = 0x10;
export const PORT_RANDOM = 0x20;

export const OPS = {
  NOP: 0x00,
  LDIA: 0x01,
  LDIB: 0x02,
  ADD: 0x05,
  SUB: 0x06,
  INC: 0x07,
  DEC: 0x08,
  CMP: 0x09,
  LDA: 0x0a,
  STA: 0x0b,
  JMP: 0x0c,
  JZ: 0x0d,
  JNZ: 0x0e,
  PUSH: 0x0f,
  POP: 0x10,
  CALL: 0x11,
  IN: 0x12,
  OUT: 0x13,
  RET: 0x14,
  HLT: 0x15,
} as const;

export type OpName = keyof typeof OPS;

export const OP_HAS_IMM: ReadonlySet<string> = new Set([
  "LDIA",
  "LDIB",
  "LDA",
  "STA",
  "JMP",
  "JZ",
  "JNZ",
  "CALL",
  "IN",
]);
