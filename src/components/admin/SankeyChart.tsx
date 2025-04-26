"use client";

import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import { fetchRecommendedLeads } from "@/lib/api/adminAPI";
import { RecommendedLeads } from "@/types/admin";
import LoadingSpinner from "../common/LoadingSpinner";

export default function SankeyChart() {
  const [leads, setLeads] = useState<RecommendedLeads[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await fetchRecommendedLeads(2);
        setLeads(data);
        if (data.length > 0) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("리드 목록 데이터를 불러오는데 실패했습니다.", error);
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );

  if (!leads.length) return <p className="flex items-center justify-center">추천 리드 데이터가 없습니다.</p>;

  // 점수 기준 정렬
  const sortedLeads = [...leads].sort((a, b) => b.leadScore - a.leadScore);

  // 상중하
  const fromLabels = ["상위 20%", "중위 50%", "하위 30%"];
  const toLabels = sortedLeads.map((lead) => lead.leadCompanyName);
  const allLabels = [...fromLabels, ...toLabels];

  const sources: number[] = [];
  const targets: number[] = [];
  const values: number[] = [];

  sortedLeads.forEach((lead, index) => {
    let groupIndex: number;

    if (index < Math.ceil(sortedLeads.length * 0.2)) {
      groupIndex = 0;
    } else if (index < Math.ceil(sortedLeads.length * 0.2) + Math.ceil(sortedLeads.length * 0.5)) {
      groupIndex = 1;
    } else {
      groupIndex = 2;
    }

    sources.push(groupIndex);
    targets.push(fromLabels.length + index);
    values.push(lead.leadScore);
  });

  return (
    <section className="h-[calc(100vh-150px)] overflow-hidden rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">리드 추천 기업 Sankey Diagram</h2>
      <Plot
        data={[
          {
            type: "sankey",
            orientation: "h",
            node: {
              pad: 20,
              thickness: 10,
              label: allLabels,
              color: "#E5D9FF"
            },
            link: {
              source: sources,
              target: targets,
              value: values,
              color: sortedLeads.map((_, index) => {
                if (index < Math.ceil(sortedLeads.length * 0.2)) {
                  return "#6A31F6";
                } else if (index < Math.ceil(sortedLeads.length * 0.2) + Math.ceil(sortedLeads.length * 0.5)) {
                  return "#A47BFF";
                } else {
                  return "#E5D9FF";
                }
              })
            }
          }
        ]}
        layout={{
          font: { size: 14, color: "#fff", family: "Pretendard, sans-serif" },
          width: 900,
          height: 600,
          paper_bgcolor: "#1F1F1F",
          plot_bgcolor: "#1F1F1F",
          margin: { l: 50, r: 50, t: 30, b: 30 }
        }}
      />
    </section>
  );
}
