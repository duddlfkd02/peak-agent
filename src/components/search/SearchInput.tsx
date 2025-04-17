"use client";

import { useState } from "react";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

import PdfUploader from "../common/PdfUploader";

interface SearchInputProps {
  onSearch: (query: string) => void;
  onUpload: (file: File) => void;
}

export default function SearchInput({ onSearch, onUpload }: SearchInputProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    onSearch(message);
    setMessage("");
  };

  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <Textarea
        placeholder="회사소개서를 업로드 하거나, 궁금한 내용을 입력해보세요."
        className="min-h-[120px] w-full resize-none overflow-hidden whitespace-pre-wrap break-words border border-primary bg-foreground pr-24 text-sm text-muted placeholder:text-muted sm:text-base"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <PdfUploader onUpload={onUpload} />
        <Button onClick={handleSubmit} size="icon" variant="default" className="text-white">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
