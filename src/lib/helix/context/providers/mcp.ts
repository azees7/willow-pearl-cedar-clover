import { mcpBeliefLines, mcpStats } from "../../../mcp/registry";
import type { ContextProvider } from "../types";

export const mcpProvider: ContextProvider = {
  id: "mcp",
  get(query) {
    const lines = mcpBeliefLines(query);
    if (!lines.length) return [];
    return [
      {
        id: "mcp:capabilities",
        category: "mcp",
        source: "minios-mcp-registry",
        lines: lines.map((content) => ({
          content,
          mass: 0.72,
          transient: true,
        })),
      },
    ];
  },
  status: mcpStats,
};
