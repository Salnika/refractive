import type { RefractionFallbackMode, RefractionRenderMode } from "./refraction-options";

export type ResolvedRefractionRenderMode = "native" | RefractionFallbackMode;

type BrowserLikeEnvironment = {
  navigator?: {
    maxTouchPoints?: number;
    platform?: string;
    userAgent?: string;
  };
};

function isIosWebKitEnvironment(navigator: BrowserLikeEnvironment["navigator"]): boolean {
  const userAgent = navigator?.userAgent ?? "";
  const platform = navigator?.platform ?? "";
  const maxTouchPoints = navigator?.maxTouchPoints ?? 0;

  return /iP(?:ad|hone|od)/u.test(userAgent) || (platform === "MacIntel" && maxTouchPoints > 1);
}

function isChromiumEnvironment(navigator: BrowserLikeEnvironment["navigator"]): boolean {
  const userAgent = navigator?.userAgent ?? "";

  if (isIosWebKitEnvironment(navigator)) {
    return false;
  }

  if (/Firefox|FxiOS/u.test(userAgent)) {
    return false;
  }

  return /(?:Chrome|Chromium|Edg|OPR)\//u.test(userAgent);
}

export function resolveRefractionRenderMode(
  renderMode: RefractionRenderMode,
  fallbackMode: RefractionFallbackMode,
  environment: BrowserLikeEnvironment = globalThis,
): ResolvedRefractionRenderMode {
  if (renderMode !== "auto") {
    return renderMode;
  }

  return isChromiumEnvironment(environment.navigator) ? "native" : fallbackMode;
}

const FORCED_NATIVE_WARNING =
  '[refractive] renderMode: "native" was forced, but the current browser does not reliably support SVG feDisplacementMap in backdrop-filter. The refractive effect may be broken or invisible. Consider renderMode: "auto" or import "refractive/snapshot" for cross-browser fidelity.';

let didWarnAboutForcedNative = false;

type ProcessLike = { env?: { NODE_ENV?: string } };

function isProductionEnvironment(): boolean {
  // Guarded access: `process` is not defined in browsers without a bundler-provided shim.
  const maybeProcess = (globalThis as { process?: ProcessLike }).process;
  return maybeProcess?.env?.NODE_ENV === "production";
}

/**
 * Emits a one-time `console.warn` when a developer forces `renderMode: "native"` on
 * a browser that does not reliably support SVG `feDisplacementMap` in
 * `backdrop-filter` (Firefox, Safari, iOS WebKit-based browsers, etc.).
 *
 * The warning is silent in production and only fires once per session/module
 * lifetime to avoid noise across re-renders or multiple instances.
 */
export function warnIfForcedNativeOnNonChromium(
  renderMode: RefractionRenderMode,
  environment: BrowserLikeEnvironment = globalThis,
): void {
  if (renderMode !== "native" || didWarnAboutForcedNative) {
    return;
  }

  if (isProductionEnvironment() || isChromiumEnvironment(environment.navigator)) {
    return;
  }

  didWarnAboutForcedNative = true;
  // eslint-disable-next-line no-console -- Intentional dev-only warning to surface a silent breakage when `renderMode: "native"` is forced on browsers that cannot render the effect.
  console.warn(FORCED_NATIVE_WARNING);
}

/**
 * Test-only helper: resets the module-level "already warned" flag so the
 * one-shot warning can be observed again. Not intended for production use.
 */
export function __resetForcedNativeWarnState(): void {
  didWarnAboutForcedNative = false;
}
