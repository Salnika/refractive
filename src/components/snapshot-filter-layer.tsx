type SnapshotFilterLayerProps = {
  filterId: string;
  height: number;
  snapshotUrl?: string;
  width: number;
};

export const SnapshotFilterLayer: React.FC<SnapshotFilterLayerProps> = ({
  filterId,
  height,
  snapshotUrl,
  width,
}) => {
  if (!snapshotUrl || width <= 0 || height <= 0) {
    return null;
  }

  return (
    <span
      aria-hidden="true"
      style={{
        borderRadius: "inherit",
        display: "block",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        position: "absolute",
        zIndex: -1,
      }}
    >
      <svg
        aria-hidden="true"
        height={height}
        style={{ display: "block", height: "100%", width: "100%" }}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
      >
        <image
          filter={`url(#${filterId})`}
          height={height}
          href={snapshotUrl}
          preserveAspectRatio="none"
          width={width}
          x={0}
          y={0}
        />
      </svg>
      <span
        style={{
          background: "inherit",
          borderRadius: "inherit",
          display: "block",
          inset: 0,
          position: "absolute",
        }}
      />
    </span>
  );
};
