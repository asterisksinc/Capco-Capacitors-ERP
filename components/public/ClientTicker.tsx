"use client";

import { Pause, Play } from "lucide-react";
import { useState } from "react";
import { clientTickerLogos } from "./clientTickerLogos";
import styles from "./ClientTicker.module.css";

// Each group exceeds the 1,800px viewport so the loop stays filled on wide screens.
const logoSequence = [...clientTickerLogos, ...clientTickerLogos, ...clientTickerLogos];

export default function ClientTicker() {
  const [paused, setPaused] = useState(false);

  return (
    <section className={styles.ticker} aria-label="Client ticker" data-paused={paused}>
      <button
        type="button"
        className={styles.control}
        onClick={() => setPaused((value) => !value)}
        aria-label={paused ? "Resume client ticker" : "Pause client ticker"}
        aria-pressed={paused}
      >
        {paused ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      </button>

      <div className={styles.content}>
        <div className={styles.viewport} role="img" aria-label="Client logos">
          <div className={styles.logoTrack} aria-hidden="true">
            {[0, 1].map((copy) => (
              <div className={styles.logoGroup} key={copy}>
                {logoSequence.map((logo, index) => (
                  <svg
                    key={index}
                    viewBox={logo.viewBox}
                    height="22"
                    width={logo.width}
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    {logo.paths.map((path, pathIndex) => (
                      <path key={pathIndex} d={path} fillRule="evenodd" clipRule="evenodd" />
                    ))}
                  </svg>
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
