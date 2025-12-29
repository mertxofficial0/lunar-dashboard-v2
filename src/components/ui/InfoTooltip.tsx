import InfoIcon from "../../icons/InfoIcon";

type InfoTooltipProps = {
  tooltip: string;
  iconSize?: number;
};

export default function InfoTooltip({
  tooltip,
  iconSize = 17,
}: InfoTooltipProps) {
  return (
    <div className="relative group w-[17px] h-[17px] flex items-center justify-center cursor-pointer shrink-0">
      {/* ICON */}
      <div className="opacity-50 group-hover:opacity-80">
        <InfoIcon size={iconSize} />
      </div>

      {/* TOOLTIP */}
      <div
        className="
          absolute
          left-full
          top-1/2
          -translate-y-2/2
          ml-3
          w-[300px]
          rounded-lg
          bg-white
          px-5 py-2
          text-[12px]
          text-slate-700
          shadow-[0_3px_10px_rgba(15,23,42,0.12)]
          pointer-events-none
          z-50

          opacity-0
          translate-x-1
          transition-all
          duration-200
          ease-out

          group-hover:opacity-100
          group-hover:translate-x-0
          group-hover:delay-[250ms]
        "
      >
        <div className="flex items-center gap-4">
          {/* ICON */}
          <div className="shrink-0 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
            <InfoIcon size={18} className="text-slate-500" />
          </div>

          {/* TEXT */}
          <div className="leading-snug font-semibold">
            {tooltip}
          </div>
        </div>
      </div>
    </div>
  );
}
