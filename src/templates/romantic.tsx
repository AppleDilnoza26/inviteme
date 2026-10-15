import type { CSSProperties } from "react";
import {
  alpha,
  arrangement,
  berries,
  botany,
  bud,
  envelopeFlap,
  euca,
  filler,
  foil,
  hills,
  hotAirBalloon,
  Layer,
  laurel,
  leaf,
  mix,
  Paper,
  peony,
  rose,
  sprig,
  tape,
  uid,
  wash,
  watercolorFilter,
  waxSeal,
} from "./art";
import {
  Abs,
  center,
  col,
  Content,
  fit,
  headlineNumber,
  initials,
  Lines,
  Names,
  Pampas,
  row,
  Sparkle,
  SPARKLE,
  StarField,
  T,
  type LayoutProps,
} from "./kit";

// Artistic Romantic: watercolor botanicals, fine-pen ornaments, cotton paper and script/serif pairings.

/* Elegant Wedding — fine-pen laurel around a monogram, soft washes, deckled double frame */
export function Elegant({ f, p, d, b, s, labels }: LayoutProps) {
  const pen = mix(p.accent, p.text, 0.2);
  const body: CSSProperties = { fontFamily: b, fontSize: 19 * s, color: p.text, textAlign: "center", lineHeight: 1.45 };
  const cap: CSSProperties = { fontFamily: b, fontSize: 12 * s, letterSpacing: 5 * s, textTransform: "uppercase", color: p.muted, textAlign: "center" };
  const name: CSSProperties = { fontFamily: d, fontSize: fit(f.title, 74, 10, 18) * s, color: p.text, lineHeight: 1.02, textAlign: "center" };
  const detail = (label: string, value: string, wide = false) =>
    value ? (
      <div style={center({ width: (wide ? 190 : 120) * s, gap: 5 * s })}>
        <T style={{ ...cap, fontSize: 10 * s, color: pen }}>{label}</T>
        <T style={{ ...body, fontSize: 18 * s }}>{value}</T>
      </div>
    ) : null;

  return (
    <div style={col({ flex: 1, position: "relative", backgroundColor: p.surface })}>
      <Layer s={s}>
        {wash(300, 150, 160, 118, p.accent2, 21, 0.6)}
        {wash(492, 776, 130, 74, p.accent2, 5, 0.4)}
        {wash(96, 706, 92, 64, p.accent2, 9, 0.34)}
        {laurel(300, 158, 72, pen, p.surface, 1.05)}
      </Layer>
      <Paper s={s} tint={p.muted} />
      <Abs s={s} top={22} left={22} right={22} bottom={22} style={{ border: `${0.8 * s}px solid ${p.accent}` }} />
      <Abs s={s} top={28} left={28} right={28} bottom={28} style={{ border: `${0.4 * s}px solid ${p.accent}` }} />

      <Content style={{ alignItems: "center", padding: `${84 * s}px ${72 * s}px ${60 * s}px` }}>
      <div style={center({ width: 148 * s, height: 148 * s })}>
        <T style={{ fontFamily: d, fontSize: 46 * s, color: pen, lineHeight: 1 }}>{initials(f.title)}</T>
      </div>
      <T style={{ ...cap, marginTop: 26 * s }}>{f.eyebrow}</T>
      <div style={center({ flex: 1, gap: 12 * s })}>
        <Names title={f.title} style={name} amp={{ fontFamily: b, fontSize: 22 * s, letterSpacing: 6 * s, color: pen, textTransform: "uppercase" }} gap={2 * s} />
        <T style={{ ...body, color: p.muted, fontSize: 17 * s }}>{f.subtitle}</T>
      </div>
      <Lines text={f.message} style={body} />
      <svg width={190 * s} height={26 * s} viewBox="0 0 190 26" style={{ display: "flex", margin: `${16 * s}px 0` }}>
        {sprig(95, 14, pen, p.surface, 0.9, 82)}
      </svg>
      <div style={row({ alignItems: "stretch", gap: 18 * s })}>
        {detail(labels.date, f.date, true)}
        {f.date && f.time ? <div style={{ display: "flex", width: 0.75 * s, backgroundColor: p.accent, opacity: 0.6 }} /> : null}
        {detail(labels.time, f.time)}
      </div>
      <T style={{ ...body, fontWeight: 600, marginTop: 16 * s }}>{f.venue}</T>
      <T style={{ ...body, fontSize: 15 * s, color: p.muted }}>{f.address}</T>
      <T style={{ ...cap, fontSize: 10 * s, letterSpacing: 3 * s, marginTop: 16 * s }}>{f.footer}</T>
      </Content>
    </div>
  );
}

