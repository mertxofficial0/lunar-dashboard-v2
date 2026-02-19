import { Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import SidebarV2 from "./SidebarV2";
import DashboardHeaderV2 from "./DashboardHeaderV2";
import RouteLoading from "./RouteLoading";

function getTitle(pathname: string) {
  if (pathname.startsWith("/daily-journal")) return "Daily Journal";
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/trades")) return "Trades";
  return "Dashboard";
}

export default function AppLayoutV2() {
  const location = useLocation();
  const title = getTitle(location.pathname);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const t = setTimeout(() => {
      setLoading(false);
    }, 1700);

    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SidebarV2 />

      {/* MAIN */}
      <div className="flex-1 min-w-0 flex flex-col bg-[#F5F6F8]">
        
        {/* HEADER */}
        <DashboardHeaderV2 title={title} />

        {/* CONTENT */}
<div className="relative flex-1 overflow-y-auto bg-[#F5F6F8]">
  {loading && <RouteLoading />}
  <Outlet />
</div>

      </div>
    </div>
  );
}
