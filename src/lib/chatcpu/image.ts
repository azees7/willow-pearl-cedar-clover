/** Factory MiniOS 4.0 image — inherited MiniOS plus Helix Mini 4.0. */

export const CACHE_NAME = "CHATCPU-MINIOS";
export const VERSION = `ChatCPU MiniOS
Version 4.0
CPU: ChatCPU
Coprocessor: Helix Mini 4.0
Architecture: 16-bit
RAM: 65536
ROM: 65536
Persistent storage: local disk
`;

export const CONFIG = `[machine]
name=ChatCPU
os=MiniOS
version=4.0
ram=65536
rom=65536
screen=32x16
io=256

[storage]
backend=local
persistent=true
admin=true

[helix]
core=helix-mini
version=4.0
gravity=F=T*m/d^2
sta=answer,next_action,voice_line
`;

export const KERNEL = `# ChatCPU MiniOS kernel

CPU_NAME = "ChatCPU"
ARCH = "16-bit"

RAM_SIZE = 65536
ROM_SIZE = 65536

SCREEN_WIDTH = 32
SCREEN_HEIGHT = 16

IO_PORTS = 256

PORT_KEY = 0x00
PORT_KEY_STATE = 0x01
PORT_SCREEN = 0x10
PORT_RANDOM = 0x20

print("ChatCPU kernel loaded")
print(f"CPU: {CPU_NAME}")
print(f"RAM: {RAM_SIZE} bytes")
print(f"ROM: {ROM_SIZE} bytes")
print(f"I/O: {IO_PORTS} ports")
`;

export const HELLO = `; ChatCPU Hello World

LDIA 'H'
OUT

LDIA 'e'
OUT

LDIA 'l'
OUT

LDIA 'l'
OUT

LDIA 'o'
OUT

LDIA ' '
OUT

LDIA 'C'
OUT

LDIA 'h'
OUT

LDIA 'a'
OUT

LDIA 't'
OUT

LDIA 'C'
OUT

LDIA 'P'
OUT

LDIA 'U'
OUT

HLT
`;

export const ADD_DEMO = `; A + B → OUT as digit if 0-9
LDIA 3
LDIB 4
ADD
LDIB 48
ADD
OUT
HLT
`;

export const SNAKE_SAVE = JSON.stringify(
  {
    length: 3,
    segments: [
      [10, 5],
      [9, 5],
      [8, 5],
    ],
    food: [15, 5],
    direction: 4,
    score: 0,
    alive: true,
  },
  null,
  2,
);

export const BOOT = `import js

BASE = "https://chatcpu.local"
CACHE_NAME = "CHATCPU-MINIOS"

async def disk():
    return await js.caches.open(CACHE_NAME)

def request(path):
    if not path.startswith("/"):
        path = "/" + path
    return js.Request.new(BASE + path)

async def load(path):
    c = await disk()
    r = await c.match(request(path))
    if r is None:
        raise FileNotFoundError(path)
    return await r.text()

async def boot():
    print("=" * 50)
    print("             ChatCPU MiniOS")
    print("=" * 50)
    print()
    print("Loading /minios/shell.py...")

    source = await load("/minios/shell.py")

    ns = {
        "__builtins__": __builtins__,
        "__name__": "__main__",
    }

    exec(
        compile(source, "/minios/shell.py", "exec"),
        ns
    )

    print()
    print("Shell loaded from persistent disk")
    print()
    print("MiniOS READY")
    print()

    return ns

minios = await boot()

command = minios["command"]
cpu = minios["cpu"]
assemble = minios["assemble"]

print("command() READY")
print()
print("Try:")
print('await command("help")')
print('await command("ls")')
print('await command("regs")')
`;

export const SHELL = `import shlex

# ChatCPU MiniOS 4.0 shell (inherited). Host runtime is the workstation.
# Commands: help version clear ls cat disk regs reset mem asm run snake admin helix pulse beliefs curate

CPU_NAME = "ChatCPU"
OPS = {
    "NOP": 0x00,
    "LDIA": 0x01,
    "LDIB": 0x02,
    "ADD": 0x05,
    "SUB": 0x06,
    "INC": 0x07,
    "DEC": 0x08,
    "IN": 0x12,
    "OUT": 0x13,
    "HLT": 0x15,
}
`;

export const FACTORY: Record<string, string> = {
  "/minios/boot.py": BOOT,
  "/minios/kernel.py": KERNEL,
  "/minios/shell.py": SHELL,
  "/minios/runtime.py": SHELL,
  "/minios/version.txt": VERSION,
  "/minios/config.cfg": CONFIG,
  "/minios/system.cfg": CONFIG,
  "/minios/programs/hello.asm": HELLO,
  "/minios/programs/add.asm": ADD_DEMO,
  "/minios/programs/demo.asm": HELLO,
  "/minios/snake.save": SNAKE_SAVE,
  "/minios/helix.cfg": CONFIG,
};

export const BOOT_LINES = [
  "==================================================",
  "             ChatCPU MiniOS 4.0",
  "==================================================",
  "",
  "Loading /minios/shell.py...",
  "Loading Helix Mini 4.0...",
  "Shell loaded from persistent disk",
  "",
  "MiniOS READY",
  "command() READY   cpu READY   assemble() READY",
  "",
  'Try: help · helix status · run /minios/programs/hello.asm · snake',
];
