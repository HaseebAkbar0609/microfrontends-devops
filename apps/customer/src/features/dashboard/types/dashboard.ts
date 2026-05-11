import type { LucideIcon } from "lucide-react";

export interface QuickStat {
	id: string;
	title: string;
	value: string;
	href: string;
	icon: LucideIcon;
}

export interface DashboardNewsItem {
	id: string;
	title: string;
	time: string;
	description: string;
}

export interface ResourceLink {
	id: string;
	label: string;
	icon: LucideIcon;
	href: string;
}
