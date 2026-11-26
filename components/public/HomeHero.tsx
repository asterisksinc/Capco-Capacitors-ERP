/* eslint-disable @next/next/no-img-element */
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { PublicNav } from "./PublicChrome";
import styles from "./HomeHero.module.css";

const credentials = [
  ["4d004.svg", "BIS Certified", "IS:2993 / IS:13340"],
  ["ce085.svg", "ISO Quality", "9001:2008 Certified"],
  ["2ae83.svg", "CE Approved", "EU Export Standard"],
];

export type HeroAction = {
  label: string;
  href: string;
  /** Set to make the link a file download (e.g. a catalog PDF). */
  download?: string;
};

type HomeHeroProps = {
  id?: string;
  image?: string;
  imageAlt?: string;
  description?: ReactNode;
  tags?: string[];
  /** Two headline lines, each revealed with the line-mask animation. */
  title?: [string, string];
  primary?: HeroAction;
  secondary?: HeroAction;
  /** Colour of the angled cut at the bottom — match the next section's background. */
  cutColor?: string;
  /** Darken a bright photo so the white type stays readable. */
  overlay?: boolean;
};

function HeroButton({ action, icon, className }: { action: HeroAction; icon: string; className: string }) {
  const inner = (
    <>
      <span>{action.label}</span>
      <img src={`/figma/solutions/${icon}`} alt="" />
    </>
  );
  return action.download ? (
    <a href={action.href} download={action.download} className={className}>{inner}</a>
  ) : (
    <Link href={action.href} className={className}>{inner}</Link>
  );
}

/**
 * Full-bleed page hero. Defaults render the home page; the Solutions pages pass their own
 * copy so every hero shares the same type scale, buttons, credentials and entrance motion.
 */
export default function HomeHero({
  id = "home-title",
  image = "/figma/home/capco-hero.jpg",
  imageAlt = "CAPCO capacitor manufacturing floor with metallized film winding lines and finished capacitors",
  description = (
    <>
      BIS-certified motor run, PFC, lighting &amp; custom capacitors. In-house Leybold metallization, Metar winding, and 5,000+ dealers pan-India.
    </>
  ),
  tags = ["Vertically Integrated Since 1994"],
  title = ["India's Trusted Capacitor", "Manufacturer"],
  primary = { label: "Explore Products", href: "#solutions" },
  secondary = { label: "Request Quote", href: "/contact?category=oem#enquiry-form" },
  cutColor,
  overlay = false,
}: HomeHeroProps) {
  return (
    <section
      className={styles.hero}
      aria-labelledby={id}
      style={cutColor ? ({ "--hero-cut": cutColor } as CSSProperties) : undefined}
    >
      <div className={styles.background} data-hero-background>
        <Image src={image} alt={imageAlt} fill priority sizes="100vw" className={styles.image} />
      </div>
      {overlay && <div className={styles.overlay} aria-hidden="true" />}
      <PublicNav variant="overlay" />
      <div className={styles.content}>
        <p className={styles.description} data-reveal>{description}</p>
        <div className={styles.tags} data-reveal>
          {tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className={styles.divider} />
        <h1 id={id} className={styles.title}>
          <span className={styles.line}><span>{title[0]}</span></span>
          <span className={styles.line}><span>{title[1]}</span></span>
        </h1>
        <div className={styles.actions} data-reveal>
          <HeroButton action={primary} icon="490a3.svg" className={styles.button} />
          <HeroButton action={secondary} icon="5ec8a.svg" className={`${styles.button} ${styles.secondary}`} />
        </div>
        <div className={styles.credentials}>
          {credentials.map(([icon, title, detail]) => (
            <div className={styles.credential} key={title} data-reveal>
              <img src={`/figma/solutions/${icon}`} alt="" />
              <div><p>{title}</p><p>{detail}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
