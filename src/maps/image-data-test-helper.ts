import { expect } from "vitest";

export class TestImageData implements ImageData {
  readonly colorSpace: PredefinedColorSpace = "srgb";
  readonly data: Uint8ClampedArray<ArrayBuffer>;
  readonly height: number;
  readonly width: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.data = new Uint8ClampedArray(width * height * 4);
  }
}

export function installTestImageData(): () => void {
  const originalImageData = Reflect.get(globalThis, "ImageData") as typeof ImageData | undefined;
  Reflect.set(globalThis, "ImageData", TestImageData);

  return () => {
    if (originalImageData) {
      Reflect.set(globalThis, "ImageData", originalImageData);
    } else {
      Reflect.deleteProperty(globalThis, "ImageData");
    }
  };
}

export function expectImageDataToBeBounded(imageData: ImageData): void {
  for (const value of imageData.data) {
    expect(value).toBeGreaterThanOrEqual(0);
    expect(value).toBeLessThanOrEqual(255);
  }
}
