import type { ContentGroupId, SupportGuideState } from "../types";

/**
 * Seed contact details and help-guide tree, one set per group.
 *
 * Ids are literal rather than generated. The prototype called
 * `crypto.randomUUID()` inside a lazy `useState` initializer, so the server and
 * the client produced different ids on first render — a hydration mismatch
 * waiting to happen.
 */
export const SUPPORT_GUIDE_SEED: Record<ContentGroupId, SupportGuideState> = {
	kund: {
		contact: {
			phone: "010-123 45 67",
			email: "support@exempel.se",
			hours: "Vardagar 08:00–17:00",
		},
		tree: [
			{
				id: "kund-cat-1",
				name: "Kom igång",
				subcategories: [
					{
						id: "kund-sub-1",
						name: "Skapa konto",
						entries: [
							{
								id: "kund-entry-1",
								title: "Så registrerar du dig",
								text: "Klicka på Skapa konto, fyll i uppgifter och verifiera din e-post.",
								images: [],
								screenshots: [],
								video: [],
							},
						],
					},
				],
			},
			{
				id: "kund-cat-2",
				name: "Arbeta i systemet",
				subcategories: [
					{
						id: "kund-sub-2",
						name: "Projekt och leads",
						entries: [
							{
								id: "kund-entry-2",
								title: "Hantera ett ärende",
								text: "Öppna ärendet, läs underlaget och svara direkt i vyn.",
								images: [],
								screenshots: [],
								video: [],
							},
						],
					},
				],
			},
		],
	},
	workspace: {
		contact: {
			phone: "010-123 45 68",
			email: "partnersupport@exempel.se",
			hours: "Vardagar 07:00–18:00",
		},
		tree: [
			{
				id: "workspace-cat-1",
				name: "Kom igång som hantverkare",
				subcategories: [
					{
						id: "workspace-sub-1",
						name: "Fyll i din profil",
						entries: [
							{
								id: "workspace-entry-1",
								title: "Så blir profilen komplett",
								text: "Lägg in bransch, orter och referenser för att matcha fler leads.",
								images: [],
								screenshots: [],
								video: [],
							},
						],
					},
				],
			},
			{
				id: "workspace-cat-2",
				name: "Leads och offerter",
				subcategories: [
					{
						id: "workspace-sub-2",
						name: "Köpa och svara på leads",
						entries: [
							{
								id: "workspace-entry-2",
								title: "Från lead till offert",
								text: "Öppna leadet, granska underlaget och skicka din offert direkt.",
								images: [],
								screenshots: [],
								video: [],
							},
						],
					},
				],
			},
		],
	},
};
