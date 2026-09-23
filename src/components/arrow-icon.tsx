type ArrowIconProps = {
  direction?: "up-right" | "right" | "left";
  className?: string;
};

export function ArrowIcon({ direction = "up-right", className }: ArrowIconProps) {
  const paths = {
    "up-right": <><path d="M5 19 19 5" /><path d="M8 5h11v11" /></>,
    right: <><path d="M4 12h16" /><path d="m13 5 7 7-7 7" /></>,
    left: <><path d="M20 12H4" /><path d="m11 5-7 7 7 7" /></>,
  };

  return <svg className={className ? `arrow-icon ${className}` : "arrow-icon"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{paths[direction]}</svg>;
}
