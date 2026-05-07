# refractive

## 0.0.5

### Added

- Added `renderMode` with `"auto"`, `"native"`, `"snapshot"`, and `"simple"` rendering strategies.
- Added `fallbackMode` so `renderMode: "auto"` can use either the high-fidelity `"snapshot"` fallback or the low-cost `"simple"` fallback outside Chromium.
- Added a Firefox/Safari snapshot renderer powered by `@html2canvas/html2canvas`, including throttled recaptures for scroll, resize, pointer/touch movement, form input, DOM mutations, transitions, and animations.
- Added `snapshotMaxFps` and `snapshotRoot` options to tune snapshot rendering cost and capture scope.
- Added exported `RefractionRenderMode` and `RefractionFallbackMode` types.
- Added Storybook controls for `renderMode`, `fallbackMode`, and `snapshotMaxFps`.

### Changed

- `renderMode: "auto"` now keeps the native SVG `backdrop-filter` path on Chromium and uses the configured fallback in Firefox/Safari.
- The snapshot fallback now renders an internal filtered SVG layer behind component children and isolates stacking so user content remains interactive.
- README documentation now explains rendering modes, the low-cost fallback, and browser/runtime limitations for native, snapshot, and simple rendering.

## 0.0.4

### Added

- Added first-class package metadata for the standalone `refractive` package, including the `exports` map for ESM consumers.
- Added exported `RefractionOptions` and `RefractionProps` types.
- Added refraction option normalization for radius, blur, glass thickness, bezel width, refractive index, specular opacity, specular angle, pixel ratio, and custom bevel surface functions.
- Added support for configurable specular highlight angle and bounded browser pixel ratio.
- Added safe custom bevel surface handling: invalid, throwing, or out-of-range surface functions now fall back to/clamp into safe values.
- Added `assignRef` support so wrapped components can preserve external callback and object refs while the HOC measures the DOM element.
- Added `useElementSize` for ResizeObserver-based measurement with requestAnimationFrame batching and a getBoundingClientRect fallback.
- Added `FilterPortal` so generated SVG filter definitions render into `document.body`.
- Added cached filter asset generation for displacement and specular map parts.
- Added composite geometry calculation to keep rendered SVG image parts within valid dimensions.
- Added tests for ref assignment, composite geometry, displacement maps, specular maps, filter asset caching, refraction option normalization, and the refractive HOC.
- Added Storybook controls for all main refraction parameters, surface equation selection, and multiple visual presets.
- Added the Storybook performance panel.
- Added README visual assets, updated installation examples, options documentation, browser/runtime notes, and Vite+ development instructions.
- Added GitHub Actions for PR checks, Storybook deployment to GitHub Pages, and npm publishing.
- Added README badges and links for GitHub Actions, npm, and the live Storybook.
- Added tag-based npm release automation for `release/x.y.z` tags, with package-version validation, npm provenance publishing, GitHub Release creation, and manual approval through the `npm` GitHub environment.

### Changed

- Renamed the fork from `@hashintel/refractive` to `refractive` and bumped the package version to `0.0.4`.
- Updated README imports and install commands to use the standalone `refractive` package name.
- Reworked the refractive HOC to generate stable filter IDs, cache intrinsic element wrappers, set useful display names, and avoid rendering browser-only filter assets during SSR or before the element has measurable dimensions.
- Moved refraction defaults and bounds out of the HOC into a dedicated normalization module.
- Moved displacement/specular image splitting out of `CompositeParts`; `CompositeParts` now receives precomputed parts.
- Reworked filter rendering to reuse cached assets and hide the backing SVG with an accessible, layout-safe zero-size container.
- Updated displacement map generation to avoid invalid scaling when maximum displacement is zero or non-finite.
- Scoped Vite+ test discovery to `src/**/*.test.ts` and `src/**/*.test.tsx`.
- Enabled declaration sourcemaps for library builds.
- Refreshed Storybook demo content with a richer refractive visual scene and fixed-position glass examples.
- Switched current package licensing metadata to MIT-only and consolidated the license text into `LICENSE.md`.
- Removed unused Turborepo configuration.

### Fixed

- Fixed external refs being replaced by internal refs in wrapped components.
- Fixed filter generation in non-browser/server-rendered environments by guarding access to `document` and `ImageData`.
- Fixed zero-size and overly large corner geometry that could produce invalid composite SVG dimensions.
- Fixed specular angle configuration being ignored by the generated filter.
- Fixed test configuration that previously allowed the suite to pass with no tests.

## 0.0.3

### Patch Changes

- [#8581](https://github.com/hashintel/hash/pull/8581) [`efc1237`](https://github.com/hashintel/hash/commit/efc12379a84adbcf28db961bf6af8dd18e6b579d) Thanks [@CiaranMn](https://github.com/CiaranMn)! - change equation export casing, e.g. LIP -> lip

## 0.0.2

### Patch Changes

- [#8328](https://github.com/hashintel/hash/pull/8328) [`567b951`](https://github.com/hashintel/hash/commit/567b95178a429aa2c1c00050ca753250db0db094) Thanks [@CiaranMn](https://github.com/CiaranMn)! - Build fix

## 0.0.1

### Patch Changes

- [#8137](https://github.com/hashintel/hash/pull/8137) [`658b9a4`](https://github.com/hashintel/hash/commit/658b9a4040029059099b43a77a757ff32e0b5c38) Thanks [@kube](https://github.com/kube)! - First version
