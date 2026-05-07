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

  it("preserves user styles while applying refraction styles on the server", () => {
    const html = renderToString(
      <refractive.div
        refraction={{ radius: 8, renderMode: "snapshot" }}
        style={{ color: "red", position: "fixed" }}
      >
        Glass
      </refractive.div>,
    );

    expect(html).toContain("color:red");
    expect(html).toContain("position:fixed");
    expect(html).toContain("border-radius:8px");
    expect(html).not.toContain("<svg");
  });
});
