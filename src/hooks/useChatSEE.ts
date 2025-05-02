import { fetchLeadAgentChatEventSource } from "@/lib/api/adminAPI";
import { TypingChat } from "@/types/admin";
import { useRef } from "react";

interface UseChatSEEProps {
  selectedLeadId: number | null;
  setChats: React.Dispatch<React.SetStateAction<TypingChat[]>>;
  runTypingAnimation: (chatId: number, fullContents: string) => void;
  clearTyping: () => void;
  setSelectedRoomId: (roomId: number) => void;
  setLoading: (value: boolean) => void;
}

export default function useChatSEE({
  selectedLeadId,
  setChats,
  runTypingAnimation,
  clearTyping,
  setSelectedRoomId,
  setLoading
}: UseChatSEEProps) {
  const eventSourceRef = useRef<EventSource | null>(null);

  const startConversation = () => {
    if (!selectedLeadId) return;

    setLoading(true);
    clearTyping();

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = fetchLeadAgentChatEventSource(selectedLeadId);
    eventSourceRef.current = eventSource;

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        const fullContents = data.contents;

        const newChat: TypingChat = {
          id: data.id,
          fromId: data.fromId,
          toId: data.toId,
          fromCompanyName: data.fromCompanyName,
          toCompanyName: data.toCompanyName,
          contents: "",
          createdAt: data.createdAt,
          isTyping: true,
          fullContents
        };

        clearTyping();
        setChats((prev) =>
          prev.map((c) => (c.isTyping ? { ...c, isTyping: false, contents: c.fullContents ?? c.contents } : c))
        );

        setChats((prevChats) => [...prevChats, newChat]);

        setTimeout(() => {
          runTypingAnimation(newChat.id, fullContents);
        }, 50);

        setSelectedRoomId(data.roomId);
      } catch (error) {
        console.error("SSE 메시지 처리 오류:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE 오류:", error);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      clearTyping();
      setLoading(false);
    };
  };

  const stopConversation = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  return { startConversation, stopConversation };
}
