import { createElement as e, useEffect as t, useId as n, useRef as r, useState as i } from "react";
import { c as a } from "react/compiler-runtime";
import { Fragment as o, jsx as s, jsxs as c } from "react/jsx-runtime";
//#region src/helpers/surface-equations.ts
var l = (e) => Math.sqrt(1 - (1 - e) ** 2), u = (e) => (1 - (1 - e) ** 4) ** (1 / 4), d = (e) => 1 - l(e), f = (e) => {
	let t = u(e * 2), n = d(e) + .1, r = 6 * e ** 5 - 15 * e ** 4 + 10 * e ** 3;
	return t * (1 - r) + n * r;
};
//#endregion
//#region src/maps/calculate-circle-map.ts
function p(e) {
	let { fillColor: t, processPixel: n, maximumDistanceToBorder: r } = e, i = Math.round(e.width), a = Math.round(e.height), o = new ImageData(i, a);
	new Uint32Array(o.data.buffer).fill(t);
	let s = Math.min(e.radius, i / 2, a / 2), c = i - s * 2, l = a - s * 2, u = s ** 2, d = (s + 1) ** 2, f = r ? (s - r) ** 2 : 0;
	for (let e = 0; e < a; e++) for (let t = 0; t < i; t++) {
		let r = (e * i + t) * 4, p = t < s, m = t >= i - s, h = e < s, g = e >= a - s, _ = p ? t - s : m ? t - s - c : 0, v = h ? e - s : g ? e - s - l : 0, y = _ * _ + v * v;
		if (y <= d && y >= f) {
			let e = Math.sqrt(y), t = s - e, i = t / s, a = Math.atan2(v, _), c = y > u ? 1 - t : 1;
			n(_, v, o.data, r, e, t, i, a, c);
		}
	}
	return o;
}
//#endregion
//#region src/maps/calculate-rounded-square-map.ts
function m(e, t, n, r) {
	let i = Math.atan2(t - e, t), a = Math.atan2(t, t - e), o = a - i, s = Math.atan2(Math.abs(r), Math.abs(n));
	if (s <= i || s >= a) return Math.abs(r) > Math.abs(n) ? [Math.abs(n / r) * t * Math.sign(n), t * Math.sign(r)] : [t * Math.sign(n), Math.abs(r / n) * t * Math.sign(r)];
	{
		let a = (s - i) / (o / (Math.PI / 2)), c = Math.cos(a), l = Math.sin(a);
		return [(t - e + c * e) * Math.sign(n), (t - e + l * e) * Math.sign(r)];
	}
}
function h(e) {
	if (e.maximumDistanceToBorder === void 0 || e.maximumDistanceToBorder <= e.radius) return p(e);
	let { fillColor: t, processPixel: n } = e, r = Math.round(e.width), i = Math.round(e.height), a = new ImageData(r, i);
	new Uint32Array(a.data.buffer).fill(t);
	let o = Math.min(e.radius, r / 2, i / 2), s = Math.max(o, Math.min(e.maximumDistanceToBorder, r / 2, i / 2)), c = r - s * 2, l = i - s * 2, u = (o + 1) ** 2;
	for (let e = 0; e < i; e++) for (let t = 0; t < r; t++) {
		let d = (e * r + t) * 4, f = t < s, p = t >= r - s, h = e < s, g = e >= i - s, _ = f ? t - s : p ? t - s - c : 0, v = h ? e - s : g ? e - s - l : 0, [y, b] = m(o, s, _, v), x = _ * _ + v * v, S = (y - _) ** 2 + (b - v) ** 2, C = Math.abs(_) > s - o && Math.abs(v) > s - o, w = C && (Math.abs(_) - (s - o)) ** 2 + (Math.abs(v) - (s - o)) ** 2 >= u;
		if (!C || !w) {
			let e = Math.sqrt(x), t = Math.sqrt(S), r = t / (e + t), i = Math.atan2(v, _), o = w ? 1 - t : 1;
			n(_, v, a.data, d, e, t, r, i, o);
		}
	}
	return a;
}
//#endregion
//#region src/maps/displacement-map.ts
function g(e = 200, t = 50, n = (e) => e, r = 1.5, i = 128) {
	let a = 1 / r;
	function o(e, t) {
		let n = t, r = 1 - a * a * (1 - n * n);
		if (r < 0) return null;
		let i = Math.sqrt(r);
		return [-(a * n + i) * e, a - (a * n + i) * t];
	}
	return Array.from({ length: i }, (r, a) => {
		let s = a / i, c = n(s), l = s < 1 ? 1e-4 : -1e-4, u = (n(s + l) - c) / l, d = Math.sqrt(u * u + 1), f = [-u / d, -1 / d], p = o(f[0], f[1]);
		if (p) {
			let n = c * t + e;
			return p[0] * (n / p[1]);
		} else return 0;
	});
}
function _(e) {
	let { pixelRatio: t, maximumDisplacement: n, precomputedDisplacementMap: r } = e, i = Math.round(e.width * t), a = Math.round(e.height * t), o = Math.min(e.radius * t, i / 2, a / 2), s = Math.min(e.bezelWidth * t, i / 2, a / 2);
	return h({
		width: i,
		height: a,
		radius: o,
		maximumDistanceToBorder: s,
		fillColor: 4278222976,
		processPixel(e, t, i, a, c, l, u, d, f) {
			let p = Math.cos(d), m = Math.sin(d), h = s > o ? u : l / s, g = r[Math.round(h * r.length)] ?? 0, _ = -p * g / n, v = -m * g / n;
			i[a] = 128 + _ * 127 * f, i[a + 1] = 128 + v * 127 * f, i[a + 2] = 0, i[a + 3] = 255;
		}
	});
}
//#endregion
//#region src/maps/specular.ts
var v = 20;
function y(e) {
	let { pixelRatio: t, specularAngle: n } = e, r = Math.round(e.width * t), i = Math.round(e.height * t), a = Math.min(e.radius * t, r / 2, i / 2), o = [Math.cos(n), Math.sin(n)];
	return p({
		width: r,
		height: i,
		fillColor: 0,
		radius: a,
		maximumDistanceToBorder: v * t,
		processPixel(e, n, r, i, s, c, l, u, d) {
			let f = a - s, p = e / s, m = -n / s, h = Math.abs(p * o[0] + m * o[1]) * Math.sqrt(1 - (1 - f / (1 * t)) ** 2), g = 255 * h, _ = g * h * d;
			r[i] = g, r[i + 1] = g, r[i + 2] = g, r[i + 3] = _;
		}
	});
}
//#endregion
//#region src/helpers/image-data-to-url.ts
function b(e, t, n, r = 0, i = 0) {
	let a = document.createElement("canvas");
	return a.width = t ?? e.width, a.height = n ?? e.height, a.getContext("2d").putImageData(e, -r, -i), a.toDataURL();
}
//#endregion
//#region src/helpers/split-imagedata-to-parts.ts
function x(e) {
	let { imageData: t } = e, n = e.cornerWidth * e.pixelRatio, r = 1 * e.pixelRatio;
	if (t.width !== n * 2 + r) throw Error("ImageData width is too small for the given corner width");
	if (t.height !== t.width) throw Error("ImageData should be square");
	return {
		topLeft: b(t, n, n, 0, 0),
		top: b(t, r, n, n, 0),
		topRight: b(t, n, n, n + r, 0),
		left: b(t, n, r, 0, n),
		center: b(t, r, r, n, n),
		right: b(t, n, r, n + r, n),
		bottomLeft: b(t, n, n, 0, n + r),
		bottom: b(t, r, n, n, n + r),
		bottomRight: b(t, n, n, n + r, n + r)
	};
}
//#endregion
//#region src/components/composite-parts.tsx
var S = (e) => {
	let t = a(74), { imageData: n, cornerWidth: r, width: i, height: l, pixelRatio: u, result: d, hideTop: f, hideBottom: p, hideLeft: m, hideRight: h } = e, g;
	t[0] !== r || t[1] !== n || t[2] !== u ? (g = x({
		imageData: n,
		cornerWidth: r,
		pixelRatio: u
	}), t[0] = r, t[1] = n, t[2] = u, t[3] = g) : g = t[3];
	let _ = g, v = i - r, y = l - r, b = `${d}_topLeft`, S;
	t[4] !== r || t[5] !== _.topLeft || t[6] !== b ? (S = /* @__PURE__ */ s("feImage", {
		href: _.topLeft,
		x: 0,
		y: 0,
		width: r,
		height: r,
		result: b,
		preserveAspectRatio: "none"
	}), t[4] = r, t[5] = _.topLeft, t[6] = b, t[7] = S) : S = t[7];
	let w = `${d}_top`, T;
	t[8] !== r || t[9] !== _.top || t[10] !== w || t[11] !== i ? (T = /* @__PURE__ */ s("feImage", {
		href: _.top,
		x: 0,
		y: 0,
		width: i,
		height: r,
		result: w,
		preserveAspectRatio: "none"
	}), t[8] = r, t[9] = _.top, t[10] = w, t[11] = i, t[12] = T) : T = t[12];
	let E = `${d}_topRight`, D;
	t[13] !== r || t[14] !== _.topRight || t[15] !== E || t[16] !== v ? (D = /* @__PURE__ */ s("feImage", {
		href: _.topRight,
		x: v,
		y: 0,
		width: r,
		height: r,
		result: E,
		preserveAspectRatio: "none"
	}), t[13] = r, t[14] = _.topRight, t[15] = E, t[16] = v, t[17] = D) : D = t[17];
	let O = `${d}_left`, k;
	t[18] !== r || t[19] !== l || t[20] !== _.left || t[21] !== O ? (k = /* @__PURE__ */ s("feImage", {
		href: _.left,
		x: 0,
		y: 0,
		width: r,
		height: l,
		result: O,
		preserveAspectRatio: "none"
	}), t[18] = r, t[19] = l, t[20] = _.left, t[21] = O, t[22] = k) : k = t[22];
	let A = `${d}_right`, j;
	t[23] !== r || t[24] !== l || t[25] !== _.right || t[26] !== A || t[27] !== v ? (j = /* @__PURE__ */ s("feImage", {
		href: _.right,
		y: 0,
		x: v,
		width: r,
		height: l,
		result: A,
		preserveAspectRatio: "none"
	}), t[23] = r, t[24] = l, t[25] = _.right, t[26] = A, t[27] = v, t[28] = j) : j = t[28];
	let M = `${d}_bottomLeft`, N;
	t[29] !== r || t[30] !== y || t[31] !== _.bottomLeft || t[32] !== M ? (N = /* @__PURE__ */ s("feImage", {
		href: _.bottomLeft,
		x: 0,
		y,
		width: r,
		height: r,
		result: M,
		preserveAspectRatio: "none"
	}), t[29] = r, t[30] = y, t[31] = _.bottomLeft, t[32] = M, t[33] = N) : N = t[33];
	let P = `${d}_bottom`, F;
	t[34] !== r || t[35] !== y || t[36] !== _.bottom || t[37] !== P || t[38] !== i ? (F = /* @__PURE__ */ s("feImage", {
		href: _.bottom,
		x: 0,
		y,
		width: i,
		height: r,
		result: P,
		preserveAspectRatio: "none"
	}), t[34] = r, t[35] = y, t[36] = _.bottom, t[37] = P, t[38] = i, t[39] = F) : F = t[39];
	let I = `${d}_bottomRight`, L;
	t[40] !== r || t[41] !== y || t[42] !== _.bottomRight || t[43] !== I || t[44] !== v ? (L = /* @__PURE__ */ s("feImage", {
		href: _.bottomRight,
		x: v,
		y,
		width: r,
		height: r,
		result: I,
		preserveAspectRatio: "none"
	}), t[40] = r, t[41] = y, t[42] = _.bottomRight, t[43] = I, t[44] = v, t[45] = L) : L = t[45];
	let R = `${d}_base`, z;
	t[46] !== l || t[47] !== _.center || t[48] !== R || t[49] !== i ? (z = /* @__PURE__ */ s("feImage", {
		href: _.center,
		x: 0,
		y: 0,
		width: i,
		height: l,
		result: R,
		preserveAspectRatio: "none"
	}), t[46] = l, t[47] = _.center, t[48] = R, t[49] = i, t[50] = z) : z = t[50];
	let B = !f && "top", V = !m && "left", H = !h && "right", U = !p && "bottom", W = !f && !m && "topLeft", G = !f && !h && "topRight", K = !p && !m && "bottomLeft", q = !p && !h && "bottomRight", J;
	t[51] !== B || t[52] !== V || t[53] !== H || t[54] !== U || t[55] !== W || t[56] !== G || t[57] !== K || t[58] !== q ? (J = [
		B,
		V,
		H,
		U,
		W,
		G,
		K,
		q
	].filter(C), t[51] = B, t[52] = V, t[53] = H, t[54] = U, t[55] = W, t[56] = G, t[57] = K, t[58] = q, t[59] = J) : J = t[59];
	let Y;
	t[60] !== d || t[61] !== J ? (Y = J.map((e, t, n) => /* @__PURE__ */ s("feComposite", {
		operator: "over",
		in: `${d}_${e}`,
		in2: t === 0 ? `${d}_base` : `${d}_composite_${t}`,
		result: t === n.length - 1 ? d : `${d}_composite_${t}`
	}, e)), t[60] = d, t[61] = J, t[62] = Y) : Y = t[62];
	let X;
	return t[63] !== j || t[64] !== N || t[65] !== F || t[66] !== L || t[67] !== z || t[68] !== Y || t[69] !== S || t[70] !== T || t[71] !== D || t[72] !== k ? (X = /* @__PURE__ */ c(o, { children: [
		S,
		T,
		D,
		k,
		j,
		N,
		F,
		L,
		z,
		Y
	] }), t[63] = j, t[64] = N, t[65] = F, t[66] = L, t[67] = z, t[68] = Y, t[69] = S, t[70] = T, t[71] = D, t[72] = k, t[73] = X) : X = t[73], X;
};
function C(e) {
	return typeof e == "string";
}
//#endregion
//#region src/components/filter.tsx
var w = (e) => {
	let t = a(53), { id: n, width: r, height: i, radius: o, blur: l, glassThickness: u, bezelWidth: d, refractiveIndex: f, scaleRatio: p, specularOpacity: m, bezelHeightFn: h, pixelRatio: v, hideTop: b, hideBottom: x, hideLeft: C, hideRight: w } = e, T = Math.max(o, d), E = T * 2 + 1, D, O;
	if (t[0] !== h || t[1] !== d || t[2] !== u || t[3] !== E || t[4] !== v || t[5] !== o || t[6] !== f) {
		let e = g(u, d, h, f);
		D = Math.max(...e.map(Math.abs)), O = _({
			width: E,
			height: E,
			radius: o,
			bezelWidth: d,
			precomputedDisplacementMap: e,
			maximumDisplacement: D,
			pixelRatio: v
		}), t[0] = h, t[1] = d, t[2] = u, t[3] = E, t[4] = v, t[5] = o, t[6] = f, t[7] = D, t[8] = O;
	} else D = t[7], O = t[8];
	let k = O, A;
	t[9] !== E || t[10] !== v || t[11] !== o ? (A = y({
		width: E,
		height: E,
		radius: o,
		specularAngle: Math.PI / 4,
		pixelRatio: v
	}), t[9] = E, t[10] = v, t[11] = o, t[12] = A) : A = t[12];
	let j = A, M = D * p, N;
	t[13] === l ? N = t[14] : (N = /* @__PURE__ */ s("feGaussianBlur", {
		in: "SourceGraphic",
		stdDeviation: l,
		result: "blurred_source"
	}), t[13] = l, t[14] = N);
	let P;
	t[15] !== T || t[16] !== k || t[17] !== i || t[18] !== x || t[19] !== C || t[20] !== w || t[21] !== b || t[22] !== v || t[23] !== r ? (P = /* @__PURE__ */ s(S, {
		imageData: k,
		width: r,
		height: i,
		cornerWidth: T,
		pixelRatio: v,
		result: "displacement_map",
		hideTop: b,
		hideBottom: x,
		hideLeft: C,
		hideRight: w
	}), t[15] = T, t[16] = k, t[17] = i, t[18] = x, t[19] = C, t[20] = w, t[21] = b, t[22] = v, t[23] = r, t[24] = P) : P = t[24];
	let F;
	t[25] !== T || t[26] !== i || t[27] !== x || t[28] !== C || t[29] !== w || t[30] !== b || t[31] !== v || t[32] !== j || t[33] !== r ? (F = /* @__PURE__ */ s(S, {
		imageData: j,
		width: r,
		height: i,
		cornerWidth: T,
		pixelRatio: v,
		result: "specular_map",
		hideTop: b,
		hideBottom: x,
		hideLeft: C,
		hideRight: w
	}), t[25] = T, t[26] = i, t[27] = x, t[28] = C, t[29] = w, t[30] = b, t[31] = v, t[32] = j, t[33] = r, t[34] = F) : F = t[34];
	let I;
	t[35] === M ? I = t[36] : (I = /* @__PURE__ */ s("feDisplacementMap", {
		in: "blurred_source",
		in2: "displacement_map",
		scale: M,
		xChannelSelector: "R",
		yChannelSelector: "G",
		result: "displaced_source"
	}), t[35] = M, t[36] = I);
	let L;
	t[37] === Symbol.for("react.memo_cache_sentinel") ? (L = /* @__PURE__ */ s("feColorMatrix", {
		in: "specular_map",
		type: "luminanceToAlpha",
		result: "specular_alpha"
	}), t[37] = L) : L = t[37];
	let R;
	t[38] === m ? R = t[39] : (R = /* @__PURE__ */ s("feComponentTransfer", {
		in: "specular_alpha",
		result: "specular_with_opacity",
		children: /* @__PURE__ */ s("feFuncA", {
			type: "linear",
			slope: m
		})
	}), t[38] = m, t[39] = R);
	let z, B, V;
	t[40] === Symbol.for("react.memo_cache_sentinel") ? (V = /* @__PURE__ */ s("feFlood", {
		floodColor: "white",
		result: "white_layer"
	}), z = /* @__PURE__ */ s("feComposite", {
		in: "white_layer",
		in2: "specular_with_opacity",
		operator: "in",
		result: "masked_specular"
	}), B = /* @__PURE__ */ s("feComposite", {
		in: "masked_specular",
		in2: "displaced_source",
		operator: "over"
	}), t[40] = z, t[41] = B, t[42] = V) : (z = t[40], B = t[41], V = t[42]);
	let H;
	t[43] !== n || t[44] !== N || t[45] !== P || t[46] !== F || t[47] !== I || t[48] !== R ? (H = /* @__PURE__ */ c("filter", {
		id: n,
		children: [
			N,
			P,
			F,
			I,
			L,
			R,
			V,
			z,
			B
		]
	}), t[43] = n, t[44] = N, t[45] = P, t[46] = F, t[47] = I, t[48] = R, t[49] = H) : H = t[49];
	let U = H, W;
	t[50] === Symbol.for("react.memo_cache_sentinel") ? (W = { display: "none" }, t[50] = W) : W = t[50];
	let G;
	return t[51] === U ? G = t[52] : (G = /* @__PURE__ */ s("svg", {
		colorInterpolationFilters: "sRGB",
		style: W,
		children: /* @__PURE__ */ s("defs", { children: U })
	}), t[51] = U, t[52] = G), G;
};
//#endregion
//#region src/hoc/refractive.tsx
function T(e) {
	return (a) => {
		let { refraction: l, ref: d, ...f } = a, p = n(), m = r(null), [h, g] = i(0), [_, v] = i(0), y = d ?? m;
		return t(() => {
			let e = y.current;
			if (!e) return;
			let t = new ResizeObserver((e) => {
				for (let t of e) {
					let e = t.borderBoxSize[0];
					e ? (g(e.inlineSize), v(e.blockSize)) : (g(t.contentRect.width), v(t.contentRect.height));
				}
			});
			return t.observe(e), () => {
				t.disconnect();
			};
		}, [y]), /* @__PURE__ */ c(o, { children: [/* @__PURE__ */ s(w, {
			id: p,
			scaleRatio: 1,
			pixelRatio: 6,
			width: h,
			height: _,
			radius: l.radius,
			blur: l.blur ?? 0,
			glassThickness: l.glassThickness ?? 70,
			bezelWidth: l.bezelWidth ?? 0,
			refractiveIndex: l.refractiveIndex ?? 1.5,
			specularOpacity: l.specularOpacity ?? 0,
			specularAngle: l.specularAngle ?? 0,
			bezelHeightFn: l.bezelHeightFn ?? u
		}), /* @__PURE__ */ s(e, {
			...f,
			ref: y,
			style: {
				...f.style,
				backdropFilter: `url(#${p})`,
				borderRadius: l.radius
			}
		})] });
	};
}
var E = /* @__PURE__ */ new Map(), D = new Proxy(T, {
	get: (t, n) => {
		if (E.has(n)) return E.get(n);
		let r = T(({ children: t, ...r }) => e(n, r, t));
		return E.set(n, r), r;
	},
	apply: (e, t, n) => e(...n)
});
//#endregion
export { d as concave, u as convex, l as convexCircle, f as lip, D as refractive };

//# sourceMappingURL=index.js.map