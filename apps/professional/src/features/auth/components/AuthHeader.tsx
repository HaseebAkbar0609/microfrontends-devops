"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageDropdown } from "./LanguageDropdown";

export function AuthHeader() {
  const pathname = usePathname();
  const isRegisterPage = pathname === "/register";

  return (
    <header className="bg-white p-4 px-12 flex items-center justify-between sticky z-100 top-0">
      {isRegisterPage ? (
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tighter text-foreground"
        >
          TIMEFLOW<span className="text-primary">.</span>
        </Link>
      ) : (
        <Image
          src="/logo.png"
          alt="TimeFlow Logo"
          width={200}
          height={100}
          className="object-contain w-42.5"
        />
      )}
      <LanguageDropdown />
    </header>
  );
}
