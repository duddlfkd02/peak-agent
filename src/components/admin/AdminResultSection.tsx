import { useState } from "react";
import { Button } from "../ui/button";
import { fetchAdminChatSummary, fetchWebSearchPDF } from "@/lib/api/adminAPI";
import ReactMarkdown from "react-markdown";
import LoadingSpinner from "../common/LoadingSpinner";
import { useAdminStore } from "@/store/useAdminStore";

export default function AdminResultSection() {
  const [summary, setSummary] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const selectedLeadId = useAdminStore((state) => state.selectedLeadId);
  const selectedRoomId = useAdminStore((state) => state.selectedRoomId);
  const selectedLeadName = useAdminStore((state) => state.selectedLeadName);

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
        popup.document.write(`
          <html lang="ko">
            <head>
              <meta charset="UTF-8" />
              <title>미리보기</title>
              <style>
                body {
                  margin: 0 auto;
                  padding: 20px;
                  max-width: 900px;
                  font-family: "Noto Sans KR", sans-serif;
                  background-color: #f5f5f5;
                }
                #save-pdf-button {
                  position: fixed;
                  top: 20px;
                  right: 20px;
                  z-index: 1000;
                  padding: 10px 20px;
                  background-color: #4708dc;
                  color: white;
                  border: none;
                  font-size: 16px;
                  cursor: pointer;
                  border-radius: 8px;
                }
              </style>
            </head>
            <body>
              <div id="html-content">${htmlText}</div>
              <button id="save-pdf-button">PDF로 저장하기</button>
  
              <script>
                // html2pdf 스크립트 로드
                const script = document.createElement("script");
                script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
                script.integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg=="
                script.crossOrigin="anonymous"
                script.referrerPolicy="no-referrer"

                script.onload = async () => {
                  document.getElementById("save-pdf-button").onclick = async () => {
                    const content = document.getElementById("html-content");
  
                    // 이미지 로딩 대기
                    const images = content.querySelectorAll("img");
                    await Promise.all([...images].map(img => {
                      if (img.complete) return Promise.resolve();
                      return new Promise(resolve => {
                        img.onload = resolve;
                        img.onerror = resolve;
                      });
                    }));
  
                    // PDF 생성
                    html2pdf().set({
                      margin:       20,
                      filename:     '기업분석_${selectedLeadName}.pdf',
                      image:        { type: 'jpeg', quality: 0.98 },
                      html2canvas:  { scale: 2 },
                      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    }).from(content).save();
                  };
                };
                document.body.appendChild(script);
              </script>
            </body>
          </html>
        `);

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
