import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildLegacyInitializeRequest, buildModernMcpRequest } from "./client";
import { desktopMcpConfig, getMcpServer } from "./registry";

describe("MiniOS MCP bus", () => {
  it("registers the mcpmcp remote discovery endpoint", () => {
    const server = getMcpServer("mcpmcp");
    assert.equal(server?.endpoint, "https://mcpmcp.io/mcp");
    assert.equal(server?.enabledByDefault, false);
    assert.equal(server?.role, "registry");
  });

  it("recreates the uploaded desktop mcp-remote config", () => {
    const config = desktopMcpConfig();
    assert.deepEqual(config, {
      mcpServers: {
        mcpmcp: {
          command: "npx",
          args: ["-y", "mcp-remote@latest", "https://mcpmcp.io/mcp"],
        },
      },
    });
  });

  it("builds the legacy initialize request used as mcp-remote fallback", () => {
    const request = buildLegacyInitializeRequest(3);
    assert.equal(request.body.method, "initialize");
    assert.equal(request.body.params.protocolVersion, "2025-11-25");
    assert.equal(request.body.id, 3);
  });

  it("builds MCP 2026-07-28 streamable HTTP tool calls", () => {
    const request = buildModernMcpRequest("tools/call", { name: "find", arguments: { q: "calendar" } }, 7);
    assert.equal(request.headers["MCP-Protocol-Version"], "2026-07-28");
    assert.equal(request.headers["Mcp-Method"], "tools/call");
    assert.equal(request.headers["Mcp-Name"], "find");
    assert.equal(request.body.id, 7);
    assert.equal(request.body.method, "tools/call");
  });
});
