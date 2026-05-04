/* eslint-disable no-param-reassign */
import { calculateCircleMap } from "./calculate-circle-map";

const NEAR_EDGE_DISTANCE = 20;

export function calculateSpecularImage(props: {
  width: number;
  height: number;
  radius: number;
  specularAngle: number;
  pixelRatio: number;
}) {
  const { pixelRatio, specularAngle } = props;

  // Calculate real dimensions using pixel ratio
  const width = Math.round(props.width * pixelRatio);
  const height = Math.round(props.height * pixelRatio);
  const radius = Math.min(props.radius * pixelRatio, width / 2, height / 2);

  // Vector along which we should see specular
  const specularVector = [Math.cos(specularAngle), Math.sin(specularAngle)] as const;

  return calculateCircleMap({
    width,
    height,
    fillColor: 0x00000000,
    radius,
    maximumDistanceToBorder: NEAR_EDGE_DISTANCE * pixelRatio,
    processPixel(
      x,
      y,
      buffer,
      offset,
      distanceFromCenter,
      _distanceFromBorder,
      _distanceFromBorderRatio,
      _angle,
      opacity,
    ) {
      if (distanceFromCenter === 0) {
        return;
      }

      const distanceFromSide = radius - distanceFromCenter;
      const edgeRatio = distanceFromSide / pixelRatio;

      if (edgeRatio <= 0 || edgeRatio >= 2) {
        return;
      }

      // Viewed from top
      const cos = x / distanceFromCenter;
      const sin = -y / distanceFromCenter;

      // Dot product of orientation
      const dotProduct = Math.max(0, cos * specularVector[0] + sin * specularVector[1]);

      const coefficient = dotProduct * Math.sqrt(1 - (1 - edgeRatio) ** 2);

      const color = 255 * coefficient;
      const finalOpacity = color * coefficient * opacity;

      buffer[offset] = color; // R
      buffer[offset + 1] = color; // G
      buffer[offset + 2] = color; // B
      buffer[offset + 3] = finalOpacity; // A
    },
  });
}
