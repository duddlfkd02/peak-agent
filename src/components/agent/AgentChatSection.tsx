"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { pdfSummary } from "@/types/pdfSummary";

export default function AgentChatSection() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const { pdfSummary } = useSearchStore();
  console.log("zustand pdfSummary", pdfSummary);

  // 요약 정보 출력 함수
  const generateCompanyIntro = (summary: pdfSummary) => {
    if (!summary) return "회사 정보를 불러올 수 없습니다.";

    const { company_description, business_model, key_executive, address, email } = summary;

    const introParts: string[] = [];

    if (company_description) {
      introParts.push(`${company_description}`);
    }

    if (business_model) {
      introParts.push(`이 회사는 ${business_model}`);
    }

    const detailParts: string[] = [];

    if (key_executive) {
      detailParts.push(`대표자는 ${key_executive} 입니다.`);
    }

    if (address) {
      detailParts.push(`주소는 ${address}이고 `);
    }

    if (email) {
      detailParts.push(`문의 이메일은 ${email}입니다.`);
    }

    if (detailParts.length > 0) {
      introParts.push("주요 정보는 아래와 같습니다.");
      introParts.push(detailParts.join(""));
    }

    return introParts.join("\n\n").trim();
  };

  const handleSubmit = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, message]);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">Agent</h2>

      <div className="flex flex-1 flex-col justify-end">
        <div className="mb-4 overflow-y-auto rounded p-4 text-sm">
          {pdfSummary ? <div className="text-white">{generateCompanyIntro(pdfSummary)}</div> : "요약 정보가 없습니다."}

          {messages.map((msg, index) => (
            <div key={index} className="rounded px-4 py-2 text-right text-white">
              {msg}
            </div>
          ))}
        </div>

        {/* 채팅 입력창 영역 */}
        <div className="relative">
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
    </div>
  );
}
