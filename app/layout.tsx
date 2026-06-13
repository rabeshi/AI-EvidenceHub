import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI-Evidence Hub Dashboard",
  description: "Clickable proof of concept for the AI-Evidence Hub SGCI dashboard"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
