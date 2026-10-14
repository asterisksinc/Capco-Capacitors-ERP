import type { Metadata } from "next";

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
    <div>
      {children}
    </div>
  );
}
