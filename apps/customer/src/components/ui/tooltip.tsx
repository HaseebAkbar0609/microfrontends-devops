"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface TooltipProps {
	children: React.ReactNode;
	content: React.ReactNode;
	className?: string;
	position?: "top" | "bottom" | "left" | "right";
}

const Tooltip = ({
	children,
	content,
	className,
	position = "top",
}: TooltipProps) => {
	const [isVisible, setIsVisible] = useState(false);

	const positionClasses = {
		top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
		bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
		left: "right-full top-1/2 -translate-y-1/2 mr-2",
		right: "left-full top-1/2 -translate-y-1/2 ml-2",
	};

	const arrowClasses = {
		top: "top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-x-4 border-t-4",
		bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-x-4 border-b-4",
		left: "left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-y-4 border-l-4",
		right: "right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-y-4 border-r-4",
	};

	return (
		<div
			className="relative flex items-center"
			onMouseEnter={() => setIsVisible(true)}
			onMouseLeave={() => setIsVisible(false)}
			onClick={() => setIsVisible(!isVisible)}
		>
			{children}
			{isVisible && (
				<div
					className={cn(
						"absolute z-50 whitespace-nowrap",
						"px-3 py-1.5 text-xs font-medium text-white bg-slate-800 rounded-md shadow-lg transition-all animate-in fade-in zoom-in-95 duration-200",
						positionClasses[position],
						className,
					)}
				>
					{content}
					{/* Arrow */}
					<div className={cn("absolute", arrowClasses[position])} />
				</div>
			)}
		</div>
	);
};

export { Tooltip };
