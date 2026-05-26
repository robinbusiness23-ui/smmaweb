import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Funkenflug – Social Media für Handwerksbetriebe",
  description:
    "Wir zeigen, wer ihr wirklich seid – nicht wer ihr sein könntet. Authentischer Social-Media-Content für Handwerksbetriebe im Mittelstand.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Bebas+Neue&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
