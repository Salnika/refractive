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
