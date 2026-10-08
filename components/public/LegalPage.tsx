import { PublicFooter, PublicNav } from "@/components/public/PublicChrome";

const legalCopy = {
  privacy: {
    title: "Privacy Policy",
    updated: "August 30, 2026",
    paragraphs: [
      "CAPCO Capacitors respects your privacy. We collect only the information needed to respond to enquiries, process dealer or OEM requests, provide product support, and improve the website experience.",
      "Information submitted through quote, newsletter, contact, or dealer forms may include your name, email, phone number, company, location, and product requirements. We use this information for legitimate business communication and service delivery.",
      "We may use analytics and basic technical logs to understand page performance, traffic sources, and security events. We do not sell personal information.",
      "Your information may be shared with service providers who help us host, secure, maintain, or operate this website, subject to reasonable confidentiality and data protection safeguards.",
      "You may contact us to request access, correction, or deletion of personal information where applicable. Policy updates take effect when posted on this page.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    updated: "August 30, 2026",
    paragraphs: [
      "By accessing or using this website, you agree to these Terms and Conditions. If you do not agree with any part of these terms, please do not use the site.",
      "All product details, specifications, catalog data, certification references, and application guidance are provided for general information. Final supply, suitability, pricing, and lead time depend on confirmed technical and commercial requirements.",
      "All content on this site, including text, graphics, logos, images, and software, is the property of CAPCO Capacitors or its licensors and is protected by applicable intellectual property laws.",
      "You may not reproduce, distribute, or create derivative works from this content without prior written consent. This site may include links to third-party websites; CAPCO is not responsible for their content or privacy practices.",
      "This site is provided on an as-is and as-available basis. To the fullest extent permitted by law, CAPCO disclaims warranties and will not be liable for indirect, incidental, or consequential damages arising from site use.",
    ],
  },
  cookies: {
    title: "Cookie Policy",
    updated: "August 30, 2026",
    paragraphs: [
      "This Cookie Policy explains how CAPCO Capacitors may use cookies and similar technologies to operate this website, remember preferences, measure usage, and improve performance.",
      "Essential cookies help the website load, route requests, secure sessions, and maintain basic functionality. These may be required for the site to work correctly.",
      "Analytics cookies, if enabled, help us understand aggregate visitor behavior such as page views, device type, and navigation paths. This helps us improve product information and enquiry flows.",
      "You can control cookies through your browser settings. Blocking some cookies may affect certain website features or form behavior.",
      "We may update this Cookie Policy from time to time as our website, tools, or legal requirements change.",
    ],
  },
};

export function LegalPage({ type }: { type: keyof typeof legalCopy }) {
  const page = legalCopy[type];

  return (
    <main className="min-h-screen bg-white text-[#121212]">
      <PublicNav />
      <section className="mx-auto grid max-w-[1800px] gap-8 px-6 py-24 lg:grid-cols-[54px_minmax(0,700px)_minmax(190px,0.5fr)] lg:px-[120px] lg:py-40">
        <aside className="hidden items-start gap-4 lg:flex">
          <div className="rotate-90 text-[10px] uppercase text-[#666]">Scroll</div>
          <div className="h-[560px] w-px bg-[#dedcd7]" />
        </aside>
        <article>
          <h1 className="text-[56px] font-normal leading-tight tracking-normal lg:text-[72px]">{page.title}</h1>
          <div className="mt-8 grid gap-5 text-sm font-medium leading-[1.35] tracking-normal">
            {page.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </article>
        <aside className="pt-3 text-left lg:text-right">
          <p className="text-[10px] uppercase text-[#666]">Last Updated</p>
          <p className="mt-2 text-xs">{page.updated}</p>
        </aside>
      </section>
      <PublicFooter ctaTitle="Ready to build?" ctaButton="Start a Project" />
    </main>
  );
}
