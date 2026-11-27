"use client";

import { ExternalLink, Headphones, Mail } from "lucide-react";

/** "Locations / Plant Facilities": plant photo with address card + phone/email desks (Dealership & Industrial pages). */
export function PlantFacilitiesSection() {
  return (
    <section className="bg-[#121212] px-6 py-20 text-white lg:px-[60px] lg:py-32">
      <div className="mx-auto max-w-[1800px]">
        <div>
          <div className="flex items-center gap-2 text-[14px] font-medium uppercase tracking-[0.02em] text-white">
            <span className="h-[6px] w-[6px] bg-[#58C7E8]" />
            LOCATIONS
          </div>
          <h2 className="type-h2 mt-4 font-normal text-white">
            Plant Facilities
          </h2>
        </div>

        {/* Google Map of the plant with the address badge */}
        <div className="relative mt-10 w-full overflow-hidden rounded-[20px] bg-[#1a1a1a] sm:h-[560px] lg:mt-12 lg:h-[680px]">
          <div className="relative h-[320px] w-full sm:absolute sm:inset-0 sm:h-full">
            <iframe
              title="Map: DADA ENERGIES (P) LTD., Medak, Telangana"
              src="https://www.google.com/maps?q=17.7359222,78.4825576&z=15&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0"
            />
          </div>

          {/* Address badge: below the photo on phones, floating bottom-right from sm up */}
          <div className="relative bg-[#1C1C1C] p-5 sm:absolute sm:bottom-8 sm:right-8 sm:max-w-[340px] sm:rounded-[12px] sm:bg-[#121212]/92 sm:p-6 sm:shadow-[0_12px_32px_rgba(0,0,0,0.25)] sm:backdrop-blur-md">
            <p className="type-caption leading-[1.55] text-white/85">
              DADA ENERGIES (P) LTD. E54 to E77, TSIIC Automotive Park, Muppireddypally Village, Manoharabad Mandal, Medak District, Hyderabad, Telangana - 502336.
            </p>
            <div className="mt-5">
              <a
                href="https://maps.app.goo.gl/iCLxR4jT38AWZDBQ7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white px-3.5 py-2.5 text-[12px] font-medium !text-[#0A0A0A] transition hover:bg-[#58C7E8]"
              >
                <span className="!text-[#0A0A0A]">Get Directions on Google Maps</span>
                <ExternalLink size={14} className="!text-[#0A0A0A] shrink-0" />
              </a>
            </div>
          </div>
        </div>

        {/* Contact desks: label, outlined icon, value (open columns, no boxes) */}
        <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16">
          {[
            { label: "Commercial desk phone", value: "+91-9848014000", href: "tel:+919848014000", Icon: Headphones },
            { label: "Department email desk", value: "info@capcocapacitor.com", href: "mailto:info@capcocapacitor.com", Icon: Mail },
          ].map(({ label, value, href, Icon }) => (
            <a key={label} href={href} className="group min-w-0">
              <span className="type-caption block uppercase tracking-[0.08em] text-white/50">{label}</span>
              <span className="mt-6 grid h-16 w-16 place-items-center rounded-full border border-white/25 lg:h-[72px] lg:w-[72px] text-white transition group-hover:border-[#58C7E8] group-hover:text-[#58C7E8]">
                <Icon size={26} strokeWidth={1.5} />
              </span>
              <span className="type-body mt-6 block break-words text-white transition group-hover:text-[#58C7E8]">{value}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
