import localizationConstants from "@/utils/translation/constants";
import type { DesignTidsplanItem } from "../types/designTidsplan";

export const DESIGN_TIDSPLAN_ITEMS: DesignTidsplanItem[] = [
	{
		id: "t1",
		datum: "2024/01/01",
		tidsplanType: localizationConstants.designTidsplanHuvudtidsplan,
		typ: "Standard",
		startDatum: "2025-03-01",
		slutDatum: "2025-10-31",
		orderNr: "OR000001",
		kund: "Fastighetsbolaget AB",
		skapadAv: "Katie Svensson",
		skapadDatum: "2025-09-01",
		revideradDatum: "2025-10-01",
		beskrivning: "",
		title: "Etablerings tidsplan över byggnation",
	},
	{
		id: "t2",
		datum: "2024/01/01",
		tidsplanType: localizationConstants.designTidsplanDeltidsplan,
		typ: "Standard",
		startDatum: "2025-03-01",
		slutDatum: "2025-06-30",
		orderNr: "OR000001",
		kund: "Fastighetsbolaget AB",
		skapadAv: "Stefan Eriksson",
		skapadDatum: "2025-09-01",
		revideradDatum: "2025-10-01",
		beskrivning: "",
		title: "Deltidsplan för fas 1",
	},
];
