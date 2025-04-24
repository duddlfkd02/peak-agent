import AiChatSection from "./\bAiChatSection";
import AdminResultSection from "./AdminResultSection";

export default function AdminPage() {
  return (
    <main className="grid h-screen grid-cols-1 gap-4 overflow-hidden px-5 pb-5 pt-[75px] lg:grid-cols-[2fr_1fr]">
      <AiChatSection />
      <AdminResultSection />
    </main>
  );
}
