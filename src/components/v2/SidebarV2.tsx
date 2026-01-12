import { useState } from "react";

import DailyJournalIcon from "../../icons/DailyJournalIcon";
import DashboardIcon from "../../icons/DashboardIcon";
import TradeLogIcon from "../../icons/TradeLogIcon";
import ReportsIcon from "../../icons/ReportsIcon";
import InsightsIcon from "../../icons/InsightsIcon";
import UniversityIcon from "../../icons/UniversityIcon";
import NotebookIcon from "../../icons/NotebookIcon";
import ChallengesIcon from "../../icons/ChallengesIcon";
import TradeReplayIcon from "../../icons/TradeReplayIcon";
import MentorModeIcon from "../../icons/MentorModeIcon";
import SidebarToggleIcon from "../../icons/SidebarToggleIcon";

/* ================================
   SIDEBAR V2 – SEQUENCED ANIMATION
================================ */

export default function SidebarV2() {
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const [collapsed, setCollapsed] = useState(true);
  const [contentHidden, setContentHidden] = useState(false);

  const toggleSidebar = () => {
    // 1️⃣ önce içerik kaybolsun
    setContentHidden(true);

    // 2️⃣ sonra sidebar width değişsin
    setTimeout(() => {
      setCollapsed((prev) => !prev);
    }, 120);

    // 3️⃣ yeni içerik slide-up ile gelsin
    setTimeout(() => {
      setContentHidden(false);
    }, 260);
  };

  return (
    <aside
  className={`
    h-screen flex flex-col text-white
    bg-[#231d2c]
    transition-[width] duration-300 ease-in-out
    ${collapsed ? "w-[60px]" : "w-[210px]"}

  `}
>
  {/* LOGO */}
  <div className="px-6 pt-1 pb-3 relative h-[80px] overflow-hidden">
    {/* LARGE LOGO */}
    {!collapsed && (
      <img
        src="/lunar-sidebar-logo11.png"
        alt="Trade Lunar"
        className={`
          absolute inset-0 m-auto max-w-[160px] h-auto
          transition-all duration-200 ease-out
          ${
            contentHidden
              ? "opacity-0 translate-y-3"
              : "opacity-100 translate-y-0"
          }
        `}
      />
    )}

    {/* SMALL LOGO */}
    {collapsed && (
      <img
        src="/lunarejder.png"
        alt="Lunar"
        className={`
          absolute inset-0 m-auto w-[38px] h-[38px]
          transition-all duration-200 ease-out
          ${
            contentHidden
              ? "opacity-0 translate-y-3"
              : "opacity-100 translate-y-0"
          }
        `}
      />
    )}
  </div>

      {/* ADD TRADE */}
      <div className="px-2.5 pb-5 overflow-hidden">
        {!collapsed ? (
          <button
            className={`
              w-full py-2 rounded-lg
              bg-[#6d5bd0] hover:bg-[#7c6be6]
              text-[12px] font-medium
              transition-all duration-200 ease-out
              ${
                contentHidden
                  ? "opacity-0 translate-y-3"
                  : "opacity-100 translate-y-0"
              }
            `}
          >
            + Add Trade
          </button>
        ) : (
          <button
            className={`
              w-full py-1.5 rounded-lg
              bg-[#6d5bd0] hover:bg-[#7c6be6]
              flex items-center justify-center
              transition-all duration-200 ease-out
              ${
                contentHidden
                  ? "opacity-0 translate-y-3"
                  : "opacity-100 translate-y-0"
              }
            `}
          >
            <span className="font-bold text-lg">+</span>
          </button>
        )}
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 text-[12px] space-y-1 overflow-hidden">
        {[
  ["Dashboard", <DashboardIcon />],
  ["Daily Journal", <DailyJournalIcon />],
  ["Trade Logs", <TradeLogIcon />],
  ["Reports", <ReportsIcon />],
  ["Insights", <InsightsIcon />],
  ["University", <UniversityIcon />],
  ["Notebook", <NotebookIcon />],
  ["Challenges", <ChallengesIcon />],
  ["Trade Replay", <TradeReplayIcon />],
  ["Mentor Mode", <MentorModeIcon />],
].map(([label, icon]) => {
  const isSelected = selectedItem === label;

  return (
    <div
      key={label as string}
      onClick={() => setSelectedItem(label as string)}
      className={`
  relative
  flex items-center
  py-[7.5px]
  ${collapsed ? "justify-center px-0" : "gap-3 px-4"}
  rounded-lg
  cursor-pointer

  transition-all
  duration-200
  ease-out

  ${isSelected
    ? "bg-white/18 text-white"
    : "text-white/80 hover:bg-white/5 hover:translate-x-[2px]"
  }

  ${contentHidden ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}
`}

    >
      <div className="w-[20px] min-w-[20px] h-[20px] flex items-center justify-center rounded-md">
        {icon}
      </div>

      {!collapsed && (
        <span className="whitespace-nowrap">{label as string}</span>
      )}
    </div>
  );
})}

      </nav>

      {/* PROFILE */}
      <div className="px-2 pb-0 overflow-hidden">
        {!collapsed && (
          <div
            className={`
              flex items-center gap-3 p-3 rounded-lg
              transition-all duration-200 ease-out
              ${
                contentHidden
                  ? "opacity-0 translate-y-3"
                  : "opacity-100 translate-y-0"
              }
            `}
          >
            <div className="w-9 h-9 rounded-full bg-violet-500 flex items-center justify-center text-sm font-semibold">
              M
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[12px] text-white font-medium">
                Mert Zengin
              </span>
              <span className="text-[9px] text-white/50">
                mertxofficial0@gmail.com
              </span>
            </div>
          </div>
        )}
      </div>
{collapsed && (
  <div
    className={`
      flex justify-center pb-4
      transition-all duration-200 ease-out
      ${contentHidden ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"}
    `}
  >
    <div
  className="
    w-9 h-9 rounded-full
    bg-violet-600
    flex items-center justify-center
    text-sm font-semibold text-white
    cursor-pointer
    hover:ring-2 hover:ring-violet-400/60
    transition
  "
>
  M
</div>

  </div>
)}

      {/* COLLAPSE BUTTON */}
      <div className="px-3 pb-2.5">
  <button
  onClick={toggleSidebar}
  className="
    w-full py-1.5 rounded-lg
    text-white/70
    bg-white/10
    hover:bg-white/20
    hover:text-white
    transition-all duration-200 ease-out
    text-sm
    flex items-center justify-center
  "
>
  <SidebarToggleIcon collapsed={collapsed} />
</button>

</div>

    </aside>
  );
}