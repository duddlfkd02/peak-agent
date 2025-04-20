"use client";

import { useSearchStore } from "@/store/useSearchStore";

import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";
import { useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";

export default function SearchPage() {
  const { setSearchText, setPdfSummary, addPdf } = useSearchStore();
  const [isloading, setIsLoading] = useState(false);
  const router = useRouter();

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    setIsLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/scout/analyze-pdf/`, {
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
      addPdf(file);
      router.push("/agent");
    } catch (error) {
      console.log("pdf 요약 실패", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex w-full max-w-[700px] flex-col items-center justify-center px-6">
      <h1 className="mb-4 text-2xl text-white">PEAK Agent에게 무엇이든 물어보세요</h1>
      {isloading ? <LoadingSpinner /> : <SearchInput onSearch={handleSearch} onUpload={handleUpload} />}
    </main>
  );
}
