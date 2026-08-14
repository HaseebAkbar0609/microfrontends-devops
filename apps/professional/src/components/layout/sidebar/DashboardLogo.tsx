"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface DashboardLogoProps {
	collapsed?: boolean;
	href?: string;
	className?: string;
	priority?: boolean;
}

export function DashboardLogo({
	collapsed = false,
	href = "/home",
	className,
	priority = true,
}: DashboardLogoProps) {
	const content = (
		<div
			className={cn(
				"relative flex h-7 items-center",
				collapsed ? "w-full justify-center" : "min-w-0 flex-1 justify-start",
				className
			)}
		>
			{/* Short Logo (TF..) - 24px x 18px */}
			<div
				className={cn(
					"flex items-center justify-center transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
					collapsed
						? "opacity-100 scale-100"
						: "pointer-events-none absolute inset-0 scale-95 opacity-0"
				)}
				aria-hidden={!collapsed}
			>
				<Image
					src="/images/logo-short.png"
					alt="TimeFlow"
					width={24}
					height={18}
					className="w-[24px] h-[18px] object-contain shrink-0"
					priority={priority}
				/>
			</div>

			{/* Full Logo (TIMEFLOW..) - 108px x 18px */}
			<div
				className={cn(
					"flex items-center transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
					collapsed
						? "pointer-events-none absolute inset-0 justify-center scale-95 opacity-0"
						: "scale-100 opacity-100"
				)}
				aria-hidden={collapsed}
			>
				<Image
					src="/images/logo-full.png"
					alt="TimeFlow"
					width={108}
					height={18}
					className="w-[108px] h-[18px] object-contain shrink-0"
					priority={priority}
				/>
			</div>
		</div>
	);

	if (!href) {
		return content;
	}

	return (
		<Link
			href={href}
			className={cn(
				"flex items-center transition-opacity hover:opacity-90",
				collapsed ? "w-full justify-center" : "min-w-0 flex-1 justify-start"
			)}
		>
			{content}
		</Link>
	);
}

export default DashboardLogo;
