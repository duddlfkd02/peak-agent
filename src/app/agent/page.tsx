"use client";

import AgentPage from "@/components/agent/AgentPage";
import { useSearchStore } from "@/store/useSearchStore";

export default function AgentPageRoute() {
  const addPdf = useSearchStore((state) => state.addPdf);

  const handleUpload = (file: File) => {
    addPdf(file);
  };

  return <AgentPage onUpload={handleUpload} />;
}
