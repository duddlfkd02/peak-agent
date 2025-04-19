"use client";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";
import { pdfSummary } from "@/types/pdfSummary";

export default function AgentChatSection() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [leads, setLeads] = useState<any[]>([]);

  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollTop = messageEndRef.current.scrollHeight;
    }
  }, [messages]);

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

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleFindLeads = async () => {
    // if (!pdfSummary?.company_id) {
    //   alert("company_id가 없습니다");
    //   return;
    // -> companu_id가 pdfSummary에 없어서 추가 필요

    try {
      const response = await fetch(`${BASE_URL}/api/scout/find-leads/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_id: 94 })
      });

      if (!response.ok) throw new Error("리드 탐색에 실패했습니다.");
      const data = await response.json();
      console.log("data 결과", data);
      setLeads(data.leads);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, message]);
    setMessage("");

    try {
      const response = await fetch(`${BASE_URL}/api/lead/details/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ search_company_name: message, company_id: 94 })
      });

      if (!response.ok) throw new Error("리드 상세 요청 실패");

      const html = await response.text();

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
