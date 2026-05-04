import type { Ref } from "react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";

import { assignRef } from "./assign-ref";

describe("assignRef", () => {
  it("assigns object refs", () => {
    const ref = createRef<HTMLDivElement>();
    const element = {} as HTMLDivElement;

    assignRef(ref, element);

    expect(ref.current).toBe(element);
  });

  it("calls callback refs", () => {
    const element = {} as HTMLDivElement;
    const values: Array<HTMLDivElement | null> = [];
    const ref: Ref<HTMLDivElement> = (value) => {
      values.push(value);
    };

    assignRef(ref, element);
    assignRef(ref, null);

    expect(values).toEqual([element, null]);
  });

  it("ignores missing refs", () => {
    expect(() => assignRef<HTMLDivElement>(undefined, null)).not.toThrow();
  });
});
