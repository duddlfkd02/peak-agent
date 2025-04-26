import dynamic from "next/dynamic";
import LeadsList from "./LeadsList";
import AiChatSection from "./AiChatSection";
import AdminResultSection from "./AdminResultSection";
import { useAdminStore } from "@/store/useAdminStore";
import { Button } from "../ui/button";

const SankeyChart = dynamic(() => import("./SankeyChart"), { ssr: false });

export default function AdminPage() {
  const { isSelectedLead, setIsSelectedLead } = useAdminStore();

  const handleBackToList = () => {
    setIsSelectedLead(false);
  };

  return (
    <main className="px-5 pb-5 pt-[75px]">
      {isSelectedLead && <Button onClick={handleBackToList}>전체 보기</Button>}
      <div className="mt-4 grid grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[2fr_1fr]">
        <div>{isSelectedLead ? <AiChatSection /> : <SankeyChart />}</div>
        <div>{isSelectedLead ? <AdminResultSection /> : <LeadsList />}</div>
      </div>
    </main>
  );
}