/* Floral Romance — watercolor peony crown spilling over the top, small spray in the opposite corner */
export function Floral({ f, p, d, b, s }: LayoutProps) {
  const bt = botany(p, 5);
  const deep = mix(p.accent, p.text, 0.35);
  const body: CSSProperties = { fontFamily: b, fontSize: 18 * s, color: p.text, textAlign: "center", lineHeight: 1.4 };
  const caps: CSSProperties = { fontFamily: b, fontSize: 12 * s, letterSpacing: 5 * s, textTransform: "uppercase", color: deep, textAlign: "center" };
  const name: CSSProperties = { fontFamily: d, fontSize: fit(f.title, 68, 10, 18) * s, color: p.text, lineHeight: 1.02, textAlign: "center" };

  const crown = arrangement(
    bt,
    [
      leaf(bt, 175, 200, 95, 200),
      leaf(bt, 255, 190, 80, 160),
      leaf(bt, 62, 178, 92, 238),
      leaf(bt, 22, 300, 82, 200),
      leaf(bt, 334, 112, 86, 128),
      leaf(bt, 440, 140, 76, 165),
      leaf(bt, 522, 118, 82, 112),
      leaf(bt, 598, 214, 86, 172),
      leaf(bt, 140, 236, 72, 178, 0.3, "soft"),
      euca(bt, 232, 150, 170, 150, 3),
      euca(bt, 92, 172, 165, 212, 4),
      euca(bt, 482, 110, 150, 146, 5),
      filler(bt, 330, 140, 125, 165, 6),
      filler(bt, 152, 192, 115, 196, 7),
      filler(bt, 560, 182, 105, 150, 8),
    ],
    [
      berries(bt, 272, 222, 9),
      berries(bt, 470, 162, 10),
      bud(bt, 370, 196, 26, 150, "bloom"),
      bud(bt, 96, 300, 30, 200, "soft"),
      bud(bt, 542, 226, 30, 160, "bloom"),
      rose(bt, 30, 226, 40, 30, 4, "soft"),
      rose(bt, 576, 150, 36, 0, 7, "soft"),
      rose(bt, 395, 126, 32, 0, 6, "soft"),
      peony(bt, 470, 70, 56, 40, 5, "bloom"),
      peony(bt, 300, 58, 64, -20, 2, "soft"),
      rose(bt, 215, 166, 42, 0, 3, "bloom"),
      peony(bt, 120, 104, 86, 10, 1, "bloom"),
    ],
  );
  const spray = arrangement(
    bt,
    [
      leaf(bt, 120, 150, 80, -60),
      leaf(bt, 175, 118, 86, -15),
      leaf(bt, 72, 200, 72, -85),
      leaf(bt, 216, 122, 70, 22),
      euca(bt, 152, 140, 130, -40, 13),
      filler(bt, 112, 162, 92, -65, 14),
    ],
    [bud(bt, 150, 86, 24, -20, "soft"), rose(bt, 96, 186, 30, 0, 12, "soft"), peony(bt, 178, 166, 58, 20, 11, "bloom")],
  );

  return (
    <div style={col({ flex: 1, position: "relative", backgroundColor: p.surface })}>
      <Layer s={s}>
        {wash(170, 150, 200, 120, p.accent2, 31, 0.2)}
        {wash(500, 790, 150, 90, p.accent2, 17, 0.18)}
      </Layer>
      <Paper s={s} tint={p.muted} />
      <Layer s={s} w={600} h={340} y={-8}>
        {crown}
      </Layer>
      <Layer s={s} w={220} h={200} x={392} y={662}>
        {spray}
      </Layer>
      <Abs
        s={s}
        top={280}
        left={78}
        right={78}
        bottom={92}
        style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 11 * s }}
      >
        <T style={caps}>{f.eyebrow}</T>
        <Names title={f.title} style={name} amp={{ ...name, fontSize: 38 * s, color: deep }} />
        <T style={{ ...body, fontSize: 17 * s, color: p.muted }}>{f.subtitle}</T>
        <Lines text={f.message} style={body} />
        <div style={row({ alignItems: "center", gap: 12 * s, marginTop: 6 * s })}>
          <div style={{ display: "flex", width: 34 * s, height: 0.8 * s, backgroundColor: deep }} />
          <T style={{ ...caps, fontSize: 14 * s, letterSpacing: 3 * s, fontWeight: 600 }}>{[f.date, f.time].filter(Boolean).join(" · ")}</T>
          <div style={{ display: "flex", width: 34 * s, height: 0.8 * s, backgroundColor: deep }} />
        </div>
        <div style={center({ gap: 2 * s })}>
          <T style={{ ...body, fontWeight: 600 }}>{f.venue}</T>
          <T style={{ ...body, fontSize: 15 * s, color: p.muted }}>{f.address}</T>
        </div>
        <T style={{ ...body, fontSize: 14 * s, color: p.muted }}>{f.footer}</T>
      </Abs>
    </div>
  );
}

