import { ImageResponse } from "next/og";
import { auth } from "@/lib/auth";
import { parseContent } from "@/lib/content";
import { BODY_FONT, getFont, getPalette, PALETTES } from "@/lib/design";
import { loadGoogleFont } from "@/lib/og-fonts";
import { needsWatermark } from "@/lib/plan-guard";
import { normalizePlan } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { CARD_HEIGHT, CARD_WIDTH, InvitationCard } from "@/templates/InvitationCard";
import { DECOR_TEXT } from "@/templates/kit";
import { LAYOUT_ACCENT_FONT, LAYOUT_BODY_FONT, resolveLayout } from "@/templates/types";

export const runtime = "nodejs";

const SCALE = 2;

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) return new Response("Unauthorized", { status: 401 });

  const { id } = await params;
  const [user, invitation] = await Promise.all([
    prisma.user.findUnique({ where: { id: session.user.id }, select: { plan: true } }),
    prisma.invitation.findFirst({ where: { id, userId: session.user.id }, include: { template: true } }),
  ]);
  if (!user || !invitation) return new Response("Not found", { status: 404 });

  const plan = normalizePlan(user.plan);
  const watermark = needsWatermark(plan);
  const content = parseContent(invitation.content);
  const locale = new URL(request.url).searchParams.get("locale") === "en" ? "en" : "ru";
  const layout = resolveLayout(invitation.template.layout);

  const display = getFont(content.font) ?? BODY_FONT;
  const body = getFont(LAYOUT_BODY_FONT[layout]) ?? BODY_FONT;
  const accentKey = LAYOUT_ACCENT_FONT[layout];
  const accent = accentKey ? getFont(accentKey) : undefined;
  const text = Object.values(content.fields).join("") + "InviteMe·FreeДатаВремяМестоDateTimeVenue0123456789 ,.·&" + DECOR_TEXT;
  // Uppercase variants are needed for text rendered with textTransform: uppercase.
  const glyphs = Array.from(new Set(text + text.toUpperCase())).join("");

  const fonts: { name: string; data: ArrayBuffer; weight: 400 | 600 | 700; style: "normal" }[] = [];
  try {
    const [displayData, body400] = await Promise.all([
      loadGoogleFont(display.family, 400, glyphs),
      loadGoogleFont(body.family, 400, glyphs),
    ]);
    fonts.push({ name: display.family, data: displayData, weight: 400, style: "normal" });
    fonts.push({ name: body.family, data: body400, weight: 400, style: "normal" });
  } catch {
    return new Response("Fonts are temporarily unavailable. Please try again.", { status: 503 });
  }
  if (accent && accent.family !== display.family && accent.family !== body.family) {
    try {
      fonts.push({ name: accent.family, data: await loadGoogleFont(accent.family, 400, glyphs), weight: 400, style: "normal" });
    } catch {
      return new Response("Fonts are temporarily unavailable. Please try again.", { status: 503 });
    }
  }
  // Bold body weights are optional: Satori falls back to the closest loaded weight.
  for (const weight of [600, 700] as const) {
    try {
      fonts.push({ name: body.family, data: await loadGoogleFont(body.family, weight, glyphs), weight, style: "normal" });
    } catch {}
  }

  const image = new ImageResponse(
    (
      <InvitationCard
        layout={layout}
        fields={content.fields}
        palette={getPalette(content.palette) ?? PALETTES[0]}
        displayFont={display.family}
        bodyFont={body.family}
        accentFont={accent?.family}
        scale={SCALE}
        watermark={watermark}
        locale={locale}
      />
    ),
    { width: CARD_WIDTH * SCALE, height: CARD_HEIGHT * SCALE, fonts },
  );

  const filename = `inviteme-${invitation.id}${watermark ? "-free" : ""}.png`;
  image.headers.set("Content-Disposition", `attachment; filename="${filename}"`);
  image.headers.set("Cache-Control", "private, no-store");
  return image;
}
