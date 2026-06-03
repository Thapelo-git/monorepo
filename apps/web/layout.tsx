import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WeddingFlow - Smart Wedding Planning",
  description: "Collaborative wedding planning platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
