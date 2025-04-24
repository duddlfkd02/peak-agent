import { Button } from "../ui/button";

export default function AdminResultSection() {
  return (
    <section className="rounded-lg bg-foreground p-4">
      <h2 className="mb-4 w-full text-left md:text-lg">리드 회사 정보</h2>
      <div>
        <Button className="w-fit border border-white bg-transparent text-sm">요약 보기</Button>
      </div>
    </section>
  );
}
