import { ComponentType } from "react";
import { JSX } from "react/jsx-runtime";

//#region src/helpers/surface-equations.d.ts
type SurfaceFnDef = (x: number) => number;
declare const convexCircle: SurfaceFnDef;
declare const convex: SurfaceFnDef;
declare const concave: SurfaceFnDef;
declare const lip: SurfaceFnDef;
//#endregion
//#region src/hoc/refractive.d.ts
type RefractionProps = {
  refraction: {
    radius: number;
    blur?: number;
    glassThickness?: number;
    bezelWidth?: number;
    refractiveIndex?: number;
    specularOpacity?: number;
    specularAngle?: number;
    bezelHeightFn?: (x: number) => number;
  };
};
type HTMLElements = { [K in keyof JSX.IntrinsicElements]: ComponentType<JSX.IntrinsicElements[K] & RefractionProps> };
type RefractiveFunction = (<P extends object>(Component: ComponentType<P>) => ComponentType<P & RefractionProps>) & HTMLElements;
/**
 * Refractive is a higher-order component (HOC) that can wrap any HTML element or custom React component
 * to apply a refractive glass effect using SVG filters.
 *
 * The wrapped component must accept a `ref` prop to reference the underlying DOM element.
 *
 * Refractive will override:
 * - `borderRadius` based on the provided `radius` in the `refraction` prop.
 * - `backdropFilter` to apply the SVG filter for the refractive effect.
 *
 * Usage with HTML elements:
 *
 * ```tsx
 * <refractive.div
 *   refraction={{ radius: 8, blur: 2 }}
 *   style={{ width: 200, height: 100, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
 * />
 * ```
 *
 * Usage with existing components:
 *
 * ```tsx
 * import { refractive } from "@hashintel/refractive";
 *
 * const MyRefractiveButton = refractive(MyButton);
 *
 * <MyRefractiveButton
 *   refraction={{ radius: 8, blur: 2 }}
 *   style={{ width: 200, height: 100, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
 * />
 * ```
 *
 * @param Component - The React component or HTML element to wrap.
 * @returns Same component with refraction props.
 */
declare const refractive: RefractiveFunction;
//#endregion
export { SurfaceFnDef, concave, convex, convexCircle, lip, refractive };
//# sourceMappingURL=index.d.ts.map