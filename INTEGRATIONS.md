# MiniOS Context + MCP Integration

This branch keeps the visual layer replaceable while baking service layers into the machine environment.

No file under `src/components/` is required for these integrations.

## 4.2 Helix context-provider contract

Helix core no longer imports Customization or MCP domain modules directly.

The canonical TypeScript contract lives in `src/lib/helix/context/`:

```ts
type ContextLine = {
  content: string;
  mass: number;
  transient: boolean;
};

type ContextChannel = {
  id: string;
  category: string;
  source: string;
  lines: ContextLine[];
};

interface ContextProvider {
  id: string;
  get(query: string): ContextChannel[];
  status?: () => string;
}
```

The default registry adapts three existing sources:

- persistent Helix journal
- local Customization Service profile
- MCP capability registry

`mini.ts` only calls `collectContext(query)`, converts returned lines into gravity-ranked beliefs, and produces STA output. It does not know Samsung or MCP by name.

Providers may be registered and removed at runtime. This is the extension seam for future calendar, health, device, host, or other context sources.

Boundary tests verify:

- a fake Calendar provider can influence a pulse without modifying Helix core;
- removing Customization and MCP providers does not break Helix;
- transient provider content is not written into the persistent journal.

MiniOS and Helix remain product version 4.0; **4.2 is the architecture milestone for this provider contract**.

## Local Customization Service context

Code lives in `src/lib/customization/`.

`importCustomizationExport()` accepts the Samsung Customization Service export as uploaded: gzip containing a tar archive containing `Customization_Service_collected_data.txt`, or plain tar/JSONL.

The importer recognizes app usage, notifications, URL/browser activity, service/app events, Wi-Fi/Bluetooth place categories, media plays, gallery tags, settings, and other service data.

### Privacy contract

The raw export is **not part of this repository**.

Import happens locally. The persisted profile is aggregate-only and deliberately does not retain raw MAC addresses, Bluetooth/Wi-Fi device names, URL paths/queries, notification content, or geohashes.

Future interfaces should pass selected file bytes to `importCustomizationExport(new Uint8Array(await file.arrayBuffer()))`.

The Customization adapter exposes matching aggregate facts as transient `local_customization` channel lines. They are gravity-ranked but are not appended to the permanent Helix journal.

Shell commands: `custom` and `custom clear`.

## MCP bus

Code lives in `src/lib/mcp/`.

The built-in registry contains `mcpmcp -> https://mcpmcp.io/mcp` as a default-off Streamable HTTP registry service.

`desktopMcpConfig()` recreates the uploaded `mcp-remote` configuration for external MCP clients.

`McpHttpClient` attempts the modern MCP `2026-07-28` Streamable HTTP flow first and falls back to the legacy `2025-11-25` initialize/session flow used by older remote servers and adapters.

Shell commands: `mcp` and `mcp config`.

MCP is registered but remains default-off. A future host-control plane decides when a remote connection is appropriate and handles authorization, visibility, approval, and disconnect behavior. That work belongs to 4.3, not 4.2.

## Agent boundary

A new UI should consume these services rather than reimplement them:

- `src/lib/chatcpu/` — machine
- `src/lib/helix/` — cognition and provider contract
- `src/lib/customization/` — local personal context
- `src/lib/mcp/` — external capability bus
- `src/components/` — replaceable interface

That separation is intentional.
