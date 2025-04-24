import { File } from "lucide-react";

export default function AgentDataSection() {
  return (
    <div className="flex flex-col items-center rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">Data </h2>
      <div className="flex w-fit cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-3 py-2 text-sm text-white">
        소스 추가하기
        <File width={18} height={18} />
      </div>

      <ul className="mt-10 text-sm text-white">
        <li className="text-center text-gray-400">업로드된 PDF 없음</li>
      </ul>
    </div>
  );
}
