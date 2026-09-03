import React from "react";

interface PdfFileIconProps {
	className?: string;
}

export function PdfFileIcon({ className = "h-9 w-7" }: PdfFileIconProps) {
	return (
		<svg
			viewBox="-3.5 0 27.5 30"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`shrink-0 ${className}`}
		>
			{/* Page Base with subtle rounded corners and folded top-right */}
			<path
				d="M3.5 2C2.67 2 2 2.67 2 3.5V26.5C2 27.33 2.67 28 3.5 28H20.5C21.33 28 22 27.33 22 26.5V9.5L14.5 2H3.5Z"
				fill="#FFFFFF"
				stroke="#CBD5E1"
				strokeWidth="1.2"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>

			{/* Folded Corner Flap */}
			<path
				d="M14.5 2V8C14.5 8.82843 15.1716 9.5 16 9.5H22"
				fill="#F8FAFC"
				stroke="#CBD5E1"
				strokeWidth="1.2"
				strokeLinejoin="round"
			/>

			{/* Red PDF Badge shifted further left with subtle radius and balanced padding */}
			<rect
				x="-3.5"
				y="13.5"
				width="18"
				height="11.5"
				rx="1.5"
				fill="#EF4444"
			/>

			{/* White Medium/SemiBold Centered PDF Text with balanced padding */}
			<text
				x="5.5"
				y="19.25"
				fill="#FFFFFF"
				fontSize="6.8"
				fontWeight="600"
				fontFamily="Inter, system-ui, -apple-system, sans-serif"
				textAnchor="middle"
				dominantBaseline="central"
				letterSpacing="0.25px"
			>
				PDF
			</text>
		</svg>
	);
}
