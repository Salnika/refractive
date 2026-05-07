import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

import { concave, convex, convexCircle, lip } from "../src/helpers/surface-equations";
import type { RefractionFallbackMode, RefractionRenderMode } from "../src/hoc/refraction-options";
import { refractive } from "../src/hoc/refractive";
import { ExampleArticle, storyFontFamily } from "./example-article";

const surfaceEquations = {
  concave,
  convex,
  convexCircle,
  lip,
};

type SurfaceEquationName = keyof typeof surfaceEquations;

type PlaygroundArgs = {
  backgroundOpacity: number;
  bezelHeightFn: SurfaceEquationName;
  bezelWidth: number;
  blur: number;
  fallbackMode: RefractionFallbackMode;
  glassHeight: number;
  glassThickness: number;
  glassWidth: number;
  radius: number;
  refractiveIndex: number;
  renderMode: RefractionRenderMode;
  snapshotMaxFps: number;
  specularAngleDegrees: number;
  specularOpacity: number;
};

const fallbackModes: RefractionFallbackMode[] = ["snapshot", "simple"];
const renderModes: RefractionRenderMode[] = ["auto", "native", "snapshot", "simple"];
const surfaceEquationNames = Object.keys(surfaceEquations) as SurfaceEquationName[];

function isChromeBrowser(): boolean {
  if (typeof navigator === "undefined") {
    return true;
  }

  const userAgent = navigator.userAgent;

  if (/Edg|OPR|Firefox|FxiOS|CriOS/u.test(userAgent)) {
    return false;
  }

  return /Chrome|Chromium/u.test(userAgent);
}

const BrowserCompatibilityNotice = () => {
  const [isOpen, setIsOpen] = useState(false);

  if (isChromeBrowser()) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{
          alignItems: "center",
          background: "rgb(17 24 39 / 0.86)",
          border: "1px solid rgb(255 255 255 / 0.24)",
          borderRadius: 6,
          color: "white",
          cursor: "pointer",
          display: "flex",
          fontFamily: storyFontFamily,
          fontSize: 13,
          fontWeight: 700,
          gap: 8,
          left: 16,
          letterSpacing: 0,
          padding: "8px 10px",
          position: "fixed",
          top: 16,
          zIndex: 10,
        }}
        type="button"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="16"
          viewBox="0 0 24 24"
          width="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 16V11" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          <circle cx="12" cy="8" fill="currentColor" r="1.2" />
        </svg>
        This browser might not be supported
      </button>

      {isOpen ? (
        <div
          aria-modal="true"
          role="dialog"
          style={{
            background: "rgb(15 23 42 / 0.34)",
            display: "grid",
            inset: 0,
            padding: 16,
            placeItems: "start center",
            position: "fixed",
            zIndex: 20,
          }}
        >
          <div
            style={{
              background: "rgb(255 255 255 / 0.96)",
              border: "1px solid rgb(15 23 42 / 0.14)",
              borderRadius: 8,
              boxShadow: "0 24px 80px rgb(15 23 42 / 0.26)",
              color: "#10131a",
              fontFamily: storyFontFamily,
              marginTop: 48,
              maxWidth: 360,
              padding: 16,
            }}
          >
            <div
              style={{
                alignItems: "center",
                display: "flex",
                fontSize: 15,
                fontWeight: 800,
                gap: 8,
                letterSpacing: 0,
                marginBottom: 8,
              }}
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="18"
                viewBox="0 0 24 24"
                width="18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 16V11" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                <circle cx="12" cy="8" fill="currentColor" r="1.2" />
              </svg>
              Browser support
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.45, margin: "0 0 10px" }}>
              This demo is ideal in Chrome. Other browsers may use a fallback because advanced SVG
              backdrop filters are not consistently supported.
            </p>
            <p style={{ fontSize: 13, lineHeight: 1.45, margin: "0 0 14px" }}>
              You can compare modes with the Storybook controls: snapshot is closer visually, while
              simple is cheaper and only applies blur.
            </p>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "#10131a",
                border: 0,
                borderRadius: 6,
                color: "white",
                cursor: "pointer",
                fontFamily: storyFontFamily,
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: 0,
                padding: "8px 12px",
              }}
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

const sharedGlassStyle = {
  alignItems: "center",
  boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.45), 0 24px 80px rgba(15, 23, 42, 0.22)",
  color: "#10131a",
  display: "flex",
  fontFamily: storyFontFamily,
  fontSize: 18,
  fontWeight: 800,
  justifyContent: "center",
  letterSpacing: 0,
  overflow: "auto",
  resize: "both",
  textTransform: "uppercase",
  zIndex: 1,
} satisfies React.CSSProperties;

