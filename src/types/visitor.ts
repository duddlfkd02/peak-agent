export interface CompanyInfo {
  id: number;
  companyName: string;
  industry: string;
  sales: number;
  totalFunding: number;
  address: string;
  email: string;
  homepage: string;
  keyExecutive: string;
  phoneNumber: string;
}

// 백엔드에서 응답받는 DB 기반 타입
export interface ChatMessage {
  id: number;
  contents: string;
  createdAt: string;
  updatedAt: string;
  roomId: number;
}

// 프론트 UI 렌더링용으로 사용
export interface UIChatMessage {
  role: "user" | "agent" | "system";
  content: string;
}

export interface ChatSummary {
  summary: string;
}
