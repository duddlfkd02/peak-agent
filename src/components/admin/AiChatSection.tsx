import { fetchAdminAiChat } from "@/lib/api/adminAPI";
import { TypingChat } from "@/types/admin";
import { useAdminStore } from "@/store/useAdminStore";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "../ui/button";
import ChatMessage from "./ChatMessage";
import useAutoScroll from "@/hooks/useAutoScroll";
import useTypingAnimation from "@/hooks/useTypingAnimation";
import useChatSSE from "@/hooks/useChatSEE";

export default function AiChatSection() {
  const [chats, setChats] = useState<TypingChat[]>([]);
  const [loading, setLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const selectedLeadId = useAdminStore((state) => state.selectedLeadId);
  const setSelectedRoomId = useAdminStore((state) => state.setSelectedRoomId);
  const selectedLeadName = useAdminStore((state) => state.selectedLeadName);

  const { isAutoScroll } = useAutoScroll(chatContainerRef, [chats]);
  const { runTypingAnimation, clearTyping } = useTypingAnimation({ setChats });
  const { startConversation, stopConversation } = useChatSSE({
    selectedLeadId,
    setChats,
    runTypingAnimation,
    clearTyping,
    setSelectedRoomId,
    setLoading
  });

  useEffect(() => {
    return () => {
      stopConversation();
      clearTyping();
    };
  }, []);

  useEffect(() => {
    if (!selectedLeadId) {
      setChats([]);
      return;
    }

    stopConversation();
    clearTyping();
    setLoading(false);

    const fetchChatData = async () => {
      try {
        const result = await fetchAdminAiChat(selectedLeadId);
        setChats(result.data.chats);
        setSelectedRoomId(result.data.roomId);
      } catch (error) {
        console.error("과거 채팅 내역 로드 실패:", error);
        setChats([]);
      }
    };

    fetchChatData();
  }, [selectedLeadId, setSelectedRoomId]);

  return (
    <section className="h-[calc(100vh-150px)] overflow-hidden rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">AI 대화 내역</h2>
      <div ref={chatContainerRef} className="h-[calc(100%-60px)] overflow-y-auto pr-2">
        {chats.length === 0 && !loading && (
          <div className="flex h-full flex-col items-center justify-center">
            <Button onClick={startConversation} disabled={loading}>
              대화 시작
            </Button>
          </div>
        )}
        {chats.map((chat) => {
          const isMyCompany = chat.fromCompanyName === selectedLeadName;
          return <ChatMessage key={`${chat.id}-${chat.createdAt}`} chat={chat} isMyCompany={isMyCompany} />;
        })}
      </div>
    </section>
  );
}
