"use client";
import { Button } from "@/components/ui/button";

export default function AgentToolSection() {
  const tools = ["Re-mind", "Report", "GPCTBA C&I", "MEDDICC", "경쟁사 분석", "AI 분석", "매너 온도"];
  return (
    <div className="flex flex-col items-center rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">Tool</h2>
      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Button key={tool} className="w-full border border-white bg-transparent text-sm">
            {tool}
          </Button>
          // 각 버튼마다 어떤 역할하는지 논의 필요
        ))}
      </div>
    </div>
  );
}
