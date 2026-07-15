import Link from "next/link";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";

interface StatItemProps {
	title: string;
	value: string;
	href: string;
	className?: string;
}

export function StatItem({ title, value, href, className }: StatItemProps) {
	return (
		<Link
			href={href}
			className={cn(
				"flex flex-1 flex-col gap-1 rounded-xl bg-gray-100 p-4 transition-colors cursor-pointer hover:bg-gray-200/70",
				className,
			)}
		>
			<span
				className="text-base font-semibold leading-snug"
				style={{ color: "var(--ui-text-primary)" }}
			>
				<Translate text={title} />
			</span>
			<span className="text-sm text-slate-500">
				<Translate text={value} />
			</span>
		</Link>
	);
}
