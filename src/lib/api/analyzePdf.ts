import { pdfSummary } from "@/types/pdfSummary";

export const fetchAnalyzePdf = async (profile_id: number): Promise<pdfSummary> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await fetch(`${BASE_URL}/api/scout/analyze-pdf/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ profile_id })
  });

  if (!response.ok) throw new Error("PDF 요약을 실패했습니다.");
  const result = await response.json();
  console.log("요약 결과", result.analysis);
  return result.analysis;
};
