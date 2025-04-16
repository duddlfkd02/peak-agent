"use client";

import SearchInput from "@/components/SearchInput";

export default function SearchPage() {
  const handleSearch = (query: string) => {
    console.log("검색 내용", query);
    // 에이전트 또는 api 요청
  };

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
  };

  return (
    <main className="m-6">
      <h1 className="mb-4 text-2xl font-bold">PEAK Agent에게 무엇이든 물어보세요</h1>
      <SearchInput onSearch={handleSearch} onUpload={handleUpload} />
    </main>
  );
}
