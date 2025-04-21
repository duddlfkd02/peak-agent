"use client";

import AgentPage from "@/components/agent/AgentPage";
import { fetchUploadPdf } from "@/lib/api/crudPdf";
import { useSearchStore } from "@/store/useSearchStore";

export default function AgentPageRoute() {
  const addPdf = useSearchStore((state) => state.addPdf);

  const handleUpload = async (file: File) => {
    addPdf(file);
    const profile = await fetchUploadPdf(94, file); // company_id 94번(휴램프로)으로 하드코딩
  };

  return <AgentPage onUpload={handleUpload} />;
}
