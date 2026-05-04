import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { refractive } from "./refractive";

describe("refractive", () => {
  it("renders on the server without creating browser-only filter assets", () => {
    const html = renderToString(<refractive.div refraction={{ radius: 8 }}>Glass</refractive.div>);

    expect(html).toContain("Glass");
    expect(html).not.toContain("<svg");
    expect(html).not.toContain("backdrop-filter");
  });

  it("does not leak a user backdrop filter before the refractive filter is ready", () => {
    const html = renderToString(
      <refractive.div refraction={{ radius: 8 }} style={{ backdropFilter: "blur(2px)" }}>
        Glass
      </refractive.div>,
    );

    expect(html).not.toContain("backdrop-filter");
  });
});
