import { AdminChatResponse, RecommendedLeads } from "@/types/admin";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAdminAiChat = async (leadId: number): Promise<AdminChatResponse> => {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v1/leads/${leadId}/chats`, {
    method: "GET",
    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" }
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("api 호출 실패 응답", text);
    throw new Error("채팅 내역 조회 실패");
  }

  const json = await response.json();
  return json;
};

export const fetchAdminChatSummary = async (leadId: number, roomId: number): Promise<string> => {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v2/rooms/${roomId}/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      leadId
    })
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("api 호출 실패 응답", text);
    throw new Error("채팅 요약 생성 실패");
  }

  const json = await response.json();

  return json.data.summary;
};

export const fetchRecommendedLeads = async (companyId: number): Promise<RecommendedLeads[]> => {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v1/companies/${companyId}/leads`);

  if (!response.ok) {
    const text = await response.text();
    console.error("리드 추천 조회 실패", text);
    throw new Error("리드 추천 조회 실패");
  }

  const json = await response.json();
  console.log("리드 추천 목록", json);
  return json.data;
};
