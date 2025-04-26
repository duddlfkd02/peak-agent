import { create } from "zustand";

interface AdminState {
  selectedLeadId: number | null; // 선택한 기업 id 저장
  setSelectedLeadId: (id: number) => void; // 클릭 시 호출되는 함수
  selectedRoomId: number | null;
  setSelectedRoomId: (id: number) => void;

  selectedLeadName: string | null;
  setSelectedLeadName: (name: string) => void;

  isSelectedLead: boolean; // 리드 선택 되었는지 확인 (컴포넌트 교체 시 사용)
  setIsSelectedLead: (value: boolean) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  selectedLeadId: null,
  selectedRoomId: null,
  selectedLeadName: null,
  isSelectedLead: false,
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),
  setSelectedLeadName: (name) => set({ selectedLeadName: name }),
  setSelectedRoomId: (id) => set({ selectedRoomId: id }),
  setIsSelectedLead: (value) => set({ isSelectedLead: value })
}));
