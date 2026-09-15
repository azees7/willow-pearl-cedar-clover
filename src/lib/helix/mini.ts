/** Helix Mini 4.0 lite — pulse, gravity, beliefs, STA. Mock LLM. */

export type HelixState = "ACTIVE" | "RESTING" | "DORMANT";

export type Belief = {
  id: string;
  category: string;
  content: string;
  mass: number;
  vec: number[];
};

export type Sta = {
  answer: string;
  next_action: string;
  voice_line: string;
};

export type PulseResult = {
  agent_id: "helix-mini";
  status: "success";
  state: HelixState;
  neighbors: { content: string; force: number }[];
  response: Sta;
  sources: string[];
};

const DIM = 8;
const EPS = 1e-6;
const KEY = "HELIX-MINI-V4";

const SEEDS: { category: string; content: string; mass: number }[] = [
  {
    category: "self_identity",
    content: "I am Helix Mini 4.0, a compact pulse agent with gravity-ranked beliefs.",
    mass: 1,
  },
  {
    category: "capabilities",
    content: "I pulse, rank beliefs by F = T*m/d^2, journal, and speak STA JSON.",
    mass: 0.9,
  },
  {
    category: "skills",
    content: "MiniOS face: helix <msg>, pulse, beliefs, curate. CPU ISA stays in ChatCPU.",
    mass: 0.85,
  },
  {
    category: "knowledge",
    content: "ChatCPU MiniOS 4.0 is the workstation face. Full Helix-AGI dashboard stays out of Mini.",
    mass: 0.8,
  },
];

function normalize(v: number[]): number[] {
  let n = 0;
  for (const x of v) n += x * x;
  n = Math.sqrt(n);
  if (n < EPS) return v;
  return v.map((x) => x / n);
}

export function embed(text: string): number[] {
  const acc = new Array(DIM).fill(0);
  const blob = (text || "").toLowerCase();
  const tokens = blob.match(/[a-z0-9]+/g) || [blob];
  let i = 0;
  for (const tok of tokens) {
    for (let n = 1; n <= 3; n++) {
      for (let k = 0; k <= Math.max(0, tok.length - n); k++) {
        const g = tok.slice(k, k + n);
        let h = 2166136261;
        for (let c = 0; c < g.length; c++) h = Math.imul(h ^ g.charCodeAt(c), 16777619);
        const idx = Math.abs(h) % DIM;
        const sign = h & 1 ? 1 : -1;
        acc[idx] += sign * (1 / (1 + i * 0.02));
        i += 1;
      }
    }
  }
  return normalize(acc);
}

function dist(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < DIM; i++) {
    const d = (a[i] || 0) - (b[i] || 0);
    s += d * d;
  }
  return Math.sqrt(s);
}

export function gravityRank(query: string, beliefs: Belief[], k = 4) {
  const q = embed(query);
  return beliefs
    .map((b) => {
      const d = dist(q, b.vec);
      const force = (1 * b.mass) / (d * d + EPS);
      return { content: b.content, force, category: b.category };
    })
    .sort((a, b) => b.force - a.force)
    .slice(0, k);
}

function loadBeliefs(): Belief[] {
  if (typeof localStorage === "undefined") return seedBeliefs();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedBeliefs();
    const parsed = JSON.parse(raw) as Belief[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seedBeliefs();
    return parsed;
  } catch {
    return seedBeliefs();
  }
}

function saveBeliefs(rows: Belief[]) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(rows));
}

function seedBeliefs(): Belief[] {
  const rows = SEEDS.map((s, i) => ({
    id: `seed-${i}`,
    category: s.category,
    content: s.content,
    mass: s.mass,
    vec: embed(s.content),
  }));
  saveBeliefs(rows);
  return rows;
}

export function allBeliefs(): Belief[] {
  return loadBeliefs();
}

export function addBelief(category: string, content: string, mass = 0.7): Belief {
  const rows = loadBeliefs();
  const row: Belief = {
    id: `b-${Date.now().toString(36)}`,
    category,
    content: content.slice(0, 500),
    mass,
    vec: embed(content),
  };
  rows.push(row);
  saveBeliefs(rows);
  return row;
}

function nextAction(query: string): string {
  const q = query.toLowerCase();
  if (/\bsnake\b/.test(q)) return "play snake on the CRT";
  if (/\bhello\b|\bdemo\b/.test(q)) return "run /minios/programs/hello.asm";
  if (/\bregs?\b|\bregister\b/.test(q)) return "show CPU registers";
  if (/\bcurate\b/.test(q)) return "run a DORMANT curator pass";
  return "await the next shell line";
}

export function pulse(query: string, hint = ""): PulseResult {
  const q = (query || "status").trim();
  const beliefs = loadBeliefs();
  const neighbors = gravityRank(`${q} ${hint}`, beliefs, 4);
  const top = neighbors[0]?.content || "Helix Mini 4.0 is listening.";
  const action = nextAction(q);
  const answer = [
    `Pulse on “${q}”.`,
    top,
    hint ? `Machine: ${hint}` : "",
    `Next: ${action}.`,
  ]
    .filter(Boolean)
    .join(" ");
  const sta: Sta = {
    answer,
    next_action: action,
    voice_line: `Helix Mini. ${action}.`,
  };
  addBelief("feedback", `pulse: ${q.slice(0, 80)}`, 0.4);
  return {
    agent_id: "helix-mini",
    status: "success",
    state: "ACTIVE",
    neighbors: neighbors.map((n) => ({ content: n.content, force: n.force })),
    response: sta,
    sources: neighbors.map((n) => n.category),
  };
}

export function curate(): string {
  addBelief(
    "knowledge",
    "Curator pass reviewed recent MiniOS pulses. Gravity and STA keys still hold.",
    0.6,
  );
  return "curator:miniOS beliefs+1 core=journal provider=mock-curator";
}

export function stats(): string {
  const n = loadBeliefs().length;
  return `state=ACTIVE beliefs=${n} embed=ngram llm=mock version=4.0`;
}
