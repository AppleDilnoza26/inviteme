import type { CSSProperties } from "react";
import { alpha, barcode, burstPoints, daisy, foil, halftone, Layer, mix, squiggle, uid, zigzag } from "./art";
import {
  Abs,
  center,
  col,
  Content,
  DiamondRow,
  fit,
  headlineNumber,
  initials,
  Lines,
  row,
  Rule,
  splitNames,
  T,
  type LayoutProps,
} from "./kit";

// Modern Art Direction: oversized type, editorial grids, flat geometry and contrast.

/** Fits a single uppercase word/line into `width` for a font of roughly `em` width per glyph. */
function fitWidth(text: string, width: number, em: number, max: number, min: number) {
  const len = Math.max(text.length, 1);
  return Math.max(min, Math.min(max, width / (len * em)));
}

/* Editorial Cover — masthead, cover lines, halftone hero disc, barcode */
export function Modern({ f, p, d, b, a, s, labels }: LayoutProps) {
  const left: CSSProperties = { textAlign: "left" };
  const label: CSSProperties = { fontFamily: b, fontSize: 10 * s, fontWeight: 700, letterSpacing: 3 * s, textTransform: "uppercase", color: p.muted, ...left };
  const body: CSSProperties = { fontFamily: b, fontSize: 16 * s, color: p.text, lineHeight: 1.5, ...left };
  const mast = f.eyebrow || f.title;
  const mastSize = fitWidth(mast, 500, 0.86, 92, 30);
  const issue = f.date.match(/\d+/)?.[0];
  const clip = uid("disc", p.accent);
  const cell = (l: string, v: string, w: number) =>
    v ? (
      <div style={col({ width: w * s, gap: 6 * s })}>
        <T style={label}>{l}</T>
        <T style={{ fontFamily: d, fontSize: 21 * s, color: p.text, lineHeight: 1.15, ...left }}>{v}</T>
      </div>
    ) : null;

  return (
    <div style={col({ flex: 1, position: "relative", backgroundColor: p.surface })}>
      <Layer s={s}>
        <defs>
          <clipPath id={clip}>
            <circle cx={400} cy={392} r={178} />
          </clipPath>
        </defs>
        <circle cx={400} cy={392} r={178} fill={p.accent} />
        {halftone(410, 330, 190, 250, 11, p.text, clip)}
        <circle cx={528} cy={232} r={58} fill="none" stroke={p.text} strokeWidth={1.5} />
        <circle cx={142} cy={588} r={34} fill={p.text} />
        <rect x={0} y={606} width={600} height={234} fill={p.bg} />
      </Layer>

      <div style={row({ position: "absolute", top: 34 * s, left: 48 * s, right: 48 * s, justifyContent: "space-between", alignItems: "center" })}>
        <T style={{ ...label, color: p.text }}>{issue ? `№ ${issue}` : f.time}</T>
        <T style={{ ...label, color: p.text }}>{f.date}</T>
      </div>
      <Abs s={s} top={56} left={48} right={48} style={{ flexDirection: "column" }}>
        <T style={{ fontFamily: d, fontSize: mastSize * s, lineHeight: 1, color: p.text, textTransform: "uppercase", letterSpacing: -1 * s, whiteSpace: "nowrap" }}>
          {mast}
        </T>
        <Rule s={s} w={504} color={p.text} h={2} style={{ marginTop: 12 * s }} />
      </Abs>

      <Abs s={s} top={250} left={48} width={380} style={{ flexDirection: "column", gap: 16 * s }}>
        <T style={{ fontFamily: a, fontSize: fit(f.title, 56, 14, 26) * s, color: p.text, lineHeight: 1.05, ...left }}>{f.title}</T>
        <div style={row({ alignItems: "center", gap: 10 * s })}>
          <div style={{ display: "flex", width: 10 * s, height: 10 * s, backgroundColor: p.text, borderRadius: 999 }} />
          <T style={{ ...label, color: p.text, fontSize: 12 * s, letterSpacing: 2 * s }}>{f.subtitle}</T>
        </div>
        <div style={{ display: "flex", width: 360 * s }}>
          <Lines text={f.message} style={{ ...body, fontFamily: a, fontSize: 16 * s }} />
        </div>
      </Abs>

      <Abs s={s} left={48} right={48} bottom={42} style={{ flexDirection: "column", gap: 18 * s }}>
        <Rule s={s} w={504} color={p.text} h={2} />
        <div style={row({ gap: 22 * s })}>
          {cell(labels.date, f.date, 210)}
          {cell(labels.time, f.time, 110)}
        </div>
        <div style={row({ justifyContent: "space-between", alignItems: "flex-end" })}>
          <div style={col({ width: 340 * s, gap: 4 * s })}>
            <T style={label}>{labels.venue}</T>
            <T style={{ ...body, fontWeight: 700 }}>{f.venue}</T>
            <T style={{ ...body, fontSize: 14 * s, color: p.muted }}>{f.address}</T>
            <T style={{ ...body, fontSize: 12 * s, color: p.muted, marginTop: 6 * s }}>{f.footer}</T>
          </div>
          <svg width={110 * s} height={48 * s} viewBox="0 0 110 48" style={{ display: "flex" }}>
            {barcode(0, 0, 110, 48, p.text, 4)}
          </svg>
        </div>
      </Abs>
    </div>
  );
}

