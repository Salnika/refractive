import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import { installTestImageData } from "../maps/image-data-test-helper";
import {
  clearFilterAssetsCacheForTests,
  getFilterAssets,
  getFilterAssetsCacheSizeForTests,
} from "./filter-assets";

function installTestDocument(): () => void {
  const originalDocument = Reflect.get(globalThis, "document") as Document | undefined;
  let nextUrlId = 0;

  Reflect.set(globalThis, "document", {
    createElement: () => ({
      getContext: () => ({
        putImageData() {},
      }),
      height: 0,
      toDataURL: () => {
        nextUrlId += 1;
        return `data:image/png;base64,test-${nextUrlId}`;
      },
      width: 0,
    }),
  });

  return () => {
    if (originalDocument) {
      Reflect.set(globalThis, "document", originalDocument);
    } else {
      Reflect.deleteProperty(globalThis, "document");
    }
  };
}

const defaultSurfaceFn = (x: number) => x;

function getDefaultAssets(radius = 12) {
  return getFilterAssets({
    radius,
    bezelWidth: 8,
    glassThickness: 70,
    refractiveIndex: 1.5,
    specularAngle: Math.PI / 4,
    bezelHeightFn: defaultSurfaceFn,
    pixelRatio: 1,
  });
}

describe("filter assets cache", () => {
  let restoreImageData: () => void;
  let restoreDocument: () => void;

  beforeAll(() => {
    restoreImageData = installTestImageData();
    restoreDocument = installTestDocument();
  });

  beforeEach(() => {
    clearFilterAssetsCacheForTests();
  });

  afterAll(() => {
    restoreDocument();
    restoreImageData();
  });

  it("reuses assets for the same key", () => {
    const surfaceFn = (x: number) => x;
    const firstAssets = getFilterAssets({
      radius: 12,
      bezelWidth: 8,
      glassThickness: 70,
      refractiveIndex: 1.5,
      specularAngle: Math.PI / 4,
      bezelHeightFn: surfaceFn,
      pixelRatio: 1,
    });
    const secondAssets = getFilterAssets({
      radius: 12,
      bezelWidth: 8,
      glassThickness: 70,
      refractiveIndex: 1.5,
      specularAngle: Math.PI / 4,
      bezelHeightFn: surfaceFn,
      pixelRatio: 1,
    });

    expect(secondAssets).toBe(firstAssets);
  });

  it("keeps different keys isolated", () => {
    expect(getDefaultAssets(12)).not.toBe(getDefaultAssets(13));
  });

  it("evicts the least recently used assets after 64 entries", () => {
    const firstAssets = getDefaultAssets(1);

    for (let radius = 2; radius <= 65; radius += 1) {
      getDefaultAssets(radius);
    }

    expect(getFilterAssetsCacheSizeForTests()).toBe(64);
    expect(getDefaultAssets(1)).not.toBe(firstAssets);
  });
});
