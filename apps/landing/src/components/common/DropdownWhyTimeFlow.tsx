"use client";
import { useState, useRef } from "react";
import Link from "next/link";

const DropdownWhyTimeFlow = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const items = [
    { label: "Varför TimeFlow", path: "/professional/whytimeflow" },
    { label: "Jämför projektverktyg", path: "/professional/comparison" },
    { label: "App TimeFlow Work", path: "/professional/AppWork" },
    { label: "Framgångshistorier från proffs", path: "/professional/#success_story" },
    { label: "Så fungerar det", path: "/professional/howitworks" },
    { label: "Smarta funktioner", path: "/professional/#smart-features" },
    { label: "ROI-kalkylator", path: "/professional/roi_calculator" },
  ];

  const handleMouseEnter = () => setIsOpen(true);
  const handleMouseLeave = () => setIsOpen(false);

  const handleItemClick = () => {
    setIsOpen(false); // 👈 closes when clicking a link
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
        Varför TimeFlow
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

export default DropdownWhyTimeFlow;
