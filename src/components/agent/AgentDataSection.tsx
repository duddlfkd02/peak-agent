import { useSearchStore } from "@/store/useSearchStore";
import PdfUploader from "../common/PdfUploader";
import type { PdfUploaderProps } from "@/components/common/PdfUploader";

import { FileUp } from "lucide-react";

export default function AgentDataSection({ onUpload }: PdfUploaderProps) {
  const { uploadedPdfs, selectedPdfs, toggleSelectedPdf } = useSearchStore();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">Data</h2>
      <div className="flex w-fit cursor-pointer items-center justify-center rounded-full bg-primary px-3 py-1 text-sm text-white">
        소스 추가하기
        <PdfUploader onUpload={onUpload} />
      </div>

      <ul className="mt-10">
        {uploadedPdfs.map((pdf, index) => (
          <li key={index} className="my-2 flex gap-2 px-2 py-3">
            <FileUp className="h-5 w-5 text-[#FF5A32]" />
            <label htmlFor={`pdf-${index}`} className="cursor-pointer text-sm text-white">
              {pdf.name}
            </label>
            <input
              type="checkbox"
              id={`pdf-${index}`}
              checked={selectedPdfs.some((p) => p.name === pdf.name)}
              onChange={() => toggleSelectedPdf(pdf)}
              className="h-5 w-5 accent-primary"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
