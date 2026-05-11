"use client";

import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import { Translate } from "@/utils/translation/translate";

interface DashboardMenuItem {
	id: string;
	label: string;
	icon: LucideIcon;
}

interface DashboardMenuCardProps {
	items: DashboardMenuItem[];
	children?: ReactNode;
}

export default function DashboardMenuCard({ items, children }: DashboardMenuCardProps) {
	return (
		<div className="rounded-md border border-slate-200 bg-slate-50 p-4">
			{children ?? (
				<ul className="space-y-3 text-sm">
					{items.map((item) => {
						const Icon = item.icon;
						return (
							<li key={item.id} className="flex items-center gap-2 text-slate-700">
								<Icon size={16} className="text-slate-500" />
								<Translate text={item.label} />
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
