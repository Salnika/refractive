import type { Ref } from "react";

export function assignRef<T>(ref: Ref<T> | undefined, value: T | null): void {
  if (!ref) {
    return;
  }

  if (typeof ref === "function") {
    ref(value);
    return;
  }

  const refObject = ref;
  refObject.current = value;
}
