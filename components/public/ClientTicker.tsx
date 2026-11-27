"use client";

import Image from "next/image";
import { clientTickerLogos } from "./clientTickerLogos";
import styles from "./ClientTicker.module.css";

export default function ClientTicker() {
  return (
    <section className={styles.ticker} aria-label="Client ticker">
      <div className={styles.content}>
        <div className={styles.viewport}>
          <div className={styles.logoTrack}>
            {[0, 1].map((copy) => (
              <div className={styles.logoGroup} key={copy} aria-hidden={copy === 1 ? true : undefined}>
                {clientTickerLogos.map((logo) => (
                  <div className={styles.logoFrame} key={logo.src}>
                    <Image
                      src={logo.src}
                      alt={copy === 0 ? logo.alt : ""}
                      width={logo.width}
                      height={logo.height}
                      sizes="120px"
                      loading="eager"
                      unoptimized={logo.src.endsWith(".gif")}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.ruler} aria-hidden="true">
          <div className={styles.rulerTrack}>
            {Array.from({ length: 160 }, (_, index) => (
              <span
                className={index % 5 === 0 ? styles.majorTick : styles.minorTick}
                key={index}
              />
            ))}
          </div>
          <span className={styles.marker} />
          <span className={styles.pointer} />
        </div>
      </div>
    </section>
  );
}
