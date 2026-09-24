type CulturalMotifProps = {
  side?: "left" | "right";
  light?: boolean;
  pattern?: "scroll" | "woven";
};

// Decorative scrollwork follows the curling ornament in Hapakat's archived poster.
export function CulturalMotif({ side = "right", light = false, pattern = "scroll" }: CulturalMotifProps) {
  return <div className={`cultural-motif cultural-motif-${side} cultural-motif-${pattern}${light ? " cultural-motif-light" : ""}`} aria-hidden="true">
    <svg viewBox="0 0 260 260" fill="none" focusable="false">
      {pattern === "scroll" ? <>
        <circle className="cultural-motif-orbit" cx="130" cy="130" r="105" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 9" />
        <circle className="cultural-motif-orbit cultural-motif-orbit-inner" cx="130" cy="130" r="76" stroke="currentColor" strokeWidth="1" strokeDasharray="1 10" />
        <path className="cultural-motif-line" pathLength="100" d="M130 128C103 92 66 78 46 99C30 116 43 139 62 135C76 132 80 114 69 107C58 101 49 112 56 120" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path className="cultural-motif-line" pathLength="100" d="M130 128C157 92 194 78 214 99C230 116 217 139 198 135C184 132 180 114 191 107C202 101 211 112 204 120" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path className="cultural-motif-line" pathLength="100" d="M128 133C91 155 78 192 99 211C115 226 138 211 132 193C128 180 110 179 105 191C102 200 111 207 119 201" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path className="cultural-motif-line" pathLength="100" d="M132 133C169 155 182 192 161 211C145 226 122 211 128 193C132 180 150 179 155 191C158 200 149 207 141 201" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path className="cultural-motif-diamond" d="M130 39L148 65L130 91L112 65L130 39ZM130 116L142 130L130 144L118 130L130 116Z" fill="currentColor" />
        <circle cx="35" cy="168" r="4" fill="currentColor" />
        <circle cx="225" cy="168" r="4" fill="currentColor" />
        <circle cx="130" cy="236" r="4" fill="currentColor" />
      </> : <>
        <path className="cultural-motif-line" pathLength="100" d="M130 18L242 130L130 242L18 130Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path className="cultural-motif-line" pathLength="100" d="M130 48L212 130L130 212L48 130Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path className="cultural-motif-line" pathLength="100" d="M130 77L183 130L130 183L77 130Z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path className="cultural-motif-line" pathLength="100" d="M130 20V91M130 169V240M20 130H91M169 130H240" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path className="cultural-motif-diamond" d="M130 102L158 130L130 158L102 130Z" fill="currentColor" />
        <path d="M130 114L146 130L130 146L114 130Z" fill="#fff9ef" fillOpacity=".6" />
        <circle cx="130" cy="20" r="5" fill="currentColor" /><circle cx="240" cy="130" r="5" fill="currentColor" /><circle cx="130" cy="240" r="5" fill="currentColor" /><circle cx="20" cy="130" r="5" fill="currentColor" />
      </>}
    </svg>
  </div>;
}
