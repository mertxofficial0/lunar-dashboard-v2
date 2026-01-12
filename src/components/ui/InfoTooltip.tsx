import { useEffect, useRef, useState } from "react";
import InfoIcon from "../../icons/InfoIcon";

type InfoTooltipProps = {
  tooltip: string;
  iconSize?: number;
};

export default function InfoTooltip({
  tooltip,
  iconSize = 13,
}: InfoTooltipProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<
    "right" | "left" | "top" | "bottom"
  >("right");

  useEffect(() => {
    if (!wrapperRef.current || !tooltipRef.current) return;

    const wrapper = wrapperRef.current;
    const tooltip = tooltipRef.current;

    const handleMouseEnter = () => {
      const w = tooltip.getBoundingClientRect();
      const i = wrapper.getBoundingClientRect();

      const spaceRight = window.innerWidth - i.right;
      const spaceLeft = i.left;
      const spaceTop = i.top;
      

      if (spaceRight >= w.width + 12) {
        setPosition("right");
      } else if (spaceLeft >= w.width + 12) {
        setPosition("left");
      } else if (spaceTop >= w.height + 12) {
        setPosition("top");
      } else {
        setPosition("bottom");
      }
    };

    wrapper.addEventListener("mouseenter", handleMouseEnter);
    return () => wrapper.removeEventListener("mouseenter", handleMouseEnter);
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative group w-[17px] h-[17px] flex items-center justify-center cursor-pointer shrink-0"
    >
      {/* ICON */}
      <div className="opacity-50 group-hover:opacity-80 -translate-y-[0.8px]">
        <InfoIcon size={iconSize} />
      </div>

      {/* TOOLTIP */}
      <div
        ref={tooltipRef}
        className={`
          absolute
          w-[300px]
          rounded-lg
          bg-white
          px-3 py-1.5
          text-[11px]
          text-slate-700
          shadow-[0_3px_10px_rgba(15,23,42,0.12)]
          pointer-events-none
          z-50

          opacity-0
          transition-all
          duration-200
          ease-out

          group-hover:opacity-100
          group-hover:delay-[250ms]

          ${
            position === "right" &&
            "left-full top-1/2 -translate-y-1/2 ml-3 translate-x-1 group-hover:translate-x-0"
          }
          ${
            position === "left" &&
            "right-full top-1/2 -translate-y-1/2 mr-3 -translate-x-1 group-hover:translate-x-0"
          }
          ${
            position === "top" &&
            "bottom-full left-1/2 -translate-x-1/2 mb-3 translate-y-1 group-hover:translate-y-0"
          }
          ${
            position === "bottom" &&
            "top-full left-1/2 -translate-x-1/2 mt-3 -translate-y-1 group-hover:translate-y-0"
          }
        `}
      >
        <div className="flex items-center gap-4">
          <div className="shrink-0 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
            <InfoIcon size={17} className="text-slate-500" />
          </div>

          <div className="leading-snug font-medium">
            {tooltip}
          </div>
        </div>
      </div>
    </div>
  );
}
