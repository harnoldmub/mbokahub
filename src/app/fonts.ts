import { Anton, Fraunces, Geist, JetBrains_Mono } from "next/font/google";

export const fontDisplay = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

export const fontSerif = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "600", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

export const fontBody = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-jetbrains",
});
