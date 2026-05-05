import type { ComponentType, ReactNode, Ref } from "react";
import { createElement, useCallback, useId, useState } from "react";
import type { JSX } from "react/jsx-runtime";

import { Filter } from "../components/filter";
import { FilterPortal } from "../components/filter-portal";
import { assignRef } from "../helpers/assign-ref";
import { type RefractionProps, normalizeRefraction } from "./refraction-options";
import { useElementSize } from "./use-element-size";

type RefractiveRef = Ref<HTMLElement>;
type RefAwareProps = {
  ref?: RefractiveRef;
  style?: React.CSSProperties;
};
type HostComponentProps = RefAwareProps & {
  children?: ReactNode;
} & Record<string, unknown>;

/**
 * @private
 * Higher-order component (HOC) that wraps a given component to apply a refractive glass effect.
 *
 * Exposed in `refractive` proxy, which also exposes JSXIntrinsicElements as keys.
 */
function createRefractiveComponent<P extends RefAwareProps>(
  Component: ComponentType<P>,
  displayName = Component.name,
): ComponentType<P & RefractionProps> {
  const RefractiveComponent: ComponentType<P & RefractionProps> = (props) => {
    const { refraction, ref: externalRef, ...componentProps } = props;
    const reactId = useId();
    const filterId = `refractive-${reactId.replace(/:/g, "")}`;
    const [element, setElement] = useState<HTMLElement | null>(null);
    const { width, height } = useElementSize(element);
    const normalizedRefraction = normalizeRefraction(refraction);

    const elementRef = useCallback(
      (nextElement: HTMLElement | null) => {
        setElement(nextElement);
        assignRef(externalRef, nextElement);
      },
      [externalRef],
    );

    const canRenderFilter =
      width > 0 &&
      height > 0 &&
      typeof ImageData !== "undefined" &&
      typeof document !== "undefined";

    const componentStyle = {
      ...componentProps.style,
      backdropFilter: canRenderFilter ? `url(#${filterId})` : undefined,
      borderRadius: normalizedRefraction.radius,
    };

    return (
      <>
        {canRenderFilter ? (
          <FilterPortal>
            <Filter
              id={filterId}
              scaleRatio={1}
              pixelRatio={normalizedRefraction.pixelRatio}
              width={width}
              height={height}
              radius={normalizedRefraction.radius}
              blur={normalizedRefraction.blur}
              glassThickness={normalizedRefraction.glassThickness}
              bezelWidth={normalizedRefraction.bezelWidth}
              refractiveIndex={normalizedRefraction.refractiveIndex}
              specularOpacity={normalizedRefraction.specularOpacity}
              specularAngle={normalizedRefraction.specularAngle}
              bezelHeightFn={normalizedRefraction.bezelHeightFn}
            />
          </FilterPortal>
        ) : null}

        <Component {...(componentProps as unknown as P)} ref={elementRef} style={componentStyle} />
      </>
    );
  };

  RefractiveComponent.displayName = `Refractive(${
    displayName.length > 0 ? displayName : "Component"
  })`;

  return RefractiveComponent;
}

type HTMLElements = {
  [K in keyof JSX.IntrinsicElements]: ComponentType<JSX.IntrinsicElements[K] & RefractionProps>;
};

type RefractiveFunction = (<P extends object>(
  Component: ComponentType<P>,
) => ComponentType<P & RefractionProps>) &
  HTMLElements;

/**
 * Cache for JSX intrinsic elements refractive components, created on demand.
 */
const CACHE = new Map<
  keyof JSX.IntrinsicElements,
  ComponentType<HostComponentProps & RefractionProps>
>();

function createHostComponent(
  elementName: keyof JSX.IntrinsicElements,
): ComponentType<HostComponentProps> {
  const HostComponent: ComponentType<HostComponentProps> = ({ children, ...props }) =>
    createElement(elementName, props, children);

  HostComponent.displayName = `refractive.${String(elementName)}`;
  return HostComponent;
}

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
export const refractive = new Proxy(createRefractiveComponent, {
  get: (target, elementName: keyof JSX.IntrinsicElements) => {
    if (typeof elementName === "symbol") {
      return Reflect.get(target, elementName);
    }

    if (CACHE.has(elementName)) {
      return CACHE.get(elementName);
    }
    const refractiveComponent = createRefractiveComponent(
      createHostComponent(elementName),
      `refractive.${String(elementName)}`,
    );
    CACHE.set(elementName, refractiveComponent);
    return refractiveComponent;
  },
  apply: (target, _thisArg, argArray: Parameters<RefractiveFunction>) => {
    return target(...argArray);
  },
}) as RefractiveFunction;
