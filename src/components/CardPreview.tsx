"use client";

import { useEffect, useRef, useState } from "react";
import { BODY_FONT, getFont, getPalette, PALETTES } from "@/lib/design";
import { CARD_HEIGHT, CARD_WIDTH, InvitationCard } from "@/templates/InvitationCard";
import { LAYOUT_ACCENT_FONT, LAYOUT_BODY_FONT, type InvitationContent, type Layout } from "@/templates/types";

function cssFamily(key: string) {
  const font = getFont(key) ?? BODY_FONT;
  return `var(${font.cssVar}), "${font.family}", serif`;
}

export function CardPreview({
  layout,
  content,
  watermark,
  locale,
  className = "",
}: {
  layout: Layout;
  content: InvitationContent;
  watermark?: boolean;
  locale?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / CARD_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: `${CARD_WIDTH} / ${CARD_HEIGHT}` }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          opacity: scale ? 1 : 0,
          transition: "opacity .3s",
        }}
      >
        <InvitationCard
          layout={layout}
          fields={content.fields}
          palette={getPalette(content.palette) ?? PALETTES[0]}
          displayFont={cssFamily(content.font)}
          bodyFont={cssFamily(LAYOUT_BODY_FONT[layout] ?? BODY_FONT.key)}
          accentFont={LAYOUT_ACCENT_FONT[layout] ? cssFamily(LAYOUT_ACCENT_FONT[layout]) : undefined}
          watermark={watermark}
          locale={locale}
        />
      </div>
    </div>
  );
}
