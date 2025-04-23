"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const goToMain = () => {
    router.push("/");
  };

  return (
    <header className="fixed left-0 top-0 z-50 flex w-full items-center justify-start bg-darkgray px-6 py-4">
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
    </header>
  );
}
