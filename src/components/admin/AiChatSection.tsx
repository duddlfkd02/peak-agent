import { fetchAdminAiChat } from "@/lib/api/adminAPI";
import { AdminChat } from "@/types/admin";
import { useEffect, useState } from "react";

import ReactMarkdown from "react-markdown";

export default function AiChatSection() {
  const [chats, setChats] = useState<AdminChat[]>([]);
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const chats = await fetchAdminAiChat(1); // 하드코딩 1번
        console.log("Ai chat 목록", chats);
        setChats(chats);
      } catch (error) {
        console.error("error", error);
      }
    };

    fetchChatData();
  }, []);

  return (
    <section className="h-[calc(100vh-80px)] overflow-hidden rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">AI 대화 내역</h2>
      <div className="h-full space-y-6 overflow-y-auto pr-2">
        {chats.map((chat) => (
          <div key={chat.id} className="rounded-xl p-4">
            <p className="mb-4 w-fit rounded-full bg-primary px-3 py-2 font-bold">{chat.fromCompanyName}</p>
            <div className="prose prose-invert prose-p:mb-4 max-w-none text-sm">
              <ReactMarkdown>{chat.contents}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
