import {
  Alice,
  Bad_Script,
  Caveat,
  Comfortaa,
  Cormorant_Garamond,
  Dela_Gothic_One,
  Forum,
  Great_Vibes,
  Lobster,
  Lora,
  Manrope,
  Marck_Script,
  Oswald,
  Pacifico,
  Philosopher,
  Playfair_Display,
  Prata,
  Rubik_Mono_One,
  Tenor_Sans,
  Unbounded,
  Yeseva_One,
} from "next/font/google";

const cormorant = Cormorant_Garamond({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], variable: "--font-cormorant", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600"], variable: "--font-playfair", display: "swap" });
const manrope = Manrope({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], variable: "--font-manrope", display: "swap" });
const lora = Lora({ subsets: ["latin", "cyrillic"], weight: ["400", "600"], variable: "--font-lora", display: "swap", preload: false });
const prata = Prata({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-prata", display: "swap", preload: false });
const greatVibes = Great_Vibes({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-great-vibes", display: "swap", preload: false });
const marckScript = Marck_Script({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-marck-script", display: "swap", preload: false });
const philosopher = Philosopher({ subsets: ["latin", "cyrillic"], weight: ["400", "700"], variable: "--font-philosopher", display: "swap", preload: false });
const alice = Alice({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-alice", display: "swap", preload: false });
const forum = Forum({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-forum", display: "swap", preload: false });
const badScript = Bad_Script({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-bad-script", display: "swap", preload: false });
const lobster = Lobster({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-lobster", display: "swap", preload: false });
const comfortaa = Comfortaa({ subsets: ["latin", "cyrillic"], weight: ["400", "600"], variable: "--font-comfortaa", display: "swap", preload: false });
const unbounded = Unbounded({ subsets: ["latin", "cyrillic"], weight: ["400", "600"], variable: "--font-unbounded", display: "swap", preload: false });
const pacifico = Pacifico({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-pacifico", display: "swap", preload: false });
const yeseva = Yeseva_One({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-yeseva", display: "swap", preload: false });
const caveat = Caveat({ subsets: ["latin", "cyrillic"], weight: ["400", "600"], variable: "--font-caveat", display: "swap", preload: false });
const delaGothic = Dela_Gothic_One({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-dela-gothic", display: "swap", preload: false });
const oswald = Oswald({ subsets: ["latin", "cyrillic"], weight: ["400", "500", "600", "700"], variable: "--font-oswald", display: "swap", preload: false });
const rubikMono = Rubik_Mono_One({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-rubik-mono", display: "swap", preload: false });
const tenor = Tenor_Sans({ subsets: ["latin", "cyrillic"], weight: "400", variable: "--font-tenor", display: "swap", preload: false });

export const fontVariables = [
  cormorant,
  playfair,
  manrope,
  lora,
  prata,
  greatVibes,
  marckScript,
  philosopher,
  alice,
  forum,
  badScript,
  lobster,
  comfortaa,
  unbounded,
  pacifico,
  yeseva,
  caveat,
  delaGothic,
  oswald,
  rubikMono,
  tenor,
]
  .map((f) => f.variable)
  .join(" ");
