import type { Metadata } from "next";
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-contact-geist",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Contact Us | CAPCO Capacitors",
  description:
    "Engineering Support, Dealership Onboarding & Global Supply — Get in touch with CAPCO Capacitors (Dada Energies Pvt. Ltd.).",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={geist.variable}
      style={{
        fontFamily: "var(--font-contact-geist), var(--font-dm-sans), sans-serif",
      }}
    >
      {children}
    </div>
  );
}
