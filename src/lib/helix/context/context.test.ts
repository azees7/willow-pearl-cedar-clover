import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { allBeliefs, pulse } from "../mini";
import {
  getContextProvider,
  registerContextProvider,
  unregisterContextProvider,
} from "./registry";
import type { ContextProvider } from "./types";

function restore(provider: ContextProvider | undefined) {
  if (provider) registerContextProvider(provider);
}

function withMemoryStorage<T>(run: () => T): T {
  const memory = new Map<string, string>();
  const storage = {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => {
      memory.set(key, value);
    },
    removeItem: (key: string) => {
      memory.delete(key);
    },
    clear: () => memory.clear(),
    key: (index: number) => [...memory.keys()][index] ?? null,
    get length() {
      return memory.size;
    },
  };

  (globalThis as { localStorage?: Storage }).localStorage = storage as Storage;
  try {
    return run();
  } finally {
    delete (globalThis as { localStorage?: Storage }).localStorage;
  }
}

describe("Helix 4.2 context provider contract", () => {
  it("accepts a new provider without changing Helix core", () => {
    const calendar: ContextProvider = {
      id: "test-calendar",
      get(query) {
        if (!/calendar/i.test(query)) return [];
        return [
          {
            id: "calendar:today",
            category: "calendar",
            source: "fake-calendar",
            lines: [
              {
                content: "Calendar context: architecture review at 3 PM.",
                mass: 25,
                transient: true,
              },
            ],
          },
        ];
      },
    };

    registerContextProvider(calendar);
    try {
      const result = pulse("what is on my calendar?");
      assert.ok(result.sources.includes("calendar"));
      assert.match(result.response.answer, /architecture review/i);
    } finally {
      unregisterContextProvider(calendar.id);
    }
  });

  it("keeps Helix functional when domain providers are absent", () => {
    const customization = getContextProvider("customization");
    const mcp = getContextProvider("mcp");
    unregisterContextProvider("customization");
    unregisterContextProvider("mcp");

    try {
      const result = pulse("status");
      assert.equal(result.status, "success");
      assert.ok(result.neighbors.length > 0);
    } finally {
      restore(customization);
      restore(mcp);
    }
  });

  it("does not persist transient provider lines into the journal", () => {
    withMemoryStorage(() => {
      const marker = "TRANSIENT-CONTEXT-MUST-NOT-PERSIST";
      const transient: ContextProvider = {
        id: "test-transient",
        get() {
          return [
            {
              id: "transient:test",
              category: "ephemeral_test",
              source: "test-suite",
              lines: [{ content: marker, mass: 50, transient: true }],
            },
          ];
        },
      };

      registerContextProvider(transient);
      try {
        const result = pulse("show transient provider context");
        assert.match(result.response.answer, new RegExp(marker));
        assert.equal(
          allBeliefs().some((belief) => belief.content.includes(marker)),
          false,
        );
      } finally {
        unregisterContextProvider(transient.id);
      }
    });
  });
});
