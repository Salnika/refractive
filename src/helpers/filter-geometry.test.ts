import { describe, expect, it } from "vitest";

import { calculateCompositeGeometry } from "./filter-geometry";

describe("calculateCompositeGeometry", () => {
  it("keeps normal geometry unchanged", () => {
    expect(
      calculateCompositeGeometry({
        cornerWidth: 20,
        height: 80,
        width: 100,
      }),
    ).toEqual({
      height: 80,
      heightMinusCorner: 60,
      renderCornerWidth: 20,
      width: 100,
      widthMinusCorner: 80,
    });
  });

  it("clamps corners for elements smaller than the configured radius or bezel", () => {
    expect(
      calculateCompositeGeometry({
        cornerWidth: 50,
        height: 30,
        width: 40,
      }),
    ).toEqual({
      height: 30,
      heightMinusCorner: 15,
      renderCornerWidth: 15,
      width: 40,
      widthMinusCorner: 25,
    });
  });

  it("keeps zero-sized geometry non-negative", () => {
    expect(
      calculateCompositeGeometry({
        cornerWidth: 20,
        height: 0,
        width: 0,
      }),
    ).toEqual({
      height: 0,
      heightMinusCorner: 0,
      renderCornerWidth: 0,
      width: 0,
      widthMinusCorner: 0,
    });
  });
});
