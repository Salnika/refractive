import { shouldPrintVitePlusHeader, vitePlusHeader } from "../binding/index.js";
import { styleText } from "node:util";
//#region src/utils/terminal.ts
function log(message) {
	console.log(message);
}
/**
* Emit the Vite+ banner (header line + trailing blank line) to stdout.
* Gating (non-TTY, git hooks) lives in `shouldPrintVitePlusHeader` on the
* Rust side so both CLIs stay in sync.
*/
function printHeader() {
	if (!shouldPrintVitePlusHeader()) return;
	log(vitePlusHeader());
	log("");
}
function accent(text) {
	return styleText("blue", text);
}
function muted(text) {
	return styleText("gray", text);
}
function success(text) {
	return styleText("green", text);
}
function warnMsg(msg) {
	console.error(styleText(["yellow", "bold"], "warn:"), msg);
}
function errorMsg(msg) {
	console.error(styleText(["red", "bold"], "error:"), msg);
}
//#endregion
export { printHeader as a, muted as i, errorMsg as n, success as o, log as r, warnMsg as s, accent as t };
