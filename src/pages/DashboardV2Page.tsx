import SidebarV2 from "../components/v2/SidebarV2";
import DashboardV2 from "../components/v2/DashboardV2";

export default function DashboardV2Page() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <SidebarV2 />
      <DashboardV2 />
    </div>
  );
}
