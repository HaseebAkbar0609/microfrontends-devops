import type { RiskClient } from "../types/forecastRisk.types";

/**
 * Riskhantering's clients, until a credit API exists. Every figure the screens
 * show is derived from these: the register's columns, the four summary cards,
 * the ring, each client's projects and its gauge. The customer register keeps
 * no credit limit and the invoice mock's customers are different people, so
 * this register stands on its own rather than pretending to join them.
 *
 * Skanska AB carries the frame's own numbers: four projects budgeted at
 * 19 600 000 with 13 000 000 spent, 8 200 000 paid of 14 700 000 invoiced, and
 * so 6 500 000 outstanding against a 5 000 000 threshold.
 */
export const INITIAL_RISK_CLIENTS: RiskClient[] = [
	{
		id: "risk-skanska",
		name: "Skanska AB",
		clientNo: "CLI-2024-793",
		status: "ongoing",
		invoiced: 14700000,
		paid: 8200000,
		settings: { spendingThreshold: 5000000, creditLimit: 3000000, alertPercent: 80, autoRedStatus: true },
		projects: [
			{
				id: "risk-skanska-1",
				projectNo: "PRJ-001",
				name: "Stockholm Office Tower",
				budget: 4500000,
				spentToDate: 3200000,
				payment: "partiallyPaid",
			},
			{
				id: "risk-skanska-2",
				projectNo: "PRJ-002",
				name: "Göteborg Shopping Mall",
				budget: 6800000,
				spentToDate: 4100000,
				payment: "partiallyPaid",
			},
			{
				id: "risk-skanska-3",
				projectNo: "PRJ-003",
				name: "Malmö Residential Complex",
				budget: 3200000,
				spentToDate: 2900000,
				payment: "fullyPaid",
			},
			{
				id: "risk-skanska-4",
				projectNo: "PRJ-004",
				name: "Uppsala Hospital Extension",
				budget: 5100000,
				spentToDate: 2800000,
				payment: "pending",
			},
		],
	},
	{
		id: "risk-ncc",
		name: "NCC Sverige",
		clientNo: "CLI-2024-118",
		status: "ongoing",
		invoiced: 8900000,
		paid: 6600000,
		settings: { spendingThreshold: 4000000, creditLimit: 2500000, alertPercent: 80, autoRedStatus: true },
		projects: [
			{
				id: "risk-ncc-1",
				projectNo: "PRJ-011",
				name: "Västerås Logistikcenter",
				budget: 5400000,
				spentToDate: 3100000,
				payment: "partiallyPaid",
			},
			{
				id: "risk-ncc-2",
				projectNo: "PRJ-012",
				name: "Linköping Skolbyggnad",
				budget: 3900000,
				spentToDate: 2450000,
				payment: "partiallyPaid",
			},
		],
	},
	{
		id: "risk-peab",
		name: "Peab Byggservice",
		clientNo: "CLI-2024-204",
		status: "ongoing",
		invoiced: 11200000,
		paid: 7450000,
		settings: { spendingThreshold: 4500000, creditLimit: 3500000, alertPercent: 80, autoRedStatus: true },
		projects: [
			{
				id: "risk-peab-1",
				projectNo: "PRJ-021",
				name: "Örebro Köpcentrum",
				budget: 4800000,
				spentToDate: 3600000,
				payment: "partiallyPaid",
			},
			{
				id: "risk-peab-2",
				projectNo: "PRJ-022",
				name: "Helsingborg Hamnkontor",
				budget: 3300000,
				spentToDate: 1950000,
				payment: "pending",
			},
			{
				id: "risk-peab-3",
				projectNo: "PRJ-023",
				name: "Lund Laboratorium",
				budget: 2600000,
				spentToDate: 2400000,
				payment: "fullyPaid",
			},
		],
	},
	{
		id: "risk-veidekke",
		name: "Veidekke Entreprenad",
		clientNo: "CLI-2023-556",
		status: "ongoing",
		invoiced: 4300000,
		paid: 4300000,
		settings: { spendingThreshold: 2000000, creditLimit: 1500000, alertPercent: 80, autoRedStatus: true },
		projects: [
			{
				id: "risk-veidekke-1",
				projectNo: "PRJ-031",
				name: "Umeå Idrottshall",
				budget: 4600000,
				spentToDate: 4200000,
				payment: "fullyPaid",
			},
		],
	},
	{
		id: "risk-jm",
		name: "JM Bostad",
		clientNo: "CLI-2024-311",
		status: "paused",
		invoiced: 9600000,
		paid: 5100000,
		settings: { spendingThreshold: 3500000, creditLimit: 2800000, alertPercent: 75, autoRedStatus: true },
		projects: [
			{
				id: "risk-jm-1",
				projectNo: "PRJ-041",
				name: "Nacka Strand Etapp 2",
				budget: 6200000,
				spentToDate: 4700000,
				payment: "pending",
			},
			{
				id: "risk-jm-2",
				projectNo: "PRJ-042",
				name: "Sollentuna Radhus",
				budget: 3400000,
				spentToDate: 1800000,
				payment: "partiallyPaid",
			},
		],
	},
	{
		id: "risk-serneke",
		name: "Serneke Bygg",
		clientNo: "CLI-2023-902",
		status: "ongoing",
		invoiced: 6800000,
		paid: 5900000,
		settings: { spendingThreshold: 3000000, creditLimit: 2200000, alertPercent: 80, autoRedStatus: false },
		projects: [
			{
				id: "risk-serneke-1",
				projectNo: "PRJ-051",
				name: "Borås Kontorshus",
				budget: 3700000,
				spentToDate: 2600000,
				payment: "partiallyPaid",
			},
			{
				id: "risk-serneke-2",
				projectNo: "PRJ-052",
				name: "Jönköping Lagerhall",
				budget: 2900000,
				spentToDate: 2750000,
				payment: "fullyPaid",
			},
		],
	},
];
