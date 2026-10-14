/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
import { PublicNav } from "./PublicChrome";
import styles from "./HomeHero.module.css";

const credentials = [
  ["4d004.svg", "BIS Certified", "IS:2993 / IS:13340"],
  ["ce085.svg", "ISO Quality", "9001:2008 Certified"],
  ["2ae83.svg", "CE Approved", "EU Export Standard"],
];

export default function HomeHero() {
  return (
    <section className={styles.hero} aria-labelledby="home-title">
      <div className={styles.background} data-hero-background>
        <Image src="/figma/solutions/22cfa.png" alt="" fill priority sizes="100vw" className={styles.image} />
      </div>
      <PublicNav variant="overlay" />
      <div className={styles.content}>
        <p className={styles.description} data-reveal>
          BIS-certified motor run, PFC, lighting &amp; custom capacitors. In-house Leybold metallization, Metar winding, and 500+ dealers pan-India.
        </p>
        <div className={styles.tags} data-reveal>
          <span>Vertically Integrated Since 1994</span>
        </div>
        <div className={styles.divider} />
        <h1 id="home-title" className={styles.title}>
          <span className={styles.line}><span>India&apos;s Trusted Capacitor</span></span>
          <span className={styles.line}><span>Manufacturer</span></span>
        </h1>
        <div className={styles.actions} data-reveal>
          <Link href="#solutions" className={styles.button}>
            <span>Explore Products</span>
            <img src="/figma/solutions/490a3.svg" alt="" />
          </Link>
          <Link href="/contact?category=oem#enquiry-form" className={`${styles.button} ${styles.secondary}`}>
            <span>Request Quote</span>
            <img src="/figma/solutions/5ec8a.svg" alt="" />
          </Link>
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
