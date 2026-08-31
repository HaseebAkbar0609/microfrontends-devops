import React from "react";

interface MachineSectionIconProps {
	className?: string;
}

export function MachineSectionIcon({ className = "h-4 w-4" }: MachineSectionIconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			role="img"
			className={className}
		>
			<path d="M16 2v2" />
			<path d="M8 2v2" />
			<rect x="3" y="4" width="18" height="18" rx="2" />
			<circle cx="12" cy="11" r="3" />
			<path d="M17 18.5a5 5 0 0 0-10 0" />
		</svg>
	);
}
