import { fetchAdminAiChat } from "@/lib/api/adminAPI";
import { useEffect } from "react";

export default function AiChatSection() {
  useEffect(() => {
    const fetchChatData = async () => {
      try {
        const chats = await fetchAdminAiChat(1);
        console.log("Ai chat 목록", chats);
      } catch (error) {
        console.error("error", error);
      }
    };

    fetchChatData();
  }, []);

  return (
    <section className="rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">AI 대화 내역</h2>
      <div className="h-full overflow-y-auto">
        <p>AI 대화 내용 마크다운 형태로 출력</p>
      </div>
    </section>
  );
}
