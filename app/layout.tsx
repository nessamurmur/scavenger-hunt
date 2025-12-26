import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crafternoon Scavenger Hunt",
  description: "Dreaming about our next chapter together",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
