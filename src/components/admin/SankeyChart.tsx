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

  // mid 노드  mock 데이터 =  index 기준으로 분류 (⭐️ 추후 api 데이터 수정 필요)
  const getCategories = (i: number): string[] => {
    const categories = [];
    if (i % 2 === 0) categories.push("서비스");
    if (i % 3 === 0) categories.push("교육");
    if (i % 4 === 0) categories.push("IT");
    if (categories.length === 0) categories.push("제조업");
    return categories;
  };

  const leadWithCategory = sortedLeads.map((lead, i) => ({
    ...lead,
    categories: getCategories(i)
  }));

  const fromLabels = sortedLeads.map((lead) => lead.leadCompanyName);
  const midLabels = ["IT", "서비스", "제조업", "교육"];
  const toLabels = leadWithCategory
    .slice()
    .sort((a, b) => b.leadScore - a.leadScore)
    .map((lead) => lead.leadCompanyName);

  const allLabels = [...fromLabels, ...midLabels, ...toLabels];

  // 화살표 흐름 구조 잡기
  const sources: number[] = [];
  const targets: number[] = [];
  const values: number[] = [];

  leadWithCategory.forEach((lead, i) => {
    const fromIndex = i;
    lead.categories.forEach((category) => {
      const midIndex = fromLabels.length + midLabels.indexOf(category);
      const toIndex = fromLabels.length + midLabels.length + toLabels.indexOf(lead.leadCompanyName);

      // from -> mid
      sources.push(fromIndex);
      targets.push(midIndex);
      values.push(toIndex);

      // mid -> to
      sources.push(midIndex);
      targets.push(toIndex);
      values.push(lead.leadScore);
    });
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
              color: values.map((v) => (v > 8 ? "#6A31F6" : v > 6 ? "#A47BFF" : "#E5D9FF"))
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
