import type { Metadata } from "next";
import type { JSX, ReactNode } from "react";

import "ai-tool-elements/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "ai-tool-elements",
  description: "An editable showcase for composable tool cards.",
};

type RootLayoutProps = Readonly<{
  children: ReactNode;
}>;

export default function RootLayout({
  children,
}: RootLayoutProps): JSX.Element {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
