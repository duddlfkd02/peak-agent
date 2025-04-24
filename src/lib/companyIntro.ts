import { CompanyInfo, UIChatMessage } from "@/types/visitor";

export const generateCompanyIntro = ({ industry, companyName }: CompanyInfo): UIChatMessage => {
  if (!industry) {
    return { role: "agent", content: "회사 정보를 불러올 수 없습니다." };
  }

  return {
    role: "agent",
    content: `안녕하세요. ${companyName} 회사 Agent입니다. 저희는 ${industry} 산업을 중점으로 하는 회사입니다. 영업 관련 문의가 있으신가요?`
  };
};
