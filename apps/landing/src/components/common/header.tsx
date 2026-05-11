import { HeaderMenu } from "@/configs/index";
import Dropdown from "./dropdown";
import DropdownWhyTimeFlow from "./DropdownWhyTimeFlow";
import DropdownOmOss from "./DropdownOmOss";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <nav className="bg-white text-black p-4 flex justify-center shadow-md relative z-[999]">
      <ul className="flex space-x-6 items-center">
        {HeaderMenu.professional.map((item, index) => (
          <li key={index} className="relative">
            {item.label === "Moduler" ? (
              <Dropdown label={item.label} />
            ) : item.label === "Varför TimeFlow" ? (
              <DropdownWhyTimeFlow />
            ) : item.label === "Om oss" ? (
              <DropdownOmOss />
            ) : (
              <Link href={item.path} className="hover:underline px-4 py-2">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Header;
