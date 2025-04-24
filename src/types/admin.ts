export interface AdminChat {
  id: number;
  fromCompanyName: string;
  toCompanyName: string;
  contents: string;
  createdAt: string;
}

// AdminChat의 반환값 중 필수적으로 사용되는 부분만 정의함
// 이후 추가 사항이 필요할 경우 아래처럼 확장해서 정의 필요

export interface AdminChatResponse {
  message: string;
  data: {
    roomId: number;
    chats: AdminChat[];
  };
}
