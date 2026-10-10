"use client";

/* Figma SVG files are kept as external assets so their original dimensions and paths are preserved. */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PublicNav } from "@/components/public/PublicChrome";
import { capabilities, industrialFaqs, industrialServices, journeyCards, oemFaqs, processSteps, productCategories, stories } from "@/lib/solutionContent";
import styles from "./SolutionPage.module.css";

const asset = (name: string) => `/figma/solutions/${name}`;
const enquiry = (subject: string) => `mailto:sales@capcocapacitor.com?subject=${encodeURIComponent(subject)}`;
const background = (name: string): CSSProperties => ({ backgroundImage: `url("${asset(name)}")` });

function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <img src={asset(name)} alt="" aria-hidden="true" className={className} />;
}

function Eyebrow({ children, green = false }: { children: ReactNode; green?: boolean }) {
  return <p className={`${styles.eyebrow} ${green ? styles.green : ""}`}>{children}</p>;
}

function Button({ children, href, shape = "e54ee.svg", icon = "490a3.svg", className = "", download }: {
  children: ReactNode; href: string; shape?: string; icon?: string | false; className?: string; download?: string;
}) {
  return <a href={href} download={download} className={`${styles.button} ${className}`} style={background(shape)}>
    <span>{children}</span>{icon && <Icon name={icon} />}
  </a>;
}

function Hero({ industrial }: { industrial: boolean }) {
  return <section className={styles.hero} aria-labelledby="solution-title">
    <Image src={asset(industrial ? "22cfa.png" : "66dd5.png")} alt="" fill priority sizes="100vw" className={styles.heroImage} />
    <PublicNav variant="overlay" logoSrc={asset("caef4.png")} className={styles.nav} />
    <p className={styles.heroIntro}>{industrial
      ? "CAPCO provides power factor audits, APFC panel integration support, and bulk capacitor supply (0.5–25 KVAR, up to 150 KVAR banks) for industrial buyers seeking to reduce electricity demand charges, improve voltage stability, and minimize equipment downtime."
      : "Co-engineered capacitor solutions, vertically integrated manufacturing, and dedicated support for India's leading equipment manufacturers."}</p>
    <div className={styles.heroContent}>
      <div className={styles.heroEyebrows}>
        <Eyebrow>{industrial ? "REDUCE ENERGY COSTS" : "5,000+ AUTHORISED DEALERS"}</Eyebrow>
        <Eyebrow>{industrial ? "IMPROVE POWER QUALITY" : "20+ STATES COVERED"}</Eyebrow>
      </div>
      <div className={styles.heroRule} />
      <h1 id="solution-title">{industrial ? <>Industrial Power Factor<br />Correction Solutions</> : <>Your Strategic OEM<br />Capacitor Partner</>}</h1>
      <div className={styles.heroButtons}>
        <Button href={enquiry(industrial ? "Request Power Audit" : "Schedule Technical Consultation")} shape={industrial ? "e54ee.svg" : "96422.svg"} className={industrial ? "" : styles.consultButton}>
          {industrial ? "Request Power Audit" : "Schedule Technical Consultation"}
        </Button>
        <Button href={industrial ? enquiry("Request Bulk Quote") : "#oem-overview"} shape="9dc25.svg" icon="5ec8a.svg">
          {industrial ? "Request Bulk Quote" : "View OEM"}
        </Button>
      </div>
    </div>
    <div className={styles.certifications}>
      {[["4d004.svg", "BIS Mark", "IS:2993 / IS:13340"], ["ce085.svg", "ISO Quality", "9001:2008 Certified"], ["2ae83.svg", "CE Approved", "EU Export Standard"]].map(([icon, title, body]) =>
        <div className={styles.certification} key={title}><Icon name={icon} /><div><span>{title}</span><p>{body}</p></div></div>)}
    </div>
  </section>;
}

