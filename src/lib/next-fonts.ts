// Fonts are requested by the browser at runtime, never during `next build`, so builds do not depend on
// Google Fonts. The `--font-*` variables (with system fallbacks) are defined for `.im-fonts` in globals.css.
const GOOGLE_FONTS: [family: string, weights: string][] = [
  ["Cormorant Garamond", "400;500;600"],
  ["Playfair Display", "400;500;600"],
  ["Manrope", "400;500;600;700"],
  ["Lora", "400;600"],
  ["Prata", "400"],
  ["Great Vibes", "400"],
  ["Marck Script", "400"],
  ["Philosopher", "400;700"],
  ["Alice", "400"],
  ["Forum", "400"],
  ["Bad Script", "400"],
  ["Lobster", "400"],
  ["Comfortaa", "400;600"],
  ["Unbounded", "400;600"],
  ["Pacifico", "400"],
  ["Yeseva One", "400"],
  ["Caveat", "400;600"],
  ["Dela Gothic One", "400"],
  ["Oswald", "400;500;600;700"],
  ["Rubik Mono One", "400"],
  ["Tenor Sans", "400"],
];

export const fontStylesheetHref =
  "https://fonts.googleapis.com/css2?" +
  GOOGLE_FONTS.map(([family, weights]) => `family=${family.replace(/ /g, "+")}:wght@${weights}`).join("&") +
  "&display=swap";

export const fontVariables = "im-fonts";
