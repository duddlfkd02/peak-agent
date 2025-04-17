import { Button } from "@/components/ui/button";
import { FileUp } from "lucide-react";
import { useRef } from "react";

export interface PdfUploaderProps {
  onUpload: (file: File) => void;
}

export default function PdfUploader({ onUpload }: PdfUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };
  return (
    <>
      <Button size="icon" onClick={handleIconClick} className="text-white">
        <FileUp className="h-5 w-5" />
        <input type="file" accept=".pdf" onChange={handleFileChange} className="hidden" ref={fileInputRef} />
      </Button>
    </>
  );
}