/* Birthday Pop — giant age numeral with a hard shadow, bold flat geometry, starburst sticker */
export function Confetti({ f, p, d, b, a, s }: LayoutProps) {
  const body: CSSProperties = { fontFamily: b, fontSize: 17 * s, color: p.text, textAlign: "center", lineHeight: 1.45 };
  const num = headlineNumber(f.title);
  const numSize = num.length >= 3 ? 200 : num.length === 2 ? 290 : 320;
  const ink = p.text;

  return (
    <div style={col({ flex: 1, position: "relative", backgroundColor: p.bg })}>
      <Layer s={s}>
        <circle cx={540} cy={70} r={150} fill={p.accent3} />
        <circle cx={540} cy={70} r={112} fill="none" stroke={p.bg} strokeWidth={3} strokeDasharray="2 10" strokeLinecap="round" />
        <path d="M0 640 L600 760 L600 840 L0 840 Z" fill={p.accent} />
        <circle cx={70} cy={840} r={130} fill={p.accent2} />
        <path d={squiggle(26, 120, 6, 12, 22)} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
        <polyline points={zigzag(420, 600, 6, 14, 22)} stroke={ink} strokeWidth={5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <polygon points="64,330 96,384 32,384" fill={p.accent2} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
        <rect x={500} y={330} width={44} height={44} rx={6} fill={p.accent} stroke={ink} strokeWidth={3} transform="rotate(18 522 352)" />
        <circle cx={60} cy={520} r={16} fill="none" stroke={ink} strokeWidth={4} />
        <circle cx={548} cy={480} r={9} fill={ink} />
        <path d="M110 250 l0 26 M97 263 l26 0" stroke={p.accent} strokeWidth={6} strokeLinecap="round" />
        <path d="M486 236 l18 18 M504 236 l-18 18" stroke={ink} strokeWidth={5} strokeLinecap="round" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} cx={36 + i * 18} cy={460} r={4} fill={ink} />
        ))}
      </Layer>

      <Content style={{ alignItems: "center", padding: `${26 * s}px ${56 * s}px ${40 * s}px` }}>
      <T
        style={{
          fontFamily: a,
          fontSize: numSize * s,
          lineHeight: 1,
          color: p.accent,
          letterSpacing: -8 * s,
          textShadow: `${9 * s}px ${9 * s}px 0 ${ink}`,
          transform: "rotate(-5deg)",
          marginBottom: -12 * s,
        }}
      >
        {num}
      </T>
      <T
        style={{
          fontFamily: b,
          fontWeight: 800,
          fontSize: 13 * s,
          letterSpacing: 3 * s,
          textTransform: "uppercase",
          color: p.accent2,
          backgroundColor: ink,
          padding: `${9 * s}px ${20 * s}px`,
          transform: "rotate(2deg)",
        }}
      >
        {f.eyebrow}
      </T>
      <T style={{ fontFamily: d, fontSize: fit(f.title, 58, 12, 20) * s, color: ink, lineHeight: 1.15, textAlign: "center", marginTop: 18 * s }}>{f.title}</T>
      <T style={{ ...body, fontWeight: 700, marginTop: 8 * s }}>{f.subtitle}</T>
      <div style={{ display: "flex", marginTop: 8 * s }}>
        <Lines text={f.message} style={{ ...body, color: alpha(ink, 0.8) }} />
      </div>

      <div style={{ display: "flex", flex: 1 }} />
      <div style={row({ alignItems: "center", gap: 22 * s })}>
        <div style={center({ position: "relative", width: 168 * s, height: 168 * s, transform: "rotate(-8deg)" })}>
          <Layer s={s} w={168} h={168}>
            <polygon points={burstPoints(84, 84, 84, 70, 18)} fill={p.accent2} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
          </Layer>
          <div style={center({ position: "relative", width: 118 * s, gap: 2 * s })}>
            <T style={{ ...body, fontWeight: 800, fontSize: 15 * s, lineHeight: 1.15 }}>{f.date}</T>
            <T style={{ fontFamily: a, fontSize: 26 * s, color: ink, lineHeight: 1.1 }}>{f.time}</T>
          </div>
        </div>
        <div
          style={col({
            width: 250 * s,
            gap: 4 * s,
            backgroundColor: "#ffffff",
            border: `${3 * s}px solid ${ink}`,
            boxShadow: `${6 * s}px ${6 * s}px 0 ${ink}`,
            padding: `${14 * s}px ${16 * s}px`,
          })}
        >
          <T style={{ ...body, textAlign: "left", fontWeight: 800, fontSize: fit(f.venue, 19, 20, 34) * s, lineHeight: 1.2 }}>{f.venue}</T>
          <T style={{ ...body, textAlign: "left", fontSize: 14 * s, color: p.muted, lineHeight: 1.35 }}>{f.address}</T>
        </div>
      </div>
      <T style={{ ...body, fontWeight: 700, fontSize: 14 * s, marginTop: 20 * s, color: ink }}>{f.footer}</T>
      </Content>
    </div>
  );
}

