# ChatCPU Core 4.1

ChatCPU is the machine layer under MiniOS. This document is the interface contract for agents that build new shells, skins, phone UIs, dashboards, games, or other user experiences on top of the machine.

## Boundary

Core work lives in `src/lib/chatcpu/`.

The visual layer lives in `src/components/` and is intentionally **not** part of the 4.1 core change. A future agent may replace or reinterpret the UI without reimplementing the CPU.

The current MiniOS workstation is one client of ChatCPU, not the definition of ChatCPU.

## Machine

- 16-bit word model
- 64 KiB RAM
- 64 KiB ROM
- Registers: A, B, C, D, PC, SP
- Flags: Z (zero), CF (carry/borrow), N (negative)
- Stack grows downward from `0xFFFF`
- Words are little-endian in RAM
- Programs are assembled into ROM bytecode

## ISA

| Instruction | Operand | Effect |
| --- | --- | --- |
| NOP | — | No operation |
| LDIA | imm16 | A ← immediate |
| LDIB | imm16 | B ← immediate |
| ADD | — | A ← A + B |
| SUB | — | A ← A - B |
| INC | — | A ← A + 1 |
| DEC | — | A ← A - 1 |
| CMP | — | Set flags from A - B without changing A |
| LDA | addr16 | A ← 16-bit RAM word |
| STA | addr16 | RAM word ← A |
| JMP | addr16/label | Unconditional jump |
| JZ | addr16/label | Jump when Z = 1 |
| JNZ | addr16/label | Jump when Z = 0 |
| PUSH | — | Push A as a 16-bit word |
| POP | — | Pop a 16-bit word into A |
| CALL | addr16/label | Push return PC, then jump |
| RET | — | Pop PC |
| IN | port16 | Read an input port into A |
| OUT | — | Emit low byte of A |
| HLT | — | Halt execution |

## Labels

The assembler resolves labels in a first pass.

```asm
LDIA 0
LDIB 5

loop:
INC
CMP
JNZ loop
HLT
```

Labels are case-insensitive and may contain letters, digits, underscores, and dots after the first character.

## Memory

`LDA` and `STA` operate on 16-bit little-endian words.

```asm
LDIA 0xBEEF
STA 0x2000

LDIA 0
LDA 0x2000
HLT
```

At halt, A is `0xBEEF`.

## Functions

```asm
LDIA 'A'
CALL emit
HLT

emit:
PUSH
OUT
POP
RET
```

`CALL` and `RET` use the same RAM-backed stack exposed by `PUSH` and `POP`.

## Compatibility

Existing MiniOS programs using the original instructions continue to assemble and execute. MiniOS remains 4.0; this revision is the **ChatCPU core** revision 4.1.

The factory disk includes `/minios/programs/core41.asm` as a small control-flow/function example.

## Agent rule

When experimenting with a new UI, prefer importing the existing ChatCPU store/core rather than copying CPU logic into the interface. New interfaces should be clients of the machine.
