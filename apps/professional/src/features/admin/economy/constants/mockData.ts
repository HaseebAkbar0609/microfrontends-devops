import { mockDate } from "@/features/widgetdashboard/utils/mockDates";

export interface EconomyInvoiceLine {
	id: string;
	item: string;
	quantity: number;
	price: number;
}

export interface EconomyInvoice {
	id: string;
	invoiceNo: string;
	date: string;
	amount: number;
	billedTo: { name: string; address: string; email: string };
	from: { name: string; address: string; email: string };
	lines: EconomyInvoiceLine[];
	paymentMethod: string;
}

const FROM_COMPANY = {
	name: "TimeFlow Bygg AB",
	address: "Storgatan 14, Stockholm",
	email: "faktura@timeflowbygg.se",
};

export const ECONOMY_MOCK_INVOICES: EconomyInvoice[] = [
	{
		id: "159357",
		invoiceNo: "159357",
		date: mockDate(-2),
		amount: 3500,
		billedTo: {
			name: "Studio Shodwe",
			address: "Kungsgatan 3, Stockholm",
			email: "ekonomi@studioshodwe.se",
		},
		from: FROM_COMPANY,
		lines: [
			{ id: "line-1", item: "Logotyp", quantity: 1, price: 2500 },
			{ id: "line-2", item: "Banderoll (2x6m)", quantity: 2, price: 500 },
		],
		paymentMethod: "Bankgiro",
	},
	{
		id: "159358",
		invoiceNo: "159358",
		date: mockDate(-6),
		amount: 4200,
		billedTo: {
			name: "Byggbolaget AB",
			address: "Industrivägen 8, Uppsala",
			email: "faktura@byggbolaget.se",
		},
		from: FROM_COMPANY,
		lines: [
			{
				id: "line-1",
				item: "Projektledning (h)",
				quantity: 6,
				price: 700,
			},
		],
		paymentMethod: "Bankgiro",
	},
	{
		id: "159359",
		invoiceNo: "159359",
		date: mockDate(-11),
		amount: 2750,
		billedTo: {
			name: "Fastighets AB Norr",
			address: "Norra vägen 21, Umeå",
			email: "ekonomi@fastighetnorr.se",
		},
		from: FROM_COMPANY,
		lines: [
			{ id: "line-1", item: "Besiktning", quantity: 1, price: 1950 },
			{ id: "line-2", item: "Reseersättning", quantity: 1, price: 800 },
		],
		paymentMethod: "Swish Företag",
	},
	{
		id: "159360",
		invoiceNo: "159360",
		date: mockDate(-18),
		amount: 5150,
		billedTo: {
			name: "Café Solsidan",
			address: "Hamngatan 2, Göteborg",
			email: "agare@cafesolsidan.se",
		},
		from: FROM_COMPANY,
		lines: [
			{
				id: "line-1",
				item: "Renovering kök (h)",
				quantity: 8,
				price: 600,
			},
			{ id: "line-2", item: "Materialkostnad", quantity: 1, price: 350 },
		],
		paymentMethod: "Bankgiro",
	},
	{
		id: "159361",
		invoiceNo: "159361",
		date: mockDate(-34),
		amount: 3500,
		billedTo: {
			name: "Olivia Wilson Design",
			address: "Parkvägen 5, Malmö",
			email: "olivia@owdesign.se",
		},
		from: FROM_COMPANY,
		lines: [
			{ id: "line-1", item: "Logotyp", quantity: 1, price: 2500 },
			{ id: "line-2", item: "Affisch (1x2m)", quantity: 2, price: 500 },
		],
		paymentMethod: "Plusgiro",
	},
	{
		id: "159362",
		invoiceNo: "159362",
		date: mockDate(-41),
		amount: 6800,
		billedTo: {
			name: "Restaurang Fyren",
			address: "Strandgatan 12, Visby",
			email: "info@restaurangfyren.se",
		},
		from: FROM_COMPANY,
		lines: [
			{
				id: "line-1",
				item: "Ombyggnad uteservering (h)",
				quantity: 10,
				price: 620,
			},
			{ id: "line-2", item: "Materialkostnad", quantity: 1, price: 600 },
		],
		paymentMethod: "Bankgiro",
	},
];

export const formatInvoiceDate = (isoDate: string): string =>
	isoDate.split("-").reverse().join("-");

export const getInvoiceLinesTotal = (invoice: EconomyInvoice): number =>
	invoice.lines.reduce((sum, line) => sum + line.quantity * line.price, 0);
