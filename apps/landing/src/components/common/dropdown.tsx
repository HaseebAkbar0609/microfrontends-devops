"use client";

import { useState, useRef } from "react";
import ModulerContent from "../professional/moduler_menu/ModulerContent";

interface DropdownProps {
  label: string;
  noButtonStyle?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ label, noButtonStyle = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  let hoverTimeout: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(hoverTimeout);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  // 👇 closes dropdown when clicked inside
  const handleContentClick = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="relative inline-block"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Dropdown Trigger */}
      <div
        className={`px-4 text-[#5B5B5B] hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200 cursor-pointer content-primary-size ${
          noButtonStyle ? "" : ""
        }`}
      >
        {label}
      </div>

      {/* Fullscreen blur background */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-xs z-[9998] pointer-events-none" />
      )}

      {/* Dropdown Menu (centered under trigger) */}
      <div
        className={`absolute left-3/2 top-full -translate-x-1/2 mt-5 w-[900px] max-w-[95vw] bg-white border border-gray-200 rounded-2xl shadow-2xl transition-all duration-300 ease-in-out z-[9999] overflow-auto max-h-[70vh] ${
          isOpen
            ? "opacity-100 visible translate-y-0 scale-100"
            : "opacity-0 invisible -translate-y-2 scale-95"
        }`}
        style={{ transformOrigin: "top center" }}
        onClick={handleContentClick} // 👈 click inside closes it
      >
        <ModulerContent />
      </div>
    </div>
  );
};

export default Dropdown;
