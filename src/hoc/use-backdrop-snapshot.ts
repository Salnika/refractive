import { useEffect, useState } from "react";

const REFRACTIVE_ROOT_ATTRIBUTE = "data-refractive-root";
const MINIMUM_SNAPSHOT_INTERVAL_MS = 16;
const DEFAULT_BACKGROUND_COLOR = null;
const REACTIVE_EVENT_NAMES = [
  "animationend",
  "animationiteration",
  "animationstart",
  "change",
  "input",
  "pointermove",
  "scroll",
  "touchmove",
  "transitionend",
  "transitionrun",
  "transitionstart",
  "wheel",
] as const;

type Html2CanvasOptions = {
  backgroundColor: string | null;
  height: number;
  ignoreElements: (element: Element) => boolean;
  logging: boolean;
  scrollX: number;
  scrollY: number;
  useCORS: boolean;
  width: number;
  x: number;
  y: number;
};

type Html2Canvas = (
  element: HTMLElement,
  options: Html2CanvasOptions,
) => Promise<HTMLCanvasElement>;

type SnapshotCrop = {
  height: number;
  scrollX: number;
  scrollY: number;
  width: number;
  x: number;
  y: number;
};

type BackdropSnapshotProps = {
  element: HTMLElement | null;
  enabled: boolean;
  frozen?: boolean;
  height: number;
  maxFps: number;
  root: () => HTMLElement | null;
  width: number;
};

let html2CanvasPromise: Promise<Html2Canvas> | undefined;

function loadHtml2Canvas(): Promise<Html2Canvas> {
  html2CanvasPromise ??= import("@html2canvas/html2canvas").then(
    (module) => module.default as Html2Canvas,
  );
  return html2CanvasPromise;
}

export function getRefractiveRootAttribute(): typeof REFRACTIVE_ROOT_ATTRIBUTE {
  return REFRACTIVE_ROOT_ATTRIBUTE;
}

export function shouldIgnoreSnapshotElement(element: Element): boolean {
  return element.hasAttribute(REFRACTIVE_ROOT_ATTRIBUTE);
}

export function shouldIgnoreSnapshotMutation(mutation: MutationRecord): boolean {
  const target = mutation.target;

  return (
    typeof Element !== "undefined" &&
    target instanceof Element &&
    target.closest(`[${REFRACTIVE_ROOT_ATTRIBUTE}]`) !== null
  );
}

export function getSnapshotThrottleDelay(maxFps: number): number {
  if (!Number.isFinite(maxFps) || maxFps <= 0) {
    return 1000;
  }

  return Math.max(MINIMUM_SNAPSHOT_INTERVAL_MS, Math.round(1000 / maxFps));
}

function negateScrollOffset(value: number): number {
  return value === 0 ? 0 : -value;
}

export function getSnapshotCrop(element: HTMLElement, root: HTMLElement): SnapshotCrop {
  const elementRect = element.getBoundingClientRect();
  const rootRect = root.getBoundingClientRect();
  const isDocumentRoot =
    typeof document !== "undefined" &&
    (root === document.body || root === document.documentElement);
  const scrollX = typeof window === "undefined" ? 0 : window.scrollX;
  const scrollY = typeof window === "undefined" ? 0 : window.scrollY;

  if (isDocumentRoot) {
    return {
      height: Math.max(0, Math.round(elementRect.height)),
      scrollX: negateScrollOffset(scrollX),
      scrollY: negateScrollOffset(scrollY),
      width: Math.max(0, Math.round(elementRect.width)),
      x: Math.max(0, Math.round(elementRect.left + scrollX)),
      y: Math.max(0, Math.round(elementRect.top + scrollY)),
    };
  }

  return {
    height: Math.max(0, Math.round(elementRect.height)),
    scrollX: negateScrollOffset(scrollX),
    scrollY: negateScrollOffset(scrollY),
    width: Math.max(0, Math.round(elementRect.width)),
    x: Math.max(0, Math.round(elementRect.left - rootRect.left + root.scrollLeft)),
    y: Math.max(0, Math.round(elementRect.top - rootRect.top + root.scrollTop)),
  };
}

