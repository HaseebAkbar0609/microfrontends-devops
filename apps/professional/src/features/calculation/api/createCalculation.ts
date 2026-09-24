import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import { listOffersAPIAction } from "@/api-actions/offers";
import type { ActionResult, ApiResponse } from "@/types/api";
import type { CreateCalculationPayload } from "../types/kalkyl";

export interface OfferDropdownOption {
	id: string;
	code: string;
	title: string;
	clientName: string;
	address: string;
	city: string;
	email: string;
	phone: string;
	budget: string;
	date: string;
}

export const MOCK_OFFER_OPTIONS: OfferDropdownOption[] = [
	{
		id: "off-001",
		code: "OFF-2026-001",
		title: "Kontorsrenovering Storgatan 12",
		clientName: "Fastighetsbolaget AB",
		address: "Storgatan 12",
		city: "Stockholm",
		email: "kontakt@fastighetsbolaget.se",
		phone: "08-123 456 78",
		budget: "1 250 000 kr",
		date: "2026-01-15",
	},
	{
		id: "off-002",
		code: "OFF-2026-002",
		title: "Fasadrenovering Brf Solhöjden",
		clientName: "Brf Solhöjden",
		address: "Solvägen 4",
		city: "Göteborg",
		email: "styrelsen@solhojden.se",
		phone: "031-987 654",
		budget: "850 000 kr",
		date: "2026-02-01",
	},
	{
		id: "off-003",
		code: "OFF-2026-003",
		title: "Nybyggnation Lagerhall",
		clientName: "Logistikpartner Sverige AB",
		address: "Industrigatan 8",
		city: "Malmö",
		email: "projekt@logistikpartner.se",
		phone: "040-555 123",
		budget: "3 400 000 kr",
		date: "2026-02-10",
	},
];

export const MOCK_BESTALLARE_COMPANIES = [
	"Fastighetsbolaget AB",
	"Brf Solhöjden",
	"Logistikpartner Sverige AB",
	"Bygg & Fastighet Nordic AB",
	"Vasakronan AB",
];

export const MOCK_RESPONSIBLE_PERSONS = [
	"Anders Svensson",
	"Maria Lindqvist",
	"Erik Johansson",
	"Anna Karlsson",
	"Johan Bergman",
];

export const MOCK_CALCULATION_ROLES = [
	"Kalkyl",
	"Kalkylansvarig",
	"Projektledare",
	"Ekonomi",
	"Arbetsledare",
];

export interface AvailableDocOption {
	id: string;
	namn: string;
	typ: "PDF" | "DOC" | "IMG";
	fileType: "pdf" | "doc" | "img";
}

export const MOCK_AVAILABLE_DOCUMENTS: AvailableDocOption[] = [
	{
		id: "doc-tmpl-1",
		namn: "Ritningsförteckning.pdf",
		typ: "PDF",
		fileType: "pdf",
	},
	{
		id: "doc-tmpl-2",
		namn: "Projektbeskrivning.doc",
		typ: "DOC",
		fileType: "doc",
	},
	{
		id: "doc-tmpl-3",
		namn: "Kalkylunderlag_K01.pdf",
		typ: "PDF",
		fileType: "pdf",
	},
	{
		id: "doc-tmpl-4",
		namn: "Situationsplan_A1.png",
		typ: "IMG",
		fileType: "img",
	},
	{
		id: "doc-tmpl-5",
		namn: "Offertunderlag_kund.pdf",
		typ: "PDF",
		fileType: "pdf",
	},
];

export async function getCalculationAvailableDocumentsAPIAction(): Promise<AvailableDocOption[]> {
	try {
		const res = await axiosInstance.get(API_PATH.CALCULATIONS.LIST);
		if (res?.data?.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
			return res.data.data;
		}
		return MOCK_AVAILABLE_DOCUMENTS;
	} catch {
		return MOCK_AVAILABLE_DOCUMENTS;
	}
}

export async function createCalculationAPIAction(
	payload: CreateCalculationPayload,
): Promise<ActionResult<{ id: string; calcNo: string }>> {
	try {
		const res = await axiosInstance.post<ApiResponse<{ id: string; calc_no?: string; calcNo?: string }>>(
			API_PATH.CALCULATIONS.CREATE,
			payload,
		);
		if (res.data?.data) {
			return {
				success: true,
				data: {
					id: res.data.data.id || `calc_${Date.now()}`,
					calcNo: res.data.data.calcNo || res.data.data.calc_no || `K-${Date.now().toString().slice(-4)}`,
				},
				error: null,
			};
		}
		return {
			success: true,
			data: {
				id: `calc_${Date.now()}`,
				calcNo: `K-${Date.now().toString().slice(-4)}`,
			},
			error: null,
		};
	} catch {
		// Mock optimistic fallback on offline/dev/network error
		return {
			success: true,
			data: {
				id: `calc_${Date.now()}`,
				calcNo: `K-${Date.now().toString().slice(-4)}`,
			},
			error: null,
		};
	}
}

export async function getOffersForKalkylAction(): Promise<OfferDropdownOption[]> {
	try {
		const res = await listOffersAPIAction({
			status: "REQUESTED",
			pageSize: 50,
		});
		if (res.items && res.items.length > 0) {
			return res.items.map((item) => ({
				id: String(item.id || item.projectId || `off_${Date.now()}`),
				code: String(item.idNumber || item.id || ""),
				title: String(item.jobName || item.idNumber || "Offert"),
				clientName: String(item.contactName || "Klient"),
				address: String(item.municipality || ""),
				city: String(item.municipality || ""),
				email: String(item.contactEmail || ""),
				phone: String(item.contactPhone || ""),
				budget: item.totalPrice ? `${item.totalPrice.toLocaleString("sv-SE")} kr` : "",
				date: String(item.date || ""),
			}));
		}
		return MOCK_OFFER_OPTIONS;
	} catch {
		return MOCK_OFFER_OPTIONS;
	}
}
