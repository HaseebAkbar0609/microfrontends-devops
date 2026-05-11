"use client";
import { useState, useRef } from "react";
import Link from "next/link";

const DropdownOmOss = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const items = [
    { label: "Om oss", path: "/professional/about-us" },
    { label: "FAQ", path: "/professional/faq" },
    { label: "Nyhetsrum", path: "/professional/newsroom" },
    { label: "Kunskap", path: "/professional/kunskap" },
    { label: "Allmänna villkor", path: "/professional/terms" },
    { label: "Cookies", path: "/professional/cookie" },
    { label: "Support", path: "/professional/support" },
    { label: "Kontakta oss", path: "/professional/#contact" },
  ];

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  const handleItemClick = () => {
    setIsOpen(false); // 👈 close dropdown after click
  };

  return (
    <div
      className="relative inline-block"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dropdown Trigger */}
      <button className="px-4 text-[#5B5B5B] hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200">
        Om oss
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl transition-all duration-300 ease-in-out z-[9999] ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.path}
            onClick={handleItemClick} // 👈 close on click
            className="block px-4 py-2 text-[#333333] hover:bg-primary-500 hover:text-white rounded-lg transition-colors duration-200"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DropdownOmOss;
