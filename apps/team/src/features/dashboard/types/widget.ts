import type { LucideIcon } from "lucide-react";
import type { TranslationKeys } from "@/utils/translation/constants";
import type { HOME_WIDGET_IDS } from "../constants/dashboard.constants";

export type HomeWidgetId = (typeof HOME_WIDGET_IDS)[number];

export interface HomeNewsItem {
	id: string;
	titleKey: TranslationKeys;
	dateKey: TranslationKeys;
	bodyKey: TranslationKeys;
}

export type HomeWidgetBody =
	| { kind: "lines"; lines: TranslationKeys[] }
	| { kind: "news"; items: HomeNewsItem[] }
	| { kind: "empty" };

export interface HomeWidget {
	titleKey: TranslationKeys;
	icon: LucideIcon;
	body: HomeWidgetBody;
}
