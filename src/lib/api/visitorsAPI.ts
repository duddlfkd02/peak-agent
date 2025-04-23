import { ChatMessage, ChatSummary, CompanyInfo } from "@/types/visitor";

// 1. 회사 정보 제공
export const fetchCompanyInfo = async (companyId: number): Promise<CompanyInfo> => {
  // API 완성 전까지 하드코딩 테스트
  return {
    id: companyId,
    companyName: "Example Corp",
    industry: "Technology",
    sales: 1000000.0,
    totalFunding: 500000.0,
    address: "123 Tech Street, San Francisco, CA 94105",
    email: "contact@examplecorp.com",
    homepage: "https://examplecorp.com",
    keyExecutive: "Jane Doe, CEO",
    phoneNumber: "+1-123-456-7890"
  };
};

// 2. AI 질의응답
export const fetchChatMessage = async (
  companyId: number,
  contents: string,
  roomId: number | null = null
): Promise<ChatMessage> => {
  return {
    id: 42,
    contents: "Example Corp의 주요 제품은 클라우드 기반 AI 솔루션입니다.",
    createdAt: "2025-04-23T14:30:00Z",
    updatedAt: "2025-04-23T14:30:00Z",
    roomId: 15
  };
};
// 3. 대화 내역 요약 리포트
export const fetchChatSummary = async (roomId: number): Promise<ChatSummary> => {
  return {
    summary: `<h2>대화 요약</h2><p>Example Corp에 대한 제품 및 서비스 문의로, 주요 AI 솔루션과 가격 정책에 대한 정보를 제공했습니다.</p>`
  };
};

// TODO : API 나오면 fetch로 수정하기
