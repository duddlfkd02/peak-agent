import AiChatSection from "./AiChatSection";
import AdminResultSection from "./AdminResultSection";
import { useState } from "react";

export default function AdminPage() {
  const [leadId, setLeadId] = useState(1); // 리드 목록 클릭 이동 시 params 등으로 변경
  const [roomId, setRoomId] = useState<number | null>(null);

  return (
    <main className="grid h-screen grid-cols-1 gap-4 overflow-hidden px-5 pb-5 pt-[75px] lg:grid-cols-[2fr_1fr]">
      <AiChatSection leadId={leadId} setRoomId={setRoomId} />
      <AdminResultSection roomId={roomId} leadId={leadId} />
    </main>
  );
}
