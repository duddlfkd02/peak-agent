import { useState } from "react";
import { Button } from "../ui/button";
import { fetchAdminChatSummary, fetchWebSearchPDF } from "@/lib/api/adminAPI";
import ReactMarkdown from "react-markdown";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAdminStore } from "@/store/useAdminStore";
import { makePopupHtml } from "@/lib/makePopupHtml";
import { useShallow } from "zustand/shallow";

export default function AdminResultSection() {
  const [summary, setSummary] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const { selectedLeadId, selectedRoomId, selectedLeadName, setIsSelectedLead } = useAdminStore(
    useShallow((state) => ({
      selectedLeadId: state.selectedLeadId,
      selectedRoomId: state.selectedRoomId,
      selectedLeadName: state.selectedLeadName,
      isSelectedLead: state.isSelectedLead,
      setIsSelectedLead: state.setIsSelectedLead
    }))
  );

  const handleBackToList = () => {
    setIsSelectedLead(false);
  };

  const handleSummary = async () => {
    if (!selectedLeadId || !selectedRoomId) return;
    if (isLoading) return;

    setIsLoading(true);

    try {
      const response = await fetchAdminChatSummary(selectedLeadId, selectedRoomId);
      setSummary(response);
    } catch (error) {
      console.error("채팅 요약을 실패했습니다.", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenHtmlPopup = async () => {
    if (isLoading || !selectedLeadName) return;
    setIsLoading(true);
    try {
      const htmlText = await fetchWebSearchPDF(selectedLeadName);

      const popup = window.open("", "_blank", "width=1000,height=800");

      if (popup) {
        // 팝업 문서 작성
        popup.document.write(makePopupHtml(htmlText, selectedLeadName));

        popup.document.close();
      }
    } catch (error) {
      console.error("HTML 불러오기 실패:", error);
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
        <Button className="ml-4 w-fit border border-white bg-transparent text-sm" onClick={handleOpenHtmlPopup}>
          웹 서치 보고서
        </Button>
        <Button className="ml-4 w-fit border border-white bg-transparent text-sm" onClick={handleBackToList}>
          다이어그램 보기
        </Button>
      </div>
      {isLoading && (
        <div className="flex h-full items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
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
