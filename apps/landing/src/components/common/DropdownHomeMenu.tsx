"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

import { getCustomerRegisterUrl } from "@/utils/constants";

type DropdownHomeMenuProps = {
  label: string;
};

const DropdownHomeMenu: React.FC<DropdownHomeMenuProps> = ({ label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customerRegisterUrl, setCustomerRegisterUrl] = useState<string>("#");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCustomerRegisterUrl(getCustomerRegisterUrl());
  }, []);

  const items = [
    { label: "Offert", path: customerRegisterUrl },
    { label: "Hitta Hantverkare", path: "#industries" },
    { label: "Så här fungerar det", path: "/consumer/how-it-works" },
    { label: "App TimeFlow Home", path: "/consumer/app-home" },
    { label: "Inspiration", path: "/consumer/inspiration" },
  ];

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);
  const handleItemClick = () => setIsOpen(false);

  return (
    <div
      className="relative inline-block"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dropdown Trigger */}
      <button
        className="px-4 text-[#5B5B5B] hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`${label} menu`}
      >
        {label}
      </button>

      {/* Dropdown Menu */}
      <div
        role="menu"
        aria-label={`${label} navigation`}
        className={`absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl transition-all duration-300 ease-in-out z-[9999] ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        {items.map((item, index) => {
          const isExternal = item.path.startsWith("http");
          return isExternal ? (
            <a
              key={index}
              href={item.path}
              onClick={handleItemClick}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-2 text-[#333333] hover:bg-primary-500 hover:text-white rounded-lg transition-colors duration-200"
            >
              {item.label}
            </a>
          ) : (
            <Link
              key={index}
              href={item.path}
              onClick={handleItemClick}
              className="block px-4 py-2 text-[#333333] hover:bg-primary-500 hover:text-white rounded-lg transition-colors duration-200"
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DropdownHomeMenu;