/* Retro Party — groovy 70s rainbow, flower-power daisies, 3D script title, admission ticket */
export function Retro({ f, p, d, b, s, labels }: LayoutProps) {
  const ink = p.text;
  const body: CSSProperties = { fontFamily: b, fontSize: 17 * s, color: ink, textAlign: "center", lineHeight: 1.45 };
  const line = `${2.5 * s}px solid ${ink}`;
  const bands = [p.accent, mix(p.accent, p.accent2, 0.5), p.accent2, p.accent3];

  return (
    <div style={col({ flex: 1, position: "relative", backgroundColor: p.bg })}>
      <Layer s={s}>
        {bands.map((c, i) => {
          const r = 400 - i * 46;
          return <path key={c + i} d={`M${300 - r} 900 A${r} ${r} 0 0 1 ${300 + r} 900`} stroke={c} strokeWidth={46} fill="none" />;
        })}
        <path d={squiggle(400, 70, 6, 10, 26)} stroke={p.accent3} strokeWidth={6} fill="none" strokeLinecap="round" />
        {daisy(74, 96, 64, p.surface, p.accent2, 12, ink)}
        {daisy(540, 214, 38, p.surface, p.accent, 0, ink)}
        {daisy(58, 440, 28, p.surface, p.accent3, 20, ink)}
        {daisy(548, 420, 22, p.surface, p.accent2, 0, ink)}
      </Layer>

      <Content style={{ alignItems: "center", padding: `${58 * s}px ${50 * s}px ${40 * s}px` }}>
        <T
          style={{
            fontFamily: b,
            fontWeight: 800,
            fontSize: 13 * s,
            letterSpacing: 4 * s,
            textTransform: "uppercase",
            color: ink,
            backgroundColor: p.surface,
            border: line,
            borderRadius: 999,
            padding: `${8 * s}px ${22 * s}px`,
          }}
        >
          {f.eyebrow}
        </T>
        <T
          style={{
            fontFamily: d,
            fontSize: fit(f.title, 84, 10, 18) * s,
            color: p.accent,
            textShadow: `${3 * s}px ${3 * s}px 0 ${p.accent2}, ${6 * s}px ${6 * s}px 0 ${ink}`,
            lineHeight: 1.05,
            textAlign: "center",
            transform: "rotate(-4deg)",
            marginTop: 34 * s,
          }}
        >
          {f.title}
        </T>
        <T style={{ ...body, fontWeight: 800, fontSize: 14 * s, letterSpacing: 3 * s, textTransform: "uppercase", marginTop: 28 * s }}>{f.subtitle}</T>
        <div style={{ display: "flex", marginTop: 12 * s }}>
          <Lines text={f.message} style={body} />
        </div>
        <div style={{ display: "flex", flex: 1 }} />
        <div style={row({ position: "relative", width: 480 * s, backgroundColor: p.surface, border: line, borderRadius: 16 * s, boxShadow: `${5 * s}px ${5 * s}px 0 ${ink}` })}>
          <div style={center({ width: 170 * s, padding: `${18 * s}px ${10 * s}px`, gap: 4 * s, backgroundColor: p.accent2, borderTopLeftRadius: 13 * s, borderBottomLeftRadius: 13 * s })}>
            <T style={{ ...body, fontWeight: 800, fontSize: 15 * s, lineHeight: 1.2 }}>{f.date}</T>
            <T style={{ fontFamily: d, fontSize: 30 * s, color: ink }}>{f.time}</T>
          </div>
          <div style={{ display: "flex", width: 0, borderLeft: `${2.5 * s}px dashed ${ink}` }} />
          <div style={col({ flex: 1, justifyContent: "center", padding: `${16 * s}px ${20 * s}px`, gap: 4 * s })}>
            <T style={{ ...body, textAlign: "left", fontSize: 11 * s, fontWeight: 800, letterSpacing: 3 * s, textTransform: "uppercase", color: p.accent }}>{labels.venue}</T>
            <T style={{ ...body, textAlign: "left", fontWeight: 800, fontSize: fit(f.venue, 18, 22, 34) * s, lineHeight: 1.2 }}>{f.venue}</T>
            <T style={{ ...body, textAlign: "left", fontSize: 14 * s, color: p.muted, lineHeight: 1.3 }}>{f.address}</T>
          </div>
        </div>
        <T style={{ ...body, fontSize: 14 * s, fontWeight: 800, marginTop: 18 * s, color: p.surface, backgroundColor: ink, padding: `${6 * s}px ${14 * s}px`, borderRadius: 999 }}>{f.footer}</T>
      </Content>
    </div>
  );
}

