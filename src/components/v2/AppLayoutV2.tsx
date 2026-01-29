import { Outlet, useLocation } from "react-router-dom";
import SidebarV2 from "./SidebarV2";
import DashboardHeaderV2 from "./DashboardHeaderV2";

function getTitle(pathname: string) {
  if (pathname.startsWith("/daily-journal")) return "Daily Journal";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/trades")) return "Trades";
  return "Dashboard";
}

export default function AppLayoutV2() {
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SidebarV2 />

      <div
  id="app-scroll-container"
  className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden"
>

        {/* TEK HEADER */}
        <DashboardHeaderV2 title={title} />

        <Outlet />
      </div>
    </div>
  );
}
