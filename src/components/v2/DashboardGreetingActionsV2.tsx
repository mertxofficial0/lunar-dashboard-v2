import ImportTradesIcon from "../../icons/ImportTradesIcon";
import EditWidgetsIcon from "../../icons/EditWidgetsIcon";
function createRipple(
  e: React.MouseEvent<HTMLButtonElement>
) {
  const button = e.currentTarget;
  const rect = button.getBoundingClientRect();

  const ripple = document.createElement("span");

  const size = Math.max(rect.width, rect.height);
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;

  ripple.className = "ripple";

  button.appendChild(ripple);

  setTimeout(() => {
    ripple.remove();
  }, 500);
}

type Props = {
  greeting: string;
};

export default function DashboardGreetingActionsV2({ greeting }: Props) {
  return (
    <div className="mb-3 -mt-1">
      <div className="flex items-center justify-between">

        {/* LEFT – GREETING */}
        <div className="text-[15px] font-semibold text-slate-700">
          {greeting}!
        </div>

        {/* RIGHT – ACTIONS */}
        <div className="flex items-center gap-2">

          {/* LAST IMPORT */}
          <span className="text-[11px] text-slate-500 mr-1.5">
            Last import was made: NaN
          </span>

          {/* EDIT WIDGETS */}
          <button
  onClick={createRipple}
  className="
    relative overflow-hidden

    h-8.5
    px-3
    flex items-center gap-2
    rounded-lg
    border border-slate-200
    bg-white
    text-[13px] text-slate-700
    hover:bg-slate-50
    ripple-light
  "
>
  <EditWidgetsIcon size={18} />
  Edit Widgets
</button>


          {/* IMPORT TRADES */}
<button
  onClick={createRipple}
  className="
    relative overflow-hidden

    h-8.5
    px-3.5
    flex items-center gap-2
    rounded-lg
    text-[13px] text-white

    bg-gradient-to-b
    from-[#8d6cf0ff]
    to-[#7C3AED]

    hover:from-[#7f5fe6]
    hover:to-[#6D28D9]
  "
>
  <ImportTradesIcon size={18} />
  Import Trade
</button>




        </div>
      </div>
    </div>
  );
}