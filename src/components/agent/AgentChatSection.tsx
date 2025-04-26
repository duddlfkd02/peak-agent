"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { FileUp } from "lucide-react";
import SkeletonLoader from "../common/SkeletonLoader";

import { useEffect, useRef, useState } from "react";

import { generateCompanyIntro } from "@/lib/companyIntro";
import { fetchChatMessage, fetchChatSummary, fetchCompanyInfo } from "@/lib/api/visitorsAPI";
import { CompanyInfo } from "@/types/visitor";
import { UIChatMessage } from "@/types/visitor";

export default function AgentChatSection() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<UIChatMessage[]>([]);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [isIntro, setIsIntro] = useState(false); // 처음 회사 소개 출력 확인용
  const [roomId, setRoomId] = useState<number | null>(null);
  const [isloading, setIsLoading] = useState(false);

  const messageEndRef = useRef<HTMLDivElement>(null);

  // companyInfo 값을 인자로 받은 후 문장 만드느 함수
  const fixedQuestions = [
    (company: CompanyInfo) => `${company.companyName}의 대표자 이름은 누구인가요?`,
    (company: CompanyInfo) => `${company.companyName}의 회사 위치는 어디인가요?`,
    (company: CompanyInfo) => `${company.companyName}의 연락처는 무엇인가요?`
  ];

  const fixedAnswers = [
    (company: CompanyInfo) =>
      company.keyExecutive
        ? `${company.companyName} 대표자 이름은 ${company.keyExecutive} 입니다.`
        : `${company.companyName} 대표자 정보는 공개되지 않아 확인할 수 없습니다.`,
    (company: CompanyInfo) =>
      company.address
        ? `${company.companyName}의 위치는 ${company.address} 입니다.`
        : `${company.companyName}의 위치정보를 확인할 수 없습니다.`,
    (company: CompanyInfo) =>
      company.phoneNumber
        ? `${company.companyName}의 연락처는 ${company.phoneNumber}입니다.`
        : `${company.companyName}의 연락처가 공개되지 않아 확인할 수 없습니다..`
  ];

  // 맨 처음 기업 기본 소개 불러오기
  useEffect(() => {
    const loadCompanyInfo = async () => {
      const data = await fetchCompanyInfo(2);
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

        setMessages((prev) => [
          ...prev,
          { role: "user", content: fixedQuestions[i](companyInfo) },
          { role: "agent", content: fixedAnswers[i](companyInfo) }
        ]);
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

  // ai 자유 채팅 로직
  const handleSubmit = async () => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await fetchChatMessage(2, message, roomId);

      setMessages((prev) => [...prev, { role: "agent", content: aiResponse.contents }]);

      if (!roomId && aiResponse.roomId) {
        setRoomId(aiResponse.roomId);
      }
    } catch (error) {
      console.error("AI 응답 실패:", error);
      setMessages((prev) => [...prev, { role: "agent", content: "AI 응답 처리 중 오류가 발생했습니다." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // 입력창 shift + enter 줄바꿈
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

      <div ref={messageEndRef} className="flex-1 space-y-2 overflow-y-auto rounded p-4 sm:text-sm">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-4 text-sm ${
                msg.role === "user" ? "bg-darkgray text-white" : "text-white"
              }`}
            >
              {msg.content}
            </div>
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
        {/* <div className="absolute bottom-3 right-20 flex gap-2">
          <Button size="icon" variant="ghost" className="bg-primary" onClick={handlePdfSummary}>
            <FileUp className="h-4 w-4" />
          </Button>
        </div> */}
      </div>
    </div>
  );
}
