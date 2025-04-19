import { create } from "zustand";
import { persist } from "zustand/middleware";
import { pdfSummary } from "../types/pdfSummary";

export interface UploadedPdfMeta {
  name: string;
  size?: number;
  lastModified?: number;
}

interface SearchState {
  searchText: string;
  setSearchText: (text: string) => void;

  pdfSummary: pdfSummary | null;
  setPdfSummary: (summary: pdfSummary) => void;

  uploadedPdfs: UploadedPdfMeta[];
  addPdf: (file: File) => void;

  selectedPdf: File | null; // 사용자가 선택한 pdf 1개만 저장
  setSelectedPdf: (file: File) => void;

  selectedPdfs: UploadedPdfMeta[]; // 사용자가 선택한 여러개의 pdf 저장  (다중 선택 시 사용)
  toggleSelectedPdf: (pdf: UploadedPdfMeta) => void;
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      searchText: "",
      setSearchText: (text) => set({ searchText: text }),

      pdfSummary: null,
      setPdfSummary: (summary) => set({ pdfSummary: summary }),

      uploadedPdfs: [],
      addPdf: (file) =>
        set((state) => ({
          uploadedPdfs: [
            ...state.uploadedPdfs,
            {
              name: file.name,
              size: file.size,
              lastModified: file.lastModified
            }
          ]
        })),

      selectedPdf: null,
      setSelectedPdf: (file) => set({ selectedPdf: file }),

      selectedPdfs: [],
      toggleSelectedPdf: (pdf: UploadedPdfMeta) =>
        set((state) => {
          const isSelected = state.selectedPdfs.some((p) => p.name === pdf.name);
          return {
            selectedPdfs: isSelected
              ? state.selectedPdfs.filter((p) => p.name !== pdf.name)
              : [...state.selectedPdfs, pdf]
          };
        })
    }),
    {
      name: "search-storage" // localStorage 키 이름
    }
  )
);
