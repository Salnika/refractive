import { stripVTControlCharacters, styleText } from "node:util";
//#region src/utils/help.ts
function toLines(value) {
	if (!value) return [];
	return Array.isArray(value) ? [...value] : [value];
}
function visibleLength(value) {
	return stripVTControlCharacters(value).length;
}
function padVisible(value, width) {
	const padding = Math.max(0, width - visibleLength(value));
	return `${value}${" ".repeat(padding)}`;
}
function renderRows(rows) {
	if (rows.length === 0) return [];
	const labelWidth = Math.max(...rows.map((row) => visibleLength(row.label)));
	const output = [];
	for (const row of rows) {
		const descriptionLines = toLines(row.description);
		if (descriptionLines.length === 0) {
			output.push(`  ${row.label}`);
			continue;
		}
		const [firstLine, ...rest] = descriptionLines;
		output.push(`  ${padVisible(row.label, labelWidth)}  ${firstLine}`);
		for (const line of rest) output.push(`  ${" ".repeat(labelWidth)}  ${line}`);
	}
	return output;
}
function heading(label, color) {
	if (!color) return `${label}:`;
	return label === "Usage" ? styleText("bold", `${label}:`) : styleText(["blue", "bold"], `${label}:`);
}
function renderCliDoc(doc, options = {}) {
	const color = options.color ?? true;
	const output = [];
	if (doc.usage) {
		const usage = color ? styleText("bold", doc.usage) : doc.usage;
		output.push(`${heading("Usage", color)} ${usage}`);
	}
	const summaryLines = toLines(doc.summary);
	if (summaryLines.length > 0) {
		if (output.length > 0) output.push("");
		output.push(...summaryLines);
	}
	for (const section of doc.sections) {
		if (output.length > 0) output.push("");
		output.push(heading(section.title, color));
		const lines = toLines(section.lines);
		if (lines.length > 0) output.push(...lines);
		if (section.rows && section.rows.length > 0) output.push(...renderRows(section.rows));
	}
	if (doc.documentationUrl) {
		if (output.length > 0) output.push("");
		output.push(`${heading("Documentation", color)} ${doc.documentationUrl}`);
	}
	output.push("");
	return output.join("\n");
}
//#endregion
export { renderCliDoc as t };
