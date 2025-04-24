"use client";
import { CircleUserRound } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const goToMain = () => {
    router.push("/");
  };

  const goToAdmin = () => {
    router.push("/admin");
  };

  return (
    <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-start bg-darkgray px-6 py-4">
      <div className="flex w-full items-center justify-between">
        <Image
          priority
          src="/logo/PEAK-simple-logo.svg"
          alt="peak logo"
          width={80}
          height={40}
          onClick={goToMain}
          style={{ width: 80, height: 40 }}
          className="cursor-pointer"
        />
        <CircleUserRound onClick={goToAdmin} className="cursor-pointer" />
      </div>
    </header>
  );
}
