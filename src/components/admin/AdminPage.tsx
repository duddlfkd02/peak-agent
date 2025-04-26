import dynamic from "next/dynamic";
import LeadsList from "./LeadsList";
import AiChatSection from "./AiChatSection";
import AdminResultSection from "./AdminResultSection";
import { useAdminStore } from "@/store/useAdminStore";

const SankeyChart = dynamic(() => import("./SankeyChart"), { ssr: false });

export default function AdminPage() {
  const isSelectedLead = useAdminStore((state) => state.isSelectedLead);

  return (
    <main className="px-5 pb-5 pt-[75px]">
      <div className="mt-4 grid grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[2fr_1fr]">
        <div>{isSelectedLead ? <AiChatSection /> : <SankeyChart />}</div>
        <div>{isSelectedLead ? <AdminResultSection /> : <LeadsList />}</div>
      </div>
    </main>
  );
}
