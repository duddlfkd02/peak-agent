"use client";

import { useSearchStore } from "@/store/useSearchStore";

export default function AgentPage() {
  const { searchText, pdfSummary } = useSearchStore();

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">🧠 에이전트 프롬프트</h1>
      {searchText && (
        <p>
          검색어: <strong>{searchText}</strong>
        </p>
      )}
      {pdfSummary && (
        <div className="mt-4">
          <p className="text-gray-600">PDF 요약 결과:</p>
          <pre className="rounded bg-gray-100 p-4">{pdfSummary}</pre>
        </div>
      )}
    </main>
  );
}
