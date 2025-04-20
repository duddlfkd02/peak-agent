export interface Lead {
  company: string;
  industry: string;
  sales: number | null;
  total_funding: number | null;
  relevance_score: number | null;
  homepage: string;
  key_executive: string;
  reasoning: string;
}

export interface LeadResponse {
  status: string;
  message: string;
  source_used: string;
  leads: Lead[];
}

export const fetchLeadRecommendations = async (companyId: number): Promise<LeadResponse> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await fetch(`${BASE_URL}/api/scout/find-leads/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company_id: 12 }) // 하드코딩된 테스트용 ID
    // body: JSON.stringify({ company_id: companyId }),
  });

  if (!response.ok) throw new Error("리드 탐색에 실패했습니다.");
  const data = await response.json();
  console.log("data 결과", data);
  return data;
};

// TODO: 백엔드 개발 완료되면 companyId 매개변수로 대체 예정
