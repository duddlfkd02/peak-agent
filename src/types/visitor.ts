export interface CompanyInfo {
  id: number;
  companyName: string;
  industry: string;
  sales: number;
  totalFunding: number;
  address: string;
  email: string;
  homepage: string;
  keyExecutive: string;
  phoneNumber: string;
}

export interface ChatMessage {
  id: number;
  contents: string;
  createdAt: string;
  updatedAt: string;
  roomId: number;
}

export interface ChatSummary {
  summary: string;
}
