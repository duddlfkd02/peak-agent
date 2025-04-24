import { create } from "zustand";
import { persist } from "zustand/middleware";

interface VisitorStore {
  companyId: number | null;
  roomId: number | null;
  setCompanyId: (id: number) => void;
  setRoomId: (id: number) => void;
}

export const useVisitorStore = create<VisitorStore>()(
  persist(
    (set) => ({
      companyId: null,
      roomId: null,
      setCompanyId: (id) => set({ companyId: id }),
      setRoomId: (id) => set({ roomId: id })
    }),
    {
      name: "visitor-store"
    }
  )
);

// 페이지 들어오면 id 저장 -> setCompanyId , 채팅 시작하면 setRoomId에 상태 저장
