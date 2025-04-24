export default function AiChatSection() {
  return (
    <section className="rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">AI 대화 내역</h2>
      <div className="h-full overflow-y-auto">
        <p>AI 대화 내용 마크다운 형태로 출력</p>
      </div>
    </section>
  );
}
