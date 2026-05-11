import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

interface StatItemProps {
	title: string;
	value: string;
	icon: LucideIcon;
	href: string;
	className?: string;
}

export function StatItem({
	title,
	value,
	// icon: Icon,
	href,
	className,
}: StatItemProps) {
	return (
		<Link
			href={href}
			className={cn(
				"flex flex-1 flex-col gap-4 rounded-xl bg-gray-100 p-4 transition-colors cursor-pointer",
				className,
			)}
		>
			{/* Top row: icon left, ellipsis right */}
			{/* <div className="flex items-center justify-between">
				<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm">
					<Icon className="h-4.5 w-4.5 text-slate-600" />
				</div>
			</div> */}

			{/* Title and value */}
			<div className="flex flex-col gap-1">
				<span
					className="text-base font-semibold leading-snug"
					style={{ color: "var(--ui-text-primary)" }}
				>
					<Translate text={title} />
				</span>
				<span className="text-sm text-slate-500">
					<Translate text={value} />
				</span>
			</div>
		</Link>
	);
}
