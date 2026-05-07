import { describe, expect, it } from "vitest";

import { resolveRefractionRenderMode } from "./render-mode";

describe("resolveRefractionRenderMode", () => {
  it("keeps explicit modes", () => {
    expect(resolveRefractionRenderMode("native", "snapshot")).toBe("native");
    expect(resolveRefractionRenderMode("snapshot", "snapshot")).toBe("snapshot");
    expect(resolveRefractionRenderMode("simple", "snapshot")).toBe("simple");
  });

  it("uses the native mode for Chromium browsers", () => {
    expect(
      resolveRefractionRenderMode("auto", "snapshot", {
        navigator: {
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/148.0.0.0 Safari/537.36",
        },
      }),
    ).toBe("native");
  });

  it("uses the snapshot mode for Firefox", () => {
    expect(
      resolveRefractionRenderMode("auto", "snapshot", {
        navigator: {
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:150.0) Gecko/20100101 Firefox/150.0",
        },
      }),
    ).toBe("snapshot");
  });

  it("uses the snapshot mode for Safari", () => {
    expect(
      resolveRefractionRenderMode("auto", "snapshot", {
        navigator: {
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/26.2 Safari/605.1.15",
        },
      }),
    ).toBe("snapshot");
  });

  it("uses the snapshot mode for iOS Chrome because it runs on WebKit", () => {
    expect(
      resolveRefractionRenderMode("auto", "snapshot", {
        navigator: {
          platform: "iPhone",
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 CriOS/148.0.0.0 Mobile/15E148 Safari/604.1",
        },
      }),
    ).toBe("snapshot");
  });

  it("uses the configured fallback mode when auto cannot rely on native SVG backdrop filters", () => {
    expect(
      resolveRefractionRenderMode("auto", "simple", {
        navigator: {
          userAgent:
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:150.0) Gecko/20100101 Firefox/150.0",
        },
      }),
    ).toBe("simple");
  });
});
