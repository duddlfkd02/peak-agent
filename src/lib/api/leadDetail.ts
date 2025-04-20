export const fetchLeadDetail = async (searchCompanyName: string, companyId: number): Promise<string> => {
  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await fetch(`${BASE_URL}/api/lead/details/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      search_company_name: searchCompanyName,
      company_id: companyId
    })
  });

  if (!response.ok) throw new Error("리드 상세 요청 실패");

  const html = await response.text();
  return html;
};
