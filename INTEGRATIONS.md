# MiniOS Context + MCP Integration

This branch keeps the visual layer replaceable while baking two service layers into the machine environment:

1. a local Samsung Customization Service context provider for Helix Mini;
2. an MCP transport/registry bus seeded with the uploaded `mcpmcp-server` endpoint.

No file under `src/components/` is required for either integration.

## Local Customization Service context

Code lives in `src/lib/customization/`.

`importCustomizationExport()` accepts the Samsung Customization Service export as uploaded: gzip containing a tar archive containing `Customization_Service_collected_data.txt`, or plain tar/JSONL.

The importer recognizes app usage, notifications, URL/browser activity, service/app events, Wi-Fi/Bluetooth place categories, media plays, gallery tags, settings, and other service data.

### Privacy contract

The raw export is **not part of this repository**.

Import happens locally. The persisted profile is aggregate-only and deliberately does not retain raw MAC addresses, Bluetooth/Wi-Fi device names, URL paths/queries, notification content, or geohashes.

Future interfaces should pass selected file bytes to `importCustomizationExport(new Uint8Array(await file.arrayBuffer()))`.

Helix automatically turns the resulting profile into transient `local_customization` beliefs during a pulse. Those context beliefs are gravity-ranked but are not appended to the permanent Helix journal.

Shell commands: `custom` and `custom clear`.

## MCP bus

Code lives in `src/lib/mcp/`.

The built-in registry contains `mcpmcp -> https://mcpmcp.io/mcp` as a default-off Streamable HTTP registry service.

`desktopMcpConfig()` recreates the uploaded `mcp-remote` configuration for external MCP clients.

`McpHttpClient` attempts the modern MCP `2026-07-28` Streamable HTTP flow first and falls back to the legacy `2025-11-25` initialize/session flow used by older remote servers and adapters.

Shell commands: `mcp` and `mcp config`.

MCP is registered but remains default-off. A future UI or host decides when a remote connection is appropriate and handles any required authorization.

## Helix behavior

Helix Mini now ranks three belief sources together: the persistent Helix journal, transient local customization context, and transient MCP capability context.

The latter two are query-sensitive and are not written into permanent beliefs merely because they were available.

## Agent boundary

A new UI should consume these services rather than reimplement them:

- `src/lib/chatcpu/` — machine
- `src/lib/helix/` — agent/cognition
- `src/lib/customization/` — local personal context
- `src/lib/mcp/` — external capability bus
- `src/components/` — replaceable interface

That separation is intentional.
