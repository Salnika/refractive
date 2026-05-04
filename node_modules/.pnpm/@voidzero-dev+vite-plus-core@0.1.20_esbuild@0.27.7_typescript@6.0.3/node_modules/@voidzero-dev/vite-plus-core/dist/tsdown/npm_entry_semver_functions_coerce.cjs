const require_chunk = require("./npm_cjs_chunk_chunk.cjs");
const require_semver$1 = require("./npm_cjs_chunk_semver.cjs");
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/parse.js
var require_parse = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	const SemVer = require_semver$1.require_semver();
	const parse = (version, options, throwErrors = false) => {
		if (version instanceof SemVer) return version;
		try {
			return new SemVer(version, options);
		} catch (er) {
			if (!throwErrors) return null;
			throw er;
		}
	};
	module.exports = parse;
}));
//#endregion
//#region ../../node_modules/.pnpm/semver@7.7.4/node_modules/semver/functions/coerce.js
var require_coerce = /* @__PURE__ */ require_chunk.__commonJSMin(((exports, module) => {
	const SemVer = require_semver$1.require_semver();
	const parse = require_parse();
	const { safeRe: re, t } = require_semver$1.require_re();
	const coerce = (version, options) => {
		if (version instanceof SemVer) return version;
		if (typeof version === "number") version = String(version);
		if (typeof version !== "string") return null;
		options = options || {};
		let match = null;
		if (!options.rtl) match = version.match(options.includePrerelease ? re[t.COERCEFULL] : re[t.COERCE]);
		else {
			const coerceRtlRegex = options.includePrerelease ? re[t.COERCERTLFULL] : re[t.COERCERTL];
			let next;
			while ((next = coerceRtlRegex.exec(version)) && (!match || match.index + match[0].length !== version.length)) {
				if (!match || next.index + next[0].length !== match.index + match[0].length) match = next;
				coerceRtlRegex.lastIndex = next.index + next[1].length + next[2].length;
			}
			coerceRtlRegex.lastIndex = -1;
		}
		if (match === null) return null;
		const major = match[2];
		return parse(`${major}.${match[3] || "0"}.${match[4] || "0"}${options.includePrerelease && match[5] ? `-${match[5]}` : ""}${options.includePrerelease && match[6] ? `+${match[6]}` : ""}`, options);
	};
	module.exports = coerce;
}));
//#endregion
//#region dist/tsdown/_npm_entry_semver_functions_coerce.cjs
module.exports = require_coerce();
//#endregion