/* Art Deco Gala — gilded sunburst, stepped frame, chevron rails, boxed programme */
export function Deco({ f, p, d, b, s, labels }: LayoutProps) {
  const gold = uid("decofoil", p.accent);
  const caps: CSSProperties = { fontFamily: b, fontSize: 12 * s, fontWeight: 600, letterSpacing: 6 * s, textTransform: "uppercase", color: p.accent, textAlign: "center" };
  const body: CSSProperties = { fontFamily: b, fontSize: 16 * s, color: p.text, textAlign: "center", lineHeight: 1.55 };
  const stroke = `url(#${gold})`;
  const rays = Array.from({ length: 25 }, (_, i) => {
    const t = Math.PI + (Math.PI / 24) * i;
    return (
      <line
        key={i}
        x1={(300 + 64 * Math.cos(t)).toFixed(1)}
        y1={(236 + 64 * Math.sin(t)).toFixed(1)}
        x2={(300 + 232 * Math.cos(t)).toFixed(1)}
        y2={(236 + 232 * Math.sin(t)).toFixed(1)}
        stroke={stroke}
        strokeWidth={i % 2 ? 0.7 : 1.8}
      />
    );
  });
  const steps = (x: number, y: number, sx: number, sy: number) => (
    <path
      key={`${x}-${y}`}
      d={`M${x} ${y + sy * 70} L${x} ${y + sy * 22} L${x + sx * 10} ${y + sy * 22} L${x + sx * 10} ${y + sy * 10} L${x + sx * 22} ${y + sy * 10} L${x + sx * 22} ${y} L${x + sx * 70} ${y}`}
      stroke={stroke}
      strokeWidth={1.6}
      fill="none"
    />
  );
  const chevrons = (x: number) =>
    Array.from({ length: 6 }, (_, i) => (
      <polyline key={`${x}-${i}`} points={`${x - 8},${330 + i * 34} ${x},${340 + i * 34} ${x + 8},${330 + i * 34}`} stroke={stroke} strokeWidth={1.2} fill="none" />
    ));
  const cell = (label: string, value: string) =>
    value ? (
      <div style={center({ flex: 1, gap: 6 * s, padding: `0 ${6 * s}px` })}>
        <T style={{ ...caps, fontSize: 9 * s, letterSpacing: 4 * s }}>{label}</T>
        <T style={{ ...body, fontSize: 15 * s, lineHeight: 1.3 }}>{value}</T>
      </div>
    ) : null;

  return (
    <div style={col({ flex: 1, position: "relative", backgroundColor: p.bg })}>
      <Layer s={s}>
        <defs>{[foil(gold, p.accent)]}</defs>
        <rect x={22} y={22} width={556} height={796} fill="none" stroke={stroke} strokeWidth={1.4} />
        <rect x={32} y={32} width={536} height={776} fill="none" stroke={stroke} strokeWidth={0.6} />
        {steps(42, 42, 1, 1)}
        {steps(558, 42, -1, 1)}
        {steps(42, 798, 1, -1)}
        {steps(558, 798, -1, -1)}
        {rays}
        {[232, 206, 180].map((r) => (
          <path key={r} d={`M${300 - r} 236 A${r} ${r} 0 0 1 ${300 + r} 236`} stroke={stroke} strokeWidth={r === 232 ? 1.6 : 0.8} fill="none" />
        ))}
        <path d="M244 236 A56 56 0 0 1 356 236 Z" fill={stroke} />
        <rect x={68} y={236} width={464} height={1.6} fill={stroke} />
        {chevrons(58)}
        {chevrons(542)}
        {Array.from({ length: 13 }, (_, i) => {
          const t = Math.PI + (Math.PI / 12) * i;
          return (
            <line key={`b${i}`} x1={300} y1={808} x2={(300 + 96 * Math.cos(t)).toFixed(1)} y2={(808 + 96 * Math.sin(t)).toFixed(1)} stroke={stroke} strokeWidth={0.8} />
          );
        })}
      </Layer>

      <Abs s={s} top={262} left={86} right={86} bottom={104} style={{ flexDirection: "column", alignItems: "center", gap: 12 * s }}>
        <T style={{ ...caps, lineHeight: 1.5, flexShrink: 0 }}>{f.eyebrow}</T>
        <div style={center({ flexGrow: 1, flexShrink: 0, gap: 14 * s })}>
          <T style={{ fontFamily: d, fontSize: fit(f.title, 48, 12, 20) * s, color: p.text, textTransform: "uppercase", letterSpacing: 6 * s, lineHeight: 1.15, textAlign: "center" }}>
            {f.title}
          </T>
          <T style={{ ...caps, color: p.muted, letterSpacing: 4 * s }}>{f.subtitle}</T>
          <DiamondRow s={s} width={150} color={p.accent} />
          <Lines text={f.message} style={body} />
        </div>
        <div style={{ display: "flex", width: 428 * s, padding: 5 * s, border: `${1 * s}px solid ${p.accent}` }}>
          <div style={row({ flex: 1, padding: `${14 * s}px ${8 * s}px`, border: `${1 * s}px solid ${alpha(p.accent, 0.6)}` })}>
            {cell(labels.date, f.date)}
            {cell(labels.time, f.time)}
            {cell(labels.venue, f.venue)}
          </div>
        </div>
        <T style={{ ...body, fontSize: 14 * s, lineHeight: 1.35, color: p.muted, flexShrink: 0 }}>{f.address}</T>
        <T style={{ ...caps, fontSize: 10 * s, color: p.muted, letterSpacing: 3 * s, flexShrink: 0 }}>{f.footer}</T>
      </Abs>
    </div>
  );
}

