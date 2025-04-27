import { fetchAdminAiChat, fetchLeadAgentChatEventSource } from "@/lib/api/adminAPI";
import { AdminChat } from "@/types/admin";
import { useAdminStore } from "@/store/useAdminStore";
import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";

export default function AiChatSection() {
  const [chats, setChats] = useState<AdminChat[]>([]);
  const [loading, setLoading] = useState(false);
  const selectedLeadId = useAdminStore((state) => state.selectedLeadId);
  const setSelectedRoomId = useAdminStore((state) => state.setSelectedRoomId);
  const selectedLeadName = useAdminStore((state) => state.selectedLeadName);
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
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [chats]);

  const handleStartConversation = () => {
    if (!selectedLeadId) return;

    setLoading(true);
    const eventSource = fetchLeadAgentChatEventSource(selectedLeadId);

    console.log(eventSource);

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
      <div ref={chatContainerRef} className="h-full overflow-y-auto">
        {chats.length === 0 && !loading ? (
          <div className="flex h-full flex-col items-center justify-center">
            <Button onClick={handleStartConversation}>대화 시작</Button>
          </div>
        ) : (
          chats.map((chat) => {
            const isMyCompany = chat.fromCompanyName === selectedLeadName;
            return (
              <div key={chat.id} className={`flex ${isMyCompany ? "justify-end" : "justify-start"} rounded-xl p-2`}>
                <div
                  className={`${isMyCompany ? "bg-primary text-white" : "bg-darkgray text-foreground"} mb-8 max-w-[70%] rounded-xl p-4`}
                >
                  <div className="prose prose-invert max-w-none break-words text-sm prose-p:mb-2">
                    <ReactMarkdown>{chat.contents}</ReactMarkdown>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
