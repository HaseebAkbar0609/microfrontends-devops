"use client";

import React, { useState, useRef, useEffect } from "react";
import Service from "../../components/professional/Service";

interface Props {
  label?: string;
}

const DropdownBranscher: React.FC<Props> = ({ label = "Branscher" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (hoverTimeout.current) {
      clearTimeout(hoverTimeout.current);
      hoverTimeout.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsOpen(false);
      hoverTimeout.current = null;
    }, 150); // short delay to prevent flicker
  };

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <div className="px-4 text-[#5B5B5B] hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200 cursor-pointer">
        {label}
      </div>

      {/* Background Blur Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-xs z-[9998] pointer-events-none transition-opacity duration-300" />
      )}

      {/* Dropdown Panel */}
      <div
        className={`absolute left-3/2 top-full -translate-x-1/2 mt-5 w-[1000px] max-w-[100vw] bg-white border border-gray-200 rounded-2xl shadow-2xl transform transition-all duration-300 ease-in-out z-[9999] ${
          isOpen
            ? "opacity-100 visible translate-y-0 scale-100"
            : "opacity-0 invisible -translate-y-2 scale-95"
        }`}
        style={{
          maxHeight: "90vh", // never taller than viewport
          transformOrigin: "top center",
        }}
      >
        <div
          className="p-4"
          style={{
            transform: "scale(0.8)", // slightly smaller look
            transformOrigin: "top center",
          }}
        >
          <Service />
        </div>
      </div>
    </div>
  );
};

export default DropdownBranscher;
