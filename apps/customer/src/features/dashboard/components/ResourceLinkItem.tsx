import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Translate } from "@/utils/translation/translate";

interface ResourceLinkItemProps {
	label: string;
	icon: LucideIcon;
	href: string;
}

export function ResourceLinkItem({
	label,
	icon: Icon,
	href,
}: ResourceLinkItemProps) {
	return (
		<Link
			href={href}
			className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-slate-50 transition-colors group"
		>
			<Icon className="w-4.5 h-4.5 text-slate-500 flex-shrink-0 group-hover:text-slate-700 transition-colors" />
			<span
				className="text-sm font-medium leading-normal"
				style={{ color: "var(--ui-text-secondary)" }}
			>
				<Translate text={label} />
			</span>
		</Link>
	);
}
