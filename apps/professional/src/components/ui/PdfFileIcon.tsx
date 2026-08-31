import React from "react";

interface PdfFileIconProps {
	className?: string;
}

export function PdfFileIcon({ className = "h-7 w-[22px]" }: PdfFileIconProps) {
	return (
		<svg
			viewBox="0 0 24 30"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`shrink-0 ${className}`}
		>
			{/* Page Base with rounded corners and folded top-right */}
			<path
				d="M4 2C2.89543 2 2 2.89543 2 4V26C2 27.1046 2.89543 28 4 28H20C21.1046 28 22 27.1046 22 26V9.5L14.5 2H4Z"
				fill="#FFFFFF"
				stroke="#CBD5E1"
				strokeWidth="1.3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>

			{/* Folded Corner Flap */}
			<path
				d="M14.5 2V8C14.5 8.82843 15.1716 9.5 16 9.5H22"
				fill="#F8FAFC"
				stroke="#CBD5E1"
				strokeWidth="1.3"
				strokeLinejoin="round"
			/>

			{/* Red PDF Badge overlapping left edge matching Figma */}
			<rect
				x="0.5"
				y="11"
				width="15.5"
				height="9.5"
				rx="2"
				fill="#DC2626"
			/>

			{/* White Bold PDF Text */}
			<text
				x="8.2"
				y="17.8"
				fill="#FFFFFF"
				fontSize="6.8"
				fontWeight="900"
				fontFamily="Inter, system-ui, -apple-system, sans-serif"
				textAnchor="middle"
				dominantBaseline="central"
				letterSpacing="0.4px"
			>
				PDF
			</text>
		</svg>
	);
}
