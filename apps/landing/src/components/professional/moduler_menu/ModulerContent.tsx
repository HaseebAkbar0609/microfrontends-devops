"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaThumbsUp,
  FaLock,
  FaCalculator,
  FaShoppingCart,
  FaCog,
} from "react-icons/fa";
import { AiOutlineProject, AiOutlineDatabase } from "react-icons/ai";
import {
  MdOutlinePeople,
  MdOutlineGavel,
  MdOutlineAnalytics,
} from "react-icons/md";
import { FiSearch } from "react-icons/fi";

export interface Item {
  name: string;
  icon: React.ReactNode;
  highlight?: boolean;
  path?: string;
}

export interface Section {
  title: string;
  description: string;
  items: Item[];
}

/**
 * Named export modulerData so MobileMenu can import exact same items.
 */
export const modulerData: Section[] = [
  {
    title: "AFFÄR",
    description: "Hantera dina affärer på ett enkelt sätt",
    items: [
      { name: "OFFERT", icon: <FaThumbsUp />, highlight: true, path: "/professional/offer" },
      { name: "B2B", icon: <FaLock />, path: "/professional/B2b_page" },
      { name: "KALKYL", icon: <FaCalculator />, path: "/professional/Calculation" },
    ],
  },
  {
    title: "PRODUKTION",
    description: "Smarta produktionsmoduler",
    items: [
      { name: "PROJEKTERING", icon: <AiOutlineProject />, highlight: true, path: "/professional/Project_Design" },
      { name: "KMA", icon: <FaCog />, path: "/professional/KMA" },
      { name: "ORDER", icon: <FaCog />, highlight: true, path: "/professional/Order" },
      { name: "PROJEKT", icon: <AiOutlineProject />, path: "/professional/Project" },
      { name: "INKÖP", icon: <FaShoppingCart />, path: "/professional/Purchase" },
      { name: "MATERAIL - LAGER", icon: <FaCog />, path: "/professional/Machine" },
      { name: "FORDON", icon: <FaCog />, path: "/professional/Machine" },
      { name: "MASKIN", icon: <FaCog />, path: "/professional/Machine" },
      { name: "ÅTKOMST", icon: <FaCog />, path: "/professional/Machine" },
    ],
  },
  {
    title: "EKONOMISTYRNING",
    description: "Full kontroll över ekonomi",
    items: [
      { name: "EKONOMI", icon: <MdOutlineAnalytics />, highlight: true, path: "/professional/Economy" },
      { name: "FAKTURA", icon: <AiOutlineProject />, path: "/professional/Invoice" },
      { name: "PROGNOS", icon: <MdOutlineAnalytics />, path: "/professional/Forecast" },
      { name: "PERSONAL", icon: <MdOutlinePeople />, path: "/professional/Personal" },
      { name: "INKASSO", icon: <FiSearch />, path: "/professional/Collection" },
      { name: "JURIDIK", icon: <MdOutlineGavel />, path: "/professional/Legal" },
    ],
  },
  {
    title: "AFFÄRSSTÖD",
    description: "Hantera hela företaget",
    items: [
      { name: "AVTAL", icon: <AiOutlineProject />, highlight: true, path: "/professional/Agreement" },
      { name: "MALLAR", icon: <AiOutlineDatabase />, highlight: true, path: "/professional/Goods" },
      { name: "MARKNAD-SÅLJ", icon: <FiSearch />, path: "/professional/Market" },
      { name: "DATA-IT", icon: <AiOutlineDatabase />, path: "/professional/Data" },
      { name: "LEDNINGSSTÖD", icon: <FaCog />, path: "/professional/Management" },
    ],
  },
];

const ModulerContent: React.FC = () => {
  // reuse exported modulerData as source of truth
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const data = modulerData;

  return (
    <div className="container mx-auto py-10 px-4 ml-5">
      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-4 gap-8 p-6">
        {data.map((section, index) => (
          <div key={index} className="flex flex-col">
            <div className="bg-[#FF914D] text-white px-4 py-2 mb-2 rounded-xl flex flex-col justify-between h-20">
              <p className="font-bold text-sm leading-5">{section.title}</p>
              <p className="text-xs leading-4 font-normal">{section.description}</p>
            </div>

            <div className="flex flex-col gap-3">
              {section.items.map((item, idx) => {
                const Card = (
                  <div
                    className={`flex items-center gap-2 px-3 py-2 border text-sm transition-all duration-200 cursor-pointer 
                      ${
                        item.highlight
                          ? "border-[#D8D8D8] hover:border-[#E97B3D] hover:text-[#E97B3D]"
                          : "border-[#D8D8D8] text-gray-700 hover:shadow-md"
                      } hover:shadow-md`}
                    style={{ borderRadius: "2px" }}
                  >
                    <span className="text-base text-black">{item.icon}</span>
                    <span className="font-medium">{item.name}</span>
                  </div>
                );

                return item.path ? (
                  <Link key={idx} href={item.path}>
                    {Card}
                  </Link>
                ) : (
                  <div key={idx}>{Card}</div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Accordion */}
      <div className="md:hidden flex flex-col gap-4">
        {data.map((section, index) => (
          <div key={index} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center bg-[#FF914D] text-white px-4 py-3 text-left"
            >
              <div>
                <p className="font-bold text-sm">{section.title}</p>
                <p className="text-xs">{section.description}</p>
              </div>
              <span>{openIndex === index ? "−" : "+"}</span>
            </button>

            {openIndex === index && (
              <div className="p-4 flex flex-col gap-3 bg-white">
                {section.items.map((item, idx) => {
                  const Card = (
                    <div
                      className={`flex items-center gap-2 px-3 py-2 border text-sm transition-all duration-200 cursor-pointer 
                        ${
                          item.highlight
                            ? "border-[#D8D8D8] hover:border-[#E97B3D] hover:text-[#E97B3D]"
                            : "border-[#D8D8D8] text-gray-700 hover:shadow-md"
                        } hover:shadow-md`}
                      style={{ borderRadius: "2px" }}
                    >
                      <span className="text-base text-black">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                  );

                  return item.path ? (
                    <Link key={idx} href={item.path}>
                      {Card}
                    </Link>
                  ) : (
                    <div key={idx}>{Card}</div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModulerContent;
