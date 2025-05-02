import { fetchAdminAiChat, fetchLeadAgentChatEventSource } from "@/lib/api/adminAPI";
import { AdminChat, TypingChat } from "@/types/admin";
import { useAdminStore } from "@/store/useAdminStore";
import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import AgentSymbol from "../common/AgentSymbol";

export default function AiChatSection() {
  const [chats, setChats] = useState<TypingChat[]>([]);
  const [loading, setLoading] = useState(false);
  const selectedLeadId = useAdminStore((state) => state.selectedLeadId);
  const setSelectedRoomId = useAdminStore((state) => state.setSelectedRoomId);
  const selectedLeadName = useAdminStore((state) => state.selectedLeadName);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isAutoScroll, setIsAutoScroll] = useState(true);

  const handleScroll = () => {
    if (!chatContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isBottom = scrollHeight - scrollTop <= clientHeight + 10;
    setIsAutoScroll(isBottom);
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!selectedLeadId) {
      setChats([]);
      return;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }
    setLoading(false);

    const fetchChatData = async () => {
      try {
        const result = await fetchAdminAiChat(selectedLeadId);
        setChats(result.data.chats);
        setSelectedRoomId(result.data.roomId);
        scrollToBottom();
      } catch (error) {
        console.error("과거 채팅 내역 로드 실패:", error);
        setChats([]);
      }
    };

    fetchChatData();
  }, [selectedLeadId, setSelectedRoomId]);

  useEffect(() => {
    const ref = chatContainerRef.current;
    if (!ref) return;
    ref.addEventListener("scroll", handleScroll);
    return () => ref.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isAutoScroll) {
      scrollToBottom();
    }
  }, [chats, isAutoScroll]);

  const runTypingAnimation = useCallback((chatId: number, fullContents: string) => {
    let currentText = "";
    let i = 0;

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    typingIntervalRef.current = setInterval(() => {
      if (!fullContents) return;

      if (i < fullContents.length) {
        currentText += fullContents[i];
        i++;
        setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === chatId ? { ...chat, contents: currentText } : chat))
        );
      } else {
        clearInterval(typingIntervalRef.current!);
        typingIntervalRef.current = null;
        setChats((prevChats) =>
          prevChats.map((chat) => (chat.id === chatId ? { ...chat, isTyping: false, contents: fullContents } : chat))
        );
        scrollToBottom();
      }
    }, 30);
  }, []);

  const handleStartConversation = useCallback(() => {
    if (!selectedLeadId || loading) return;

    setLoading(true);
    // setChats([]);

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
          fullContents: fullContents
        };

        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
          setChats((prev) =>
            prev.map((c) => (c.isTyping ? { ...c, isTyping: false, contents: c.fullContents ?? c.contents } : c))
          );
        }

        setChats((prevChats) => [...prevChats, newChat]);

        setTimeout(() => {
          runTypingAnimation(newChat.id, fullContents);
        }, 50);

        setSelectedRoomId(data.roomId);
      } catch (error) {
        console.error("SSE 메시지 처리 오류:", error, event.data);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE 연결 오류:", error);
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      setLoading(false);
    };
  }, [selectedLeadId, loading, runTypingAnimation, setSelectedRoomId]);

  return (
    <section className="h-[calc(100vh-150px)] overflow-hidden rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">AI 대화 내역</h2>
      <div ref={chatContainerRef} className="h-[calc(100%-60px)] overflow-y-auto pr-2">
        {chats.length === 0 && !loading && (
          <div className="flex h-full flex-col items-center justify-center">
            <Button onClick={handleStartConversation} disabled={loading}>
              대화 시작
            </Button>
          </div>
        )}
        {chats.map((chat) => {
          const isMyCompany = chat.fromCompanyName === selectedLeadName;
          return (
            <div
              key={`${chat.id}-${chat.createdAt}`}
              className={`flex ${isMyCompany ? "justify-end" : "justify-start"} w-full p-2`}
            >
              <div className={`flex items-start gap-4 ${isMyCompany ? "flex-row-reverse" : "flex-row"}`}>
                <AgentSymbol />
                <div
                  className={`${
                    isMyCompany ? "bg-primary text-white" : "bg-darkgray text-foreground"
                  } my-2 max-w-[70%] rounded-xl p-4`}
                >
                  <div className="prose prose-invert max-w-none break-words text-sm prose-p:mb-2">
                    <ReactMarkdown>{chat.contents}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