/* Luxury Gold — modern editorial wedding: interlocking gold rings, oversized initials, left-aligned names */
export function Luxury({ f, p, d, b, a, s, labels }: LayoutProps) {
  const gold = uid("luxfoil", p.accent);
  const left: CSSProperties = { textAlign: "left" };
  const caps: CSSProperties = { fontFamily: b, fontSize: 11 * s, letterSpacing: 4 * s, textTransform: "uppercase", color: p.accent, ...left };
  const body: CSSProperties = { fontFamily: b, fontSize: 15 * s, color: p.text, lineHeight: 1.55, ...left };
  const names = splitNames(f.title);
  const longest = names ? Math.max(names[0].length, names[1].length) : f.title.length;
  const nameSize = Math.max(30, Math.min(62, 470 / (longest * 0.78)));
  const name: CSSProperties = { fontFamily: d, fontSize: nameSize * s, color: p.text, textTransform: "uppercase", letterSpacing: 2 * s, lineHeight: 1.05, ...left };
  const init = initials(f.title);

  return (
    <div style={col({ flex: 1, position: "relative", backgroundColor: p.bg })}>
      <Layer s={s}>
        <defs>{[foil(gold, p.accent)]}</defs>
        <circle cx={420} cy={470} r={92} fill="none" stroke={`url(#${gold})`} strokeWidth={1.6} />
        <circle cx={490} cy={470} r={92} fill="none" stroke={`url(#${gold})`} strokeWidth={1.6} />
        <rect x={0} y={598} width={600} height={242} fill={p.surface} />
        <rect x={48} y={598} width={504} height={1.4} fill={`url(#${gold})`} />
      </Layer>
      <Abs s={s} top={444} left={420} width={70} height={52} style={{ alignItems: "center", justifyContent: "center" }}>
        <T style={{ fontFamily: a, fontSize: 26 * s, color: p.accent, lineHeight: 1, letterSpacing: 1 * s }}>{init}</T>
      </Abs>

      <div style={row({ position: "absolute", bottom: 774 * s, left: 48 * s, right: 48 * s, justifyContent: "space-between", alignItems: "flex-end", gap: 24 * s })}>
        <T style={{ ...caps, flex: 1.4 }}>{f.eyebrow}</T>
        <T style={{ ...caps, flex: 1, color: p.muted, textAlign: "right" }}>{f.date}</T>
      </div>
      <Abs s={s} top={72} left={48} width={504} height={1} style={{ backgroundColor: alpha(p.accent, 0.6) }} />

      <Abs s={s} top={150} left={48} width={470} style={{ flexDirection: "column", gap: 4 * s }}>
        {names
          ? [
              <T key="n1" style={name}>{names[0]}</T>,
              <T key="amp" style={{ fontFamily: a, fontSize: nameSize * 0.8 * s, color: p.accent, lineHeight: 1.1 }}>&</T>,
              <T key="n2" style={name}>{names[1]}</T>,
            ]
          : <T style={name}>{f.title}</T>}
        <T style={{ ...caps, color: p.muted, letterSpacing: 3 * s, marginTop: 18 * s }}>{f.subtitle}</T>
        <div style={{ display: "flex", width: 330 * s, marginTop: 10 * s }}>
          <Lines text={f.message} style={body} />
        </div>
      </Abs>

      <Abs s={s} top={626} left={48} right={48} bottom={40} style={{ flexDirection: "column", justifyContent: "space-between" }}>
        <div style={row({ gap: 24 * s })}>
          <div style={col({ width: 200 * s, gap: 6 * s })}>
            <T style={{ ...caps, fontSize: 9 * s }}>{labels.date}</T>
            <T style={{ fontFamily: a, fontSize: 24 * s, color: p.text, lineHeight: 1.15, ...left }}>{f.date}</T>
            <T style={{ ...body, color: p.accent3, fontSize: 16 * s }}>{f.time}</T>
          </div>
          <div style={{ display: "flex", width: 1 * s, backgroundColor: alpha(p.accent, 0.5) }} />
          <div style={col({ flex: 1, gap: 6 * s })}>
            <T style={{ ...caps, fontSize: 9 * s }}>{labels.venue}</T>
            <T style={{ ...body, fontSize: 17 * s }}>{f.venue}</T>
            <T style={{ ...body, fontSize: 13 * s, color: p.muted }}>{f.address}</T>
          </div>
        </div>
        <T style={{ ...caps, fontSize: 10 * s, color: p.muted, letterSpacing: 2.5 * s }}>{f.footer}</T>
      </Abs>
    </div>
  );
}

