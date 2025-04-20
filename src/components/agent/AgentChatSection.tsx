"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { pdfSummary } from "@/types/pdfSummary";
import SkeletonLoader from "../common/SkeletonLoader";
import { generateCompanyIntro } from "@/lib/companyIntro";
import { fetchLeadRecommendations } from "@/lib/api/findLeads";
import { fetchLeadDetail } from "@/lib/api/leadDetail";

export default function AgentChatSection() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [isloading, setIsLoading] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    }
  }, [messages]);

  const { pdfSummary } = useSearchStore();
  console.log("zustand pdfSummary", pdfSummary);

  const handleFindLeads = async () => {
    try {
      const leadResponse = await fetchLeadRecommendations(94);
      setLeads(leadResponse.leads);
    } catch (error) {
      console.error("리드 탐색 중 오류 발생", error);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, message]);
    setMessage("");

    setIsLoading(true);

    try {
      const html = await fetchLeadDetail(message, 94);

      // 새 창 열기
      const popup = window.open("", "_blank", `width=${window.innerWidth},height=${window.innerHeight},left=0,top=0`);

      if (popup) {
        popup.document.open();
        popup.document.write(html);
        popup.document.close();
      } else {
        setMessages((prev) => [...prev, "팝업을 차단했거나 새 창을 열 수 없습니다."]);
      }
    } catch (error) {
      console.error("리드 상세 요청 에러:", error);
      setMessages((prev) => [...prev, "리드 상세 요청 에러"]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
      setMessage("");
    }
  };
  return (
    <div className="flex h-[calc(100vh-80px)] flex-col rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">Agent</h2>

      <div ref={messageEndRef} className="flex-1 overflow-y-auto rounded p-4 sm:text-sm">
        {pdfSummary ? <div className="text-white">{generateCompanyIntro(pdfSummary)}</div> : "요약 정보가 없습니다."}
        {pdfSummary && (
          <Button className="mt-4 w-fit border bg-transparent text-white" onClick={handleFindLeads}>
            리드 탐색하기
          </Button>
        )}

        {leads.length > 0 && (
          <div className="mt-6">
            <h3 className="bold mb-2 text-white">추천 리드</h3>
            <ul className="space-y-2">
              {leads.map((lead, index) => (
                <li key={index} className="rounded bg-darkgray p-3 text-white">
                  <p>회사명: {lead.company}</p>
                  <p>산업군: {lead.industry}</p>
                  <p>홈페이지: {lead.homepage}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {messages.map((msg, index) => (
          <div key={index} className="rounded px-4 py-2 text-right text-white">
            {msg}
          </div>
        ))}
        {isloading && (
          <div className="rounded px-4 py-2 text-left">
            <SkeletonLoader />
          </div>
        )}
      </div>

      {/* 채팅 입력창 영역 */}
      <div className="relative mt-4">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={handleKeyDown}
          placeholder="궁금한 내용을 입력해보세요."
          className="min-h-[120px] w-full resize-none pr-24 text-sm text-muted placeholder:text-muted sm:text-base"
        />
        <div className="absolute bottom-3 right-3 flex gap-2">
          <Button size="icon" variant="ghost" className="bg-primary" onClick={handleSubmit}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
