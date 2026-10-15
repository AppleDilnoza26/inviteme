import "server-only";

type Weight = 400 | 600 | 700;

/**
 * Satori (next/og) needs raw TTF/OTF data. Google Fonts returns a subset
 * containing only the requested glyphs when `text` is passed, which keeps
 * Cyrillic and Latin both working with a small download.
 */
export async function loadGoogleFont(family: string, weight: Weight, text: string): Promise<ArrayBuffer> {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url, { cache: "force-cache" })).text();
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error(`Font not available: ${family} ${weight}`);
  const res = await fetch(match[1], { cache: "force-cache" });
  if (!res.ok) throw new Error(`Font download failed: ${family}`);
  return res.arrayBuffer();
}