/* Garden Party — herbarium plate: taped watercolor specimen, handwritten notes, specimen label */
export function Greenery({ f, p, d, b, a, s, labels }: LayoutProps) {
  const bt = botany(p, 8);
  const left: CSSProperties = { textAlign: "left" };
  const body: CSSProperties = { fontFamily: b, fontSize: 18 * s, color: p.text, lineHeight: 1.4, ...left };
  const caps: CSSProperties = { fontFamily: b, fontSize: 11 * s, letterSpacing: 4 * s, textTransform: "uppercase", color: p.muted, ...left };
  const stem = [
    [150, 830], [140, 740], [150, 650], [170, 560], [178, 470], [168, 380], [158, 300], [163, 220], [172, 150], [178, 92],
  ];
  const specimen = arrangement(
    bt,
    [
      <path key="stem" d={`M${stem.map(([x, y]) => `${x} ${y}`).join(" L")}`} stroke={bt.ink.leaf.deep} strokeWidth={2.2} fill="none" strokeLinejoin="round" />,
      <path key="branch" d="M162 610 C200 560 230 520 262 452" stroke={bt.ink.leaf.deep} strokeWidth={1.6} fill="none" />,
      ...stem.slice(1).map(([x, y], i) => leaf(bt, x, y, 96 - i * 6, i % 2 ? 52 : -56, 0.3)),
      leaf(bt, 205, 548, 62, 70, 0.3, "soft"),
      leaf(bt, 236, 498, 58, -10, 0.3, "soft"),
      leaf(bt, 262, 452, 50, 30, 0.3, "soft"),
      euca(bt, 120, 760, 230, -24, 21),
      filler(bt, 168, 430, 150, 28, 22),
      filler(bt, 150, 300, 120, -30, 23),
    ],
    [bud(bt, 178, 92, 26, 4, "soft"), bud(bt, 205, 150, 20, 38, "bloom"), berries(bt, 100, 520, 24), berries(bt, 232, 360, 25)],
  );
  const num = headlineNumber(f.title);
  const row2 = (label: string, value: string) =>
    value ? (
      <div style={row({ gap: 10 * s, alignItems: "baseline", borderBottom: `${0.8 * s}px dashed ${alpha(p.text, 0.4)}`, paddingBottom: 6 * s })}>
        <T style={{ ...caps, fontSize: 9 * s, letterSpacing: 2.5 * s, width: 58 * s }}>{label}</T>
        <T style={{ ...body, fontSize: 16 * s, flex: 1, lineHeight: 1.25 }}>{value}</T>
      </div>
    ) : null;

  return (
    <div style={col({ flex: 1, position: "relative", backgroundColor: p.surface })}>
      <Layer s={s}>{wash(170, 470, 170, 360, p.accent2, 41, 0.22)}</Layer>
      <Paper s={s} tint={p.muted} />
      <Abs s={s} top={24} left={24} right={24} bottom={24} style={{ border: `${0.8 * s}px solid ${alpha(p.text, 0.25)}` }} />
      <Layer s={s} w={300} h={840}>
        {specimen}
        {tape(150, 650, 92, 22, -14, p.accent2)}
        {tape(166, 262, 80, 20, 9, p.accent2)}
      </Layer>

      <Abs s={s} top={78} left={300} right={56} bottom={58} style={{ flexDirection: "column", gap: 12 * s }}>
        <T style={caps}>{f.eyebrow}</T>
        <T style={{ fontFamily: d, fontSize: fit(f.title, 52, 9, 16) * s, color: p.text, lineHeight: 1.05, ...left }}>{f.title}</T>
        <T style={{ fontFamily: a, fontSize: 28 * s, color: p.accent3, lineHeight: 1.1, transform: "rotate(-3deg)", ...left }}>{f.subtitle}</T>
        <Lines text={f.message} style={{ ...body, fontSize: 17 * s }} />
        <div style={{ display: "flex", flex: 1 }} />
        <div style={col({ gap: 8 * s, padding: `${14 * s}px ${14 * s}px ${12 * s}px`, border: `${1 * s}px solid ${p.text}`, backgroundColor: alpha(p.surface, 0.85) })}>
          <div style={row({ justifyContent: "space-between", alignItems: "baseline" })}>
            <T style={{ ...caps, color: p.text, fontWeight: 600, letterSpacing: 3 * s }}>Specimen</T>
            <T style={{ fontFamily: a, fontSize: 24 * s, color: p.accent3, lineHeight: 1 }}>{`№ ${num}`}</T>
          </div>
          {row2(labels.date, f.date)}
          {row2(labels.time, f.time)}
          {row2(labels.venue, [f.venue, f.address].filter(Boolean).join(", "))}
        </div>
        <T style={{ fontFamily: a, fontSize: 22 * s, color: p.accent3, lineHeight: 1.15, ...left }}>{f.footer}</T>
      </Abs>
    </div>
  );
}

