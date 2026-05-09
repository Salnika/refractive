import { afterEach, describe, expect, it, vi } from "vitest";

import { readReducedMotion, subscribeToReducedMotion } from "./use-reduced-motion";

type MatchMediaListener = (event: MediaQueryListEvent) => void;

type MockMediaQueryList = {
  matches: boolean;
  media: string;
  addEventListener: (type: "change", listener: MatchMediaListener) => void;
  removeEventListener: (type: "change", listener: MatchMediaListener) => void;
  dispatch: (matches: boolean) => void;
  listeners: Set<MatchMediaListener>;
};

function createMockMediaQueryList(initialMatches: boolean): MockMediaQueryList {
  const listeners = new Set<MatchMediaListener>();

  return {
    listeners,
    matches: initialMatches,
    media: "(prefers-reduced-motion: reduce)",
    addEventListener: (_type, listener) => {
      listeners.add(listener);
    },
    removeEventListener: (_type, listener) => {
      listeners.delete(listener);
    },
    dispatch(matches) {
      this.matches = matches;
      const event = { matches } as unknown as MediaQueryListEvent;
      for (const listener of listeners) {
        listener(event);
      }
    },
  };
}

describe("readReducedMotion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns false when window is unavailable", () => {
    vi.stubGlobal("window", undefined);

    expect(readReducedMotion()).toBe(false);
  });

  it("returns false when matchMedia is unavailable", () => {
    vi.stubGlobal("window", {});

    expect(readReducedMotion()).toBe(false);
  });

  it("returns true when prefers-reduced-motion matches", () => {
    const mediaQueryList = createMockMediaQueryList(true);
    vi.stubGlobal("window", {
      matchMedia: (query: string) => {
        expect(query).toBe("(prefers-reduced-motion: reduce)");
        return mediaQueryList;
      },
    });

    expect(readReducedMotion()).toBe(true);
  });

  it("returns false when prefers-reduced-motion does not match", () => {
    const mediaQueryList = createMockMediaQueryList(false);
    vi.stubGlobal("window", {
      matchMedia: () => mediaQueryList,
    });

    expect(readReducedMotion()).toBe(false);
  });
});

describe("subscribeToReducedMotion", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("subscribes to media query changes and forwards updates", () => {
    const mediaQueryList = createMockMediaQueryList(false);
    vi.stubGlobal("window", {
      matchMedia: () => mediaQueryList,
    });

    const updates: boolean[] = [];
    const unsubscribe = subscribeToReducedMotion((matches) => {
      updates.push(matches);
    });

    expect(mediaQueryList.listeners.size).toBe(1);

    mediaQueryList.dispatch(true);
    mediaQueryList.dispatch(false);
    expect(updates).toEqual([true, false]);

    unsubscribe();
    expect(mediaQueryList.listeners.size).toBe(0);
  });

  it("returns a no-op cleanup when window is unavailable", () => {
    vi.stubGlobal("window", undefined);

    const unsubscribe = subscribeToReducedMotion(() => {});
    expect(typeof unsubscribe).toBe("function");
    expect(() => {
      unsubscribe();
    }).not.toThrow();
  });

  it("returns a no-op cleanup when matchMedia is unavailable", () => {
    vi.stubGlobal("window", {});

    const unsubscribe = subscribeToReducedMotion(() => {});
    expect(typeof unsubscribe).toBe("function");
    expect(() => {
      unsubscribe();
    }).not.toThrow();
  });
});