function OemOverview() {
  const [active, setActive] = useState<number | null>(0);
  return <section id="oem-overview" className={styles.overview}>
    <div className={styles.overviewHeading}>
      <div><Eyebrow>30+ Years of OEM Trust</Eyebrow><h2>Built for Equipment<br />Manufacturers</h2></div>
      <p>CAPCO partners with HVAC, TPW Fan Manufacturers, Moto &amp; Panel appliance, and industrial equipment OEMs to deliver custom capacitor solutions that meet exact technical specifications, compliance requirements, and production timelines.</p>
    </div>
    <div className={styles.benefits}>
      <div className={styles.benefitsImage}><Image src={asset("15515.png")} alt="CAPCO Leybold metallization equipment and manufacturing team" fill sizes="(max-width: 800px) 100vw, 44vw" /></div>
      <div className={styles.benefitsContent}>
        <div className={styles.capabilities}>
          {capabilities.map((item, index) => <div key={item.title} className={active === index ? styles.capabilityActive : ""}>
            <h3><button type="button" aria-expanded={active === index} aria-controls={`capability-${index}`} onClick={() => setActive(active === index ? null : index)}>
              {item.title}<span><Icon name={active === index ? "3c9d6.svg" : "a3fb3.svg"} /></span>
            </button></h3>
            <div id={`capability-${index}`} hidden={active !== index}><p>{item.body}</p></div>
          </div>)}
        </div>
        <Button href={enquiry("Start Co-Engineering Project")} shape="96e0b.svg" icon="24503.svg" className={styles.overviewButton}>Start Co-Engineering Project</Button>
      </div>
    </div>
  </section>;
}

function DevelopmentProcess() {
  return <section className={styles.process}>
    <div className={styles.processHeading}><Eyebrow green>Collaborative Development Process</Eyebrow><h2>Dedicated Support for<br />Production Success</h2>
      <Button href={enquiry("Start Co-Engineering Project")} shape="56a75.svg" icon="a5437.svg" className={styles.processButton}>Start Co-Engineering Project</Button>
    </div>
    <ol className={styles.processList}>
      {processSteps.map((step, index) => <li key={step.title}>
        <div className={styles.numberCard}><span className={styles.dial} style={background(step.dial)} /><span>{String(index + 1).padStart(2, "0")}</span></div>
        <div className={styles.processCard}><span className={styles.stepLabel}>STEP {String(index + 1).padStart(2, "0")}</span><div><h3>{step.title}</h3><p>{step.body}</p></div></div>
      </li>)}
    </ol>
  </section>;
}

function PartnerStrip() {
  return <div className={styles.partners} aria-label="Partner network">{Array.from({ length: 5 }, (_, index) => <div key={index}><Icon name="bc3ed.svg" /></div>)}</div>;
}

