"use client";
import Image from "next/image";

export default function Header() {
  return (
    <header className="flex w-full items-center justify-start px-6 py-4">
      <Image src="/logo/PEAK-simple-logo.svg" alt="peak logo" width={80} height={24} />
    </header>
  );
}
