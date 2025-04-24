import { useState } from "react";
import { Button } from "../ui/button";
import { fetchAdminChatSummary } from "@/lib/api/adminAPI";
import ReactMarkdown from "react-markdown";
import LoadingSpinner from "../common/LoadingSpinner";

interface IProps {
  roomId: number | null;
  leadId: number;
}
export default function AdminResultSection({ roomId, leadId }: IProps) {
  const [summary, setSummary] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSummary = async () => {
    if (!roomId) return;

    setIsLoading(true);

    try {
      const response = await fetchAdminChatSummary(leadId, roomId);
      setSummary(response);
    } catch (error) {
      console.error("채팅 요약을 실패했습니다.", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="h-[calc(100vh-150px)] overflow-hidden rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">리드 회사 정보</h2>
      <div>
        <Button className="w-fit border border-white bg-transparent text-sm" onClick={handleSummary}>
          요약 보기
        </Button>
      </div>
      {isLoading && (
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
      {summary && (
        <div className="h-full space-y-6 overflow-y-auto pb-14 pr-2 pt-5">
          <div className="prose prose-invert prose-p:mb-4 max-w-none text-sm">
            <ReactMarkdown>{summary}</ReactMarkdown>
          </div>
        </div>
      )}
    </section>
  );
}
