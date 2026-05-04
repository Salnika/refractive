import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { calculateSpecularImage } from "./specular";
import { expectImageDataToBeBounded, installTestImageData } from "./image-data-test-helper";

describe("calculateSpecularImage", () => {
  let restoreImageData: () => void;

  beforeAll(() => {
    restoreImageData = installTestImageData();
  });

  afterAll(() => {
    restoreImageData();
  });

  it("uses specularAngle to produce a different highlight orientation", () => {
    const firstImage = calculateSpecularImage({
      height: 41,
      pixelRatio: 1,
      radius: 20,
      specularAngle: 0,
      width: 41,
    });
    const secondImage = calculateSpecularImage({
      height: 41,
      pixelRatio: 1,
      radius: 20,
      specularAngle: Math.PI / 2,
      width: 41,
    });

    expect(Array.from(firstImage.data)).not.toEqual(Array.from(secondImage.data));
  });

  it("keeps opposite specular angles distinct", () => {
    const firstImage = calculateSpecularImage({
      height: 41,
      pixelRatio: 1,
      radius: 20,
      specularAngle: 0,
      width: 41,
    });
    const oppositeImage = calculateSpecularImage({
      height: 41,
      pixelRatio: 1,
      radius: 20,
      specularAngle: Math.PI,
      width: 41,
    });

    expect(Array.from(firstImage.data)).not.toEqual(Array.from(oppositeImage.data));
  });

  it("keeps generated pixel channels bounded", () => {
    const imageData = calculateSpecularImage({
      height: 41,
      pixelRatio: 1,
      radius: 20,
      specularAngle: Math.PI / 4,
      width: 41,
    });

    expect(imageData.width).toBe(41);
    expect(imageData.height).toBe(41);
    expectImageDataToBeBounded(imageData);
  });

  it("keeps the specular highlight near the edge instead of filling the interior", () => {
    const imageData = calculateSpecularImage({
      height: 41,
      pixelRatio: 1,
      radius: 20,
      specularAngle: 0,
      width: 41,
    });
    const centerOffset = (20 * imageData.width + 20) * 4;

    expect(imageData.data[centerOffset + 3]).toBe(0);
  });
});
