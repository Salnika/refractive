import { CompositeParts } from "./composite-parts";
import { getFilterAssets } from "./filter-assets";

type FilterProps = {
  id: string;
  scaleRatio: number;
  blur: number;
  width: number;
  height: number;
  radius: number;
  glassThickness: number;
  bezelWidth: number;
  refractiveIndex: number;
  specularOpacity: number;
  specularAngle: number;
  bezelHeightFn: (x: number) => number;
  pixelRatio: number;
  hideTop?: boolean;
  hideBottom?: boolean;
  hideLeft?: boolean;
  hideRight?: boolean;
};

/**
 * @private
 * Creates an SVG containing a filter that can be used as `backdrop-filter`to create a refractive effect.
 *
 * At the moment, width and height need to be explicitly provided to match the size of element it will be applied to.
 *
 * Usage:
 * ```tsx
 * const filterId = "my-refractive-filter";
 *
 * <Filter id={filterId} {...otherProps} />
 * <div style={{ backdropFilter: `url(#${filterId})` }} />
 * ```
 *
 * @param props - The properties for the Filter component.
 * @returns An SVG element containing the filter definition.
 */
export const Filter: React.FC<FilterProps> = ({
  id,
  width,
  height,
  radius,
  blur,
  glassThickness,
  bezelWidth,
  refractiveIndex,
  scaleRatio,
  specularOpacity,
  specularAngle,
  bezelHeightFn,
  pixelRatio,
  hideTop,
  hideBottom,
  hideLeft,
  hideRight,
}) => {
  const { cornerWidth, displacementParts, maximumDisplacement, specularParts } = getFilterAssets({
    radius,
    glassThickness,
    bezelWidth,
    refractiveIndex,
    specularAngle,
    bezelHeightFn,
    pixelRatio,
  });

  const scale = maximumDisplacement * scaleRatio;

  const content = (
    <filter id={id}>
      <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blurred_source" />

      <CompositeParts
        width={width}
        height={height}
        cornerWidth={cornerWidth}
        parts={displacementParts}
        result="displacement_map"
        hideTop={hideTop}
        hideBottom={hideBottom}
        hideLeft={hideLeft}
        hideRight={hideRight}
      />

      <CompositeParts
        width={width}
        height={height}
        cornerWidth={cornerWidth}
        parts={specularParts}
        result="specular_map"
        hideTop={hideTop}
        hideBottom={hideBottom}
        hideLeft={hideLeft}
        hideRight={hideRight}
      />

      <feDisplacementMap
        in="blurred_source"
        in2="displacement_map"
        scale={scale}
        xChannelSelector="R"
        yChannelSelector="G"
        result="displaced_source"
      />

      <feColorMatrix in="specular_map" type="luminanceToAlpha" result="specular_alpha" />

      <feComponentTransfer in="specular_alpha" result="specular_with_opacity">
        <feFuncA type="linear" slope={specularOpacity} />
      </feComponentTransfer>

      <feFlood floodColor="white" result="white_layer" />

      <feComposite
        in="white_layer"
        in2="specular_with_opacity"
        operator="in"
        result="masked_specular"
      />

      <feComposite in="masked_specular" in2="displaced_source" operator="over" />
    </filter>
  );

  return (
    <svg
      aria-hidden="true"
      colorInterpolationFilters="sRGB"
      style={{
        height: 0,
        overflow: "hidden",
        pointerEvents: "none",
        position: "absolute",
        width: 0,
      }}
    >
      <defs>{content}</defs>
    </svg>
  );
};
