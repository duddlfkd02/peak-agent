"use client";

import Plot from "react-plotly.js";
import { useEffect, useState } from "react";
import { fetchRecommendedLeads } from "@/lib/api/adminAPI";
import { RecommendedLeads } from "@/types/admin";

export default function SankeyChart() {
  const [leads, setLeads] = useState<RecommendedLeads[]>([]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await fetchRecommendedLeads(2);
        setLeads(data);
      } catch (error) {
        console.error("리드 목록 데이터를 불러오는데 실패했습니다.", error);
      }
    };

    fetchLeads();
  }, []);

  if (!leads.length) return <p>추천 리드 데이터가 없습니다.</p>;

  // 점수 기준 정렬
  const sortedLeads = [...leads].sort((a, b) => b.leadScore - a.leadScore);

  // 상중하
  const topCount = Math.ceil(leads.length * 0.4); // 상위 40%
  const midCount = Math.ceil(leads.length * 0.3); // 중위 30%

  const groupLabels = ["상", "중", "하"];

  const leadGroups = sortedLeads.map((_, i) => {
    if (i < topCount) return "상";
    else if (i < topCount + midCount) return "중";
    else return "하";
  });

  const fromLabels = [...leads]
    .sort((a, b) => a.leadCompanyName.localeCompare(b.leadCompanyName))
    .map((lead) => lead.leadCompanyName);
  const toLabels = [...leads].sort((a, b) => b.leadScore - a.leadScore).map((lead) => lead.leadCompanyName);
  const allLabels = [...fromLabels, ...groupLabels, ...toLabels];

  const sources = [
    ...fromLabels.map((_, i) => i),
    ...leadGroups.map((group) => fromLabels.length + groupLabels.indexOf(group)) // 중간지점 → 오른쪽 (점수순정렬)
  ];

  const targets = [
    ...leadGroups.map((group) => fromLabels.length + groupLabels.indexOf(group)),
    ...toLabels.map((_, i) => fromLabels.length + groupLabels.length + i) // 중간지점 → 오른쪽 (점수순정렬)
  ];

  const values = [
    ...sortedLeads.map((lead) => lead.leadScore),
    ...sortedLeads.map((lead) => lead.leadScore) // 중간지점 → 오른쪽 (점수순정렬)
  ];

  return (
    <section className="h-[calc(100vh-150px)] overflow-hidden rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">리드 추천 기업 생키 다이어그램</h2>
      <Plot
        data={[
          {
            type: "sankey",
            orientation: "h",
            node: {
              pad: 15,
              thickness: 20,
              label: allLabels,
              // color: "#6A31F6"
              color: [
                ...Array(fromLabels.length).fill("#C5A3FF"),
                ...groupLabels.map((g) => (g === "상" ? "#ed937c" : g === "중" ? "#fded36" : "#ceff96")),
                ...Array(toLabels.length).fill("#A07EFF")
              ]
            },
            link: {
              source: sources,
              target: targets,
              value: values,
              color: values.map((v) => `rgba(138, 43, 226, ${v / 10})`)
            }
          }
        ]}
        layout={{
          font: { size: 14 },
          width: 900,
          paper_bgcolor: "#1F1F1F",
          plot_bgcolor: "#1F1F1F",
          margin: { l: 50, r: 50, t: 30, b: 30 }
        }}
      />
    </section>
  );
}
