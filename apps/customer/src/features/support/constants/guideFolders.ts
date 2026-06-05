import { GuideFolder } from "../types";

export const GUIDE_FOLDERS: GuideFolder[] = [
	{
		title: "Offert & Konsulter",
		count: 5,
		defaultOpen: true,
		items: [
			{
				label: "Offert",
				count: 2,
				active: true,
			},
			{
				label: "Konsult",
				count: 3,
			},
		],
	},
	{
		title: "Mina Projekt",
		count: 8,
		defaultOpen: false,
		items: [
			{
				label: "Projekthantering",
				count: 3,
			},
			{
				label: "Arkiverade Projekt",
				count: 3,
			},
		],
	},
	{
		title: "Tjänster & Erbjudanden",
	},
	{
		title: "Support & Verktyg",
	},
	{
		title: "Inställningar",
	},
];