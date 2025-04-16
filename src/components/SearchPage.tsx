"use client";

import { useSearchStore } from "@/store/useSearchStore";
import SearchInput from "@/components/SearchInput";
import { useRouter } from "next/navigation";

export default function SearchPage() {
  const { setSearchText, setPdfSummary } = useSearchStore();
  const router = useRouter();

  // 사용자 검색어 기준
  const handleSearch = (query: string) => {
    console.log("검색 내용", query);
    setSearchText(query);
    router.push("/agent");
    // 에이전트 또는 api 요청
  };

  // pdf 요약 api
  const handleUpload = async (file: File) => {
    console.log("첨부한 파일", file);

    const response = await fetch("http://localhost:8000//api/analyze-pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        profile_id: 1
      })
    });
    const result = await response.json();
    console.log("요약 결과", result.analysis);
    setPdfSummary(result.analysis);
    router.push("/agent");
  };

  return (
    <main className="m-6 flex flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl text-white">PEAK Agent에게 무엇이든 물어보세요</h1>
      <SearchInput onSearch={handleSearch} onUpload={handleUpload} />
    </main>
  );
}
