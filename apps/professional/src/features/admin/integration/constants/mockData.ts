export interface IntegrationOffering {
	id: string;
	title: string;
	provider: string;
	text: string;
	modulesDescription: string;
	connected: boolean;
}

// Mock catalog content is intentionally plain data (not i18n) — the backend
// will provide the real integration catalog once its API exists.
export const INTEGRATION_OFFERINGS: IntegrationOffering[] = [
	{
		id: "i-1",
		title: "Ekonomi - modul",
		provider: "Fortnox",
		text: "Koppling till bokföring",
		modulesDescription:
			"Denna koppling är mot modulerna ekonomi, personal, prognos, faktura",
		connected: true,
	},
	{
		id: "i-2",
		title: "Ekonomi - modul",
		provider: "Beijer",
		text: "Koppling till leverantör",
		modulesDescription:
			"Denna koppling är mot modulerna inköp, order, projekt",
		connected: true,
	},
	{
		id: "i-3",
		title: "Ekonomi - modul",
		provider: "Dahal",
		text: "Koppling till leverantör",
		modulesDescription:
			"Denna koppling är mot modulerna inköp, order, projekt",
		connected: true,
	},
	{
		id: "i-4",
		title: "Ekonomi - modul",
		provider: "Visma",
		text: "Koppling till bokföring",
		modulesDescription:
			"Denna koppling är mot modulerna ekonomi, personal, prognos, faktura",
		connected: false,
	},
];
