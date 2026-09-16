import { journalProvider } from "./providers/journal";
import { customizationProvider } from "./providers/customization";
import { mcpProvider } from "./providers/mcp";
import type { ContextChannel, ContextProvider } from "./types";

const providers = new Map<string, ContextProvider>();

for (const provider of [journalProvider, customizationProvider, mcpProvider]) {
  providers.set(provider.id, provider);
}

export function registerContextProvider(provider: ContextProvider) {
  providers.set(provider.id, provider);
}

export function unregisterContextProvider(id: string): ContextProvider | undefined {
  const provider = providers.get(id);
  providers.delete(id);
  return provider;
}

export function getContextProvider(id: string): ContextProvider | undefined {
  return providers.get(id);
}

export function listContextProviders(): ContextProvider[] {
  return [...providers.values()];
}

export function collectContext(query: string): ContextChannel[] {
  return listContextProviders().flatMap((provider) => {
    try {
      return provider.get(query);
    } catch {
      return [];
    }
  });
}

export function contextProviderStats(): string {
  return listContextProviders()
    .map((provider) => provider.status?.() ?? `${provider.id}=ready`)
    .join(" ");
}
