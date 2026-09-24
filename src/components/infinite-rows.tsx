import type { CSSProperties, ReactNode } from "react";

export function InfiniteRows({ rows, duplicateRows, className = "", secondsPerItem = 12 }: { rows: [ReactNode[], ReactNode[]]; duplicateRows?: [ReactNode[], ReactNode[]]; className?: string; secondsPerItem?: number }) {
  return <div className={`infinite-rows ${className}`}>
    {rows.map((items, index) => <div className="infinite-row" key={index} style={{ "--marquee-duration": `${Math.max(36, items.length * secondsPerItem)}s` } as CSSProperties}>
      <div className="infinite-track">
        <div className="infinite-group">{items}</div>
        <div className="infinite-group" aria-hidden="true">{duplicateRows?.[index] ?? items}</div>
      </div>
    </div>)}
  </div>;
}
