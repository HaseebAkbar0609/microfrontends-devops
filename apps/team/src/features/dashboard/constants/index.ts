import {
	ChartColumn,
	Folder,
	Image as ImageIcon,
	Newspaper,
	ShieldCheck,
	Table2,
	UserRound,
} from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import type { HomeWidget, HomeWidgetId } from "../types";

export const HOME_WIDGETS: Record<HomeWidgetId, HomeWidget> = {
	stats: {
		titleKey: localizationConstants.statsTitle,
		icon: Table2,
		body: {
			kind: "lines",
			lines: [
				localizationConstants.statsLineOne,
				localizationConstants.statsLineTwo,
				localizationConstants.statsLineThree,
			],
		},
	},
	kpiStatus: {
		titleKey: localizationConstants.kpiStatusTitle,
		icon: Folder,
		body: {
			kind: "lines",
			lines: [
				localizationConstants.kpiLineOne,
				localizationConstants.kpiLineTwo,
				localizationConstants.kpiLineThree,
				localizationConstants.kpiLineFour,
			],
		},
	},
	users: {
		titleKey: localizationConstants.usersTitle,
		icon: Table2,
		body: {
			kind: "lines",
			lines: [
				localizationConstants.usersLineOne,
				localizationConstants.usersLineTwo,
				localizationConstants.usersLineThree,
				localizationConstants.usersLineFour,
			],
		},
	},
	economy: {
		titleKey: localizationConstants.economyTitle,
		icon: ShieldCheck,
		body: {
			kind: "lines",
			lines: [
				localizationConstants.economyLineOne,
				localizationConstants.economyLineTwo,
			],
		},
	},
	vehicles: {
		titleKey: localizationConstants.vehiclesTitle,
		icon: ShieldCheck,
		body: {
			kind: "lines",
			lines: [
				localizationConstants.vehiclesLineOne,
				localizationConstants.vehiclesLineTwo,
				localizationConstants.vehiclesLineThree,
			],
		},
	},
	keys: {
		titleKey: localizationConstants.keysTitle,
		icon: UserRound,
		body: {
			kind: "lines",
			lines: [
				localizationConstants.keysLineOne,
				localizationConstants.keysLineTwo,
				localizationConstants.keysLineThree,
			],
		},
	},
	news: {
		titleKey: localizationConstants.newsTitle,
		icon: Newspaper,
		body: {
			kind: "news",
			items: [
				{
					id: "news-global",
					titleKey: localizationConstants.newsGlobalTitle,
					dateKey: localizationConstants.newsGlobalDate,
					bodyKey: localizationConstants.newsGlobalBody,
				},
				{
					id: "news-sweden",
					titleKey: localizationConstants.newsSwedenTitle,
					dateKey: localizationConstants.newsSwedenDate,
					bodyKey: localizationConstants.newsSwedenBody,
				},
			],
		},
	},
	graph: {
		titleKey: localizationConstants.menuGraph,
		icon: ChartColumn,
		body: { kind: "empty" },
	},
	image: {
		titleKey: localizationConstants.menuImage,
		icon: ImageIcon,
		body: { kind: "empty" },
	},
};
