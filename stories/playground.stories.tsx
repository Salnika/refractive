import type { Meta, StoryObj } from "@storybook/react-vite";

import { concave, convex, convexCircle, lip } from "../src/helpers/surface-equations";
import { refractive } from "../src/hoc/refractive";
import { ExampleArticle } from "./example-article";

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
        position: "sticky",
        top: 100,
        marginLeft: 50,
        width: glassWidth,
        height: glassHeight,
        resize: "both",
        overflow: "auto",
        backgroundColor: `rgba(255, 255, 255, ${backgroundOpacity})`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1,
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
    backgroundOpacity: 0.6,
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
