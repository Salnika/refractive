import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  __resetForcedNativeWarnState,
  resolveRefractionRenderMode,
  warnIfForcedNativeOnNonChromium,
} from "./render-mode";

const CHROMIUM_DESKTOP = {
  navigator: {
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/148.0.0.0 Safari/537.36",
  },
};
const FIREFOX_DESKTOP = {
  navigator: {
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:150.0) Gecko/20100101 Firefox/150.0",
  },
};
const SAFARI_DESKTOP = {
  navigator: {
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/26.2 Safari/605.1.15",
  },
};
const IOS_CHROME = {
  navigator: {
    platform: "iPhone",
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 CriOS/148.0.0.0 Mobile/15E148 Safari/604.1",
  },
};

describe("resolveRefractionRenderMode", () => {
  it("keeps explicit modes", () => {
    expect(resolveRefractionRenderMode("native", "snapshot")).toBe("native");
    expect(resolveRefractionRenderMode("snapshot", "snapshot")).toBe("snapshot");
    expect(resolveRefractionRenderMode("simple", "snapshot")).toBe("simple");
  });

  it("uses the native mode for Chromium browsers", () => {
    expect(resolveRefractionRenderMode("auto", "snapshot", CHROMIUM_DESKTOP)).toBe("native");
  });

  it("uses the snapshot mode for Firefox", () => {
    expect(resolveRefractionRenderMode("auto", "snapshot", FIREFOX_DESKTOP)).toBe("snapshot");
  });

  it("uses the snapshot mode for Safari", () => {
    expect(resolveRefractionRenderMode("auto", "snapshot", SAFARI_DESKTOP)).toBe("snapshot");
  });

  it("uses the snapshot mode for iOS Chrome because it runs on WebKit", () => {
    expect(resolveRefractionRenderMode("auto", "snapshot", IOS_CHROME)).toBe("snapshot");
  });

  it("uses the configured fallback mode when auto cannot rely on native SVG backdrop filters", () => {
    expect(resolveRefractionRenderMode("auto", "simple", FIREFOX_DESKTOP)).toBe("simple");
  });
});

describe("warnIfForcedNativeOnNonChromium", () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;
  const processEnv = (globalThis as { process: { env: Record<string, string | undefined> } })
    .process.env;
  const originalNodeEnv = processEnv.NODE_ENV;

  beforeEach(() => {
    __resetForcedNativeWarnState();
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    processEnv.NODE_ENV = "development";
  });

  afterEach(() => {
    warnSpy.mockRestore();
    processEnv.NODE_ENV = originalNodeEnv;
  });

  it("does not warn when forcing native on a Chromium browser", () => {
    warnIfForcedNativeOnNonChromium("native", CHROMIUM_DESKTOP);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("warns once when forcing native on Firefox and stays silent on subsequent calls", () => {
    warnIfForcedNativeOnNonChromium("native", FIREFOX_DESKTOP);
    warnIfForcedNativeOnNonChromium("native", FIREFOX_DESKTOP);
    warnIfForcedNativeOnNonChromium("native", FIREFOX_DESKTOP);

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining("[refractive]"));
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('renderMode: "native"'));
  });

  it("does not warn when renderMode is auto on Firefox", () => {
    warnIfForcedNativeOnNonChromium("auto", FIREFOX_DESKTOP);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("does not warn for snapshot or simple modes", () => {
    warnIfForcedNativeOnNonChromium("snapshot", FIREFOX_DESKTOP);
    warnIfForcedNativeOnNonChromium("simple", FIREFOX_DESKTOP);
    expect(warnSpy).not.toHaveBeenCalled();
  });

  it("warns when forcing native on iOS Chrome (WebKit)", () => {
    warnIfForcedNativeOnNonChromium("native", IOS_CHROME);
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it("stays silent in production even on non-Chromium browsers", () => {
    processEnv.NODE_ENV = "production";
    warnIfForcedNativeOnNonChromium("native", FIREFOX_DESKTOP);
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
