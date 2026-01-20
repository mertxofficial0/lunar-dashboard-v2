import { Outlet } from "react-router-dom";
import SidebarV2 from "./SidebarV2";

export default function AppLayoutV2() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SidebarV2 />
      <div className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden">
        <Outlet />
      </div>
    </div>
  );
}
