import { create } from "zustand";

interface SearchState {
  searchText: string;
  setSearchText: (text: string) => void;

  pdfSummary: string;
  setPdfSummary: (summary: string) => void;

  uploadedPdfs: File[]; // 사용자가 업로드 한 모든 pdf 파일 저장 (읽기만 가능)
  addPdf: (file: File) => void;

  selectedPdf: File | null; // 사용자가 선택한 pdf 1개만 저장
  setSelectedPdf: (file: File) => void;

  selectedPdfs: File[]; // 사용자가 선택한 여러개의 pdf 저장  (다중 선택 시 사용)
  toggleSelectedPdf: (file: File) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  searchText: "",
  setSearchText: (text) => set({ searchText: text }),

  pdfSummary: "",
  setPdfSummary: (summary) => set({ pdfSummary: summary }),

  uploadedPdfs: [],
  addPdf: (file) => set((state) => ({ uploadedPdfs: [...state.uploadedPdfs, file] })),

  selectedPdf: null,
  setSelectedPdf: (file) => set({ selectedPdf: file }),

  selectedPdfs: [],
  toggleSelectedPdf: (pdf: File) =>
    set((state) => {
      const isSelected = state.selectedPdfs.some((p) => p.name === pdf.name);
      return {
        selectedPdfs: isSelected ? state.selectedPdfs.filter((p) => p.name !== pdf.name) : [...state.selectedPdfs, pdf]
      };
    })
}));
