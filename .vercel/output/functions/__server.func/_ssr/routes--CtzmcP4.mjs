import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes--CtzmcP4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Factory MiniOS 4.0 image — inherited MiniOS plus Helix Mini 4.0. */
var CACHE_NAME = "CHATCPU-MINIOS";
var VERSION = `ChatCPU MiniOS
Version 4.0
CPU: ChatCPU
Coprocessor: Helix Mini 4.0
Architecture: 16-bit
RAM: 65536
ROM: 65536
Persistent storage: local disk
`;
var CONFIG = `[machine]
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
var KERNEL = `# ChatCPU MiniOS kernel

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
var HELLO = `; ChatCPU Hello World

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
var ADD_DEMO = `; A + B → OUT as digit if 0-9
LDIA 3
LDIB 4
ADD
LDIB 48
ADD
OUT
HLT
`;
var SNAKE_SAVE = JSON.stringify({
	length: 3,
	segments: [
		[10, 5],
		[9, 5],
		[8, 5]
	],
	food: [15, 5],
	direction: 4,
	score: 0,
	alive: true
}, null, 2);
var BOOT = `import js

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
var SHELL = `import shlex

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
var FACTORY = {
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
	"/minios/helix.cfg": CONFIG
};
var BOOT_LINES = [
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
	"Try: help · helix status · run /minios/programs/hello.asm · snake"
];
var KEY$1 = CACHE_NAME;
function readAll() {
	if (typeof localStorage === "undefined") return { ...FACTORY };
	try {
		const raw = localStorage.getItem(KEY$1);
		if (!raw) return { ...FACTORY };
		const parsed = JSON.parse(raw);
		return {
			...FACTORY,
			...parsed
		};
	} catch {
		return { ...FACTORY };
	}
}
function writeAll(files) {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(KEY$1, JSON.stringify(files));
}
function listFiles() {
	return Object.keys(readAll()).sort();
}
function readFile(path) {
	const p = path.startsWith("/") ? path : `/${path}`;
	const files = readAll();
	if (!(p in files)) throw new Error(`FileNotFoundError: ${p}`);
	return files[p];
}
function writeFile(path, data) {
	const p = path.startsWith("/") ? path : `/${path}`;
	const files = readAll();
	files[p] = data;
	writeAll(files);
}
function ensureDisk() {
	if (typeof localStorage === "undefined") return;
	if (!localStorage.getItem(KEY$1)) {
		writeAll({ ...FACTORY });
		return;
	}
	const files = readAll();
	if (!files["/minios/version.txt"]?.includes("4.0")) writeAll({
		...files,
		"/minios/version.txt": VERSION,
		"/minios/config.cfg": FACTORY["/minios/config.cfg"],
		"/minios/system.cfg": FACTORY["/minios/system.cfg"],
		"/minios/helix.cfg": FACTORY["/minios/helix.cfg"],
		"/minios/shell.py": FACTORY["/minios/shell.py"]
	});
}
function installFactory() {
	writeAll({ ...FACTORY });
}
function diskStatus() {
	const files = readAll();
	return {
		backend: "local",
		name: CACHE_NAME,
		count: Object.keys(files).length,
		files: Object.keys(files).sort()
	};
}
/** ChatCPU MiniOS ISA — inherited from setup.py SHELL + runtime.py. */
var RAM_SIZE = 65536;
var ROM_SIZE = 65536;
var CYCLE_LIMIT = 1e6;
var OPS = {
	NOP: 0,
	LDIA: 1,
	LDIB: 2,
	ADD: 5,
	SUB: 6,
	INC: 7,
	DEC: 8,
	IN: 18,
	OUT: 19,
	HLT: 21
};
var OP_HAS_IMM = /* @__PURE__ */ new Set([
	"LDIA",
	"LDIB",
	"IN"
]);
function stripComment(raw) {
	let inQuote = false;
	for (let i = 0; i < raw.length; i++) {
		const ch = raw[i];
		if (ch === "'") inQuote = !inQuote;
		else if (ch === ";" && !inQuote) return raw.slice(0, i);
	}
	return raw;
}
function number(raw) {
	const x = raw.trim();
	if (x.toLowerCase().startsWith("0x")) return parseInt(x, 16);
	if (x.toLowerCase().startsWith("0b")) return parseInt(x.slice(2), 2);
	if (x.length >= 3 && x.startsWith("'") && x.endsWith("'")) return x.charCodeAt(1);
	return parseInt(x, 10);
}
function assemble(source) {
	const program = [];
	for (const raw of source.split(/\r?\n/)) {
		const line = stripComment(raw).trim();
		if (!line) continue;
		const sp = line.search(/\s/);
		const op = (sp < 0 ? line : line.slice(0, sp)).toUpperCase();
		const operand = sp < 0 ? "" : line.slice(sp).trim().replace(/,$/, "");
		if (!(op in OPS)) throw new Error(`Unknown instruction: ${op}`);
		program.push(OPS[op]);
		if (OP_HAS_IMM.has(op)) {
			if (!operand) throw new Error(`${op} needs an operand`);
			const value = number(operand);
			if (Number.isNaN(value)) throw new Error(`Bad operand: ${operand}`);
			program.push(value & 255);
			program.push(value >> 8 & 255);
		}
	}
	return Uint8Array.from(program);
}
function hexDump(bytes) {
	return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
}
var ChatCPU = class {
	A = 0;
	B = 0;
	C = 0;
	D = 0;
	PC = 0;
	SP = 65535;
	Z = 0;
	CF = 0;
	N = 0;
	cycles = 0;
	ram;
	rom;
	running = false;
	outputBuffer = [];
	keyQueue = [];
	lastError = null;
	constructor() {
		this.ram = new Uint8Array(RAM_SIZE);
		this.rom = new Uint8Array(ROM_SIZE);
	}
	snapshot() {
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
			running: this.running
		};
	}
	reset() {
		this.A = 0;
		this.B = 0;
		this.C = 0;
		this.D = 0;
		this.PC = 0;
		this.SP = 65535;
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
	load(program) {
		this.reset();
		this.rom.set(program.subarray(0, ROM_SIZE));
	}
	pushKey(code) {
		this.keyQueue.push(code & 255);
	}
	imm16() {
		const lo = this.rom[this.PC];
		const hi = this.rom[this.PC + 1 & 65535];
		this.PC = this.PC + 2 & 65535;
		return lo | hi << 8;
	}
	flags() {
		this.Z = this.A === 0 ? 1 : 0;
		this.N = this.A & 32768 ? 1 : 0;
	}
	step() {
		const op = this.rom[this.PC];
		this.PC = this.PC + 1 & 65535;
		if (op === OPS.NOP) {} else if (op === OPS.LDIA) this.A = this.imm16();
		else if (op === OPS.LDIB) this.B = this.imm16();
		else if (op === OPS.ADD) {
			const result = this.A + this.B;
			this.CF = result > 65535 ? 1 : 0;
			this.A = result & 65535;
		} else if (op === OPS.SUB) {
			const result = this.A - this.B;
			this.CF = result < 0 ? 1 : 0;
			this.A = result & 65535;
		} else if (op === OPS.INC) this.A = this.A + 1 & 65535;
		else if (op === OPS.DEC) this.A = this.A - 1 & 65535;
		else if (op === OPS.IN) {
			const port = this.imm16() & 255;
			if (port === 0 || port === 0) this.A = this.keyQueue.length ? this.keyQueue.shift() : 0;
			else if (port === 32) this.A = Math.floor(Math.random() * 65536);
			else this.A = 0;
		} else if (op === OPS.OUT) this.outputBuffer.push(String.fromCharCode(this.A & 255));
		else if (op === OPS.HLT) this.running = false;
		else {
			this.running = false;
			this.lastError = `Unknown opcode ${op.toString(16).padStart(2, "0").toUpperCase()} at ${(this.PC - 1 & 65535).toString(16).padStart(4, "0").toUpperCase()}`;
			throw new Error(this.lastError);
		}
		this.flags();
		this.cycles += 1;
	}
	run(limit = CYCLE_LIMIT) {
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
};
var DIM = 8;
var EPS = 1e-6;
var KEY = "HELIX-MINI-V4";
var SEEDS = [
	{
		category: "self_identity",
		content: "I am Helix Mini 4.0, a compact pulse agent with gravity-ranked beliefs.",
		mass: 1
	},
	{
		category: "capabilities",
		content: "I pulse, rank beliefs by F = T*m/d^2, journal, and speak STA JSON.",
		mass: .9
	},
	{
		category: "skills",
		content: "MiniOS face: helix <msg>, pulse, beliefs, curate. CPU ISA stays in ChatCPU.",
		mass: .85
	},
	{
		category: "knowledge",
		content: "ChatCPU MiniOS 4.0 is the workstation face. Full Helix-AGI dashboard stays out of Mini.",
		mass: .8
	}
];
function normalize(v) {
	let n = 0;
	for (const x of v) n += x * x;
	n = Math.sqrt(n);
	if (n < EPS) return v;
	return v.map((x) => x / n);
}
function embed(text) {
	const acc = new Array(DIM).fill(0);
	const blob = (text || "").toLowerCase();
	const tokens = blob.match(/[a-z0-9]+/g) || [blob];
	let i = 0;
	for (const tok of tokens) for (let n = 1; n <= 3; n++) for (let k = 0; k <= Math.max(0, tok.length - n); k++) {
		const g = tok.slice(k, k + n);
		let h = 2166136261;
		for (let c = 0; c < g.length; c++) h = Math.imul(h ^ g.charCodeAt(c), 16777619);
		const idx = Math.abs(h) % DIM;
		const sign = h & 1 ? 1 : -1;
		acc[idx] += sign * (1 / (1 + i * .02));
		i += 1;
	}
	return normalize(acc);
}
function dist(a, b) {
	let s = 0;
	for (let i = 0; i < DIM; i++) {
		const d = (a[i] || 0) - (b[i] || 0);
		s += d * d;
	}
	return Math.sqrt(s);
}
function gravityRank(query, beliefs, k = 4) {
	const q = embed(query);
	return beliefs.map((b) => {
		const d = dist(q, b.vec);
		const force = 1 * b.mass / (d * d + EPS);
		return {
			content: b.content,
			force,
			category: b.category
		};
	}).sort((a, b) => b.force - a.force).slice(0, k);
}
function loadBeliefs() {
	if (typeof localStorage === "undefined") return seedBeliefs();
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return seedBeliefs();
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed) || parsed.length === 0) return seedBeliefs();
		return parsed;
	} catch {
		return seedBeliefs();
	}
}
function saveBeliefs(rows) {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(KEY, JSON.stringify(rows));
}
function seedBeliefs() {
	const rows = SEEDS.map((s, i) => ({
		id: `seed-${i}`,
		category: s.category,
		content: s.content,
		mass: s.mass,
		vec: embed(s.content)
	}));
	saveBeliefs(rows);
	return rows;
}
function allBeliefs() {
	return loadBeliefs();
}
function addBelief(category, content, mass = .7) {
	const rows = loadBeliefs();
	const row = {
		id: `b-${Date.now().toString(36)}`,
		category,
		content: content.slice(0, 500),
		mass,
		vec: embed(content)
	};
	rows.push(row);
	saveBeliefs(rows);
	return row;
}
function nextAction(query) {
	const q = query.toLowerCase();
	if (/\bsnake\b/.test(q)) return "play snake on the CRT";
	if (/\bhello\b|\bdemo\b/.test(q)) return "run /minios/programs/hello.asm";
	if (/\bregs?\b|\bregister\b/.test(q)) return "show CPU registers";
	if (/\bcurate\b/.test(q)) return "run a DORMANT curator pass";
	return "await the next shell line";
}
function pulse(query, hint = "") {
	const q = (query || "status").trim();
	const beliefs = loadBeliefs();
	const neighbors = gravityRank(`${q} ${hint}`, beliefs, 4);
	const top = neighbors[0]?.content || "Helix Mini 4.0 is listening.";
	const action = nextAction(q);
	const sta = {
		answer: [
			`Pulse on “${q}”.`,
			top,
			hint ? `Machine: ${hint}` : "",
			`Next: ${action}.`
		].filter(Boolean).join(" "),
		next_action: action,
		voice_line: `Helix Mini. ${action}.`
	};
	addBelief("feedback", `pulse: ${q.slice(0, 80)}`, .4);
	return {
		agent_id: "helix-mini",
		status: "success",
		state: "ACTIVE",
		neighbors: neighbors.map((n) => ({
			content: n.content,
			force: n.force
		})),
		response: sta,
		sources: neighbors.map((n) => n.category)
	};
}
function curate() {
	addBelief("knowledge", "Curator pass reviewed recent MiniOS pulses. Gravity and STA keys still hold.", .6);
	return "curator:miniOS beliefs+1 core=journal provider=mock-curator";
}
function stats() {
	return `state=ACTIVE beliefs=${loadBeliefs().length} embed=ngram llm=mock version=4.0`;
}
var KEY_TO_DIR = {
	ArrowUp: 1,
	w: 1,
	W: 1,
	ArrowDown: 2,
	s: 2,
	S: 2,
	ArrowLeft: 3,
	a: 3,
	A: 3,
	ArrowRight: 4,
	d: 4,
	D: 4
};
var DELTA = {
	1: [0, -1],
	2: [0, 1],
	3: [-1, 0],
	4: [1, 0]
};
function defaultSnake() {
	return {
		length: 3,
		segments: [
			[10, 5],
			[9, 5],
			[8, 5]
		],
		food: [15, 5],
		direction: 4,
		score: 0,
		alive: true
	};
}
function parseSnake(raw) {
	try {
		const parsed = JSON.parse(raw);
		const base = defaultSnake();
		return {
			...base,
			...parsed,
			segments: parsed.segments?.length ? parsed.segments : base.segments,
			food: parsed.food ?? base.food,
			direction: parsed.direction || 4,
			alive: parsed.alive !== false
		};
	} catch {
		return defaultSnake();
	}
}
function occupancy(state) {
	return new Set(state.segments.map(([x, y]) => `${x},${y}`));
}
function spawnFood(state) {
	const taken = occupancy(state);
	for (let i = 0; i < 200; i++) {
		const x = Math.floor(Math.random() * 32);
		const y = Math.floor(Math.random() * 16);
		if (!taken.has(`${x},${y}`)) return [x, y];
	}
	return [0, 0];
}
function turnSnake(state, key) {
	const next = KEY_TO_DIR[key];
	if (!next || !state.alive) return state;
	if ({
		1: 2,
		2: 1,
		3: 4,
		4: 3
	}[state.direction] === next) return state;
	return {
		...state,
		direction: next
	};
}
function stepSnake(state) {
	if (!state.alive) return state;
	const [dx, dy] = DELTA[state.direction];
	const [hx, hy] = state.segments[0];
	const nx = hx + dx;
	const ny = hy + dy;
	if (nx < 0 || ny < 0 || nx >= 32 || ny >= 16) return {
		...state,
		alive: false
	};
	if (occupancy(state).has(`${nx},${ny}`)) return {
		...state,
		alive: false
	};
	const ate = nx === state.food[0] && ny === state.food[1];
	const segments = [[nx, ny], ...state.segments];
	if (!ate) segments.pop();
	return {
		...state,
		segments,
		length: segments.length,
		score: state.score + (ate ? 1 : 0),
		food: ate ? spawnFood({
			...state,
			segments
		}) : state.food
	};
}
function renderSnake(state) {
	const rows = Array.from({ length: 16 }, () => Array.from({ length: 32 }, () => " "));
	const [fx, fy] = state.food;
	if (rows[fy]) rows[fy][fx] = "*";
	state.segments.forEach(([x, y], i) => {
		if (!rows[y]) return;
		rows[y][x] = i === 0 ? state.alive ? "@" : "X" : "o";
	});
	return rows.map((r) => r.join(""));
}
function splitArgs(line) {
	const out = [];
	let cur = "";
	let quote = null;
	for (const ch of line) {
		if (quote) {
			if (ch === quote) quote = null;
			else cur += ch;
			continue;
		}
		if (ch === "\"" || ch === "'") {
			quote = ch;
			continue;
		}
		if (/\s/.test(ch)) {
			if (cur) out.push(cur);
			cur = "";
			continue;
		}
		cur += ch;
	}
	if (cur) out.push(cur);
	return out;
}
function formatRegs(cpu) {
	const h = (n) => n.toString(16).padStart(4, "0").toUpperCase();
	return [
		`A  = ${h(cpu.A)} (${cpu.A})`,
		`B  = ${h(cpu.B)} (${cpu.B})`,
		`C  = ${h(cpu.C)} (${cpu.C})`,
		`D  = ${h(cpu.D)} (${cpu.D})`,
		`PC = ${h(cpu.PC)} (${cpu.PC})`,
		`SP = ${h(cpu.SP)} (${cpu.SP})`,
		`Z  = ${cpu.Z}`,
		`CF = ${cpu.CF}`,
		`N  = ${cpu.N}`,
		`CYCLES = ${cpu.cycles}`
	].join("\n");
}
function runCommand(cpu, line) {
	const parts = splitArgs(line);
	if (!parts.length) return { text: "" };
	const cmd = parts[0].toLowerCase();
	const args = parts.slice(1);
	if (cmd === "help") return { text: `ChatCPU MiniOS 4.0

