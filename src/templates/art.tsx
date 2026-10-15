import type { CSSProperties, ReactNode } from "react";
import type { Palette } from "@/lib/design";
import { H, rng, W } from "./kit";

// Satori renders <svg> through resvg, which supports gradients and filter primitives
// (feTurbulence, feDisplacementMap, feComposite...). Only intrinsic elements are allowed
// inside <svg>, so the helpers below are plain functions returning markup, not components.

/* ---------- colour & id helpers ---------- */

function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/./g, "$&$&") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function alpha(hex: string, a: number) {
  const [r, g, b] = rgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function mix(a: string, b: string, t: number) {
  const x = rgb(a);
  const y = rgb(b);
  return `#${x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, "0")).join("")}`;
}

/** Ids depend only on the inputs: identical definitions may collide harmlessly, different ones never do. */
export function uid(...parts: (string | number)[]) {
  const str = parts.join("|");
  let h = 5381;
  for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
  return `im${(h >>> 0).toString(36)}`;
}

const n1 = (n: number) => n.toFixed(1);

/** Absolutely positioned SVG canvas measured in card units. */
export function Layer({
  s,
  w = W,
  h = H,
  x = 0,
  y = 0,
  style,
  children,
}: {
  s: number;
  w?: number;
  h?: number;
  x?: number;
  y?: number;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <svg
      width={w * s}
      height={h * s}
      viewBox={`0 0 ${w} ${h}`}
      style={{ position: "absolute", left: x * s, top: y * s, display: "flex", ...style }}
    >
      {children}
    </svg>
  );
}

/* ---------- filters ---------- */

/** Wobbly pigment edge + granulation: the core of the watercolor look. */
export function watercolorFilter(id: string, seed: number, warp = 7, freq = 0.035) {
  return (
    <filter key={id} id={id} x="-25%" y="-25%" width="150%" height="150%">
      <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves={2} seed={seed} result="warp" />
      <feDisplacementMap in="SourceGraphic" in2="warp" scale={warp} xChannelSelector="R" yChannelSelector="G" result="shape" />
      <feTurbulence type="fractalNoise" baseFrequency={0.7} numOctaves={2} seed={seed + 5} result="grain" />
      <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -0.7 1.28" result="mask" />
      <feComposite in="shape" in2="mask" operator="in" result="grainy" />
      <feGaussianBlur in="grainy" stdDeviation={0.45} />
    </filter>
  );
}

/** Cotton paper: fine grain plus soft mottling, tinted with the given colour. */
export function Paper({ s, tint, seed = 4, strength = 1 }: { s: number; tint: string; seed?: number; strength?: number }) {
  const id = uid("paper", tint, seed);
  const [r, g, b] = rgb(tint).map((v) => (v / 255).toFixed(3));
  return (
    <Layer s={s}>
      <defs>
        <filter id={id} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency={0.85} numOctaves={3} seed={seed} result="fine" />
          <feColorMatrix in="fine" type="matrix" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  1.7 0 0 0 -0.68`} result="grain" />
          <feTurbulence type="fractalNoise" baseFrequency={0.011} numOctaves={3} seed={seed + 9} result="soft" />
          <feColorMatrix in="soft" type="matrix" values={`0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${b}  1.5 0 0 0 -0.62`} result="mottle" />
          <feMerge>
            <feMergeNode in="mottle" />
            <feMergeNode in="grain" />
          </feMerge>
        </filter>
      </defs>
      <rect x={0} y={0} width={W} height={H} fill="#000000" filter={`url(#${id})`} opacity={0.13 * strength} />
    </Layer>
  );
}

/* ---------- watercolor washes ---------- */

export function blobPath(cx: number, cy: number, rx: number, ry: number, seed: number, wobble = 0.16, n = 11) {
  const r = rng(seed);
  const pts = Array.from({ length: n }, (_, i) => {
    const a = (Math.PI * 2 * i) / n + r() * 0.25;
    const k = 1 + (r() - 0.5) * 2 * wobble;
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  });
  const mid = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const start = mid(pts[n - 1], pts[0]);
  let d = `M${n1(start[0])} ${n1(start[1])}`;
  pts.forEach((p, i) => {
    const m = mid(p, pts[(i + 1) % n]);
    d += ` Q${n1(p[0])} ${n1(p[1])} ${n1(m[0])} ${n1(m[1])}`;
  });
  return `${d}Z`;
}

/** Loose watercolor wash with a slightly darker drying edge. */
export function wash(cx: number, cy: number, rx: number, ry: number, color: string, seed: number, opacity = 0.5) {
  const gid = uid("wash", color, opacity);
  const fid = uid("washf", seed);
  return (
    <g key={uid("w", cx, cy, rx, ry, color, seed)}>
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor={color} stopOpacity={opacity * 0.75} />
          <stop offset="0.72" stopColor={color} stopOpacity={opacity * 0.55} />
          <stop offset="1" stopColor={color} stopOpacity={opacity} />
        </radialGradient>
        {watercolorFilter(fid, seed, 26, 0.012)}
      </defs>
      <path d={blobPath(cx, cy, rx, ry, seed)} fill={`url(#${gid})`} filter={`url(#${fid})`} />
    </g>
  );
}

/* ---------- botanical watercolor ---------- */

type Ink = { light: string; base: string; deep: string };
type InkKey = "bloom" | "soft" | "leaf";

export type Botany = {
  ink: Record<InkKey, Ink>;
  radial: Record<InkKey, string>;
  linear: Record<InkKey, string>;
  flowerFilter: string;
  leafFilter: string;
  defs: ReactNode;
};

export function botany(p: Palette, seed = 3): Botany {
  const ink: Record<InkKey, Ink> = {
    bloom: { light: mix(p.accent2, "#ffffff", 0.2), base: p.accent, deep: mix(p.accent, p.text, 0.5) },
    soft: { light: mix(p.accent2, "#ffffff", 0.45), base: mix(p.accent2, p.accent, 0.25), deep: mix(p.accent, p.text, 0.2) },
    leaf: { light: mix(p.accent3, "#ffffff", 0.5), base: p.accent3, deep: mix(p.accent3, p.text, 0.42) },
  };
  const keys: InkKey[] = ["bloom", "soft", "leaf"];
  const radial = Object.fromEntries(keys.map((k) => [k, uid("rad", ink[k].base, ink[k].light, ink[k].deep)])) as Record<InkKey, string>;
  const linear = Object.fromEntries(keys.map((k) => [k, uid("lin", ink[k].base, ink[k].light, ink[k].deep)])) as Record<InkKey, string>;
  const flowerFilter = uid("wcf", seed);
  const leafFilter = uid("wcl", seed);
  const defs = (
    <defs key="defs">
      {keys.map((k) => (
        <radialGradient key={radial[k]} id={radial[k]} cx="50%" cy="100%" r="100%" fx="50%" fy="100%">
          <stop offset="0" stopColor={ink[k].deep} stopOpacity={0.95} />
          <stop offset="0.45" stopColor={ink[k].base} stopOpacity={0.85} />
          <stop offset="1" stopColor={ink[k].light} stopOpacity={0.62} />
        </radialGradient>
      ))}
      {keys.map((k) => (
        <linearGradient key={linear[k]} id={linear[k]} x1="0.5" y1="1" x2="0.5" y2="0">
          <stop offset="0" stopColor={ink[k].deep} stopOpacity={0.85} />
          <stop offset="0.55" stopColor={ink[k].base} stopOpacity={0.7} />
          <stop offset="1" stopColor={ink[k].light} stopOpacity={0.55} />
        </linearGradient>
      ))}
      {watercolorFilter(flowerFilter, seed, 9, 0.04)}
      {watercolorFilter(leafFilter, seed + 11, 5, 0.05)}
    </defs>
  );
  return { ink, radial, linear, flowerFilter, leafFilter, defs };
}

function leafPath(L: number, w: number) {
  return `M0 0 C${n1(w)} ${n1(-L * 0.28)} ${n1(w * 0.9)} ${n1(-L * 0.72)} 0 ${n1(-L)} C${n1(-w * 0.9)} ${n1(-L * 0.72)} ${n1(-w)} ${n1(-L * 0.28)} 0 0Z`;
}

/** Broad cupped petal with a softly notched rim. */
function cupPath(L: number, w: number) {
  return (
    `M0 0 C${n1(-w * 0.55)} ${n1(-L * 0.08)} ${n1(-w * 1.05)} ${n1(-L * 0.5)} ${n1(-w * 0.85)} ${n1(-L * 0.82)} ` +
    `C${n1(-w * 0.6)} ${n1(-L * 1.06)} ${n1(-w * 0.18)} ${n1(-L * 0.95)} 0 ${n1(-L)} ` +
    `C${n1(w * 0.18)} ${n1(-L * 0.95)} ${n1(w * 0.6)} ${n1(-L * 1.06)} ${n1(w * 0.85)} ${n1(-L * 0.82)} ` +
    `C${n1(w * 1.05)} ${n1(-L * 0.5)} ${n1(w * 0.55)} ${n1(-L * 0.08)} 0 0Z`
  );
}

/** Layered peony: rings of broad translucent petals glazed over each other around a cupped heart. */
export function peony(b: Botany, x: number, y: number, r: number, rot: number, seed: number, kind: InkKey = "bloom") {
  const rand = rng(seed);
  const ink = b.ink[kind];
  const rings = [
    { n: 6, L: 1, w: 0.78, op: 0.72, off: 0 },
    { n: 6, L: 0.8, w: 0.7, op: 0.76, off: 30 },
    { n: 5, L: 0.58, w: 0.66, op: 0.82, off: 12 },
    { n: 4, L: 0.38, w: 0.7, op: 0.9, off: 45 },
  ];
  return (
    <g key={uid("peony", x, y, r, seed)} transform={`translate(${n1(x)} ${n1(y)}) rotate(${rot})`}>
      {rings.flatMap((ring, ri) =>
        Array.from({ length: ring.n }, (_, i) => {
          const L = r * ring.L * (0.9 + rand() * 0.2);
          const a = ring.off + (360 / ring.n) * i + (rand() - 0.5) * 14;
          return (
            <path
              key={`${ri}-${i}`}
              d={cupPath(L, L * ring.w)}
              transform={`rotate(${n1(a)})`}
              fill={`url(#${b.radial[kind]})`}
              opacity={ring.op}
              stroke={ink.deep}
              strokeOpacity={0.28}
              strokeWidth={0.9}
            />
          );
        }),
      )}
      {[0, 72, 144, 216, 288].map((a) => (
        <path
          key={`c${a}`}
          d={`M0 ${n1(-r * 0.05)} q${n1(r * 0.08)} ${n1(-r * 0.1)} ${n1(r * 0.16)} 0`}
          transform={`rotate(${a})`}
          stroke={ink.deep}
          strokeWidth={1.2}
          fill="none"
          opacity={0.6}
        />
      ))}
    </g>
  );
}

/** Garden rose seen from above: outer petals plus a spiralling heart. */
export function rose(b: Botany, x: number, y: number, r: number, rot: number, seed: number, kind: InkKey = "bloom") {
  const rand = rng(seed);
  const ink = b.ink[kind];
  return (
    <g key={uid("rose", x, y, r, seed)} transform={`translate(${n1(x)} ${n1(y)}) rotate(${rot})`}>
      {Array.from({ length: 5 }, (_, i) => {
        const L = r * (0.9 + rand() * 0.2);
        return (
          <path
            key={`o${i}`}
            d={cupPath(L, L * 0.8)}
            transform={`rotate(${n1(i * 72 + rand() * 10)})`}
            fill={`url(#${b.radial[kind]})`}
            opacity={0.65}
            stroke={ink.deep}
            strokeOpacity={0.25}
            strokeWidth={0.8}
          />
        );
      })}
      <circle cx={0} cy={0} r={r * 0.5} fill={ink.base} opacity={0.55} />
      {[0.42, 0.32, 0.22, 0.13].map((k, i) => (
        <path
          key={`s${i}`}
          d={`M${n1(-r * k)} 0 A${n1(r * k)} ${n1(r * k)} 0 0 1 ${n1(r * k * 0.7)} ${n1(-r * k * 0.7)}`}
          transform={`rotate(${i * 95})`}
          stroke={ink.deep}
          strokeWidth={1.4}
          fill="none"
          opacity={0.7}
          strokeLinecap="round"
        />
      ))}
    </g>
  );
}

export function bud(b: Botany, x: number, y: number, size: number, rot: number, kind: InkKey = "bloom") {
  const z = size;
  return (
    <g key={uid("bud", x, y, size, rot)} transform={`translate(${n1(x)} ${n1(y)}) rotate(${rot})`}>
      <path d={`M0 ${n1(z * 0.9)} Q${n1(z * 0.1)} ${n1(z * 0.4)} 0 0`} stroke={b.ink.leaf.deep} strokeWidth={1.4} fill="none" />
      <path
        d={`M0 0 C${n1(-z * 0.5)} ${n1(-z * 0.2)} ${n1(-z * 0.45)} ${n1(-z * 0.8)} 0 ${n1(-z)} C${n1(z * 0.45)} ${n1(-z * 0.8)} ${n1(z * 0.5)} ${n1(-z * 0.2)} 0 0Z`}
        fill={`url(#${b.radial[kind]})`}
        stroke={b.ink[kind].deep}
        strokeOpacity={0.35}
        strokeWidth={0.8}
      />
      <path d={leafPath(z * 0.5, z * 0.2)} transform="rotate(-35)" fill={`url(#${b.linear.leaf})`} />
      <path d={leafPath(z * 0.5, z * 0.2)} transform="rotate(35)" fill={`url(#${b.linear.leaf})`} />
    </g>
  );
}

export function leaf(b: Botany, x: number, y: number, L: number, rot: number, w = 0.32, kind: InkKey = "leaf") {
  return (
    <g key={uid("leaf", x, y, L, rot, kind)} transform={`translate(${n1(x)} ${n1(y)}) rotate(${rot})`}>
      <path d={leafPath(L, L * w)} fill={`url(#${b.linear[kind]})`} stroke={b.ink[kind].deep} strokeOpacity={0.3} strokeWidth={0.8} />
      <path d={`M0 0 Q${n1(L * 0.04)} ${n1(-L * 0.5)} 0 ${n1(-L * 0.9)}`} stroke={b.ink[kind].deep} strokeOpacity={0.45} strokeWidth={0.8} fill="none" />
    </g>
  );
}

/** Silver-dollar eucalyptus: curved stem with round, translucent leaves. */
export function euca(b: Botany, x: number, y: number, len: number, rot: number, seed: number) {
  const rand = rng(seed);
  const pts = Array.from({ length: 8 }, (_, i) => {
    const t = i / 7;
    return { x: Math.sin(t * 2.4) * len * 0.08, y: -t * len };
  });
  const ink = b.ink.leaf;
  return (
    <g key={uid("euca", x, y, len, rot, seed)} transform={`translate(${n1(x)} ${n1(y)}) rotate(${rot})`}>
      <path d={`M${pts.map((p) => `${n1(p.x)} ${n1(p.y)}`).join(" L")}`} stroke={ink.deep} strokeWidth={1.3} fill="none" opacity={0.7} />
      {pts.slice(1).map((p, i) => {
        const r = len * (0.11 - i * 0.008) * (0.9 + rand() * 0.2);
        const side = i % 2 ? 1 : -1;
        return (
          <ellipse
            key={i}
            cx={n1(p.x + side * r * 0.9)}
            cy={n1(p.y + r * 0.2)}
            rx={n1(r)}
            ry={n1(r * 0.9)}
            fill={i % 3 === 1 ? ink.light : ink.base}
            opacity={0.55}
            stroke={ink.deep}
            strokeOpacity={0.3}
            strokeWidth={0.7}
          />
        );
      })}
    </g>
  );
}

export function berries(b: Botany, x: number, y: number, seed: number, color?: string) {
  const rand = rng(seed);
  const c = color ?? b.ink.bloom.deep;
  return (
    <g key={uid("berries", x, y, seed)} transform={`translate(${n1(x)} ${n1(y)})`}>
      {Array.from({ length: 5 }, (_, i) => {
        const bx = (rand() - 0.5) * 26;
        const by = (rand() - 0.5) * 22;
        const r = 3.5 + rand() * 2.5;
        return (
          <g key={i}>
            <path d={`M0 0 L${n1(bx)} ${n1(by)}`} stroke={b.ink.leaf.deep} strokeWidth={0.8} opacity={0.6} />
            <circle cx={n1(bx)} cy={n1(by)} r={n1(r)} fill={c} opacity={0.8} />
            <circle cx={n1(bx - r * 0.3)} cy={n1(by - r * 0.3)} r={n1(r * 0.3)} fill="#ffffff" opacity={0.5} />
          </g>
        );
      })}
    </g>
  );
}

/** Fine filler sprig (gypsophila-like): hairline stems tipped with tiny florets. */
export function filler(b: Botany, x: number, y: number, len: number, rot: number, seed: number) {
  const rand = rng(seed);
  return (
    <g key={uid("filler", x, y, len, rot, seed)} transform={`translate(${n1(x)} ${n1(y)}) rotate(${rot})`}>
      <path d={`M0 0 Q${n1(len * 0.08)} ${n1(-len * 0.5)} 0 ${n1(-len)}`} stroke={b.ink.leaf.deep} strokeWidth={0.9} fill="none" opacity={0.6} />
      {Array.from({ length: 7 }, (_, i) => {
        const t = 0.3 + (i / 6) * 0.7;
        const side = i % 2 ? 1 : -1;
        const ex = side * (8 + rand() * 12);
        const ey = -len * t - 6 - rand() * 8;
        return (
          <g key={i}>
            <path d={`M0 ${n1(-len * t)} L${n1(ex)} ${n1(ey)}`} stroke={b.ink.leaf.deep} strokeWidth={0.6} opacity={0.55} />
            <circle cx={n1(ex)} cy={n1(ey)} r={2.6} fill={b.ink.soft.base} opacity={0.85} />
            <circle cx={n1(ex)} cy={n1(ey)} r={1} fill={b.ink.bloom.deep} opacity={0.6} />
          </g>
        );
      })}
      <circle cx={0} cy={n1(-len)} r={3} fill={b.ink.soft.base} opacity={0.85} />
    </g>
  );
}

/** Puts leaves under flowers, each set through its own watercolor filter. */
export function arrangement(b: Botany, leaves: ReactNode[], flowers: ReactNode[]) {
  return [
    b.defs,
    <g key="leaves" filter={`url(#${b.leafFilter})`}>
      {leaves}
    </g>,
    <g key="flowers" filter={`url(#${b.flowerFilter})`}>
      {flowers}
    </g>,
  ];
}

/* ---------- fine-line botanical (ink drawing) ---------- */

function outlineLeaf(x: number, y: number, L: number, rot: number, color: string, fill: string, sw: number, key: string) {
  return (
    <g key={key} transform={`translate(${n1(x)} ${n1(y)}) rotate(${n1(rot)})`}>
      <path d={leafPath(L, L * 0.3)} fill={fill} stroke={color} strokeWidth={sw} />
      <path d={`M0 0 L0 ${n1(-L * 0.8)}`} stroke={color} strokeWidth={sw * 0.6} />
    </g>
  );
}

/** Laurel wreath drawn with a fine pen, open at the top. */
export function laurel(cx: number, cy: number, R: number, color: string, fill: string, sw = 1) {
  const side = (mirror: boolean) => {
    const pt = (deg: number, rr = R) => {
      const a = (deg * Math.PI) / 180;
      return [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
    };
    const [sx, sy] = pt(104);
    const [ex, ey] = pt(-62);
    const parts: ReactNode[] = [
      <path key="stem" d={`M${n1(sx)} ${n1(sy)} A${R} ${R} 0 0 0 ${n1(ex)} ${n1(ey)}`} stroke={color} strokeWidth={sw} fill="none" />,
    ];
    for (let k = 0; k < 11; k++) {
      const deg = 96 - k * 15;
      const L = 24 - k * 0.9;
      const [x, y] = pt(deg);
      parts.push(outlineLeaf(x, y, L, deg + 38, color, fill, sw, `o${k}`));
      parts.push(outlineLeaf(x, y, L * 0.9, deg - 22, color, fill, sw, `i${k}`));
      if (k % 3 === 1) {
        const [bx, by] = pt(deg - 6, R + 9);
        parts.push(<circle key={`b${k}`} cx={n1(bx)} cy={n1(by)} r={2.4} fill={fill} stroke={color} strokeWidth={sw} />);
      }
    }
    return (
      <g key={mirror ? "l" : "r"} transform={mirror ? `translate(${cx * 2} 0) scale(-1 1)` : "translate(0 0)"}>
        {parts}
      </g>
    );
  };
  return (
    <g key={uid("laurel", cx, cy, R)}>
      {side(false)}
      {side(true)}
    </g>
  );
}

/** Small horizontal sprig used as a divider. */
export function sprig(cx: number, cy: number, color: string, fill: string, sw = 1, span = 80) {
  const half = (mirror: boolean) => (
    <g key={mirror ? "l" : "r"} transform={mirror ? `translate(${cx * 2} 0) scale(-1 1)` : "translate(0 0)"}>
      <path d={`M${cx + 6} ${cy} Q${cx + span * 0.5} ${cy - 6} ${cx + span} ${cy - 2}`} stroke={color} strokeWidth={sw} fill="none" />
      {[0.3, 0.55, 0.8].map((t, i) => {
        const x = cx + span * t;
        const y = cy - 4 * Math.sin(t * Math.PI);
        return [
          outlineLeaf(x, y, 13 - i * 2, 55, color, fill, sw, `u${i}`),
          outlineLeaf(x - 4, y + 1, 12 - i * 2, 130, color, fill, sw, `d${i}`),
        ];
      })}
    </g>
  );
  return (
    <g key={uid("sprig", cx, cy, span)}>
      {half(false)}
      {half(true)}
      <circle cx={cx} cy={cy} r={2.6} fill={color} />
    </g>
  );
}

/* ---------- romantic props ---------- */

/** Strip of washi tape with torn ends. */
export function tape(x: number, y: number, w: number, h: number, rot: number, color: string) {
  const teeth = 5;
  const jag = (side: number) =>
    Array.from({ length: teeth + 1 }, (_, i) => `${n1(side + (i % 2 ? 3 : -3) * (side ? 1 : -1))},${n1((h / teeth) * i)}`);
  const pts = [...jag(0), ...jag(w).reverse()].join(" ");
  return (
    <g key={uid("tape", x, y, w, rot)} transform={`translate(${n1(x - w / 2)} ${n1(y - h / 2)}) rotate(${rot} ${n1(w / 2)} ${n1(h / 2)})`}>
      <polygon points={pts} fill={color} opacity={0.72} />
      <rect x={0} y={h * 0.18} width={w} height={1} fill="#ffffff" opacity={0.35} />
    </g>
  );
}

/** Watercolor hot-air balloon with curved gores, ropes and a wicker basket. */
export function hotAirBalloon(cx: number, cy: number, r: number, colors: string[], line: string, seed: number) {
  const clip = uid("balloonclip", cx, cy, r);
  const fid = uid("balloonf", seed);
  const env =
    `M${n1(cx - r)} ${n1(cy)} C${n1(cx - r)} ${n1(cy - r * 1.32)} ${n1(cx + r)} ${n1(cy - r * 1.32)} ${n1(cx + r)} ${n1(cy)} ` +
    `C${n1(cx + r)} ${n1(cy + r * 0.6)} ${n1(cx + r * 0.32)} ${n1(cy + r * 1.05)} ${n1(cx + r * 0.24)} ${n1(cy + r * 1.22)} ` +
    `L${n1(cx - r * 0.24)} ${n1(cy + r * 1.22)} C${n1(cx - r * 0.32)} ${n1(cy + r * 1.05)} ${n1(cx - r)} ${n1(cy + r * 0.6)} ${n1(cx - r)} ${n1(cy)}Z`;
  const by = cy + r * 1.62;
  return (
    <g key={uid("balloon", cx, cy, r)}>
      <defs>
        <clipPath id={clip}>
          <path d={env} />
        </clipPath>
        {watercolorFilter(fid, seed, 6, 0.04)}
      </defs>
      <g filter={`url(#${fid})`}>
        <g clipPath={`url(#${clip})`}>
          {[1, 0.8, 0.6, 0.4, 0.2].map((k, i) => (
            <ellipse key={i} cx={cx} cy={n1(cy + r * 0.1)} rx={n1(r * k * 1.02)} ry={n1(r * 1.4)} fill={colors[i % colors.length]} opacity={0.82} />
          ))}
          <ellipse cx={n1(cx - r * 0.45)} cy={n1(cy - r * 0.45)} rx={n1(r * 0.25)} ry={n1(r * 0.4)} fill="#ffffff" opacity={0.3} />
        </g>
        <path d={env} fill="none" stroke={line} strokeOpacity={0.45} strokeWidth={1.1} />
        <rect x={n1(cx - r * 0.2)} y={n1(by)} width={n1(r * 0.4)} height={n1(r * 0.28)} rx={2} fill={mix(colors[0], line, 0.55)} opacity={0.85} />
      </g>
      {[-0.24, -0.08, 0.08, 0.24].map((k, i) => (
        <path key={`r${i}`} d={`M${n1(cx + r * k)} ${n1(cy + r * 1.22)} L${n1(cx + r * k * 0.8)} ${n1(by)}`} stroke={line} strokeWidth={0.8} opacity={0.6} />
      ))}
    </g>
  );
}

/** Wax seal: irregular poured rim, embossed ring and a soft highlight. */
export function waxSeal(cx: number, cy: number, r: number, color: string, seed: number) {
  const gid = uid("wax", color);
  const light = mix(color, "#ffffff", 0.35);
  const deep = mix(color, "#000000", 0.35);
  return (
    <g key={uid("seal", cx, cy, r)}>
      <defs>
        <radialGradient id={gid} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor={light} />
          <stop offset="0.55" stopColor={color} />
          <stop offset="1" stopColor={deep} />
        </radialGradient>
      </defs>
      <path d={blobPath(cx + 2, cy + 4, r * 1.02, r * 1.02, seed, 0.07, 15)} fill="#000000" opacity={0.18} />
      <path d={blobPath(cx, cy, r, r, seed, 0.07, 15)} fill={`url(#${gid})`} />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="none" stroke={deep} strokeWidth={2.2} opacity={0.55} />
      <circle cx={cx} cy={cy} r={r * 0.72} fill="none" stroke={light} strokeWidth={0.9} opacity={0.6} transform={`translate(-1 -1)`} />
      <path d={`M${n1(cx - r * 0.55)} ${n1(cy - r * 0.35)} A${n1(r * 0.7)} ${n1(r * 0.7)} 0 0 1 ${n1(cx + r * 0.1)} ${n1(cy - r * 0.68)}`} stroke="#ffffff" strokeWidth={2} fill="none" opacity={0.35} strokeLinecap="round" />
    </g>
  );
}

/** Envelope liner: a V-shaped flap filled with a fine floret repeat. */
export function envelopeFlap(w: number, depth: number, ground: string, ink: string, edge: string) {
  const clip = uid("flap", w, depth, ground);
  const flap = `M0 0 L${w} 0 L${w / 2} ${depth} Z`;
  const florets: ReactNode[] = [];
  for (let y = 14, row = 0; y < depth; y += 26, row++) {
    for (let x = row % 2 ? 13 : 0; x <= w; x += 26) {
      florets.push(
        <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
          {[0, 90, 180, 270].map((a) => (
            <ellipse key={a} cx={0} cy={-4} rx={2.2} ry={4} fill="none" stroke={ink} strokeWidth={0.7} transform={`rotate(${a + 45})`} />
          ))}
          <circle cx={0} cy={0} r={1.2} fill={ink} />
        </g>,
      );
    }
  }
  return (
    <g key={clip}>
      <defs>
        <clipPath id={clip}>
          <path d={flap} />
        </clipPath>
      </defs>
      <path d={`M0 0 L${w} 0 L${w / 2} ${depth + 8} Z`} fill="#000000" opacity={0.08} />
      <path d={flap} fill={ground} />
      <g clipPath={`url(#${clip})`} opacity={0.75}>
        {florets}
      </g>
      <path d={`M0 0 L${w / 2} ${depth} L${w} 0`} fill="none" stroke={edge} strokeWidth={1.4} />
    </g>
  );
}

/** Rolling hills silhouette for the bottom of a card. */
export function hills(y: number, amp: number, color: string, seed: number, opacity = 1) {
  const r = rng(seed);
  const pts = Array.from({ length: 7 }, (_, i) => [i * 100, y - r() * amp]);
  let d = `M0 ${H} L0 ${n1(pts[0][1])}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1];
    const [x, yy] = pts[i];
    d += ` C${n1(px + 50)} ${n1(py)} ${n1(x - 50)} ${n1(yy)} ${x} ${n1(yy)}`;
  }
  return <path key={uid("hills", y, amp, seed)} d={`${d} L${W} ${H} Z`} fill={color} opacity={opacity} />;
}

/** Metallic foil gradient definition. */
export function foil(id: string, base: string) {
  return (
    <linearGradient key={id} id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={mix(base, "#000000", 0.25)} />
      <stop offset="0.35" stopColor={mix(base, "#ffffff", 0.45)} />
      <stop offset="0.6" stopColor={base} />
      <stop offset="0.85" stopColor={mix(base, "#ffffff", 0.3)} />
      <stop offset="1" stopColor={mix(base, "#000000", 0.2)} />
    </linearGradient>
  );
}

/* ---------- modern / graphic ---------- */

export function barcode(x: number, y: number, w: number, h: number, color: string, seed = 2) {
  const rand = rng(seed);
  const bars: ReactNode[] = [];
  let cx = 0;
  let i = 0;
  while (cx < w) {
    const bw = [1, 1, 2, 3][Math.floor(rand() * 4)];
    if (i % 2 === 0) bars.push(<rect key={i} x={n1(x + cx)} y={y} width={bw} height={h} fill={color} />);
    cx += bw + (i % 2 ? 0 : 1);
    i++;
  }
  return <g key={uid("barcode", x, y, w, h)}>{bars}</g>;
}

/** Print-style halftone: dot size fades along a diagonal. */
export function halftone(x: number, y: number, w: number, h: number, step: number, color: string, clip?: string) {
  const dots: ReactNode[] = [];
  for (let gy = 0; gy <= h; gy += step) {
    for (let gx = (gy / step) % 2 ? step / 2 : 0; gx <= w; gx += step) {
      const t = (gx / w + gy / h) / 2;
      const r = step * 0.5 * t;
      if (r > 0.4) dots.push(<circle key={`${gx}-${gy}`} cx={n1(x + gx)} cy={n1(y + gy)} r={n1(r)} fill={color} />);
    }
  }
  const key = uid("halftone", x, y, w, h, step);
  return clip ? (
    <g key={key} clipPath={`url(#${clip})`}>
      {dots}
    </g>
  ) : (
    <g key={key}>{dots}</g>
  );
}

export function burstPoints(cx: number, cy: number, r1: number, r2: number, n: number) {
  return Array.from({ length: n * 2 }, (_, i) => {
    const r = i % 2 ? r2 : r1;
    const a = (Math.PI * i) / n - Math.PI / 2;
    return `${n1(cx + Math.cos(a) * r)},${n1(cy + Math.sin(a) * r)}`;
  }).join(" ");
}

export function squiggle(x: number, y: number, waves: number, amp: number, len: number) {
  let d = `M${x} ${y}`;
  for (let i = 0; i < waves; i++) d += ` q${len / 2} ${i % 2 ? amp : -amp} ${len} 0`;
  return d;
}

export function zigzag(x: number, y: number, teeth: number, amp: number, len: number) {
  const pts = Array.from({ length: teeth * 2 + 1 }, (_, i) => `${n1(x + (i * len) / 2)},${n1(y + (i % 2 ? -amp : 0))}`);
  return pts.join(" ");
}

/** 70s flower-power daisy. */
export function daisy(cx: number, cy: number, r: number, petal: string, heart: string, rot = 0, stroke = "none") {
  return (
    <g key={uid("daisy", cx, cy, r, petal)} transform={`translate(${n1(cx)} ${n1(cy)}) rotate(${rot})`}>
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse
          key={i}
          cx={0}
          cy={n1(-r * 0.55)}
          rx={n1(r * 0.3)}
          ry={n1(r * 0.48)}
          fill={petal}
          stroke={stroke}
          strokeWidth={2}
          transform={`rotate(${i * 45})`}
        />
      ))}
      <circle cx={0} cy={0} r={n1(r * 0.32)} fill={heart} stroke={stroke} strokeWidth={2} />
    </g>
  );
}
