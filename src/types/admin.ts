// 순수 서버 응답 데이터
export interface AdminChat {
  id: number;
  fromCompanyName: string;
  toCompanyName: string;
  fromId?: string | null;
  toId?: string | null;
  contents: string;
  createdAt: string;
}

// 상태관리 전용 확장 타입
export interface TypingChat extends AdminChat {
  isTyping?: boolean;
  fullContents?: string;
}

export interface AdminChatResponse {
  message: string;
  data: {
    roomId: number;
    chats: AdminChat[];
  };
}

export interface RecommendedLeads {
  id: number;
  leadCompanyName: string;
  leadScore: number;
}
