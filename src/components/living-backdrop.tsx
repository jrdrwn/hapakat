type BackdropVariant = "home" | "gallery" | "guide" | "river" | "volunteer" | "heritage" | "about" | "story";

type LivingBackdropProps = {
  tone?: "light" | "dark";
  variant?: BackdropVariant;
};

const lines: Record<BackdropVariant, string[]> = {
  home: [
    "M-50 130C180 90 270 310 490 290S790 120 1050 160",
    "M-50 170C180 130 270 350 490 330S790 160 1050 200",
    "M-50 210C180 170 270 390 490 370S790 200 1050 240",
  ],
  gallery: [
    "M535 120h290v330H535z",
    "M565 95h290v330H565z",
    "M595 70h290v330H595z",
    "M595 180h290M595 290h290M595 400h290",
  ],
  guide: [
    "M480 185Q620 125 740 205Q860 125 1000 185V440Q850 370 740 455Q610 370 480 440Z",
    "M740 205v250",
    "M505 225Q625 175 715 235M505 270Q625 220 715 280M505 315Q625 265 715 325",
    "M765 235Q860 175 975 225M765 280Q860 220 975 270M765 325Q860 265 975 315",
  ],
  river: [
    "M-90 425C80 260 190 515 355 330S650 85 790 185S980 270 1090 95",
    "M-105 480C55 315 180 565 375 390S660 145 805 245S990 330 1100 145",
    "M-90 535C75 365 200 610 405 445S680 205 820 300S1005 385 1100 200",
  ],
  volunteer: [
    "M585 320L735 120L925 205L790 475L585 320Z",
    "M585 320L925 205M735 120L790 475",
    "M465 410L585 320M925 205L1060 110M790 475L905 570",
  ],
  heritage: [
    "M415 395H1080",
    "M500 300h175v190H500zM675 245h175v245H675zM850 190h175v300H850z",
    "M535 335h105M535 365h105M710 285h105M710 315h105M885 235h105M885 265h105",
  ],
  about: [
    "M785 310m-220 0a220 220 0 1 0 440 0a220 220 0 1 0-440 0",
    "M785 310m-160 0a160 160 0 1 0 320 0a160 160 0 1 0-320 0",
    "M785 310m-95 0a95 95 0 1 0 190 0a95 95 0 1 0-190 0",
    "M785 310L555 95M785 310L1010 120M785 310L1050 485M785 310L550 525",
  ],
  story: [
    "M525 170Q650 120 760 205Q870 120 995 170V450Q870 395 760 475Q650 395 525 450Z",
    "M760 205V475",
    "M560 210Q660 175 730 230M560 260Q660 225 730 280M560 310Q660 275 730 330",
  ],
};

/** Abstract shapes inspired by Hapakat's archive, with a different scene for each page. */
export function LivingBackdrop({ tone = "dark", variant = "river" }: LivingBackdropProps) {
  return (
    <div className={`living-backdrop living-backdrop-${tone} living-backdrop-${variant}`} aria-hidden="true">
      <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" focusable="false">
        <g className="living-current">
          {lines[variant].map((path) => <path className="living-backdrop-line" pathLength="100" d={path} key={path} />)}
        </g>
        {variant === "home" && <g className="living-rhythm">
          <path d="M760 115l70 70-70 70-70-70zM760 138l47 47-47 47-47-47zM930 350l36 36-36 36-36-36z" />
          <path d="M760 58v56m0 142v56m-127-127h55m143 0h55M930 315v34m0 73v34" />
          <circle cx="635" cy="405" r="5" /><circle cx="880" cy="78" r="4" />
        </g>}
        {variant === "gallery" && <g className="living-rhythm">
          <path d="M610 110h20m-20 60h20m-20 110h20m-20 110h20M850 110h20m-20 60h20m-20 110h20m-20 110h20" />
          <path d="M740 215l40 40-40 40-40-40zM740 225l30 30-30 30-30-30z" />
          <circle cx="475" cy="185" r="5" /><circle cx="930" cy="470" r="5" />
        </g>}
        {(variant === "guide" || variant === "story") && <g className="living-rhythm">
          <path d="M730 135l20 20-20 20-20-20zM920 465l26 26-26 26-26-26z" />
          <circle cx="505" cy="145" r="5" /><circle cx="975" cy="110" r="4" />
        </g>}
        {variant === "river" && <g className="living-rhythm">
          <circle cx="820" cy="260" r="66" /><circle cx="820" cy="260" r="105" /><circle cx="820" cy="260" r="146" />
          <circle cx="820" cy="260" r="7" /><circle cx="645" cy="95" r="5" /><circle cx="1000" cy="460" r="4" />
        </g>}
        {variant === "volunteer" && <g className="living-rhythm">
          <path d="M735 77l43 43-43 43-43-43zM925 162l43 43-43 43-43-43zM790 432l43 43-43 43-43-43zM585 277l43 43-43 43-43-43z" />
          <circle cx="735" cy="120" r="7" /><circle cx="925" cy="205" r="7" /><circle cx="790" cy="475" r="7" /><circle cx="585" cy="320" r="7" />
        </g>}
        {variant === "heritage" && <g className="living-rhythm">
          <circle cx="500" cy="395" r="12" /><circle cx="675" cy="395" r="12" /><circle cx="850" cy="395" r="12" />
          <path d="M415 355l-28 40 28 40M505 260l22-22 22 22M680 205l22-22 22 22M855 150l22-22 22 22" />
        </g>}
        {variant === "about" && <g className="living-rhythm">
          <path d="M785 235l75 75-75 75-75-75zM785 255l55 55-55 55-55-55z" />
          <circle cx="785" cy="310" r="10" /><circle cx="555" cy="95" r="5" /><circle cx="1050" cy="485" r="5" />
        </g>}
      </svg>
    </div>
  );
}
