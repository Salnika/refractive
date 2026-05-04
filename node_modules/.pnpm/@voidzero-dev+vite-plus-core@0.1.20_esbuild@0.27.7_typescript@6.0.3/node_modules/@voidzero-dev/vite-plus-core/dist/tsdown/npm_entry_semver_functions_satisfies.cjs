const require_chunk = require("./npm_cjs_chunk_chunk.cjs");
const require_range$1 = require("./npm_cjs_chunk_range.cjs");
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/satisfies.js
var require_satisfies = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	const Range = require_range$1.require_range();
	const satisfies = (version, range, options) => {
		try {
			range = new Range(range, options);
		} catch (er) {
			return false;
		}
		return range.test(version);
	};
	module.exports = satisfies;
}));
//#endregion
//#region dist/tsdown/_npm_entry_semver_functions_satisfies.cjs
module.exports = require_satisfies();
//#endregion
