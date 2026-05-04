export type CompositeGeometry = {
  height: number;
  heightMinusCorner: number;
  renderCornerWidth: number;
  width: number;
  widthMinusCorner: number;
};

export function calculateCompositeGeometry(props: {
  cornerWidth: number;
  height: number;
  width: number;
}): CompositeGeometry {
  const width = Math.max(0, props.width);
  const height = Math.max(0, props.height);
  const renderCornerWidth = Math.max(0, Math.min(props.cornerWidth, width / 2, height / 2));

  return {
    height,
    heightMinusCorner: height - renderCornerWidth,
    renderCornerWidth,
    width,
    widthMinusCorner: width - renderCornerWidth,
  };
}