/* Bauhaus Party — six-tile geometric poster over heavy grotesque type and ruled details */
export function Bauhaus({ f, p, d, b, s, labels }: LayoutProps) {
  const left: CSSProperties = { textAlign: "left" };
  const caps: CSSProperties = { fontFamily: b, fontSize: 13 * s, fontWeight: 600, letterSpacing: 3 * s, textTransform: "uppercase", color: p.accent, ...left };
  const body: CSSProperties = { fontFamily: b, fontSize: 17 * s, color: p.text, lineHeight: 1.4, ...left };
  const ink = p.text;
  const cell = (label: string, value: string, flex: number) => (
    <div style={col({ flex, gap: 4 * s })}>
      <T style={{ ...caps, fontSize: 11 * s }}>{label}</T>
      <T style={{ ...body, fontWeight: 600, fontSize: 20 * s, lineHeight: 1.15 }}>{value}</T>
    </div>
  );

  return (
    <div style={col({ flex: 1, position: "relative", backgroundColor: p.bg })}>
      <Layer s={s}>
        <rect x={0} y={0} width={200} height={200} fill={p.accent3} />
        <path d="M0 0 A200 200 0 0 1 200 200 L0 200 Z" fill={p.accent} />
        <rect x={200} y={0} width={200} height={200} fill={p.surface} />
        <circle cx={300} cy={100} r={78} fill={p.accent2} />
        <circle cx={300} cy={100} r={22} fill={ink} />
        <rect x={400} y={0} width={200} height={200} fill={p.accent} />
        <path d="M400 0 A100 100 0 0 0 600 0 Z" fill={ink} />
        <rect x={470} y={150} width={60} height={50} fill={p.surface} />
        <rect x={0} y={200} width={200} height={200} fill={p.accent2} />
        <polygon points="20,380 100,220 180,380" fill={ink} />
        <rect x={200} y={200} width={200} height={200} fill={ink} />
        <path d="M400 200 A200 200 0 0 1 200 400 L400 400 Z" fill={p.surface} />
        <rect x={400} y={200} width={200} height={200} fill={p.surface} />
        <path d="M400 400 A100 100 0 0 1 600 400 Z" fill={p.accent3} />
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={420 + i * 34} y={226} width={12} height={84} fill={p.accent} />
        ))}
      </Layer>

      <Abs s={s} top={430} left={48} right={48} bottom={40} style={{ flexDirection: "column", gap: 10 * s }}>
        <T style={caps}>{f.eyebrow}</T>
        <T style={{ fontFamily: d, fontSize: (f.title.length > 28 ? 28 : fit(f.title, 58, 10, 18)) * s, color: ink, lineHeight: 1.12, textTransform: "uppercase", ...left }}>{f.title}</T>
        <T style={{ ...caps, color: ink, fontSize: 15 * s }}>{f.subtitle}</T>
        <Lines text={f.message} style={body} />
        <div style={{ display: "flex", flex: 1 }} />
        <Rule s={s} w={504} color={ink} h={4} />
        <div style={row({ gap: 18 * s })}>
          {cell(labels.date, f.date, 1.1)}
          {cell(labels.time, f.time, 0.6)}
          {cell(labels.venue, f.venue, 1.3)}
        </div>
        <div style={row({ justifyContent: "space-between", alignItems: "flex-start", gap: 24 * s })}>
          <T style={{ ...body, flex: 1, fontSize: 14 * s, lineHeight: 1.3, color: p.muted }}>{f.address}</T>
          <T style={{ ...body, flex: 1, fontSize: 14 * s, lineHeight: 1.3, color: p.accent, fontWeight: 600, textAlign: "right" }}>{f.footer}</T>
        </div>
      </Abs>
    </div>
  );
}

