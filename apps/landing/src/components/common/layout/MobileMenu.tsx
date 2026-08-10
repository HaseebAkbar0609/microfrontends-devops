"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { HeaderMenu } from "@/configs";
import { modulerData } from "@/components/professional/moduler_menu/ModulerContent";

interface MobileMenuProps {
  currentMenu: string;
  onClose?: () => void;
}

interface SubItem {
  label: string;
  path: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ currentMenu, onClose }) => {
  const { pathname } = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleClick = () => {
    if (onClose) onClose();
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label));
  };

  const renderDropdown = (label: string, subItems: SubItem[]) => (
    <div className="px-4" key={label}>
      <button
        type="button"
        aria-expanded={Boolean(openDropdown === label)}
        aria-controls={`mobile-${label.replace(/\s+/g, "").toLowerCase()}`}
        aria-haspopup="true"
        onClick={() => toggleDropdown(label)}
        className="w-full text-left flex justify-between items-center py-3"
      >
        <span className="text-[#5B5B5B]">{label}</span>
        <span>{openDropdown === label ? "−" : "+"}</span>
      </button>

      {openDropdown === label && (
        <div id={`mobile-${label.replace(/\s+/g, "").toLowerCase()}`} className="pl-4">
          {subItems.map((sub, i) => (
            <Link
              key={i}
              href={sub.path}
              onClick={handleClick}
              className="block py-2 text-[#333] hover:text-primary-500"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
      {HeaderMenu[currentMenu]
        .filter((item) => {
          // Hide "Webinar" entirely on offer page
          if (pathname === "/professional/offer" && item.label.toLowerCase() === "webinar") {
            return false;
          }
          // Show only "On-demand Webinar" on offer page
          if (pathname === "/professional/offer" && item.label.toLowerCase() !== "on-demand webinar") {
            return true;
          }
          // Hide "On-demand Webinar" outside offer page
          if (pathname !== "/professional/offer" && item.label.toLowerCase() === "on-demand webinar") {
            return false;
          }
          return true;
        })
        .map((item, key) => {
          const label = item.label.trim().toLowerCase();

          // Consumer dropdowns
          if (currentMenu === "consumer" && label === "hitta hantverkare") {
            const hittaHantverkareItems: SubItem[] = [
              { label: "Få offer", path: "/home/offer" },
              { label: "Hitta Hantverkare", path: "/home/find-professional" },
              { label: "Så här fungerar det", path: "/home/how-it-works" },
              { label: "App TimeFlow Home", path: "/home/app" },
              { label: "Inspiration", path: "/home/inspiration" },
            ];
            return renderDropdown("Hitta hantverkare", hittaHantverkareItems);
          }

          if (currentMenu === "consumer" && label === "om oss") {
            return renderDropdown("Om oss", [
              { label: "Om oss", path: "/consumer/about-us" },
              { label: "FAQ", path: "/consumer/faq" },
              { label: "Nyhetsrum", path: "/consumer/newsroom" },
              { label: "Kunskap", path: "/consumer/kunskap" },
              { label: "Allmänna villkor", path: "/consumer/terms" },
              { label: "Cookies", path: "/consumer/cookie" },
              { label: "Support", path: "/consumer/support" },
              { label: "Kontakta oss", path: "/consumer/#contact" },
            ]);
          }

          // Professional dropdowns
          if (label === "moduler") {
            const modulerItems = modulerData.flatMap((section) =>
              section.items.map((m) => ({ label: m.name, path: m.path ?? "#" }))
            );
            return renderDropdown("Moduler", modulerItems);
          }

          if (label === "varför timeflow") {
            return renderDropdown("Varför TimeFlow", [
              { label: "Varför TimeFlow", path: "/professional/whytimeflow" },
              { label: "Jämför projektverktyg", path: "/professional/comparison" },
              { label: "App TimeFlow Work", path: "/professional/AppWork" },
              { label: "Framgångshistorier från proffs", path: "/professional/#success_story" },
              { label: "Så fungerar det", path: "/professional/howitworks" },
              { label: "Smarta funktioner", path: "/professional/#smart-features" },
              { label: "ROI-kalkylator", path: "/professional/roi_calculator" },
            ]);
          }

          if (label === "om oss") {
            return renderDropdown("Om oss", [
              { label: "Om oss", path: "/professional/about-us" },
              { label: "FAQ", path: "/professional/faq" },
              { label: "Nyhetsrum", path: "/professional/newsroom" },
              { label: "Kunskap", path: "/professional/kunskap" },
              { label: "Allmänna villkor", path: "/professional/terms" },
              { label: "Cookies", path: "/professional/cookie" },
              { label: "Support", path: "/professional/support" },
              { label: "Kontakta oss", path: "/professional/#contact" },
            ]);
          }

          // Default single link
          return (
            <Link
              key={key}
              href={item.path}
              className="px-4 py-3 block text-[#5B5B5B] hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200"
              onClick={handleClick}
            >
              {item.label}
            </Link>
          );
        })}
    </>
  );
};

export default MobileMenu;
