import type { Metadata } from "next";
import { Fraunces, JetBrains_Mono, Manrope } from "next/font/google";

import { AppProviders } from "@/components/layout/app-providers";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["SOFT", "opsz"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Espaço do Empreendedor",
  description:
    "Plataforma de apoio ao MEI com atendimento humano, orientação simples e acompanhamento de solicitações.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${manrope.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-screen font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
