import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { AppProviders } from "@/components/AppProviders";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CAPCO Capacitors | Capacitor Manufacturer in India",
  description: "CAPCO Capacitors manufactures BIS & CE certified motor run, PFC, lighting and custom capacitors for OEMs, dealers and industrial buyers across India.",
  keywords: ["capacitor manufacturer India", "CAPCO Capacitors", "BIS certified capacitors", "PFC capacitors", "motor run capacitors"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

