import { create } from "zustand";

interface AdminState {
  selectedLeadId: number | null; // 선택한 기업 id 저장
  setSelectedLeadId: (id: number) => void; // 클릭 시 호출되는 함수
  selectedRoomId: number | null;
  setSelectedRoomId: (id: number) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  selectedLeadId: null,
  selectedRoomId: null,
  setSelectedLeadId: (id) => set({ selectedLeadId: id }),
  setSelectedRoomId: (id) => set({ selectedRoomId: id })
}));