/* Boho Arch — watercolor terracotta arch, painted sun, dried grasses and palm spears */
export function Boho({ f, p, d, b, a, s }: LayoutProps) {
  const bt = botany(p, 12);
  const body: CSSProperties = { fontFamily: b, fontSize: 17 * s, color: p.text, textAlign: "center", lineHeight: 1.45 };
  const caps: CSSProperties = { fontFamily: b, fontSize: 11 * s, letterSpacing: 4 * s, textTransform: "uppercase", color: p.text, textAlign: "center" };
  const archG = uid("arch", p.accent2, p.surface);
  const archF = uid("archf", p.accent2);
  const sunG = uid("sun", p.accent, p.text);
  const sunF = uid("sunf", p.accent);
  const bouquet = arrangement(
    bt,
    [
      leaf(bt, 120, 300, 170, -22, 0.16),
      leaf(bt, 150, 300, 150, 8, 0.16),
      leaf(bt, 95, 300, 130, -48, 0.18),
      euca(bt, 170, 300, 160, 30, 31),
      filler(bt, 135, 300, 170, -8, 32),
      filler(bt, 110, 300, 150, -34, 33),
    ],
    [bud(bt, 192, 196, 26, 22, "soft"), bud(bt, 60, 210, 22, -40, "bloom"), rose(bt, 150, 268, 34, 0, 34, "bloom"), rose(bt, 196, 280, 24, 20, 35, "soft")],
  );

  return (
    <div style={col({ flex: 1, position: "relative", backgroundColor: p.surface })}>
      <Layer s={s}>
        <defs>
          <linearGradient id={archG} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={p.accent2} stopOpacity={0.55} />
            <stop offset="0.6" stopColor={p.accent2} stopOpacity={0.22} />
            <stop offset="1" stopColor={p.accent2} stopOpacity={0.08} />
          </linearGradient>
          {watercolorFilter(archF, 51, 16, 0.018)}
          <radialGradient id={sunG} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={p.accent} stopOpacity={0.42} />
            <stop offset="0.8" stopColor={p.accent} stopOpacity={0.55} />
            <stop offset="1" stopColor={mix(p.accent, p.text, 0.25)} stopOpacity={0.7} />
          </radialGradient>
          {watercolorFilter(sunF, 52, 5, 0.04)}
        </defs>
        <g filter={`url(#${archF})`}>
          <path d="M78 840 L78 330 A222 222 0 0 1 522 330 L522 840 Z" fill={`url(#${archG})`} />
        </g>
        <g filter={`url(#${sunF})`}>
          <circle cx={300} cy={214} r={58} fill={`url(#${sunG})`} />
        </g>
        <path d="M96 840 L96 334 A204 204 0 0 1 504 334 L504 840" fill="none" stroke={p.accent} strokeWidth={1} opacity={0.7} />
      </Layer>
      <Paper s={s} tint={p.muted} />
      <Abs s={s} bottom={-30} left={-46} style={{ transform: "rotate(-16deg)" }}>
        <Pampas s={s} size={400} color={alpha(p.accent2, 0.85)} stem={p.accent3} />
      </Abs>
      <Abs s={s} bottom={-40} right={-40} style={{ transform: "rotate(14deg)" }}>
        <Pampas s={s} size={360} color={alpha(p.accent2, 0.85)} stem={p.accent3} seed={13} />
      </Abs>
      <Layer s={s} w={300} h={320} x={-30} y={540}>
        {bouquet}
      </Layer>
      <Layer s={s} w={300} h={320} x={330} y={560} style={{ transform: "scaleX(-1)" }}>
        {bouquet}
      </Layer>

      <Abs s={s} top={282} left={118} right={118} bottom={130} style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 13 * s }}>
        <T style={caps}>{f.eyebrow}</T>
        <T style={{ fontFamily: d, fontSize: fit(f.title, 54, 12, 20) * s, color: mix(p.accent, p.text, 0.25), lineHeight: 1.08, textAlign: "center" }}>{f.title}</T>
        <T style={{ fontFamily: a, fontSize: 26 * s, color: p.accent, textAlign: "center", lineHeight: 1.1 }}>{f.subtitle}</T>
        <Lines text={f.message} style={body} />
        <div style={row({ alignItems: "center", gap: 12 * s, marginTop: 4 * s })}>
          <T style={{ ...caps, fontWeight: 600 }}>{f.date}</T>
          {f.time ? <div style={{ display: "flex", width: 5 * s, height: 5 * s, borderRadius: 999, backgroundColor: p.accent }} /> : null}
          <T style={{ ...caps, fontWeight: 600 }}>{f.time}</T>
        </div>
        <div style={center({ gap: 2 * s })}>
          <T style={{ ...body, fontWeight: 600 }}>{f.venue}</T>
          <T style={{ ...body, fontSize: 14 * s, color: p.muted }}>{f.address}</T>
        </div>
        <T style={{ fontFamily: a, fontSize: 21 * s, color: p.muted, textAlign: "center" }}>{f.footer}</T>
      </Abs>
    </div>
  );
}

