export type Belief = {
  id: string;
  category: string;
  content: string;
  mass: number;
  vec: number[];
};

export type EmbedFn = (text: string) => number[];

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
  {
    category: "capabilities",
    content: "Helix receives context through provider channels; provider domains stay outside the core pulse.",
    mass: 0.86,
  },
];

function saveBeliefs(rows: Belief[]) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(rows));
}

export function seedBeliefs(embed: EmbedFn): Belief[] {
  const rows = SEEDS.map((seed, i) => ({
    id: `seed-${i}`,
    category: seed.category,
    content: seed.content,
    mass: seed.mass,
    vec: embed(seed.content),
  }));
  saveBeliefs(rows);
  return rows;
}

export function loadBeliefs(embed: EmbedFn): Belief[] {
  if (typeof localStorage === "undefined") return seedBeliefs(embed);
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedBeliefs(embed);
    const parsed = JSON.parse(raw) as Belief[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seedBeliefs(embed);
    return parsed;
  } catch {
    return seedBeliefs(embed);
  }
}

export function allBeliefs(embed: EmbedFn): Belief[] {
  return loadBeliefs(embed);
}

export function addBelief(
  embed: EmbedFn,
  category: string,
  content: string,
  mass = 0.7,
): Belief {
  const rows = loadBeliefs(embed);
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
