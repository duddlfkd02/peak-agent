import { useState } from "react";
import { Button } from "../ui/button";
import { fetchAdminChatSummary } from "@/lib/api/adminAPI";
import ReactMarkdown from "react-markdown";

interface IProps {
  roomId: number | null;
  leadId: number;
}
export default function AdminResultSection({ roomId, leadId }: IProps) {
  const [summary, setSummary] = useState<string>();

  const handleSummary = async () => {
    if (!roomId) return;
    const response = await fetchAdminChatSummary(leadId, roomId);
    setSummary(response);
  };

  return (
    <section className="h-[calc(100vh-150px)] overflow-hidden rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">리드 회사 정보</h2>
      <div>
        <Button className="w-fit border border-white bg-transparent text-sm" onClick={handleSummary}>
          요약 보기
        </Button>
      </div>
      {summary && (
        <div className="h-full space-y-6 overflow-y-auto pb-14 pr-2 pt-5">
          <div className="prose prose-invert max-w-none text-sm prose-p:mb-4">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      )}
    </section>
  );
}