/* Classic Invitation — envelope liner flap, poured wax seal with monogram, letterpress layout */
export function Classic({ f, p, d, b, s }: LayoutProps) {
  const pen = mix(p.accent, p.text, 0.2);
  const seal = mix(p.accent, "#8c2f2f", 0.6);
  const body: CSSProperties = { fontFamily: b, fontSize: 19 * s, color: p.text, textAlign: "center", lineHeight: 1.4 };
  const caps: CSSProperties = { fontFamily: b, fontSize: 12 * s, letterSpacing: 5 * s, textTransform: "uppercase", color: p.muted, textAlign: "center" };

  return (
    <div style={col({ flex: 1, position: "relative", backgroundColor: p.surface })}>
      <Paper s={s} tint={p.muted} />
      <Abs s={s} top={16} left={16} right={16} bottom={16} style={{ border: `${0.8 * s}px solid ${p.accent}` }} />
      <Layer s={s}>
        {envelopeFlap(600, 226, mix(p.accent2, p.surface, 0.35), p.accent, p.accent)}
        {waxSeal(300, 226, 48, seal, 6)}
      </Layer>
      <Abs s={s} top={180} left={254} width={92} height={92} style={{ alignItems: "center", justifyContent: "center" }}>
        <T style={{ fontFamily: d, fontSize: 30 * s, color: mix(seal, "#ffffff", 0.6), letterSpacing: 1 * s }}>{initials(f.title)}</T>
      </Abs>

      <Abs s={s} top={300} left={70} right={70} bottom={52} style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 * s }}>
        <T style={caps}>{f.eyebrow}</T>
        <T style={{ fontFamily: d, fontSize: fit(f.title, 52, 12, 20) * s, color: p.text, lineHeight: 1.1, textAlign: "center" }}>{f.title}</T>
        <T style={{ ...body, color: p.muted, fontSize: 17 * s }}>{f.subtitle}</T>
        <Lines text={f.message} style={body} />
        <svg width={190 * s} height={26 * s} viewBox="0 0 190 26" style={{ display: "flex" }}>
          {sprig(95, 14, pen, p.surface, 0.9, 82)}
        </svg>
        <T style={{ fontFamily: d, fontSize: 28 * s, color: p.text, textAlign: "center" }}>{f.date}</T>
        <T style={{ ...caps, color: pen, fontWeight: 600 }}>{f.time}</T>
        <div style={center({ gap: 2 * s })}>
          <T style={{ ...body, fontWeight: 600 }}>{f.venue}</T>
          <T style={{ ...body, fontSize: 15 * s, color: p.muted }}>{f.address}</T>
        </div>
        <T style={{ ...body, fontSize: 14 * s, color: p.muted }}>{f.footer}</T>
      </Abs>
    </div>
  );
}

