import NotificationBellIcon from "../../icons/NotificationBellIcon";
import CurrentDollarIcon from "../../icons/CurrentDollarIcon";
import BrokerWalletIcon from "../../icons/BrokerWalletIcon";
import CalendarRangeIcon from "../../icons/CalendarRangeIcon";
export default function DashboardHeaderV2() {
  return (
    <div
      className="
        sticky top-0 z-40
        bg-white
        px-5 py-2
        flex items-center justify-between
        shadow-[0_1px_5px_rgba(15,23,42,0.06)]
      "
    >

      {/* LEFT */}
      <h1 className="text-lg font-semibold text-slate-900">
        Dashboard
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {/* CURRENCY ($) */}
        <button
          className="
            w-9 h-9
            flex items-center justify-center
            rounded-full
            border border-slate-200
            bg-white
            hover:bg-slate-50
          "
        >
          <CurrentDollarIcon size={25} />
        </button>

        {/* DATE RANGE */}
        <button
          className="
            h-9
            flex items-center gap-2
            px-4
            rounded-full
            border border-slate-200
            bg-white
            hover:bg-slate-50
            text-sm text-slate-700
          "
        >
          {/* CALENDAR ICON */}
          <CalendarRangeIcon size={20} />

          <span>Jul 11, 2025 - Aug 10, 2025</span>

          

          {/* CHEVRON */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="#64748B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* BROKER SELECT */}
        <button
          className="
            h-9
            flex items-center gap-2
            px-4
            rounded-full
            border border-slate-200
            bg-white
            hover:bg-slate-50
            text-sm text-slate-700
          "
        >
          <BrokerWalletIcon size={20} />
          <span>2023 TradingUA</span>

          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="#64748B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* NOTIFICATION */}
        <button
          className="
            w-10 h-10
            flex items-center justify-center
            rounded-full
            border border-slate-200
            bg-white
            hover:bg-slate-50
          "
        >
          <NotificationBellIcon size={30} />
        </button>

      </div>
    </div>
  );
}
