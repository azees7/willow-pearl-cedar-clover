/** Helix Mini 4.2 lite — pulse, gravity, provider channels, STA. Mock LLM. */

import { collectContext, contextProviderStats } from "./context/registry";
import { EMBEDDING_EPSILON, embed, embeddingDistance } from "./embedding";
import {
  addBelief as addJournalBelief,
  allBeliefs as allJournalBeliefs,
  loadBeliefs,
  type Belief,
} from "./journal";

export type { Belief } from "./journal";
export type { ContextChannel, ContextLine, ContextProvider } from "./context/types";

export type HelixState = "ACTIVE" | "RESTING" | "DORMANT";

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

export { embed };

export function gravityRank(query: string, beliefs: Belief[], k = 4) {
  const q = embed(query);
  return beliefs
    .map((belief) => {
      const distance = embeddingDistance(q, belief.vec);
      const force = belief.mass / (distance * distance + EMBEDDING_EPSILON);
      return {
        content: belief.content,
        force,
        category: belief.category,
      };
    })
    .sort((a, b) => b.force - a.force)
    .slice(0, k);
}

export function allBeliefs(): Belief[] {
  return allJournalBeliefs(embed);
}

export function addBelief(category: string, content: string, mass = 0.7): Belief {
  return addJournalBelief(embed, category, content, mass);
}

function contextBeliefs(query: string): Belief[] {
  let index = 0;

  return collectContext(query).flatMap((channel) =>
    channel.lines.map((line) => ({
      id: `ctx-${channel.id}-${index++}`,
      category: channel.category,
      content: line.content,
      mass: line.mass,
      vec: embed(line.content),
    })),
  );
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
  const beliefs = contextBeliefs(q);
  const neighbors = gravityRank(`${q} ${hint}`, beliefs, 4);
  const top = neighbors[0]?.content || "Helix Mini 4.2 is listening.";
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
    neighbors: neighbors.map((neighbor) => ({
      content: neighbor.content,
      force: neighbor.force,
    })),
    response: sta,
    sources: neighbors.map((neighbor) => neighbor.category),
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
  const n = loadBeliefs(embed).length;
  return `state=ACTIVE beliefs=${n} embed=ngram llm=mock version=4.2 ${contextProviderStats()}`;
}
