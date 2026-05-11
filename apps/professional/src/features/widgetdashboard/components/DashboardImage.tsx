import React from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";

interface DashboardImageProps {
    src: string;
    alt: string;
}

export const DashboardImage = ({ src, alt }: DashboardImageProps) => (
    <div className="relative h-[235px] w-full">
        <Image
            src={src}
            alt={alt}
            fill
            className="object-cover rounded-lg"
        />
        <button className="absolute top-3 right-3 bg-white/90 p-2 rounded-md shadow">
            <MoreVertical size={20} />
        </button>
    </div>
);
