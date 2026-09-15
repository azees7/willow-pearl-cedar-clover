import { create } from "zustand";
import {
  allBeliefs,
  curate as curateMini,
  pulse as pulseMini,
  stats,
  type Belief,
  type HelixState,
  type PulseResult,
} from "./mini";

type HelixStore = {
  state: HelixState;
  input: string;
  last: PulseResult | null;
  log: string[];
  beliefs: Belief[];
  hydrate: () => void;
  setInput: (v: string) => void;
  pulse: (query?: string, hint?: string) => PulseResult;
  curate: () => string;
  stats: () => string;
};

export const useHelix = create<HelixStore>((set, get) => ({
  state: "RESTING",
  input: "",
  last: null,
  log: [],
  beliefs: [],
  hydrate: () => set({ beliefs: allBeliefs() }),
  setInput: (v) => set({ input: v }),
  pulse: (query, hint) => {
    const q = (query ?? get().input).trim() || "status";
    const result = pulseMini(q, hint);
    set({
      last: result,
      state: "ACTIVE",
      input: "",
      log: [...get().log, result.response.answer].slice(-12),
      beliefs: allBeliefs(),
    });
    return result;
  },
  curate: () => {
    const line = curateMini();
    set({
      state: "DORMANT",
      log: [...get().log, line].slice(-12),
      beliefs: allBeliefs(),
    });
    return line;
  },
  stats: () => stats(),
}));