export function useBackdropSnapshot({
  element,
  enabled,
  frozen = false,
  height,
  maxFps,
  root,
  width,
}: BackdropSnapshotProps): string | undefined {
  const [snapshotUrl, setSnapshotUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!enabled || !element || width <= 0 || height <= 0 || typeof document === "undefined") {
      setSnapshotUrl(undefined);
      return;
    }

    const snapshotRoot = root();

    if (!snapshotRoot) {
      setSnapshotUrl(undefined);
      return;
    }

    const resolvedSnapshotRoot = snapshotRoot;
    let disposed = false;
    let running = false;
    let queued = false;
    let lastCaptureAt = 0;
    let animationFrame: number | undefined;
    let timeout: number | undefined;
    const throttleDelay = getSnapshotThrottleDelay(maxFps);

    function isDisposed(): boolean {
      return disposed;
    }

    function clearScheduledCapture(): void {
      if (timeout !== undefined) {
        window.clearTimeout(timeout);
        timeout = undefined;
      }

      if (animationFrame !== undefined && typeof window.cancelAnimationFrame !== "undefined") {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = undefined;
      }
    }

    let capture: () => Promise<void> = async () => {};

    function scheduleCapture(): void {
      if (timeout !== undefined) {
        return;
      }

      const elapsed = Date.now() - lastCaptureAt;
      const delay = Math.max(0, throttleDelay - elapsed);
      timeout = window.setTimeout(() => {
        timeout = undefined;

        if (typeof window.requestAnimationFrame === "undefined") {
          void capture();
          return;
        }

        animationFrame = window.requestAnimationFrame(() => {
          animationFrame = undefined;
          void capture();
        });
      }, delay);
    }

    capture = async () => {
      clearScheduledCapture();

      if (running) {
        queued = true;
        return;
      }

      running = true;
      lastCaptureAt = Date.now();

      try {
        const html2canvas = await loadHtml2Canvas();

        if (isDisposed()) {
          return;
        }

        const crop = getSnapshotCrop(element, resolvedSnapshotRoot);
        const canvas = await html2canvas(resolvedSnapshotRoot, {
          backgroundColor: DEFAULT_BACKGROUND_COLOR,
          height: crop.height,
          ignoreElements: shouldIgnoreSnapshotElement,
          logging: false,
          scrollX: crop.scrollX,
          scrollY: crop.scrollY,
          useCORS: true,
          width: crop.width,
          x: crop.x,
          y: crop.y,
        });

        if (isDisposed()) {
          return;
        }

        setSnapshotUrl(canvas.toDataURL("image/png"));
      } catch {
        if (!isDisposed()) {
          setSnapshotUrl(undefined);
        }
      } finally {
        running = false;

        if (!isDisposed() && queued) {
          queued = false;
          scheduleCapture();
        }
      }
    };

    scheduleCapture();

    if (frozen) {
      return () => {
        disposed = true;
        clearScheduledCapture();
      };
    }

    function scheduleFromEvent(): void {
      scheduleCapture();
    }

    window.addEventListener("resize", scheduleFromEvent);

    for (const eventName of REACTIVE_EVENT_NAMES) {
      window.addEventListener(eventName, scheduleFromEvent, {
        capture: true,
        passive: true,
      });
    }

    const mutationObserver =
      typeof MutationObserver === "undefined"
        ? undefined
        : new MutationObserver((mutations) => {
            if (mutations.every(shouldIgnoreSnapshotMutation)) {
              return;
            }

            scheduleCapture();
          });

    mutationObserver?.observe(resolvedSnapshotRoot, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => {
      disposed = true;
      clearScheduledCapture();
      mutationObserver?.disconnect();
      window.removeEventListener("resize", scheduleFromEvent);

      for (const eventName of REACTIVE_EVENT_NAMES) {
        window.removeEventListener(eventName, scheduleFromEvent, true);
      }
    };
  }, [element, enabled, frozen, height, maxFps, root, width]);

  return snapshotUrl;
}
