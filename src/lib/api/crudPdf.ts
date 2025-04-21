import { pdfSummary } from "@/types/pdfSummary";

export interface CompanyProfile {
  id: number;
  companyId: number;
  fileName: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchUploadPdf = async (company_id: number, file: File): Promise<CompanyProfile> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_CRUD_URL;

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/api/company/${company_id}/files`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) throw new Error("PDF 업로드를 실패했습니다.");
  const result = await response.json();
  console.log("PDF 기업 프로필", result);

  return result;
};
