import type { Meta, StoryObj } from "@storybook/react-vite";

import { concave, convex, convexCircle, lip } from "../src/helpers/surface-equations";
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
  glassHeight: number;
  glassThickness: number;
  glassWidth: number;
  radius: number;
  refractiveIndex: number;
  specularAngleDegrees: number;
  specularOpacity: number;
};

const surfaceEquationNames = Object.keys(surfaceEquations) as SurfaceEquationName[];

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
  glassHeight,
  glassThickness,
  glassWidth,
  radius,
  refractiveIndex,
  specularAngleDegrees,
  specularOpacity,
}: PlaygroundArgs) => (
  <div style={{ position: "relative" }}>
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
        glassThickness,
        radius,
        refractiveIndex,
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
    glassHeight: 200,
    glassThickness: 70,
    glassWidth: 300,
    radius: 20,
    refractiveIndex: 1.5,
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
