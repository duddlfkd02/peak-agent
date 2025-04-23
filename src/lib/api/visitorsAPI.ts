import { ChatMessage, ChatSummary, CompanyInfo } from "@/types/visitor";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

// 1. 회사 정보 제공
export const fetchCompanyInfo = async (companyId: number): Promise<CompanyInfo> => {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v1/companies/${companyId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json", "ngrok-skip-browser-warning": "true" }
  });

  if (!response.ok) throw new Error("회사 정보를 불러오는데 실패했습니다.");
  const json = await response.json();
  console.log("json 결과", json.data);
  return json.data;
};

// 2. AI 질의응답
export const fetchChatMessage = async (
  companyId: number,
  contents: string,
  roomId: number | null = null
): Promise<ChatMessage> => {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v2/chats`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ companyId, contents, roomId })
  });

  if (!response.ok) throw new Error("AI 채팅 실패");

  const json = await response.json();
  console.log("채팅 json 결과", json);

  return {
    ...json.data,
    roomId: json.data.room_id
  };
};
// 3. 대화 내역 요약 리포트 - 개발 진행 중 추후 수정
export const fetchChatSummary = async (roomId: number): Promise<ChatSummary> => {
  const response = await fetch(`${NEXT_PUBLIC_API_URL}/api/v2/rooms/${roomId}/summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }
  });

  if (!response.ok) throw new Error("요약 리포트 요청 실패");

  const json = await response.json();
  return json.data;
};