const GlassOverArticle = ({
  backgroundOpacity,
  bezelHeightFn,
  bezelWidth,
  blur,
  fallbackMode,
  glassHeight,
  glassThickness,
  glassWidth,
  radius,
  refractiveIndex,
  renderMode,
  snapshotMaxFps,
  specularAngleDegrees,
  specularOpacity,
}: PlaygroundArgs) => (
  <div style={{ position: "relative" }}>
    <BrowserCompatibilityNotice />

    <refractive.div
      style={{
        ...sharedGlassStyle,
        backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
        height: glassHeight,
        left: 56,
        position: "fixed",
        top: 100,
        width: glassWidth,
      }}
      refraction={{
        bezelHeightFn: surfaceEquations[bezelHeightFn],
        bezelWidth,
        blur,
        fallbackMode,
        glassThickness,
        radius,
        refractiveIndex,
        renderMode,
        snapshotMaxFps,
        specularAngle: (specularAngleDegrees * Math.PI) / 180,
        specularOpacity,
      }}
    >
      Refractive Glass
    </refractive.div>

    <ExampleArticle />
  </div>
);

const meta = {
  title: "Playground",
  component: GlassOverArticle,
  args: {
    backgroundOpacity: 0.5,
    bezelHeightFn: "convex",
    bezelWidth: 30,
    blur: 2,
    fallbackMode: "snapshot",
    glassHeight: 200,
    glassThickness: 70,
    glassWidth: 300,
    radius: 20,
    refractiveIndex: 1.5,
    renderMode: "auto",
    snapshotMaxFps: 30,
    specularAngleDegrees: 115,
    specularOpacity: 0.9,
  },
  argTypes: {
    backgroundOpacity: {
      control: { max: 1, min: 0, step: 0.05, type: "range" },
    },
    bezelHeightFn: {
      control: "select",
      options: surfaceEquationNames,
    },
    bezelWidth: {
      control: { max: 120, min: 0, step: 1, type: "range" },
    },
    blur: {
      control: { max: 20, min: 0, step: 0.5, type: "range" },
    },
    fallbackMode: {
      control: "select",
      options: fallbackModes,
    },
    glassHeight: {
      control: { max: 600, min: 40, step: 10, type: "range" },
    },
    glassThickness: {
      control: { max: 300, min: 0, step: 5, type: "range" },
    },
    glassWidth: {
      control: { max: 800, min: 40, step: 10, type: "range" },
    },
    radius: {
      control: { max: 120, min: 0, step: 1, type: "range" },
    },
    refractiveIndex: {
      control: { max: 3, min: 1, step: 0.05, type: "range" },
    },
    renderMode: {
      control: "select",
      options: renderModes,
    },
    snapshotMaxFps: {
      control: { max: 60, min: 1, step: 1, type: "range" },
    },
    specularAngleDegrees: {
      control: { max: 360, min: 0, step: 1, type: "range" },
    },
    specularOpacity: {
      control: { max: 1, min: 0, step: 0.05, type: "range" },
    },
  },
} satisfies Meta<typeof GlassOverArticle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const FrostedPanel: Story = {
  args: {
    backgroundOpacity: 0.48,
    bezelHeightFn: "convex",
    bezelWidth: 24,
    blur: 4,
    glassHeight: 220,
    glassThickness: 80,
    glassWidth: 340,
    radius: 28,
    refractiveIndex: 1.45,
    specularAngleDegrees: 115,
    specularOpacity: 0.72,
  },
};

export const CrystalLens: Story = {
  args: {
    backgroundOpacity: 0.28,
    bezelHeightFn: "convexCircle",
    bezelWidth: 46,
    blur: 1,
    glassHeight: 260,
    glassThickness: 150,
    glassWidth: 420,
    radius: 56,
    refractiveIndex: 1.82,
    specularAngleDegrees: 42,
    specularOpacity: 0.95,
  },
};

export const SoftBubble: Story = {
  args: {
    backgroundOpacity: 0.38,
    bezelHeightFn: "concave",
    bezelWidth: 34,
    blur: 8,
    glassHeight: 260,
    glassThickness: 95,
    glassWidth: 260,
    radius: 120,
    refractiveIndex: 1.36,
    specularAngleDegrees: 210,
    specularOpacity: 0.45,
  },
};

export const SharpPrism: Story = {
  args: {
    backgroundOpacity: 0.22,
    bezelHeightFn: "lip",
    bezelWidth: 64,
    blur: 0,
    glassHeight: 180,
    glassThickness: 220,
    glassWidth: 520,
    radius: 12,
    refractiveIndex: 2.18,
    specularAngleDegrees: 300,
    specularOpacity: 1,
  },
};
