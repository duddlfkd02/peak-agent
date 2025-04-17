import AgentDataSection from "./AgentDataSection";
import AgentToolSection from "./AgentToolSection";
import AgentChatSection from "./AgentChatSection";
import type { PdfUploaderProps } from "@/components/common/PdfUploader";

export default function AgentPage({ onUpload }: PdfUploaderProps) {
  return (
    <main className="grid grid-cols-1 gap-4 p-5 lg:grid-cols-3">
      <AgentDataSection onUpload={onUpload} />
      <AgentChatSection />
      <AgentToolSection />
    </main>
  );
}
