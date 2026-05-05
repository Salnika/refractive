import { convex } from "../helpers/surface-equations";

export type RefractionOptions = {
  radius: number;
  blur?: number;
  glassThickness?: number;
  bezelWidth?: number;
  refractiveIndex?: number;
  specularOpacity?: number;
  specularAngle?: number;
  bezelHeightFn?: (x: number) => number;
  pixelRatio?: number;
};

export type RefractionProps = {
  refraction: RefractionOptions;
};

export type NormalizedRefractionOptions = Required<RefractionOptions>;

const TWO_PI = Math.PI * 2;

const SAFE_SURFACE_FUNCTIONS = new WeakMap<(x: number) => number, (x: number) => number>();

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function finiteNumber(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clampOption(
  value: number | undefined,
  fallback: number,
  min: number,
  max: number,
): number {
  return clamp(finiteNumber(value, fallback), min, max);
}

function normalizeAngle(value: number | undefined): number {
  const angle = finiteNumber(value, Math.PI / 4);
  return ((angle % TWO_PI) + TWO_PI) % TWO_PI;
}

function defaultPixelRatio(): number {
  if (typeof window === "undefined") {
    return 1;
  }

  return clampOption(window.devicePixelRatio, 1, 1, 3);
}

function sanitizeSurfaceValue(value: number, x: number): number {
  if (!Number.isFinite(value)) {
    return convex(x);
  }

  return clamp(value, 0, 1);
}

function getSafeSurfaceFunction(fn: ((x: number) => number) | undefined): (x: number) => number {
  if (!fn || fn === convex) {
    return convex;
  }

  const existingFn = SAFE_SURFACE_FUNCTIONS.get(fn);
  if (existingFn) {
    return existingFn;
  }

  const safeFn = (x: number) => {
    try {
      return sanitizeSurfaceValue(fn(x), x);
    } catch {
      return convex(x);
    }
  };

  SAFE_SURFACE_FUNCTIONS.set(fn, safeFn);
  return safeFn;
}

export function normalizeRefraction(refraction: RefractionOptions): NormalizedRefractionOptions {
  return {
    radius: clampOption(refraction.radius, 0, 0, 120),
    blur: clampOption(refraction.blur, 0, 0, 20),
    glassThickness: clampOption(refraction.glassThickness, 70, 0, 300),
    bezelWidth: clampOption(refraction.bezelWidth, 0, 0, 120),
    refractiveIndex: clampOption(refraction.refractiveIndex, 1.5, 1, 3),
    specularOpacity: clampOption(refraction.specularOpacity, 0, 0, 1),
    specularAngle: normalizeAngle(refraction.specularAngle),
    bezelHeightFn: getSafeSurfaceFunction(refraction.bezelHeightFn),
    pixelRatio: clampOption(refraction.pixelRatio, defaultPixelRatio(), 1, 3),
  };
}
