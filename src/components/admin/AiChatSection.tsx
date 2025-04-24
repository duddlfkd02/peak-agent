import { fetchAdminAiChat } from "@/lib/api/adminAPI";
import { AdminChat } from "@/types/admin";
import React, { SetStateAction, useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

interface IProps {
  leadId: number;
  setRoomId: React.Dispatch<SetStateAction<number | null>>;
}

export default function AiChatSection({ leadId, setRoomId }: IProps) {
  const [chats, setChats] = useState<AdminChat[]>([]);
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const result = await fetchAdminAiChat(leadId); // 하드코딩 1번
        const chats = result.data.chats;
        const responseRoomId = result.data.roomId;
        console.log("Ai chat 목록", chats);
        setRoomId(responseRoomId);
        setChats(chats);
      } catch (error) {
        console.error("error", error);
      }
    };

    fetchChatData();
  }, []);

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