/* Memphis Pop — 80s Memphis pattern around a tilted neo-brutalist card with sticker tags */
export function Memphis({ f, p, d, b, a, s }: LayoutProps) {
  const ink = p.text;
  const body: CSSProperties = { fontFamily: b, fontSize: 16 * s, color: ink, textAlign: "center", lineHeight: 1.45 };
  const tag = (bg: string, text: string, rot: number) =>
    text ? (
      <T
        style={{
          fontFamily: b,
          fontWeight: 800,
          fontSize: 16 * s,
          color: ink,
          backgroundColor: bg,
          border: `${2.5 * s}px solid ${ink}`,
          borderRadius: 999,
          padding: `${6 * s}px ${16 * s}px`,
          transform: `rotate(${rot}deg)`,
        }}
      >
        {text}
      </T>
    ) : null;
  const dots = [];
  for (let i = 0; i < 5; i++) for (let j = 0; j < 4; j++) dots.push(<circle key={`${i}-${j}`} cx={470 + i * 18} cy={736 + j * 18} r={3.2} fill={ink} />);

  return (
    <div style={col({ flex: 1, position: "relative", backgroundColor: p.bg })}>
      <Layer s={s}>
        <circle cx={526} cy={96} r={96} fill={p.accent} />
        <circle cx={526} cy={96} r={96} fill="none" stroke={ink} strokeWidth={3} />
        <path d="M-80 840 A150 150 0 0 1 220 840 Z" fill={p.accent3} stroke={ink} strokeWidth={3} />
        <path d={squiggle(34, 70, 7, 12, 24)} stroke={p.accent3} strokeWidth={7} fill="none" strokeLinecap="round" />
        <path d={squiggle(330, 800, 5, 10, 22)} stroke={p.accent} strokeWidth={6} fill="none" strokeLinecap="round" />
        <polyline points={zigzag(250, 112, 5, 14, 22)} stroke={ink} strokeWidth={5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        <polygon points="40,560 92,600 30,630" fill={p.accent2} stroke={ink} strokeWidth={3} strokeLinejoin="round" />
        <rect x={540} y={560} width={36} height={36} fill={p.accent2} stroke={ink} strokeWidth={3} transform="rotate(20 558 578)" />
        <path d="M44 300 l0 30 M29 315 l30 0" stroke={ink} strokeWidth={5} strokeLinecap="round" />
        <path d="M560 300 l0 26 M547 313 l26 0" stroke={p.accent} strokeWidth={6} strokeLinecap="round" />
        <circle cx={140} cy={64} r={14} fill="none" stroke={ink} strokeWidth={4} />
        {dots}
      </Layer>

      <Abs
        s={s}
        top={170}
        left={56}
        width={488}
        height={520}
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 13 * s,
          backgroundColor: p.surface,
          border: `${4 * s}px solid ${ink}`,
          boxShadow: `${12 * s}px ${12 * s}px 0 ${ink}`,
          transform: "rotate(-2deg)",
          padding: `${28 * s}px ${30 * s}px`,
        }}
      >
        <T
          style={{
            fontFamily: b,
            fontWeight: 800,
            fontSize: 12 * s,
            letterSpacing: 2 * s,
            textTransform: "uppercase",
            color: ink,
            backgroundColor: p.accent2,
            border: `${2.5 * s}px solid ${ink}`,
            padding: `${6 * s}px ${14 * s}px`,
            transform: "rotate(3deg)",
          }}
        >
          {f.eyebrow}
        </T>
        <T style={{ fontFamily: d, fontSize: fit(f.title, 50, 8, 14) * s, color: ink, lineHeight: 1.1, textAlign: "center", textTransform: "uppercase" }}>{f.title}</T>
        <T style={{ fontFamily: a, fontSize: 32 * s, color: p.accent, lineHeight: 1, textAlign: "center", transform: "rotate(-3deg)" }}>{f.subtitle}</T>
        <Lines text={f.message} style={body} />
        <div style={row({ gap: 10 * s, flexWrap: "wrap", justifyContent: "center", marginTop: 6 * s })}>
          {tag(p.accent, f.date, -3)}
          {tag(p.accent3, f.time, 4)}
        </div>
        <div style={center({ gap: 2 * s })}>
          <T style={{ ...body, fontWeight: 800, fontSize: 18 * s }}>{f.venue}</T>
          <T style={{ ...body, fontSize: 14 * s, color: p.muted }}>{f.address}</T>
        </div>
      </Abs>
      <Abs s={s} left={60} right={60} bottom={56} style={{ justifyContent: "center" }}>
        {f.footer ? (
          <T
            style={{
              fontFamily: a,
              fontSize: 26 * s,
              color: ink,
              textAlign: "center",
              backgroundColor: p.surface,
              border: `${2.5 * s}px solid ${ink}`,
              borderRadius: 999,
              padding: `${2 * s}px ${22 * s}px ${4 * s}px`,
              transform: "rotate(2deg)",
            }}
          >
            {f.footer}
          </T>
        ) : null}
      </Abs>
    </div>
  );
}
