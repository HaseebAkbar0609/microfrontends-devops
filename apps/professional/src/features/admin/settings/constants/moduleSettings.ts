export interface ModuleSettingRow {
	id: string;
	label: string;
	type: "choice" | "fixed";
	fixedLabel?: string;
}

export interface FlowTalkConfig {
	phone: string;
}

export const MODULE_SETTINGS_ROWS: Record<string, ModuleSettingRow[]> = {
	Avtal: [
		{ id: "avtal-1", label: "Andra / lägga till avtal", type: "choice" },
		{
			id: "avtal-2",
			label: "Arkiverad avtal raderas",
			type: "fixed",
			fixedLabel: "36 man",
		},
		{ id: "avtal-3", label: "Anställningsavtal", type: "choice" },
		{ id: "avtal-4", label: "Projektavtal", type: "choice" },
		{ id: "avtal-5", label: "Orderavtal", type: "choice" },
	],
	Mallar: [
		{ id: "mallar-1", label: "Arkivera mallar", type: "choice" },
		{ id: "mallar-2", label: "Radara mallar", type: "choice" },
		{ id: "mallar-3", label: "Revidera mallar", type: "choice" },
		{ id: "mallar-4", label: "Lägga in nya mallar", type: "choice" },
	],
	"Marknad-Sälj": [
		{ id: "marknad-1", label: "Kundenkät", type: "choice" },
		{
			id: "marknad-2",
			label: "Aktivera Personal utskick",
			type: "choice",
		},
		{ id: "marknad-3", label: "Aktivera Kund utskick", type: "choice" },
		{
			id: "marknad-4",
			label: "Aktivera Leverantörs utskick",
			type: "choice",
		},
	],
	"Data-IT": [
		{ id: "datait-1", label: "Koder", type: "choice" },
		{
			id: "datait-2",
			label: "Datautrustning koppling personal",
			type: "choice",
		},
		{ id: "datait-3", label: "Skapa budget / ändra", type: "choice" },
	],
	Ledningsstöd: [
		{ id: "ledning-1", label: "Styrelseportal", type: "choice" },
		{ id: "ledning-2", label: "Visselbläsar funktion", type: "choice" },
		{ id: "ledning-3", label: "Rapport funktion", type: "choice" },
	],
};

export const MODULE_FLOWTALK: Record<string, FlowTalkConfig> = {
	"Marknad-Sälj": { phone: "+46705215050" },
};