SYSTEM
  help            version         clear
  admin           setup           reboot

FILES
  ls              cat <file>
  disk            write <file>    (admin)

CPU
  regs            reset
  mem <addr> [n]

HELIX MINI 4.0
  helix [msg]     pulse [msg]
  beliefs         curate

PROGRAMS
  asm <file>      run <file>
  demo

GAMES
  snake

ISA
  NOP LDIA LDIB ADD SUB INC DEC IN OUT HLT` };
	if (cmd === "version") try {
		return { text: readFile("/minios/version.txt") };
	} catch (err) {
		return { text: String(err) };
	}
	if (cmd === "ls") {
		const prefix = args[0] || "";
		return { text: listFiles().filter((p) => p.startsWith(prefix) || p.startsWith("/" + prefix)).join("\n") || "(empty disk)" };
	}
	if (cmd === "disk") {
		const st = diskStatus();
		return { text: `ChatCPU persistent disk\n${st.count} files\nbackend ${st.backend}\n\n${st.files.join("\n")}` };
	}
	if (cmd === "cat") {
		if (!args[0]) return { text: "usage: cat <file>" };
		try {
			return { text: readFile(args[0]) };
		} catch (err) {
			return { text: String(err) };
		}
	}
	if (cmd === "write") {
		if (args.length < 2) return { text: "usage: write <file> <text>" };
		writeFile(args[0], args.slice(1).join(" "));
		return { text: `WROTE ${args[0]}` };
	}
	if (cmd === "asm") {
		if (!args[0]) return { text: "usage: asm <file>" };
		try {
			const program = assemble(readFile(args[0]));
			return { text: `ASSEMBLED ${program.length} BYTES\n\n${hexDump(program)}` };
		} catch (err) {
			return { text: String(err) };
		}
	}
	if (cmd === "run") {
		if (!args[0]) return { text: "usage: run <file>" };
		try {
			const program = assemble(readFile(args[0]));
			cpu.load(program);
			const out = cpu.run();
			return {
				text: `HALTED (${cpu.cycles} cycles)\n\n${out}`,
				crt: out
			};
		} catch (err) {
			return { text: cpu.lastError || String(err) };
		}
	}
	if (cmd === "demo") try {
		writeFile("/minios/programs/demo.asm", HELLO);
		const program = assemble(HELLO);
		cpu.load(program);
		const out = cpu.run();
		return {
			text: `HALTED (${cpu.cycles} cycles)\n\n${out}`,
			crt: out
		};
	} catch (err) {
		return { text: String(err) };
	}
	if (cmd === "regs") return { text: formatRegs(cpu) };
	if (cmd === "reset") {
		cpu.reset();
		return { text: "ChatCPU RESET OK" };
	}
	if (cmd === "mem") {
		const address = args[0] ? parseInt(args[0], args[0].startsWith("0x") ? 16 : 10) : 0;
		const length = args[1] ? parseInt(args[1], 10) : 64;
		const slice = cpu.ram.subarray(address, address + length);
		const hex = Array.from(slice).map((x) => x.toString(16).padStart(2, "0").toUpperCase()).join(" ");
		return { text: `${address.toString(16).padStart(4, "0").toUpperCase()}: ${hex || "(empty)"}` };
	}
	if (cmd === "clear") return { text: "__CLEAR__" };
	if (cmd === "snake") {
		let state = defaultSnake();
		try {
			state = parseSnake(readFile("/minios/snake.save"));
		} catch {}
		return {
			text: "SNAKE · WASD / arrows · eat * · hit a wall and it ends · Esc shell",
			mode: "snake",
			snake: state
		};
	}
	if (cmd === "admin") return {
		text: "ADMIN · disk, ROM, factory install",
		admin: true
	};
	if (cmd === "helix" || cmd === "pulse") {
		const sta = pulse(args.join(" ") || "status", `cpu cycles=${cpu.cycles}`);
		return { text: `${sta.response.answer}\nnext_action: ${sta.response.next_action}\nvoice_line: ${sta.response.voice_line}` };
	}
	if (cmd === "beliefs") {
		const rows = allBeliefs();
		return { text: `${stats()}\n\n` + rows.map((b) => `${b.category}\t${b.content}`).join("\n") };
	}
	if (cmd === "curate") return { text: curate() };
	if (cmd === "setup") {
		installFactory();
		return { text: "SETUP COMPLETE\nMiniOS 4.0 factory image installed.\nNext: helix status · run /minios/programs/hello.asm" };
	}
	if (cmd === "reboot") return { text: "__REBOOT__" };
	return { text: `${cmd}: command not found` };
}
function blankCrt() {
	return Array.from({ length: 16 }, () => " ".repeat(32));
}
function paintCrt(text) {
	const rows = blankCrt();
	let x = 0;
	let y = 0;
	for (const ch of text) {
		if (ch === "\n") {
			x = 0;
			y = Math.min(15, y + 1);
			continue;
		}
		const row = rows[y].split("");
		row[x] = ch;
		rows[y] = row.join("");
		x += 1;
		if (x >= 32) {
			x = 0;
			y += 1;
			if (y >= 16) break;
		}
	}
	return rows;
}
var cpu = new ChatCPU();
function push(lines, line) {
	const next = [...lines, line];
	return next.length > 200 ? next.slice(-200) : next;
}
var useMachine = create((set, get) => ({
	crt: blankCrt(),
	status: "HALT",
	cycles: 0,
	keys: 0,
	lines: BOOT_LINES.map((text) => ({
		kind: "sys",
		text
	})),
	input: "",
	mode: "shell",
	snake: defaultSnake(),
	adminOpen: true,
	asmPath: "/minios/programs/hello.asm",
	asmSource: HELLO,
	asmHex: "",
	lastError: null,
	boot: () => {
		ensureDisk();
		try {
			const source = readFile("/minios/programs/hello.asm");
			set({
				crt: blankCrt(),
				lines: BOOT_LINES.map((text) => ({
					kind: "sys",
					text
				})),
				asmPath: "/minios/programs/hello.asm",
				asmSource: source,
				status: "HALT",
				cycles: 0,
				lastError: null,
				mode: "shell"
			});
		} catch {
			set({ lines: BOOT_LINES.map((text) => ({
				kind: "sys",
				text
			})) });
		}
		cpu.reset();
	},
	typeInput: (v) => set({ input: v }),
	submit: () => {
		const { input, mode } = get();
		const line = input.trim();
		if (!line) return;
		if (mode === "snake") {
			if (line === "q" || line === "exit") set({
				mode: "shell",
				input: "",
				crt: blankCrt()
			});
			return;
		}
		const result = runCommand(cpu, line);
		let lines = push(get().lines, {
			kind: "in",
			text: line
		});
		if (result.text === "__CLEAR__") {
			set({
				lines: [],
				input: "",
				crt: blankCrt()
			});
			return;
		}
		if (result.text === "__REBOOT__") {
			get().boot();
			set({ input: "" });
			return;
		}
		if (result.text) lines = push(lines, {
			kind: "out",
			text: result.text
		});
		const patch = {
			lines,
			input: "",
			cycles: cpu.cycles,
			status: cpu.lastError ? "ERR" : "HALT",
			lastError: cpu.lastError,
			keys: cpu.keyQueue.length
		};
		if (result.crt) patch.crt = paintCrt(result.crt);
		if (result.admin) patch.adminOpen = true;
		if (result.mode === "snake" && result.snake) {
			patch.mode = "snake";
			patch.snake = result.snake;
			patch.crt = renderSnake(result.snake);
		}
		set(patch);
	},
	runSource: (source, path) => {
		try {
			if (path) writeFile(path, source);
			const program = assemble(source);
			cpu.load(program);
			const out = cpu.run();
			set({
				asmSource: source,
				asmHex: Array.from(program).map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" "),
				crt: paintCrt(out),
				cycles: cpu.cycles,
				status: "HALT",
				lastError: null,
				lines: push(get().lines, {
					kind: "out",
					text: `HALTED (${cpu.cycles} cycles)\n${out}`
				})
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			console.error("runSource failed", message, source?.slice?.(0, 120));
			set({
				status: "ERR",
				lastError: message,
				lines: push(get().lines, {
					kind: "out",
					text: message
				})
			});
		}
	},
	saveAsm: () => {
		const { asmPath, asmSource } = get();
		writeFile(asmPath, asmSource);
		set({ lines: push(get().lines, {
			kind: "out",
			text: `WROTE ${asmPath}`
		}) });
	},
	resetMachine: () => {
		cpu.reset();
		set({
			crt: blankCrt(),
			status: "HALT",
			cycles: 0,
			keys: 0,
			lastError: null,
			mode: "shell"
		});
	},
	clearCrt: () => set({ crt: blankCrt() }),
	setAdmin: (open) => set({ adminOpen: open }),
	setAsm: (path, source) => set({
		asmPath: path,
		asmSource: source
	}),
	key: (code) => {
		const { mode, snake } = get();
		if (mode === "snake") {
			if (code === "Escape") {
				writeFile("/minios/snake.save", JSON.stringify(snake, null, 2));
				set({ mode: "shell" });
				return;
			}
			set({
				snake: turnSnake(snake, code),
				keys: get().keys + 1
			});
			return;
		}
		cpu.pushKey(code.charCodeAt(0));
		set({ keys: cpu.keyQueue.length });
	},
	tickSnake: () => {
		const { mode, snake } = get();
		if (mode !== "snake") return;
		const next = stepSnake(snake);
		writeFile("/minios/snake.save", JSON.stringify(next, null, 2));
		set({
			snake: next,
			crt: renderSnake(next),
			status: next.alive ? "RUN" : "HALT"
		});
	},
	refreshRegs: () => {
		const snap = cpu.snapshot();
		const h = (n) => n.toString(16).padStart(4, "0").toUpperCase();
		return [
			{
				label: "A",
				value: h(snap.A)
			},
			{
				label: "B",
				value: h(snap.B)
			},
			{
				label: "C",
				value: h(snap.C)
			},
			{
				label: "D",
				value: h(snap.D)
			},
			{
				label: "PC",
				value: h(snap.PC)
			},
			{
				label: "SP",
				value: h(snap.SP)
			},
			{
				label: "Z",
				value: String(snap.Z)
			},
			{
				label: "CF",
				value: String(snap.CF)
			},
			{
				label: "N",
				value: String(snap.N)
			},
			{
				label: "CYC",
				value: String(snap.cycles)
			}
		];
	}
}));
function AdminPanel() {
	const open = useMachine((s) => s.adminOpen);
	const setAdmin = useMachine((s) => s.setAdmin);
	const setAsm = useMachine((s) => s.setAsm);
	const boot = useMachine((s) => s.boot);
	const files = (0, import_react.useMemo)(() => listFiles(), [open]);
	const [selected, setSelected] = (0, import_react.useState)("/minios/kernel.py");
	const [body, setBody] = (0, import_react.useState)(() => {
		try {
			return readFile("/minios/kernel.py");
		} catch {
			return "";
		}
	});
	if (!open) return null;
	function load(path) {
		setSelected(path);
		try {
			setBody(readFile(path));
		} catch (err) {
			setBody(String(err));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
					children: "Admin disk"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 px-2 font-mono text-xs text-dim",
					onClick: () => setAdmin(false),
					children: "Hide"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 font-mono text-xs text-muted",
				children: "Inherited MiniOS image. Write rights on every file."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-[180px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "max-h-56 overflow-auto rounded-md bg-bg p-2 font-mono text-[12px]",
					children: files.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => load(f),
						className: `block w-full truncate rounded-sm px-2 py-2 text-left ${selected === f ? "bg-chassis text-phosphor" : "text-fg"}`,
						children: f
					}) }, f))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: body,
						onChange: (e) => setBody(e.target.value),
						className: "min-h-40 min-w-0 flex-1 rounded-md bg-bg p-3 font-mono text-[12px] text-fg outline-none ring-1 ring-line",
						spellCheck: false,
						suppressHydrationWarning: true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-md bg-phosphor px-3 font-medium text-bg",
							onClick: () => {
								writeFile(selected, body);
								if (selected.endsWith(".asm")) setAsm(selected, body);
							},
							children: "Write file"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line",
							onClick: () => {
								installFactory();
								boot();
								load("/minios/kernel.py");
							},
							children: "Factory install"
						})]
					})]
				})]
			})
		]
	});
}
function AssemblerPanel() {
	const asmPath = useMachine((s) => s.asmPath);
	const asmSource = useMachine((s) => s.asmSource);
	const asmHex = useMachine((s) => s.asmHex);
	const setAsm = useMachine((s) => s.setAsm);
	const saveAsm = useMachine((s) => s.saveAsm);
	const runSource = useMachine((s) => s.runSource);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-[280px] flex-col rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs tracking-[0.18em] text-muted uppercase",
					children: "Assembler"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: asmPath,
					onChange: (e) => setAsm(e.target.value, asmSource),
					className: "h-9 min-w-0 flex-1 rounded-sm bg-bg px-2 font-mono text-xs text-phosphor outline-none ring-1 ring-line",
					suppressHydrationWarning: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				value: asmSource,
				onChange: (e) => setAsm(asmPath, e.target.value),
				className: "min-h-[180px] min-w-0 flex-1 resize-y rounded-md bg-bg p-3 font-mono text-[13px] leading-relaxed text-fg outline-none ring-1 ring-line focus:ring-phosphor",
				spellCheck: false,
				suppressHydrationWarning: true,
				"aria-label": "Assembly source"
			}),
			asmHex ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 truncate font-mono text-[11px] text-dim",
				title: asmHex,
				children: asmHex
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: saveAsm,
						className: "h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line",
						children: "Save"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => runSource(asmSource, asmPath),
						className: "h-11 rounded-md bg-phosphor px-3 font-medium text-bg",
						children: "Save and run"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => runSource(asmSource),
						className: "h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line",
						children: "Assemble"
					})
				]
			})
		]
	});
}
function CrtScreen() {
	const crt = useMachine((s) => s.crt);
	const status = useMachine((s) => s.status);
	const mode = useMachine((s) => s.mode);
	const key = useMachine((s) => s.key);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0 rounded-xl bg-bg p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
		onKeyDown: (e) => {
			if (mode === "snake") {
				e.preventDefault();
				key(e.key);
			}
		},
		tabIndex: 0,
		"aria-label": "CRT 32 by 16",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-baseline justify-between font-mono text-xs tracking-[0.18em] text-muted uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"CRT ",
					32,
					"×",
					16
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: status === "ERR" ? "text-danger" : "text-phosphor",
					children: mode === "snake" ? "SNAKE" : "VIDEO"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-md bg-[#070806]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 opacity-30",
					style: { backgroundImage: "repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.45) 3px)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "relative z-10 overflow-x-auto p-3 font-mono text-[10px] leading-[1.35] whitespace-pre text-phosphor sm:text-[13px]",
					children: crt.join("\n")
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 font-mono text-xs text-dim",
				children: mode === "snake" ? "Focus · WASD / arrows · Esc returns to shell" : "Focus and type in the shell to queue keys"
			})
		]
	});
}
function RegsPanel() {
	const cycles = useMachine((s) => s.cycles);
	const status = useMachine((s) => s.status);
	const regs = useMachine((s) => s.refreshRegs)();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-baseline justify-between font-mono text-xs tracking-[0.18em] text-muted uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Registers" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-phosphor",
					children: status
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-5",
				children: regs.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-sm bg-bg px-2 py-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
						className: "font-mono text-[10px] tracking-[0.16em] text-dim",
						children: r.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
						className: "font-mono text-sm tabular-nums text-phosphor",
						children: r.value
					})]
				}, r.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 hidden font-mono text-[11px] text-dim sm:block",
				children: [cycles, " cycles retired"]
			})
		]
	});
}
function ShellPanel() {
	const lines = useMachine((s) => s.lines);
	const input = useMachine((s) => s.input);
	const typeInput = useMachine((s) => s.typeInput);
	const submit = useMachine((s) => s.submit);
	const mode = useMachine((s) => s.mode);
	const end = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		end.current?.scrollIntoView({ block: "end" });
	}, [lines]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-[240px] flex-col rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 font-mono text-xs tracking-[0.18em] text-muted uppercase",
				children: "Shell"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 overflow-auto font-mono text-[13px] leading-relaxed text-fg",
				children: [lines.map((line, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: line.kind === "in" ? "whitespace-pre-wrap text-phosphor" : line.kind === "sys" ? "whitespace-pre-wrap text-muted" : "whitespace-pre-wrap text-fg",
					children: line.kind === "in" ? `> ${line.text}` : line.text
				}, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ref: end })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-3 flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					submit();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "self-center font-mono text-phosphor",
						children: "›"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: input,
						onChange: (e) => typeInput(e.target.value),
						placeholder: mode === "snake" ? "Esc to leave snake" : "help ls run /minios/programs/hello.asm",
						className: "h-11 min-w-0 flex-1 rounded-md bg-bg px-3 font-mono text-sm text-fg outline-none ring-1 ring-line focus:ring-phosphor",
						autoCapitalize: "off",
						autoCorrect: "off",
						spellCheck: false,
						suppressHydrationWarning: true,
						disabled: mode === "snake"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "h-11 rounded-md bg-phosphor px-4 font-medium text-bg transition-transform duration-150 active:scale-[0.98]",
						children: "Enter"
					})
				]
			})
		]
	});
}
var useHelix = create((set, get) => ({
	state: "RESTING",
	input: "",
	last: null,
	log: [],
	beliefs: [],
	hydrate: () => set({ beliefs: allBeliefs() }),
	setInput: (v) => set({ input: v }),
	pulse: (query, hint) => {
		const result = pulse((query ?? get().input).trim() || "status", hint);
		set({
			last: result,
			state: "ACTIVE",
			input: "",
			log: [...get().log, result.response.answer].slice(-12),
			beliefs: allBeliefs()
		});
		return result;
	},
	curate: () => {
		const line = curate();
		set({
			state: "DORMANT",
			log: [...get().log, line].slice(-12),
			beliefs: allBeliefs()
		});
		return line;
	},
	stats: () => stats()
}));
function HelixPanel() {
	const state = useHelix((s) => s.state);
	const input = useHelix((s) => s.input);
	const setInput = useHelix((s) => s.setInput);
	const pulse = useHelix((s) => s.pulse);
	const curate = useHelix((s) => s.curate);
	const last = useHelix((s) => s.last);
	const stats = useHelix((s) => s.stats);
	const beliefs = useHelix((s) => s.beliefs);
	const hydrate = useHelix((s) => s.hydrate);
	(0, import_react.useEffect)(() => {
		hydrate();
	}, [hydrate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-h-[220px] min-w-0 flex-col rounded-xl bg-plate p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex items-baseline justify-between gap-2 font-mono text-xs tracking-[0.18em] text-muted uppercase",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Helix Mini 4.0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-phosphor",
					children: state
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 font-mono text-[11px] text-dim",
				children: stats()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mb-2 max-h-20 overflow-auto font-mono text-[11px] leading-relaxed text-muted",
				children: beliefs.slice(0, 6).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "truncate",
					children: [
						b.category,
						": ",
						b.content
					]
				}, b.id))
			}),
			last ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 rounded-md bg-bg p-2 font-mono text-[12px] text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: last.response.answer }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-phosphor",
					children: last.response.next_action
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 font-mono text-[12px] text-dim",
				children: "Pulse ranks beliefs by gravity F = T m / d². STA keys stay answer / next_action / voice_line."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-auto flex gap-2",
				onSubmit: (e) => {
					e.preventDefault();
					pulse();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: "pulse Helix Mini",
						className: "h-11 min-w-0 flex-1 rounded-md bg-bg px-3 font-mono text-sm text-fg outline-none ring-1 ring-line focus:ring-phosphor",
						suppressHydrationWarning: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "submit",
						className: "h-11 rounded-md bg-phosphor px-3 font-medium text-bg",
						children: "Pulse"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line",
						onClick: () => curate(),
						children: "Curate"
					})
				]
			})
		]
	});
}
function Workstation() {
	const boot = useMachine((s) => s.boot);
	const status = useMachine((s) => s.status);
	const cycles = useMachine((s) => s.cycles);
	const keys = useMachine((s) => s.keys);
	const lastError = useMachine((s) => s.lastError);
	const runSource = useMachine((s) => s.runSource);
	const asmSource = useMachine((s) => s.asmSource);
	const clearCrt = useMachine((s) => s.clearCrt);
	const resetMachine = useMachine((s) => s.resetMachine);
	const setAdmin = useMachine((s) => s.setAdmin);
	const adminOpen = useMachine((s) => s.adminOpen);
	const tickSnake = useMachine((s) => s.tickSnake);
	const mode = useMachine((s) => s.mode);
	const snake = useMachine((s) => s.snake);
	const submit = useMachine((s) => s.submit);
	const typeInput = useMachine((s) => s.typeInput);
	(0, import_react.useEffect)(() => {
		boot();
	}, [boot]);
	(0, import_react.useEffect)(() => {
		if (mode !== "snake" || !snake.alive) return;
		const id = window.setInterval(() => tickSnake(), 140);
		return () => window.clearInterval(id);
	}, [
		mode,
		snake.alive,
		tickSnake
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-dvh overflow-x-hidden bg-bg px-3 py-4 sm:px-6 sm:py-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[11px] tracking-[0.22em] text-phosphor uppercase",
						children: "MiniCPU · 64 KiB · MiniOS 4.0 · Helix Mini"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-balance text-3xl font-medium tracking-tight text-fg sm:text-4xl",
						children: "ChatCPU MiniOS"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2 font-mono text-xs tabular-nums text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: status === "ERR" ? "text-danger" : "text-phosphor",
								children: status
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["CYC ", cycles] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["KEYS ", keys] }),
							mode === "snake" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["SCORE ", snake.score] }) : null
						]
					})]
				}),
				lastError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					"data-testid": "last-error",
					className: "rounded-md bg-plate px-3 py-2 font-mono text-sm text-danger",
					children: lastError
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-md bg-phosphor px-3 font-medium text-bg",
							onClick: () => runSource(asmSource, "/minios/programs/hello.asm"),
							children: "Run demo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line",
							onClick: () => {
								typeInput("snake");
								submit();
							},
							children: "Snake"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line",
							onClick: clearCrt,
							children: "Clear CRT"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line",
							onClick: resetMachine,
							children: "Reset"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "h-11 rounded-md px-3 font-medium text-fg ring-1 ring-line",
							onClick: () => setAdmin(!adminOpen),
							children: adminOpen ? "Hide admin" : "Admin"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-col gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrtScreen, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShellPanel, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-0 flex-col gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RegsPanel, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HelixPanel, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssemblerPanel, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminPanel, {})
						]
					})]
				})
			]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Workstation, {});
}
//#endregion
export { Home as component };
