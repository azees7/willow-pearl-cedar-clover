import type { McpServerDescriptor } from "./registry";

export type McpJsonRpcResult<T = unknown> = {
  jsonrpc: "2.0";
  id?: string | number | null;
  result?: T;
  error?: { code?: number; message?: string; data?: unknown };
};

export type McpTool = {
  name: string;
  description?: string;
  inputSchema?: Record<string, unknown>;
};

type FetchLike = typeof fetch;
type McpEra = "modern" | "legacy";

const CLIENT_INFO = { name: "chatcpu-minios", version: "4.1" } as const;

function methodName(params: Record<string, unknown> | undefined): string | null {
  if (!params) return null;
  const value = params.name ?? params.uri ?? params.taskId;
  return typeof value === "string" ? value : null;
}

function parseEventStream(text: string): McpJsonRpcResult {
  const dataLines = text
    .split(/\r?\n/)
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .filter(Boolean);
  if (!dataLines.length) throw new Error("MCP server returned an empty event stream");
  return JSON.parse(dataLines[dataLines.length - 1]) as McpJsonRpcResult;
}

async function parseResponse(response: Response): Promise<McpJsonRpcResult> {
  const text = await response.text();
  const contentType = response.headers.get("content-type") ?? "";
  if (!response.ok) {
    throw new Error(`MCP HTTP ${response.status}: ${text.slice(0, 300)}`);
  }
  if (!text.trim()) return { jsonrpc: "2.0", result: null };
  if (contentType.includes("text/event-stream")) return parseEventStream(text);
  return JSON.parse(text) as McpJsonRpcResult;
}

function assertResult<T>(message: McpJsonRpcResult<T>): T {
  if (message.error) {
    throw new Error(`MCP ${message.error.code ?? "error"}: ${message.error.message ?? "unknown error"}`);
  }
  return message.result as T;
}

export function buildModernMcpRequest(
  method: string,
  params: Record<string, unknown> = {},
  id: number | string = 1,
) {
  const mirroredName = methodName(params);
  const headers: Record<string, string> = {
    Accept: "application/json, text/event-stream",
    "Content-Type": "application/json",
    "MCP-Protocol-Version": "2026-07-28",
    "Mcp-Method": method,
  };
  if (mirroredName) headers["Mcp-Name"] = mirroredName;

  return {
    headers,
    body: {
      jsonrpc: "2.0" as const,
      id,
      method,
      params: {
        ...params,
        _meta: {
          "io.modelcontextprotocol/clientInfo": CLIENT_INFO,
        },
      },
    },
  };
}

export function buildLegacyInitializeRequest(id: number | string = 1) {
  return {
    headers: {
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
    },
    body: {
      jsonrpc: "2.0" as const,
      id,
      method: "initialize",
      params: {
        protocolVersion: "2025-11-25",
        capabilities: {},
        clientInfo: CLIENT_INFO,
      },
    },
  };
}

export class McpHttpClient {
  private nextId = 1;
  private era: McpEra | null = null;
  private sessionId: string | null = null;

  constructor(
    readonly server: McpServerDescriptor,
    private readonly fetchImpl: FetchLike = fetch,
  ) {}

  private async post(headers: Record<string, string>, body: unknown) {
    let response: Response;
    try {
      response = await this.fetchImpl(this.server.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });
    } catch (error) {
      throw new Error(`MCP transport failed for ${this.server.id}: ${String(error)}`);
    }
    return { response, message: await parseResponse(response) };
  }

  private async connectLegacy() {
    const init = buildLegacyInitializeRequest(this.nextId++);
    const { response, message } = await this.post(init.headers, init.body);
    assertResult(message);
    this.sessionId = response.headers.get("mcp-session-id");
    this.era = "legacy";

    const headers: Record<string, string> = {
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
      "MCP-Protocol-Version": "2025-11-25",
    };
    if (this.sessionId) headers["Mcp-Session-Id"] = this.sessionId;

    await this.post(headers, {
      jsonrpc: "2.0",
      method: "notifications/initialized",
      params: {},
    });
  }

  async connect(): Promise<McpEra> {
    if (this.era) return this.era;

    try {
      const probe = buildModernMcpRequest("server/discover", {}, this.nextId++);
      const { message } = await this.post(probe.headers, probe.body);
      if (!message.error) {
        this.era = "modern";
        return this.era;
      }
    } catch {
      // Fall through to the legacy initialize/session flow used by mcp-remote.
    }

    await this.connectLegacy();
    return this.era as McpEra;
  }

  async request<T = unknown>(method: string, params: Record<string, unknown> = {}): Promise<T> {
    const era = await this.connect();
    if (era === "modern") {
      const request = buildModernMcpRequest(method, params, this.nextId++);
      const { message } = await this.post(request.headers, request.body);
      return assertResult<T>(message as McpJsonRpcResult<T>);
    }

    const headers: Record<string, string> = {
      Accept: "application/json, text/event-stream",
      "Content-Type": "application/json",
      "MCP-Protocol-Version": "2025-11-25",
    };
    if (this.sessionId) headers["Mcp-Session-Id"] = this.sessionId;
    const { message } = await this.post(headers, {
      jsonrpc: "2.0",
      id: this.nextId++,
      method,
      params,
    });
    return assertResult<T>(message as McpJsonRpcResult<T>);
  }

  discover() {
    return this.request("server/discover");
  }

  async listTools(): Promise<McpTool[]> {
    const result = await this.request<{ tools?: McpTool[] }>("tools/list");
    return Array.isArray(result?.tools) ? result.tools : [];
  }

  callTool(name: string, args: Record<string, unknown> = {}) {
    return this.request("tools/call", { name, arguments: args });
  }
}
