import { Clock } from "lucide-react";

import type { DashboardNewsItem } from "@/features/dashboard/types/dashboard";
import { Translate } from "@/utils/translation/translate";

interface DashboardNewsItemProps {
	item: DashboardNewsItem;
}

export function DashboardNewsItemCard({ item }: DashboardNewsItemProps) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex flex-col gap-1">
				<p
					className="text-sm font-semibold leading-snug"
					style={{ color: "var(--ui-text-secondary)" }}
				>
					<Translate text={item.title}/>
				</p>
				<div className="flex items-center gap-2">
					<Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
					<span
						className="text-sm"
						style={{ color: "var(--ui-text-muted)" }}
					>
						<Translate text={item.time}/>
					</span>
				</div>
			</div>
			<p
				className="text-sm leading-normal line-clamp-3"
				style={{ color: "var(--ui-text-secondary)" }}
			>
					<Translate text={item.description}/>
			</p>
		</div>
	);
}
