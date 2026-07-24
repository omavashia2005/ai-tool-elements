import type { Metadata } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import type { JSX, ReactNode } from "react";

import "ai-tool-elements/styles.css";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-display",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ai-tool-elements — typed React cards for every tool your AI calls",
  description:
    "Provider-independent React components for showing tools and connectors like Stripe, Gmail, Notion, and Exa. Built on shadcn/ui. npm install ai-tool-elements.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({
  children,
}: RootLayoutProps): JSX.Element {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
