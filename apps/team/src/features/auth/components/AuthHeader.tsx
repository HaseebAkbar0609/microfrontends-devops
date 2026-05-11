import Image from "next/image";
import { LanguageDropdown } from "./LanguageDropdown";

export function AuthHeader() {
  return (
    <header className="bg-white p-4 px-12 flex items-center justify-between sticky z-100 top-0">
      <Image
        src="/images/logo.png"
        alt="TimeFlow Logo"
        width={200}
        height={100}
        className="object-contain w-[170px]"
      />
      <LanguageDropdown />
    </header>
  );
}
