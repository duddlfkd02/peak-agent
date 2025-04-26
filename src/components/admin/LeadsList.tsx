"use client";

import { fetchRecommendedLeads } from "@/lib/api/adminAPI";
import { RecommendedLeads } from "@/types/admin";
import { useAdminStore } from "@/store/useAdminStore";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";

export default function LeadsList() {
  const [leads, setLeads] = useState<RecommendedLeads[]>([]);
  const { setSelectedLeadId, setIsSelectedLead, setSelectedLeadName } = useAdminStore(
    useShallow((state) => ({
      setSelectedLeadId: state.setSelectedLeadId,
      setIsSelectedLead: state.setIsSelectedLead,
      setSelectedLeadName: state.setSelectedLeadName
    }))
  );

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

  const handleClick = (leadId: number, name: string) => {
    setSelectedLeadId(leadId);
    setIsSelectedLead(true);
    setSelectedLeadName(name);
  };

  return (
    <section className="h-[calc(100vh-150px)] overflow-hidden rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">리드 추천 목록</h2>
      <table className="w-full table-auto text-center text-sm">
        <thead>
          <tr className="border">
            <th className="border-r py-3">기업명</th>
            <th className="py-3">리드 점수</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="border">
              <td
                className="hover:test-black cursor-pointer border-r py-3 hover:bg-gray-500"
                onClick={() => handleClick(lead.id, lead.leadCompanyName)}
              >
                {lead.leadCompanyName}
              </td>
              <td className="py-3 text-purple-400">{lead.leadScore}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
