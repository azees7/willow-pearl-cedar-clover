import {
  customizationBeliefLines,
  customizationStats,
} from "../../../customization/store";
import type { ContextProvider } from "../types";

export const customizationProvider: ContextProvider = {
  id: "customization",
  get(query) {
    const lines = customizationBeliefLines(query);
    if (!lines.length) return [];
    return [
      {
        id: "customization:local",
        category: "local_customization",
        source: "local-customization",
        lines: lines.map((content) => ({
          content,
          mass: 0.78,
          transient: true,
        })),
      },
    ];
  },
  status: customizationStats,
};
