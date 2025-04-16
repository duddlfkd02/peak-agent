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
    <div>
      <Input
        placeholder="회사소개서를 업로드 하거나, 궁금한 내용을 입력해보세요. 
      "
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <PdfUploader onUpload={onUpload} />
      <Button onClick={handleSubmit} size="icon" variant="default">
        <SendHorizonal className="h-4 w-4" />
      </Button>
    </div>
  );
}