/* Baby Shower — watercolor sky, drifting hot-air balloons, handwritten notes */
export function Baby({ f, p, d, b, a, s }: LayoutProps) {
  const sky = mix(p.bg, p.muted, 0.28);
  const body: CSSProperties = { fontFamily: b, fontSize: 18 * s, color: p.text, textAlign: "center", lineHeight: 1.4 };
  const caps: CSSProperties = { fontFamily: b, fontSize: 12 * s, letterSpacing: 4 * s, textTransform: "uppercase", color: p.muted, textAlign: "center", fontWeight: 600 };
  const sparkles = [
    [70, 90, 14], [250, 60, 9], [540, 330, 12], [60, 330, 9], [330, 300, 7],
  ];

  return (
    <div style={col({ flex: 1, position: "relative", backgroundColor: p.surface })}>
      <Layer s={s}>
        {wash(300, 150, 380, 230, sky, 61, 0.55)}
        {wash(150, 250, 150, 60, "#ffffff", 62, 0.95)}
        {wash(470, 90, 120, 46, "#ffffff", 63, 0.9)}
        {wash(120, 800, 230, 90, sky, 64, 0.45)}
        {wash(500, 820, 220, 80, p.accent, 65, 0.22)}
        {hotAirBalloon(438, 176, 66, [p.accent, "#ffffff", p.accent, "#ffffff", p.accent], p.text, 66)}
        {hotAirBalloon(150, 128, 36, [p.accent2, "#ffffff", p.accent3, "#ffffff", p.accent2], p.text, 67)}
        {sparkles.map(([x, y, z], i) => (
          <path key={i} d={SPARKLE} fill={p.accent3} transform={`translate(${x - z} ${y - z}) scale(${(z * 2) / 100})`} />
        ))}
      </Layer>
      <Paper s={s} tint={p.muted} />

      <Abs s={s} top={356} left={64} right={64} bottom={70} style={{ flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 * s }}>
        <T style={caps}>{f.eyebrow}</T>
        <T style={{ fontFamily: d, fontSize: fit(f.title, 46, 12, 20) * s, color: p.text, lineHeight: 1.15, textAlign: "center" }}>{f.title}</T>
        <T style={{ fontFamily: a, fontSize: 27 * s, color: mix(p.accent, p.text, 0.25), textAlign: "center", lineHeight: 1.1 }}>{f.subtitle}</T>
        <Lines text={f.message} style={body} />
        <div style={row({ alignItems: "center", gap: 12 * s, marginTop: 4 * s })}>
          <T style={{ ...caps, color: p.text }}>{f.date}</T>
          {f.time ? <Sparkle s={s} size={12} color={p.accent3} /> : null}
          <T style={{ ...caps, color: p.text }}>{f.time}</T>
        </div>
        <div style={center({ gap: 2 * s })}>
          <T style={{ ...body, fontWeight: 600 }}>{f.venue}</T>
          <T style={{ ...body, fontSize: 15 * s, color: p.muted }}>{f.address}</T>
        </div>
        <T style={{ fontFamily: a, fontSize: 22 * s, color: p.muted, textAlign: "center" }}>{f.footer}</T>
      </Abs>
    </div>
  );
}

