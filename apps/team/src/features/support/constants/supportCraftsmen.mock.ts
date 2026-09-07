import localizationConstants from "@/utils/translation/constants";
import type { Craftsman } from "../types";

/** Craftsman companies a ticket can be linked to. Names and phone numbers are record content. */
export const SUPPORT_CRAFTSMEN_SEED: Craftsman[] = [
	{ id: "h1", name: "Anders Holm", company: "Anders Holm Bygg AB", tradeKey: localizationConstants.supportTradeConstruction, country: "Sverige", status: "active", phone: "+46 70 112 33 44" },
	{ id: "h2", name: "Nina Nordvik", company: "Nordvik El & VVS", tradeKey: localizationConstants.supportTradeElectricalPlumbing, country: "Norge", status: "pending", phone: "+47 912 33 221" },
	{ id: "h3", name: "Kalle Ek", company: "Ek & Söner Måleri", tradeKey: localizationConstants.supportTradePainting, country: "Sverige", status: "active", phone: "+46 73 555 88 21" },
	{ id: "h4", name: "Petra Sund", company: "Byggkraft i Väst", tradeKey: localizationConstants.supportTradeConstruction, country: "Sverige", status: "paused", phone: "+46 72 909 11 04" },
	{ id: "h5", name: "Jussi Virtanen", company: "Virtanen Rakennus Oy", tradeKey: localizationConstants.supportTradeRenovation, country: "Finland", status: "active", phone: "+358 40 223 118" },
	{ id: "h6", name: "Lars Hansen", company: "Hansen Snekkeri", tradeKey: localizationConstants.supportTradeCarpentry, country: "Norge", status: "inactive", phone: "+47 977 45 010" },
	{ id: "h7", name: "Mette Sørensen", company: "Sørensen VVS ApS", tradeKey: localizationConstants.supportTradePlumbing, country: "Danmark", status: "pending", phone: "+45 31 22 87 65" },
];
