import { AdminChat } from "@/types/admin";

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchAdminAiChat = async (leadId: number): Promise<AdminChat[]> => {
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
  console.log("chat반환 성공", json.data);
  return json.data.chats;
};
