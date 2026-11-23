"use client";

import type { ReactNode } from "react";

type CrossFadeProps<T> = {
  items: readonly T[];
  activeIndex: number;
  render: (item: T, index: number) => ReactNode;
  className?: string;
  slideClassName?: string;
};

/**
 * Stacks every slide in one grid cell so the container always has the height of
 * the tallest slide (no layout jump), then crossfades + slides between them.
 * Slides before the active one sit to the left, slides after it to the right,
 * so the motion direction follows next/previous naturally.
 */
export default function CrossFade<T>({ items, activeIndex, render, className = "", slideClassName = "" }: CrossFadeProps<T>) {
  return (
    <div className={`crossfade grid ${className}`}>
      {items.map((item, index) => {
        const state = index === activeIndex ? "active" : index < activeIndex ? "before" : "after";
        return (
          <div
            key={index}
            data-slide={state}
            aria-hidden={state !== "active"}
            inert={state !== "active"}
            className={`crossfade-slide [grid-area:1/1] ${slideClassName}`}
          >
            {render(item, index)}
          </div>
        );
      })}
    </div>
  );
}
