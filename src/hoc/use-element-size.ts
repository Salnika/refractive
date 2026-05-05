import { useEffect, useState } from "react";

type ElementSize = {
  width: number;
  height: number;
};

const EMPTY_SIZE: ElementSize = { width: 0, height: 0 };

function normalizeSize(width: number, height: number): ElementSize {
  return {
    width: Math.max(0, Math.round(width)),
    height: Math.max(0, Math.round(height)),
  };
}

function readElementSize(element: HTMLElement): ElementSize {
  const rect = element.getBoundingClientRect();
  return normalizeSize(rect.width, rect.height);
}

function isResizeObserverSizeArray(
  value: ResizeObserverSize | readonly ResizeObserverSize[] | undefined,
): value is readonly ResizeObserverSize[] {
  return Array.isArray(value);
}

function getBorderBoxSize(entry: ResizeObserverEntry): ElementSize {
  const borderBoxSize: ResizeObserverSize | readonly ResizeObserverSize[] | undefined =
    entry.borderBoxSize;
  const firstBorderBoxSize = isResizeObserverSizeArray(borderBoxSize)
    ? borderBoxSize[0]
    : borderBoxSize;

  if (firstBorderBoxSize) {
    return normalizeSize(firstBorderBoxSize.inlineSize, firstBorderBoxSize.blockSize);
  }

  return normalizeSize(entry.contentRect.width, entry.contentRect.height);
}

export function useElementSize(element: HTMLElement | null): ElementSize {
  const [size, setSize] = useState(EMPTY_SIZE);

  useEffect(() => {
    let animationFrame: number | undefined;
    let pendingSize: ElementSize | undefined;

    function commitSize(nextSize: ElementSize): void {
      setSize((currentSize) =>
        currentSize.width === nextSize.width && currentSize.height === nextSize.height
          ? currentSize
          : nextSize,
      );
    }

    function flushSize(): void {
      animationFrame = undefined;

      if (pendingSize) {
        commitSize(pendingSize);
        pendingSize = undefined;
      }
    }

    function scheduleSize(nextSize: ElementSize): void {
      pendingSize = nextSize;

      if (animationFrame !== undefined) {
        return;
      }

      if (typeof requestAnimationFrame === "undefined") {
        flushSize();
        return;
      }

      animationFrame = requestAnimationFrame(flushSize);
    }

    if (!element) {
      commitSize(EMPTY_SIZE);
      return;
    }

    scheduleSize(readElementSize(element));

    if (typeof ResizeObserver === "undefined") {
      return () => {
        if (animationFrame !== undefined && typeof cancelAnimationFrame !== "undefined") {
          cancelAnimationFrame(animationFrame);
        }
      };
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries.at(-1);

      if (entry) {
        scheduleSize(getBorderBoxSize(entry));
      }
    });

    resizeObserver.observe(element);

    return () => {
      resizeObserver.disconnect();

      if (animationFrame !== undefined && typeof cancelAnimationFrame !== "undefined") {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [element]);

  return size;
}
