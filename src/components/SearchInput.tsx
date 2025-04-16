"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
import PdfUploader from "./PdfUploader";

interface SearchInputProps {
  onSearch: (query: string) => void;
  onUpload: (file: File) => void;
}

export default function SearchInput({ onSearch, onUpload }: SearchInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = () => {
    onSearch(input);
    setInput("");
  };

  return (
    <div className="relative mx-auto w-full">
      <Input
        placeholder="회사소개서를 업로드 하거나, 궁금한 내용을 입력해보세요."
        className="m min-h-[100px] whitespace-pre-wrap break-words border border-primary bg-foreground pb-10 text-sm text-muted placeholder:text-muted sm:text-base"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div className="flex gap-2">
        <div className="absolute bottom-4 right-16 text-white">
          <PdfUploader onUpload={onUpload} />
        </div>

        <Button onClick={handleSubmit} size="icon" variant="default" className="absolute bottom-4 right-4 text-white">
          <SendHorizonal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
