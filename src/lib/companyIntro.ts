// src/lib/utils.ts
import { pdfSummary } from "@/types/pdfSummary";

export const generateCompanyIntro = (summary: pdfSummary) => {
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
    detailParts.push(`대표자는 ${key_executive}입니다.`);
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
