import AgentDataSection from "./AgentDataSection";
import AgentToolSection from "./AgentToolSection";
import AgentChatSection from "./AgentChatSection";

export default function AgentPage() {
  return (
    <main className="grid h-screen grid-cols-1 gap-4 overflow-hidden px-5 pb-5 pt-[75px] lg:grid-cols-[1fr_3fr_1fr]">
      <AgentDataSection />
      <AgentChatSection />
      <AgentToolSection />
    </main>
  );
}
