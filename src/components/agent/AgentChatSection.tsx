"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import SkeletonLoader from "../common/SkeletonLoader";

import { useEffect, useRef, useState } from "react";
import { fetchLeadRecommendations } from "@/lib/api/findLeads";
import { useSearchStore } from "@/store/useSearchStore";
import { CompanyInfo } from "@/types/visitor";
import { generateCompanyIntro } from "@/lib/companyIntro";
import { fetchCompanyInfo } from "@/lib/api/visitorsAPI";

export default function AgentChatSection() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isIntro, setIsIntro] = useState(false); // 처음 회사 소개 출력 확인용

  const [leads, setLeads] = useState<any[]>([]);
  const [isloading, setIsLoading] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);

  // companyInfo 값을 인자로 받은 후 문장 만드느 함수
  const fixedQuestions = [
    (company: CompanyInfo) => `${company.companyName}의 대표자 이름은 누구인가요?`,
    (company: CompanyInfo) => `${company.companyName}의 회사 위치는 어디인가요?`,
    (company: CompanyInfo) => `${company.companyName}의 연락처는 무엇인가요?`
  ];

  const fixedAnswers = [
    (company: CompanyInfo) => `${company.companyName} 대표자 이름은 ${company.keyExecutive} 입니다.`,
    (company: CompanyInfo) => `${company.companyName}의 위치는 ${company.address} 입니다.`,
    (company: CompanyInfo) => `${company.companyName}의 연락처는 ${company.phoneNumber}입니다.`
  ];

  // 맨 처음 기업 기본 소개 불러오기
  useEffect(() => {
    const loadCompanyInfo = async () => {
      const data = await fetchCompanyInfo(1);
      setCompanyInfo(data);
      setMessages([generateCompanyIntro(data)]);
    };
    loadCompanyInfo();
  }, []);

  const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  useEffect(() => {
    const startQnA = async () => {
      if (!companyInfo || isIntro) return;
      setIsIntro(true);

      for (let i = 0; i < fixedQuestions.length; i++) {
        await delay(2000);
        setMessages((prev) => [...prev, fixedQuestions[i](companyInfo), fixedAnswers[i](companyInfo)]);
      }
    };

    startQnA();
  }, [companyInfo, isIntro]);

  // 채팅 자동 스크롤
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    }
  }, [messages]);

  // 입력창 제출 로직
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
      // handleSubmit();
      setMessage("");
    }
  };
  return (
    <div className="flex h-[calc(100vh-80px)] flex-col rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">Agent</h2>

      <div ref={messageEndRef} className="flex-1 overflow-y-auto rounded p-4 sm:text-sm">
        {messages.map((msg, index) => (
          <div key={index} className="rounded px-4 py-2 text-white">
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
        {/* <div className="absolute bottom-3 right-3 flex gap-2">
          <Button size="icon" variant="ghost" className="bg-primary" onClick={handleSubmit}>
            <Send className="h-4 w-4" />
          </Button>
        </div> */}
      </div>
    </div>
  );
}
