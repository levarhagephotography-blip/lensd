import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import "./globals.css";

const displayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display"
});

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lensd.vercel.app"),
  title: "LENSD — Your AI Creative Shoot Companion",
  description:
    "Stop showing up with no plan. AI-powered shoot planner for photographers and content creators.",
  openGraph: {
    title: "LENSD — Your AI Creative Shoot Companion",
    description:
      "Stop showing up with no plan. AI-powered shoot planner for photographers and content creators.",
    type: "website",
    url: "https://lensd.vercel.app",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "LENSD preview image"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "LENSD — Your AI Creative Shoot Companion",
    description:
      "Stop showing up with no plan. AI-powered shoot planner for photographers and content creators.",
    images: ["/opengraph-image"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>{children}</body>
    </html>
  );
}
