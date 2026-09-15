export type McpServerDescriptor = {
  id: string;
  name: string;
  endpoint: string;
  transport: "streamable-http";
  role: "registry" | "tool-server";
  enabledByDefault: boolean;
  source: string;
};

export const MCP_SERVERS: readonly McpServerDescriptor[] = [
  {
    id: "mcpmcp",
    name: "MCP MCP Registry",
    endpoint: "https://mcpmcp.io/mcp",
    transport: "streamable-http",
    role: "registry",
    enabledByDefault: false,
    source: "glenngillen/mcpmcp-server",
  },
] as const;

export function getMcpServer(id: string): McpServerDescriptor | undefined {
  return MCP_SERVERS.find((server) => server.id === id);
}

export function desktopMcpConfig(id = "mcpmcp") {
  const server = getMcpServer(id);
  if (!server) throw new Error(`Unknown MCP server: ${id}`);
  return {
    mcpServers: {
      [server.id]: {
        command: "npx",
        args: ["-y", "mcp-remote@latest", server.endpoint],
      },
    },
  };
}

export function mcpBeliefLines(query = ""): string[] {
  if (!/mcp|tool|server|connector|integration|capabil/i.test(query)) return [];
  return MCP_SERVERS.map(
    (server) => `MCP ${server.role} ${server.id}: ${server.name} at ${server.endpoint}; default ${server.enabledByDefault ? "on" : "off"}.`,
  );
}

export function mcpStats(): string {
  return `mcp=ready servers=${MCP_SERVERS.length} default=off`;
}
