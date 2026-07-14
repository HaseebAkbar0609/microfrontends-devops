import Link from "next/link";
import { MoreVertical } from "lucide-react";
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
	icon: Icon,
	href,
	className,
}: StatItemProps) {
	return (
		<Link
			href={href}
			className={cn(
				"flex flex-1 flex-col gap-4 rounded-xl bg-gray-100 p-4 transition-colors cursor-pointer hover:bg-gray-200/70",
				className,
			)}
		>
			<div className="flex items-center justify-between">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
					<Icon className="h-5 w-5 text-slate-800" />
				</div>
				<MoreVertical className="h-4 w-4 text-slate-500" aria-hidden />
			</div>

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
