"use client";

import { useSearchStore } from "@/store/useSearchStore";

import { useRouter } from "next/navigation";
import SearchInput from "./SearchInput";
import { useState } from "react";
import LoadingSpinner from "../common/LoadingSpinner";
import { fetchAnalyzePdf } from "@/lib/api/analyzePdf";
import { fetchUploadPdf } from "@/lib/api/crudPdf";

export default function SearchPage() {
  const { setSearchText, setPdfSummary, addPdf } = useSearchStore();
  const [isloading, setIsLoading] = useState(false);
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
    setIsLoading(true);

    try {
      const profile = await fetchUploadPdf(94, file); // company_id 94번(휴램프로)으로 하드코딩
      const result = await fetchAnalyzePdf(profile.id);
      setPdfSummary(result);
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
