import type { LucideIcon } from "lucide-react";
import type { HOME_WIDGET_IDS } from "../constants/dashboard.constants";

export type HomeWidgetId = (typeof HOME_WIDGET_IDS)[number];

export interface HomeNewsItem {
	id: string;
	titleKey: string;
	dateKey: string;
	bodyKey: string;
}

export type HomeWidgetBody =
	| { kind: "lines"; lines: string[] }
	| { kind: "news"; items: HomeNewsItem[] }
	| { kind: "empty" };

export interface HomeWidget {
	titleKey: string;
	icon: LucideIcon;
	body: HomeWidgetBody;
}
