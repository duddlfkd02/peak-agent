import { fetchAdminAiChat } from "@/lib/api/adminAPI";
import { AdminChat } from "@/types/admin";
import { useAdminStore } from "@/store/useAdminStore";
import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function AiChatSection() {
  const [chats, setChats] = useState<AdminChat[]>([]);
  const [loading, setLoading] = useState(false);
  const selectedLeadId = useAdminStore((state) => state.selectedLeadId);
  const setSelectedRoomId = useAdminStore((state) => state.setSelectedRoomId);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedLeadId) return;

    const fetchChatData = async () => {
      try {
        const result = await fetchAdminAiChat(selectedLeadId);
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

  useEffect(() => {
    // 채팅이 업데이트될 때마다 스크롤을 맨 아래로 이동
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const handleStartConversation = () => {
    if (!selectedLeadId) return;

    setLoading(true);
    const url = process.env.NEXT_PUBLIC_API_URL;

    const eventSource = new EventSource(`${url}/api/v2/leads/${selectedLeadId}/agents/chats`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const newChat: AdminChat = {
        id: data.id,
        fromId: data.fromId,
        toId: data.toId,
        fromCompanyName: data.fromCompanyName,
        toCompanyName: data.toCompanyName,
        contents: data.contents,
        createdAt: data.createdAt
      };
      setSelectedRoomId(data.roomId);
      setChats((prevChats) => [...prevChats, newChat]);
    };

    eventSource.onerror = (error) => {
      console.error("SSE 연결 오류", error);
      eventSource.close();
      setLoading(false);
    };

    eventSource.addEventListener("end", () => {
      eventSource.close();
      setLoading(false);
    });
  };

  return (
    <section className="h-[calc(100vh-150px)] overflow-hidden rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">AI 대화 내역</h2>
      <div ref={chatContainerRef} className="h-full space-y-6 overflow-y-auto pr-2">
        {chats.length === 0 && !loading ? (
          <div className="flex h-full flex-col items-center justify-center">
            <button
              onClick={handleStartConversation}
              className="rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/80"
            >
              대화 시작
            </button>
          </div>
        ) : (
          chats.map((chat) => (
            <div key={chat.id} className="rounded-xl p-4">
              <p className="mb-4 w-fit rounded-full bg-primary px-3 py-2 font-bold">{chat.fromCompanyName}</p>
              <div className="prose prose-invert max-w-none text-sm prose-p:mb-4">
                <ReactMarkdown>{chat.contents}</ReactMarkdown>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
