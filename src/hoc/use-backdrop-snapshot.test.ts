import { describe, expect, it } from "vitest";

import {
  getRefractiveRootAttribute,
  getSnapshotCrop,
  getSnapshotThrottleDelay,
  shouldIgnoreSnapshotElement,
} from "./use-backdrop-snapshot";

describe("snapshot helpers", () => {
  it("marks refractive elements as ignored during capture", () => {
    const attribute = getRefractiveRootAttribute();

    expect(
      shouldIgnoreSnapshotElement({
        hasAttribute: (name: string) => name === attribute,
      } as unknown as Element),
    ).toBe(true);
    expect(
      shouldIgnoreSnapshotElement({
        hasAttribute: () => false,
      } as unknown as Element),
    ).toBe(false);
  });

  it("clamps snapshot throttling to browser-friendly bounds", () => {
    expect(getSnapshotThrottleDelay(30)).toBe(33);
    expect(getSnapshotThrottleDelay(120)).toBe(16);
    expect(getSnapshotThrottleDelay(0)).toBe(1000);
    expect(getSnapshotThrottleDelay(Number.NaN)).toBe(1000);
  });

  it("calculates crop coordinates relative to a custom root", () => {
    const element = {
      getBoundingClientRect: () => ({ height: 40, left: 20, top: 50, width: 100 }),
    } as unknown as HTMLElement;
    const root = {
      getBoundingClientRect: () => ({ left: 10, top: 30 }),
      scrollLeft: 5,
      scrollTop: 7,
    } as unknown as HTMLElement;

    expect(getSnapshotCrop(element, root)).toEqual({
      height: 40,
      scrollX: 0,
      scrollY: 0,
      width: 100,
      x: 15,
      y: 27,
    });
  });
});
