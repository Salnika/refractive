import { describe, expect, it } from "vitest";

import { convex } from "../helpers/surface-equations";
import { normalizeRefraction } from "./refraction-options";

describe("normalizeRefraction", () => {
  it("clamps numeric options to safe ranges", () => {
    const normalized = normalizeRefraction({
      radius: Number.POSITIVE_INFINITY,
      blur: -1,
      glassThickness: 10_000,
      bezelWidth: Number.NaN,
      refractiveIndex: 10,
      specularOpacity: -4,
      specularAngle: -Math.PI / 2,
      pixelRatio: 50,
    });

    expect(normalized.radius).toBe(0);
    expect(normalized.blur).toBe(0);
    expect(normalized.glassThickness).toBe(300);
    expect(normalized.bezelWidth).toBe(0);
    expect(normalized.refractiveIndex).toBe(3);
    expect(normalized.specularOpacity).toBe(0);
    expect(normalized.specularAngle).toBe((Math.PI * 3) / 2);
    expect(normalized.pixelRatio).toBe(3);
  });

  it("uses defaults for missing optional options", () => {
    const normalized = normalizeRefraction({ radius: 8 });

    expect(normalized).toMatchObject({
      radius: 8,
      blur: 0,
      glassThickness: 70,
      bezelWidth: 0,
      refractiveIndex: 1.5,
      specularOpacity: 0,
      specularAngle: Math.PI / 4,
      bezelHeightFn: convex,
      pixelRatio: 1,
      fallbackMode: "snapshot",
      renderMode: "auto",
      snapshotMaxFps: 30,
    });
    expect(normalized.snapshotRoot()).toBe(null);
  });

  it("falls back when a custom surface function throws", () => {
    const normalized = normalizeRefraction({
      radius: 8,
      bezelHeightFn() {
        throw new Error("broken surface");
      },
    });

    expect(normalized.bezelHeightFn(0.5)).toBe(convex(0.5));
  });

  it("falls back when a custom surface function returns NaN", () => {
    const normalized = normalizeRefraction({
      radius: 8,
      bezelHeightFn: () => Number.NaN,
    });

    expect(normalized.bezelHeightFn(0.5)).toBe(convex(0.5));
  });

  it("keeps safe custom surface functions stable", () => {
    const surfaceFn = (x: number) => x;

    expect(normalizeRefraction({ radius: 8, bezelHeightFn: surfaceFn }).bezelHeightFn).toBe(
      normalizeRefraction({ radius: 8, bezelHeightFn: surfaceFn }).bezelHeightFn,
    );
  });
});
