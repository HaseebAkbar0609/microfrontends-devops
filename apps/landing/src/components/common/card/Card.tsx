"use client";

import Button from "../button";
import { CardProps } from "./Card.types";

const Card: React.FC<CardProps> = ({ title, description, image, resource }) => {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md transition-all duration-300 ease-in-out relative flex flex-col hover:-translate-y-2 hover:shadow-2xl">
      <div className={`h-[200px] ${image} bg-cover bg-center relative`}></div>
      <div className="px-7 py-8 grow flex flex-col">
        <p className="font-bold header-secondary-size mb-3">{title}</p>
        <p className="content-primary-size text-[#64748b]">{description}</p>
        <ul className="list-none mb-8 grow">
          {resource.slice(0, 4).map((item, key) => (
            <li
              key={key}
              className="py-2 text-sm relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-[#10b981] before:font-bold before:text-sm"
            >
              {item}
            </li>
          ))}
          {resource.length > 4 && (
            <li className="py-2 text-sm relative pl-6 before:content-['✓'] before:absolute before:left-0 before:text-[#10b981] before:font-bold before:text-sm">
              + {resource.length - 4} fler tjänster
            </li>
          )}
        </ul>
        <Button>Läs mer</Button>
      </div>
    </div>
  );
};

export default Card;
