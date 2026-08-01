import { Bebas_Neue, DM_Sans } from "next/font/google";

export const fontDisplay = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

export const fontSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const fontClassNames = [fontDisplay.variable, fontSans.variable].join(
  " ",
);
