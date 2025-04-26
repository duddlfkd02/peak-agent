import AiChatSection from "./AiChatSection";
import AdminResultSection from "./AdminResultSection";
import { useState } from "react";
import { Button } from "../ui/button";

import dynamic from "next/dynamic";
import LeadsList from "./LeadsList";

const SankeyChart = dynamic(() => import("./SankeyChart"), { ssr: false });

export default function AdminPage() {
  const [showDiagram, setShowDiagram] = useState(false);

  return (
    <main className="relative h-screen px-5 pb-5 pt-[75px]">
      <Button onClick={() => setShowDiagram(!showDiagram)}>{showDiagram ? "Ai 대화보기" : "다이어그램 보기"}</Button>
      <div className="mt-4 grid grid-cols-1 gap-4 overflow-hidden lg:grid-cols-[2fr_1fr]">
        <div>{showDiagram ? <SankeyChart /> : <AiChatSection />}</div>
        {/* <LeadsList /> */}
        <AdminResultSection />
      </div>
    </main>
  );
}