function SuccessStories() {
  const track = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => { if (selected !== null) dialog.current?.showModal(); }, [selected]);
  function go(direction: number) {
    const element = track.current;
    const card = element?.firstElementChild as HTMLElement | null;
    if (element && card) element.scrollBy({ left: direction * (card.offsetWidth + parseFloat(getComputedStyle(element).columnGap)), behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }
  return <section id="success-stories" className={styles.stories} aria-label="OEM success stories">
    <div className={styles.storiesHeading}><div><Eyebrow green>Proven Partnerships</Eyebrow><h2>OEM Success Stories</h2></div>
      <div className={styles.carouselControls}><span aria-live="polite">{String(current + 1).padStart(2, "0")}/04</span><div>
        <button type="button" aria-label="Previous success story" disabled={current === 0} onClick={() => go(-1)}><Icon name="a96fb.svg" /></button>
        <button type="button" aria-label="Next success story" disabled={current === stories.length - 1} onClick={() => go(1)}><Icon name="3aa7c.svg" /></button>
      </div></div>
    </div>
    <div ref={track} className={styles.storyTrack} onScroll={() => {
      const element = track.current;
      const card = element?.firstElementChild as HTMLElement | null;
      if (element && card) setCurrent(Math.min(stories.length - 1, Math.round(element.scrollLeft / (card.offsetWidth + parseFloat(getComputedStyle(element).columnGap)))));
    }}>
      {stories.map((story, index) => <article className={styles.storyCard} key={story.title}>
        <Image src={asset(story.image)} alt={story.title} fill sizes="(max-width: 800px) 90vw, 79vw" />
        <div className={styles.storyShade} />
        <button type="button" className={styles.storyTitle} onClick={() => setSelected(index)}><span>{story.eyebrow}</span><h3>{story.title}</h3></button>
        <div className={styles.storyStats}><div>{story.stats.map(([label, value]) => <div key={label}><span>[{label}]</span><strong>{value}</strong></div>)}</div><p>{story.body}</p></div>
      </article>)}
    </div>
    <dialog ref={dialog} className={styles.storyDialog} onClose={() => setSelected(null)} aria-labelledby="story-dialog-title" onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      {selected !== null && <><button type="button" className={styles.dialogClose} aria-label="Close success story" onClick={() => dialog.current?.close()}>×</button><Image src={asset(stories[selected].image)} alt="" width={1000} height={560} /><div><Eyebrow>Success Story</Eyebrow><h2 id="story-dialog-title">{stories[selected].title}</h2><p>{stories[selected].body}</p><Button href={enquiry(stories[selected].title)}>Discuss Your Project</Button></div></>}
    </dialog>
  </section>;
}

function ProductCategories() {
  return <section id="product-categories" className={styles.products}>
    <div className={styles.sectionHeading}><div><Eyebrow>COMPLETE CAPACITOR SOLUTIONS</Eyebrow><h2>Browse by Product Category</h2></div>
      <Button href="/catalogs/capco-product-catalog.pdf" download="CAPCO-Product-Catalog.pdf" shape="cf072.svg" icon="4e858.svg" className={styles.catalogButton}>Download Complete Catalog (PDF)</Button>
    </div>
    <div className={styles.productGrid}>{productCategories.map(product => <article className={styles.productCard} key={product.code} style={background("f4e6e.svg")}>
      <div className={styles.productMeta}><span style={product.tagAsset ? background(product.tagAsset) : undefined}>{product.tag}</span><span>{product.code}</span></div>
      <h3>{product.title}</h3><p>{product.body}</p>
      <dl>{product.specs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
      <Button href={`/products/${product.slug}`} shape={product.buttonAsset} icon="a9bc9.svg" className={styles.productButton}>{product.cta}</Button>
    </article>)}</div>
  </section>;
}

function IndustrialIntro() {
  return <>
    <section className={styles.industrialIntro}><div className={styles.introRule} /><div className={styles.overviewHeading}>
      <div><Eyebrow>THE COST OF POOR POWER FACTOR</Eyebrow><h2>Are You Paying Penalty Charges for Low Power Factor?</h2></div>
      <p>Most industrial facilities in India operate at a power factor of 0.75–0.85, well below the 0.95 threshold required by most state electricity boards.</p>
    </div></section>
    <div className={styles.penaltyTrack} tabIndex={0} role="region" aria-label="Power factor insights. Scroll for more.">
      {[
        { image: "2f1e3.png", icon: "1856e.svg", title: "Power Factor Penalties", body: "Facilities operating below 0.95 power factor face penalty charges of ₹1–3 per KVA of reactive power, adding significant costs to monthly electricity bills.", cta: "₹5–20 Lakhs Annual Penalty" },
        { image: "f5300.png", icon: "cbe03.svg", title: "Success Stories", body: "See how OEMs, dealers, and industrial buyers achieved cost savings, efficiency gains, and growth with CAPCO capacitors.", cta: "View Case Studies", href: "#success-stories" },
        { image: "17639.png", icon: "10f24.svg", title: "Industry Trends & Best Practices", body: "Power factor correction guides, capacitor selection tips, and updates on Indian electrical manufacturing.", cta: "Read Latest Insights", href: "/#projects" },
      ].map(card => <article key={card.title} className={styles.penaltyCard}>
        <Image src={asset(card.image)} alt={card.title} fill sizes="(max-width: 800px) 90vw, 79vw" /><div className={styles.storyShade} />
        <div className={styles.penaltyTitle}><Icon name={card.icon} /><h3>{card.title}</h3></div>
        <div className={styles.penaltyCopy}><p>{card.body}</p>{card.href ? <Button href={card.href} shape="b15ce.svg" icon="36370.svg">{card.cta}</Button> : <strong>{card.cta}</strong>}</div>
      </article>)}
    </div>
  </>;
}

function IndustrialServices() {
  return <section className={styles.services}>
    <div className={styles.sectionHeading}><div><Eyebrow>OUR SOLUTIONS</Eyebrow><h2>Three Ways Capco Helps<br />Industrial Buyers</h2></div><Button href={enquiry("Request Power Audit")} shape="cf072.svg" icon={false} className={styles.catalogButton}>Request Power Audit</Button></div>
    <div className={styles.serviceList}>{industrialServices.map(service => <article key={service.title} className={styles.serviceRow}>
      <div className={styles.serviceLabel}><span>{service.label}</span><i /></div>
      <div className={styles.serviceCard} style={background("e5d60.svg")}><Icon name={service.icon} /><h3>{service.title}</h3><p>{service.body}</p><div className={styles.serviceActions}>
        <Button href={enquiry(service.cta)} shape="a40dc.svg" icon={false} className={styles.serviceButton}>{service.cta}</Button><span>{service.note}</span>
      </div></div>
    </article>)}</div>
  </section>;
}

const locations = [
  { name: "Bell Junction", type: "Operating site", detail: "West Texas · ERCOT", body: "Standalone storage dispatching into ERCOT West. Containerized LFP, energized and operated by Anode from first dispatch.", x: 30, y: 56, icon: "6261e.svg" },
  { name: "Cedar Bayou", type: "Operating site", detail: "Site location", body: "Explore the operating network and contact our team for more information.", x: 42, y: 68, icon: "a1758.svg" },
  { name: "Marfa Flats", type: "Operating site", detail: "Site location", body: "Standalone storage on a constrained node, cycling twice daily against congestion.", x: 22, y: 72, icon: "a1758.svg" },
  { name: "Salt Fork", type: "Operating site", detail: "Site location", body: "First fleet site to complete a full augmentation cycle with no measured capacity shortfall.", x: 36, y: 46, icon: "a1758.svg" },
  { name: "Dallas HQ", type: "Office", detail: "Office location", body: "Contact the team for information about this location.", x: 52, y: 58, icon: "8200f.svg" },
  { name: "Austin", type: "Office", detail: "Office location", body: "Contact the team for information about this location.", x: 47, y: 78, icon: "8200f.svg" },
  { name: "Rotterdam", type: "In development", detail: "Development location", body: "Contact the team for information about this location.", x: 66, y: 44, icon: "ab167.svg" },
  { name: "Adelaide", type: "In development", detail: "Development location", body: "Contact the team for information about this location.", x: 82, y: 72, icon: "ab167.svg" },
  { name: "Santiago", type: "In development", detail: "Development location", body: "Contact the team for information about this location.", x: 62, y: 88, icon: "ab167.svg" },
];

function Footprint() {
  const [active, setActive] = useState(0);
  const location = locations[active];
  return <section className={styles.footprint} aria-label="Global footprint">
    <Image src={asset("caf7c.png")} alt="" fill sizes="100vw" className={styles.mapImage} />
    <div className={styles.mapOverlay} />
    <div className={styles.mapHeading}><Eyebrow green>Global Footprint</Eyebrow><h2>Where We Operate</h2></div>
    {locations.map((item, index) => <button type="button" key={item.name} className={`${styles.mapMarker} ${index === active ? styles.activeMarker : ""}`} style={{ left: `${item.x}%`, top: `${item.y}%` }} aria-label={item.name} aria-pressed={active === index} onClick={() => setActive(index)}><Icon name={item.icon} /></button>)}
    <div className={styles.mapPopup} style={{ left: `${Math.min(location.x + 1.35, 73)}%`, top: `${Math.max(location.y - 22, 30)}%` }} aria-live="polite"><small>{location.type}</small><h3>{location.name}</h3><span>{location.detail}</span><p>{location.body}</p></div>
    <div className={styles.mapLegend}><div>{[["501a6.svg", "Operating site"], ["e1fc2.svg", "Office"], ["3e93b.svg", "In development"]].map(([icon, label]) => <span key={label}><Icon name={icon} />{label}</span>)}</div><span>{String(active + 1).padStart(2, "0")}/09</span></div>
  </section>;
}

function Journey() {
  return <section className={styles.journey}>
    <Eyebrow>Ready to Partner?</Eyebrow><h2>Start Your OEM Journey<br />with Capco Capacitors</h2>
    <div className={styles.journeyGrid}>{journeyCards.map(card => <article key={card.title}><div><Image src={asset(card.image)} alt={card.title} fill sizes="(max-width: 800px) 100vw, 31vw" /></div><h3>{card.title}</h3><p>{card.body}</p></article>)}</div>
    <Button href={enquiry("Schedule Technical Consultation")} shape="9a91f.svg" icon="24503.svg" className={styles.journeyButton}>Schedule Technical Consultation</Button>
  </section>;
}

function Faqs({ industrial }: { industrial: boolean }) {
  return <section className={styles.faqs}><Eyebrow>{industrial ? "Quick Answers" : "OEM Partnership Clarity"}</Eyebrow><h2>{industrial ? "Everything You Need to Know" : "Frequently Asked Questions"}</h2>
    <div className={styles.faqList}>{(industrial ? industrialFaqs : oemFaqs).map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true" /></summary><p>{item.answer} <a href={enquiry(item.question)}>Contact our team →</a></p></details>)}</div>
  </section>;
}

function Facilities() {
  return <section className={styles.facilities}><Eyebrow>LOCATIONS</Eyebrow><h2>Plant Facilities</h2>
    <div className={styles.facilityImage}>
      <Image src={asset("2f1e3.png")} alt="" fill sizes="94vw" />
      <Image src={asset("5fe3a.png")} alt="DADA Energies manufacturing facilities" fill sizes="94vw" />
      <div className={styles.facilityAddress}><p>DADA ENERGIES (P) LTD. E54 to E77, TSIIC Automotive Park, Muppireddypally Village, Manoharabad Mandal, Medak District, Hyderabad, Telangana - 502336.</p>
        <Button href="https://www.google.com/maps/search/?api=1&query=DADA+ENERGIES+TSIIC+Automotive+Park+Muppireddypally+Telangana+502336" shape="8435a.svg" icon="38a25.svg" className={styles.directionsButton}>Get Directions on Google Maps</Button>
      </div>
    </div>
    <div className={styles.contactDesks}><a href="tel:+919848014000"><span>COMMERCIAL DESK PHONE</span><i><Icon name="45042.svg" /></i><p>+91 98480 14000</p></a><a href="mailto:sales@capcocapacitor.com"><span>DEPARTMENT EMAIL DESK</span><i><Icon name="1a3aa.svg" /></i><p>sales@capcocapacitor.com</p></a></div>
  </section>;
}

function SolutionFooter({ industrial }: { industrial: boolean }) {
  return <>
    <section id="contact" className={styles.contactCta}>
      <div className={styles.ctaRings} aria-hidden="true"><span /><span /><span /><div style={background("527c0.svg")} /><div style={background("9c1db.svg")} /></div>
      <div className={styles.ctaContent}><h2>{industrial ? "Join 5,000+ Successful CAPCO Dealers" : "Ready to Partner?"}</h2>
        <p>{industrial ? "Whether you're a regional distributor or a specialized industrial supplier, CAPCO gives you the range, margins, marketing support, and trusted supply to grow your business profitably." : "Whether you need a single custom capacitor or a complete supply chain partnership, our OEM team is ready to support your requirements with technical expertise, competitive pricing, and reliable delivery."}</p>
        <Button href={enquiry(industrial ? "Apply for Dealership" : "Request OEM Pricing")} shape="ad979.svg" icon="24503.svg">{industrial ? "Apply for Dealership" : "Request OEM Pricing"}</Button>
      </div>
    </section>
    <footer className={styles.footer} style={background("a62f2.png")}>
      <div className={styles.footerTop}><div className={styles.newsletter}><h3>{industrial ? "Talk with an expert at Anode" : "Join our Newsletter"}</h3>
        <form onSubmit={event => { event.preventDefault(); const form = new FormData(event.currentTarget); window.location.href = `${enquiry("Newsletter enquiry")}&body=${encodeURIComponent(`Please send newsletter information to ${form.get("email")}.`)}`; }}><input type="email" name="email" required aria-label="Email address for newsletter" placeholder="Your email" /><button type="submit">Sign Up</button></form>
      </div><div className={styles.footerLinks}>
        {[
          { title: "Company", links: [["Home", "/"], ["About", "/#why"], ["Gallery", "/#projects"], ["Awards & Achievements", "/#why"], ["Careers", enquiry("Careers")], ["Contact", "#contact"]] },
          { title: "Solutions", links: [["OEMs", "/solutions/oem"], ["Dealership", "/solutions/dealership"], ["B2D Marketing Landing Page", "/solutions/dealership"], ["Industrial Enquiry", enquiry("Industrial Enquiry")]] },
          { title: "Global Footprint", links: ["UAE", "USA", "Sri Lanka", "Bangladesh", "Turkey", "African Continent", "Egypt"].map(label => [label, enquiry(`${label} enquiry`)]) },
          { title: "Media", links: [["Newsroom", "/#projects"], ["Corporate Social Responsibility", "/#why"], ["Awards", "/#why"], ["Certifications", "/#why"]] },
          { title: "Social", links: ["Instagram", "LinkedIn", "Facebook", "YouTube"].map(label => [label, enquiry(`${label} contact`)]) },
          { title: "Contact", links: ["Instagram", "LinkedIn", "Facebook", "YouTube"].map(label => [label, enquiry(`${label} contact`)]) },
        ].map(group => <div key={group.title}><p>{group.title}</p>{group.links.map(([label, href]) => <Link href={href} key={label}>{label}</Link>)}</div>)}
      </div></div>
      <div className={styles.footerBottom}><Link href="/" aria-label="CAPCO home">{industrial ? <Icon name="75083.svg" /> : <Image src={asset("caef4.png")} alt="CAPCO" width={95} height={34} />}</Link><span>©2026 Capco Capacitors</span><div><Link href="/privacy-policy">Privacy Policy</Link><Link href="/terms-and-conditions">Terms &amp; Conditions</Link></div><span>All Rights Reserved. <span>Website by Asterisk.Inc</span></span></div>
    </footer>
  </>;
}

export function SolutionPage({ variant }: { variant: "oem" | "industrial" }) {
  const industrial = variant === "industrial";
  return <main className={styles.page} data-variant={variant}>
    <Hero industrial={industrial} />
    {industrial ? <><IndustrialIntro /><IndustrialServices /></> : <><OemOverview /><DevelopmentProcess /></>}
    <PartnerStrip />
    {industrial ? <><ProductCategories /><SuccessStories /><Faqs industrial /><Footprint /><Facilities /></> : <><SuccessStories /><ProductCategories /><Footprint /><Journey /><Faqs industrial={false} /></>}
    <SolutionFooter industrial={industrial} />
  </main>;
}
