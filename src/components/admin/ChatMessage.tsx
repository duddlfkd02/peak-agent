import { TypingChat } from "@/types/admin";
import AgentSymbol from "../common/AgentSymbol";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  chat: TypingChat;
  isMyCompany: boolean;
}

export default function ChatMessage({ chat, isMyCompany }: ChatMessageProps) {
  return (
    <div
      key={`${chat.id}-${chat.createdAt}`}
      className={`flex ${isMyCompany ? "justify-end" : "justify-start"} w-full p-2`}
    >
      <div className={`flex items-start gap-4 ${isMyCompany ? "flex-row-reverse" : "flex-row"}`}>
        <AgentSymbol />
        <div
          className={`${
            isMyCompany ? "bg-primary text-white" : "bg-darkgray text-foreground"
          } my-2 max-w-[70%] rounded-xl p-4`}
        >
          <div className="prose prose-invert max-w-none break-words text-sm prose-p:mb-2">
            <ReactMarkdown>{chat.contents}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
