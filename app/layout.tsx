import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YSN Store — Votre boutique en ligne",
  description: "Créez votre boutique en ligne et partagez vos produits partout.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}