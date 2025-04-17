import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import { useSearchStore } from "@/store/useSearchStore";

export default function AgentChatSection() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const { pdfSummary } = useSearchStore();
  console.log("zustand pdfSummary", pdfSummary);

  const handleSubmit = () => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, message]);
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">Agent</h2>

      <div className="flex flex-1 flex-col justify-end">
        <div className="mb-4 flex-1 space-y-2 overflow-y-auto rounded p-4 text-sm text-muted">
          {messages.length === 0 ? (
            Object.keys(pdfSummary || {}).length > 0 ? (
              <pre className="whitespace-pre-wrap text-left text-muted-foreground">
                {JSON.stringify(pdfSummary, null, 2)}
              </pre>
            ) : (
              <p className="text-muted-foreground">아직 요약된 내용이 없습니다.</p>
            )
          ) : (
            messages.map((msg, index) => (
              <div key={index} className="rounded px-4 py-2 text-white">
                {msg}
              </div>
            ))
          )}
        </div>

        {/* 채팅 입력창 영역 */}
        <div className="relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={handleKeyDown}
            placeholder="궁금한 내용을 입력해보세요."
            className="min-h-[120px] w-full resize-none pr-24 text-sm text-muted placeholder:text-muted sm:text-base"
          />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <Button size="icon" variant="ghost" className="bg-primary" onClick={handleSubmit}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
