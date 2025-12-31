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
    <div className="mb-4 -mt-1">
      <div className="flex items-center justify-between">

        {/* LEFT – GREETING */}
        <div className="text-md font-semibold text-slate-700">
          {greeting}!
        </div>

        {/* RIGHT – ACTIONS */}
        <div className="flex items-center gap-2">

          {/* LAST IMPORT */}
          <span className="text-xs text-slate-500 mr-2">
            Last import was made: NaN
          </span>

          {/* EDIT WIDGETS */}
          <button
  onClick={createRipple}
  className="
    relative overflow-hidden

    h-9
    px-4
    flex items-center gap-2
    rounded-lg
    border border-slate-200
    bg-white
    text-sm text-slate-700
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

    h-9
    px-4
    flex items-center gap-2
    rounded-lg
    text-sm text-white

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