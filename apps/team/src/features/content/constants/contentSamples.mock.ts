import type { ContentRowsBySection } from "../types";

/**
 * Seed rows until the API lands. Only `useContentSections` reads this file.
 *
 * Select values are stored as option ids, not labels, so switching language
 * cannot corrupt a row. Row text is record content and stays literal.
 */
export const CONTENT_ROWS_SEED: ContentRowsBySection = {
	"kund:inspiration": [
		{
			id: "kund-inspiration-1",
			values: {
				title: "10 idéer för ett litet kök",
				type: "inspiration",
				body: "Smarta lösningar för små ytor.",
				images: [],
			},
		},
		{
			id: "kund-inspiration-2",
			values: {
				title: "Checklista inför offertjämförelse",
				type: "advice",
				body: "Jämför äpplen med äpplen.",
				images: [],
			},
		},
	],
	"kund:fragor-svar": [
		{
			id: "kund-faq-1",
			values: {
				question: "Vad kostar tjänsten?",
				category: "payment",
				answer: "Att lägga upp projekt är gratis.",
			},
		},
		{
			id: "kund-faq-2",
			values: {
				question: "Hur väljer jag hantverkare?",
				category: "project",
				answer: "Jämför omdömen och offerter.",
			},
		},
	],
	"kund:nyheter": [
		{
			id: "kund-news-1",
			values: {
				title: "Nya filter i projektsök",
				date: "2026-08-21",
				body: "Nu kan du filtrera på ort.",
				images: [],
			},
		},
		{
			id: "kund-news-2",
			values: {
				title: "Uppdaterade avtalsmallar",
				date: "2026-07-04",
				body: "Mallarna följer nya regler.",
				images: [],
			},
		},
	],
	"kund:priser": [
		{
			id: "kund-price-1",
			values: {
				name: "Målning vägg, 2 strykningar",
				kind: "unitPrice",
				unit: "squareMetre",
				price: "245",
				note: "Material ingår ej.",
			},
		},
		{
			id: "kund-price-2",
			values: {
				name: "Snickare",
				kind: "productPrice",
				unit: "hour",
				price: "695",
				note: "",
			},
		},
	],
	"kund:konsulter": [
		{
			id: "kund-consultant-1",
			values: {
				name: "Anna Lind",
				role: "Byggkonsult",
				email: "anna@exempel.se",
				phone: "070-123 45 67",
				photo: [],
				description:
					"Stöttar kunder vid upphandling och besiktning av byggprojekt.",
			},
		},
		{
			id: "kund-consultant-2",
			values: {
				name: "Omar Haddad",
				role: "Elprojektering",
				email: "omar@exempel.se",
				phone: "070-987 65 43",
				photo: [],
				description:
					"Granskar elritningar och tar fram underlag för elinstallationer.",
			},
		},
	],
	"kund:kategorier": [
		{
			id: "kund-category-1",
			values: {
				name: "Badrum",
				parent: "plumbing",
				desc: "Renovering och nybyggnation av badrum.",
			},
		},
		{
			id: "kund-category-2",
			values: {
				name: "Takbyte",
				parent: "construction",
				desc: "Byte av yttertak och underlagstak.",
			},
		},
	],
	"workspace:fragor-svar": [
		{
			id: "workspace-faq-1",
			values: {
				question: "Hur fungerar leadspoäng?",
				category: "leads",
				answer: "Poängen speglar hur väl leadet matchar din profil.",
			},
		},
		{
			id: "workspace-faq-2",
			values: {
				question: "När faktureras abonnemanget?",
				category: "billing",
				answer: "Den första varje månad.",
			},
		},
	],
	"workspace:uppdateringar": [
		{
			id: "workspace-update-1",
			values: {
				title: "Ny leadsvy",
				release: "2026-10-15",
				downtime: "no",
				window: "",
				body: "Ny vy för leads släpps.",
			},
		},
		{
			id: "workspace-update-2",
			values: {
				title: "Planerat underhåll",
				release: "2026-11-01",
				downtime: "yes",
				window: "02:00–04:00",
				body: "Systemet är otillgängligt under uppdateringen.",
			},
		},
	],
};
