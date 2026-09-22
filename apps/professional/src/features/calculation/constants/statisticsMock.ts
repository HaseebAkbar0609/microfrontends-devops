import type { CalculationStatRow, CalculationStatKpis } from "../types/statistics";

export const DUMMY_CALCULATION_STAT_KPIS: CalculationStatKpis = {
	totalOffers: 1234,
	won: 123,
	lost: 145,
};

export const DUMMY_CALCULATION_STAT_ROWS: CalculationStatRow[] = [
	{
		id: "stat-1",
		datum: "2025-12-14 - 2025-12-30",
		bestellare: "Fastighetsbolaget",
		kategori: "Service",
		typ: "B2B",
		entreprenadform: "Totalentreprenad",
		antalOffert: 60,
		vunna: 10,
		forlorade: 50,
	},
	{
		id: "stat-2",
		datum: "2025-12-01 - 2025-12-30",
		bestellare: "Fastighetsbolaget",
		kategori: "Entreprenad",
		typ: "B2C- Offert",
		entreprenadform: "General",
		antalOffert: 40,
		vunna: 20,
		forlorade: 20,
	},
	{
		id: "stat-3",
		datum: "2025-12-01 - 2025-12-30",
		bestellare: "Fastighetsbolaget",
		kategori: "Service",
		typ: "Express",
		entreprenadform: "Totalentreprenad",
		antalOffert: 23,
		vunna: 33,
		forlorade: 33,
	},
	{
		id: "stat-4",
		datum: "2025-12-01 - 2025-12-30",
		bestellare: "Fastighetsbolaget",
		kategori: "Entreprenad",
		typ: "Hyra IN",
		entreprenadform: "Totalentreprenad",
		antalOffert: 35,
		vunna: 11,
		forlorade: 11,
	},
	{
		id: "stat-5",
		datum: "2025-12-01 - 2025-12-30",
		bestellare: "Fastighetsbolaget",
		kategori: "Service",
		typ: "Hyra UT",
		entreprenadform: "Totalentreprenad",
		antalOffert: 76,
		vunna: 66,
		forlorade: 66,
	},
	{
		id: "stat-6",
		datum: "2025-12-14 - 2025-12-30",
		bestellare: "Fastighetsbolaget",
		kategori: "Entreprenad",
		typ: "B2B",
		entreprenadform: "Totalentreprenad",
		antalOffert: 112,
		vunna: 9,
		forlorade: 9,
	},
];

export const DEFAULT_BESTELLARE_OPTIONS: string[] = [
	"Fastighetsbolaget",
	"Bygg & Bo AB",
	"Stadsfastigheter",
	"Nordic Bygg",
];

export const DEFAULT_KATEGORI_OPTIONS: string[] = [
	"Service",
	"Entreprenad",
	"Underhåll",
	"Renovering",
];

export const DEFAULT_TYP_OPTIONS: string[] = [
	"B2B",
	"B2C Offert",
	"Express",
	"Hyra IN",
	"Hyra UT",
];

export const DEFAULT_ENTREPRENADFORM_OPTIONS: string[] = [
	"General",
	"Totalentreprenad",
	"Delad entreprenad",
	"Underentreprenad",
];

export const DEFAULT_START_DATE_OPTIONS: string[] = [
	"2025-12-24",
	"2025-12-01",
	"2025-11-01",
	"2025-10-01",
];

export const DEFAULT_END_DATE_OPTIONS: string[] = [
	"2025-12-30",
	"2025-12-31",
	"2026-01-31",
];
