import type { Parts } from "../helpers/split-imagedata-to-parts";
import { splitImageDataToParts } from "../helpers/split-imagedata-to-parts";
import { calculateDisplacementMap, calculateDisplacementMapRadius } from "../maps/displacement-map";
import { calculateSpecularImage } from "../maps/specular";

const MAX_CACHE_SIZE = 64;

type FilterAssetsProps = {
  radius: number;
  glassThickness: number;
  bezelWidth: number;
  refractiveIndex: number;
  specularAngle: number;
  bezelHeightFn: (x: number) => number;
  pixelRatio: number;
};

export type FilterAssets = {
  cornerWidth: number;
  maximumDisplacement: number;
  displacementParts: Parts;
  specularParts: Parts;
};

const filterAssetsCache = new Map<string, FilterAssets>();
const surfaceFunctionIds = new WeakMap<(x: number) => number, number>();
let nextSurfaceFunctionId = 1;

function getSurfaceFunctionId(fn: (x: number) => number): number {
  const existingId = surfaceFunctionIds.get(fn);
  if (existingId) {
    return existingId;
  }

  const id = nextSurfaceFunctionId;
  nextSurfaceFunctionId += 1;
  surfaceFunctionIds.set(fn, id);
  return id;
}

function createFilterAssetsCacheKey(props: FilterAssetsProps): string {
  return [
    props.radius,
    props.glassThickness,
    props.bezelWidth,
    props.refractiveIndex,
    props.specularAngle,
    props.pixelRatio,
    getSurfaceFunctionId(props.bezelHeightFn),
  ].join("|");
}

function setCacheEntry(key: string, value: FilterAssets): void {
  filterAssetsCache.set(key, value);

  if (filterAssetsCache.size <= MAX_CACHE_SIZE) {
    return;
  }

  const oldestKey = filterAssetsCache.keys().next().value;

  if (oldestKey) {
    filterAssetsCache.delete(oldestKey);
  }
}

export function getFilterAssets(props: FilterAssetsProps): FilterAssets {
  const key = createFilterAssetsCacheKey(props);
  const cachedAssets = filterAssetsCache.get(key);

  if (cachedAssets) {
    filterAssetsCache.delete(key);
    filterAssetsCache.set(key, cachedAssets);
    return cachedAssets;
  }

  const cornerWidth = Math.max(props.radius, props.bezelWidth);
  const imageSide = cornerWidth * 2 + 1;
  const displacementRadiusMap = calculateDisplacementMapRadius(
    props.glassThickness,
    props.bezelWidth,
    props.bezelHeightFn,
    props.refractiveIndex,
  );
  const maximumDisplacement = Math.max(...displacementRadiusMap.map(Math.abs));
  const displacementMap = calculateDisplacementMap({
    width: imageSide,
    height: imageSide,
    radius: props.radius,
    bezelWidth: props.bezelWidth,
    precomputedDisplacementMap: displacementRadiusMap,
    maximumDisplacement,
    pixelRatio: props.pixelRatio,
  });
  const specularMap = calculateSpecularImage({
    width: imageSide,
    height: imageSide,
    radius: props.radius,
    specularAngle: props.specularAngle,
    pixelRatio: props.pixelRatio,
  });
  const assets = {
    cornerWidth,
    maximumDisplacement,
    displacementParts: splitImageDataToParts({
      imageData: displacementMap,
      cornerWidth,
      pixelRatio: props.pixelRatio,
    }),
    specularParts: splitImageDataToParts({
      imageData: specularMap,
      cornerWidth,
      pixelRatio: props.pixelRatio,
    }),
  };

  setCacheEntry(key, assets);
  return assets;
}

export function clearFilterAssetsCacheForTests(): void {
  filterAssetsCache.clear();
}

export function getFilterAssetsCacheSizeForTests(): number {
  return filterAssetsCache.size;
}
