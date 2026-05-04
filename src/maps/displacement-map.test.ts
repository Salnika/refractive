import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { convex } from "../helpers/surface-equations";
import { calculateDisplacementMap, calculateDisplacementMapRadius } from "./displacement-map";
import { expectImageDataToBeBounded, installTestImageData } from "./image-data-test-helper";

describe("displacement map generation", () => {
  let restoreImageData: () => void;

  beforeAll(() => {
    restoreImageData = installTestImageData();
  });

  afterAll(() => {
    restoreImageData();
  });

  it("precomputes finite displacement radii", () => {
    const map = calculateDisplacementMapRadius(70, 30, convex, 1.5);

    expect(map).toHaveLength(128);
    expect(map.every(Number.isFinite)).toBe(true);
  });

  it("generates bounded image data", () => {
    const precomputedDisplacementMap = calculateDisplacementMapRadius(70, 30, convex, 1.5);
    const maximumDisplacement = Math.max(...precomputedDisplacementMap.map(Math.abs));
    const imageData = calculateDisplacementMap({
      bezelWidth: 30,
      height: 61,
      maximumDisplacement,
      pixelRatio: 1,
      precomputedDisplacementMap,
      radius: 20,
      width: 61,
    });

    expect(imageData.width).toBe(61);
    expect(imageData.height).toBe(61);
    expectImageDataToBeBounded(imageData);
  });
});
