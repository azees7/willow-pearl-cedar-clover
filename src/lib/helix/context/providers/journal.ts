import { embed } from "../../embedding";
import { loadBeliefs } from "../../journal";
import type { ContextProvider } from "../types";

export const journalProvider: ContextProvider = {
  id: "journal",
  get() {
    const grouped = new Map<string, ReturnType<typeof loadBeliefs>>();

    for (const belief of loadBeliefs(embed)) {
      const rows = grouped.get(belief.category) ?? [];
      rows.push(belief);
      grouped.set(belief.category, rows);
    }

    return [...grouped.entries()].map(([category, beliefs]) => ({
      id: `journal:${category}`,
      category,
      source: "helix-journal",
      lines: beliefs.map((belief) => ({
        content: belief.content,
        mass: belief.mass,
        transient: false,
      })),
    }));
  },
  status() {
    return `journal=ready beliefs=${loadBeliefs(embed).length}`;
  },
};