/* Starry Night — watercolor nebula, gold-foil crescent, layered hills */
export function Celestial({ f, p, d, b, s }: LayoutProps) {
  const body: CSSProperties = { fontFamily: b, fontSize: 19 * s, color: p.text, textAlign: "center", lineHeight: 1.45 };
  const moon = uid("moonfoil", p.accent);
  const glow = uid("nebula", p.accent2);
  const halo = uid("halo", p.accent);
  const neb = uid("nebf", p.accent2);
  return (
    <div style={col({ flex: 1, position: "relative", backgroundImage: `linear-gradient(180deg, ${p.bg} 0%, ${p.surface} 100%)` })}>
      <Layer s={s}>
        <defs>
          <radialGradient id={glow} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={p.accent2} stopOpacity={0.42} />
            <stop offset="0.55" stopColor={p.accent2} stopOpacity={0.16} />
            <stop offset="1" stopColor={p.accent2} stopOpacity={0} />
          </radialGradient>
          <radialGradient id={halo} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor={p.accent} stopOpacity={0.3} />
            <stop offset="1" stopColor={p.accent} stopOpacity={0} />
          </radialGradient>
          {watercolorFilter(neb, 71, 30, 0.01)}
        </defs>
        <g filter={`url(#${neb})`}>
          <ellipse cx={130} cy={300} rx={280} ry={150} fill={`url(#${glow})`} transform="rotate(-24 130 300)" />
          <ellipse cx={500} cy={560} rx={260} ry={130} fill={`url(#${glow})`} transform="rotate(-18 500 560)" />
        </g>
        <circle cx={330} cy={110} r={120} fill={`url(#${halo})`} />
      </Layer>
      <StarField s={s} p={p} />
      <Layer s={s}>
        <defs>{[foil(moon, p.accent)]}</defs>
        <path d="M322 58 A58 58 0 1 0 362 158 A46 46 0 1 1 322 58 Z" fill={`url(#${moon})`} />
        {hills(712, 70, mix(p.surface, p.accent2, 0.25), 5, 0.9)}
        {hills(760, 60, mix(p.bg, "#000000", 0.25), 9)}
      </Layer>

      <Content style={{ alignItems: "center", padding: `${196 * s}px ${70 * s}px ${44 * s}px`, gap: 14 * s }}>
        <T style={{ fontFamily: b, fontSize: 13 * s, letterSpacing: 5 * s, textTransform: "uppercase", color: mix(p.accent2, "#ffffff", 0.45), textAlign: "center" }}>{f.eyebrow}</T>
        <T style={{ fontFamily: d, fontSize: fit(f.title, 66, 12, 20) * s, color: p.accent, lineHeight: 1.1, textAlign: "center" }}>{f.title}</T>
        <T style={{ ...body, color: p.muted, fontSize: 17 * s }}>{f.subtitle}</T>
        <Sparkle s={s} size={18} color={p.accent} />
        <Lines text={f.message} style={body} />
        <div style={row({ alignItems: "center", gap: 16 * s, marginTop: 16 * s })}>
          <div style={{ display: "flex", width: 46 * s, height: 1, backgroundColor: alpha(p.accent, 0.6) }} />
          <T style={{ fontFamily: d, fontSize: fit(f.date, 40, 16, 24) * s, color: p.accent, lineHeight: 1.1, textAlign: "center" }}>{f.date}</T>
          <div style={{ display: "flex", width: 46 * s, height: 1, backgroundColor: alpha(p.accent, 0.6) }} />
        </div>
        <T style={{ fontFamily: b, fontSize: 15 * s, letterSpacing: 5 * s, color: mix(p.accent2, "#ffffff", 0.45), textAlign: "center" }}>{f.time}</T>
        <div style={{ display: "flex", flex: 1 }} />
        <div style={center({ gap: 2 * s })}>
          <T style={{ ...body, fontWeight: 600 }}>{f.venue}</T>
          <T style={{ ...body, fontSize: 15 * s, color: alpha(p.text, 0.8) }}>{f.address}</T>
        </div>
        <T style={{ ...body, fontSize: 14 * s, color: alpha(p.text, 0.75) }}>{f.footer}</T>
      </Content>
    </div>
  );
}

