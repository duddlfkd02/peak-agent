import { fetchAdminAiChat } from "@/lib/api/adminAPI";
import { AdminChat } from "@/types/admin";
import { useAdminStore } from "@/store/useAdminStore";
import React, { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

export default function AiChatSection() {
  const [chats, setChats] = useState<AdminChat[]>([]);
  const selectedLeadId = useAdminStore((state) => state.selectedLeadId);
  const setSelectedRoomId = useAdminStore((state) => state.setSelectedRoomId);

  useEffect(() => {
    if (!selectedLeadId) return;

    const fetchChatData = async () => {
      try {
        const result = await fetchAdminAiChat(selectedLeadId); // 하드코딩 1번 목록
        const chats = result.data.chats;
        const roomId = result.data.roomId;
        console.log("Ai chat 목록", chats);
        setChats(chats);
        setSelectedRoomId(roomId);
      } catch (error) {
        console.error("error", error);
      }
    };

    fetchChatData();
  }, [selectedLeadId]);

  return (
    <section className="h-[calc(100vh-150px)] overflow-hidden rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">AI 대화 내역</h2>
      <div className="h-full space-y-6 overflow-y-auto pr-2">
        {chats.map((chat) => (
          <div key={chat.id} className="rounded-xl p-4">
            <p className="mb-4 w-fit rounded-full bg-primary px-3 py-2 font-bold">{chat.fromCompanyName}</p>
            <div className="prose prose-invert max-w-none text-sm prose-p:mb-4">
              <ReactMarkdown>{chat.contents}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
