import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type { ActionResult, ApiResponse } from "@/types/api";

export interface CustomerDropdownOption {
	id: string;
	name?: string;
	companyName: string;
	contactPerson: string;
	firstName: string;
	lastName: string;
	address: string;
	postalCode: string;
	city: string;
	email: string;
	phone: string;
	orgNumber: string;
	role?: string;
}

export const MOCK_CUSTOMERS_LIST: CustomerDropdownOption[] = [
	{
		id: "cust-001",
		name: "Anders Svensson",
		companyName: "Fastighetsbolaget AB",
		contactPerson: "Anders Svensson",
		firstName: "Anders",
		lastName: "Svensson",
		address: "Storgatan 12",
		postalCode: "111 22",
		city: "Stockholm",
		email: "anders.svensson@fastighetsbolaget.se",
		phone: "08-123 456 78",
		orgNumber: "556123-4567",
		role: "Kalkyl",
	},
	{
		id: "cust-002",
		name: "Maria Lindqvist",
		companyName: "Brf Solhöjden",
		contactPerson: "Maria Lindqvist",
		firstName: "Maria",
		lastName: "Lindqvist",
		address: "Solvägen 4",
		postalCode: "412 55",
		city: "Göteborg",
		email: "maria.l@solhojden.se",
		phone: "031-987 654",
		orgNumber: "716400-1234",
		role: "Projektledare",
	},
	{
		id: "cust-003",
		name: "Erik Johansson",
		companyName: "Logistikpartner Sverige AB",
		contactPerson: "Erik Johansson",
		firstName: "Erik",
		lastName: "Johansson",
		address: "Industrigatan 8",
		postalCode: "211 20",
		city: "Malmö",
		email: "erik.johansson@logistikpartner.se",
		phone: "040-555 123",
		orgNumber: "556987-6543",
		role: "Kalkylansvarig",
	},
	{
		id: "cust-004",
		name: "Anna Karlsson",
		companyName: "Bygg & Fastighet Nordic AB",
		contactPerson: "Anna Karlsson",
		firstName: "Anna",
		lastName: "Karlsson",
		address: "Kungsgatan 15",
		postalCode: "111 43",
		city: "Stockholm",
		email: "anna.k@byggnordic.se",
		phone: "08-765 432 10",
		orgNumber: "556789-0123",
		role: "Ekonomi",
	},
	{
		id: "cust-005",
		name: "Johan Bergman",
		companyName: "Vasakronan AB",
		contactPerson: "Johan Bergman",
		firstName: "Johan",
		lastName: "Bergman",
		address: "Mäster Samuelsgatan 42",
		postalCode: "111 57",
		city: "Stockholm",
		email: "johan.bergman@vasakronan.se",
		phone: "08-565 818 00",
		orgNumber: "556061-4603",
		role: "Arbetsledare",
	},
];

export const MOCK_AVAILABLE_SUPPLIERS: string[] = [
	"Kran & Transport AB",
	"Ställningsbyggarna Väst",
	"Nordic Byggmaterial AB",
	"Betong & Grund AB",
	"Måleri & Ytskikt AB",
	"El & Automation Syd",
	"Ventilationsteknik Sverige AB",
	"Rör & VVS Montörerna",
];

export interface AvailableDocOption {
	id: string;
	namn: string;
	typ: string;
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
		namn: "FasadsKiss_A-01.img",
		typ: "IMG",
		fileType: "img",
	},
	{
		id: "doc-tmpl-4",
		namn: "Situationsplan_v2.pdf",
		typ: "PDF",
		fileType: "pdf",
	},
];

export interface CreateEnquiryPayload {
	calc_id?: string;
	project_name: string;
	project_number?: string;
	block_name?: string;
	project_address?: string;
	postal_code?: string;
	city?: string;
	type?: string;
	category?: string;
	department?: string;
	contract_sum?: number;
	offer_number?: string;
	start_date?: string;
	end_date?: string;
	latest_offer_date?: string;
	customer: {
		company_name?: string;
		contact_person?: string;
		first_name?: string;
		last_name?: string;
		address?: string;
		postal_code?: string;
		city?: string;
		email?: string;
		phone?: string;
		org_number?: string;
		role?: string;
	};
	documents: Array<{
		id: string;
		filename: string;
		typ: string;
		fileType: string;
	}>;
	gdpr_accepted: boolean;
	suppliers: string[];
}

export async function getCustomersForEnquiryAction(): Promise<CustomerDropdownOption[]> {
	try {
		const response = await axiosInstance.get<ApiResponse<Record<string, unknown>[]>>(
			API_PATH.CUSTOMERS.LIST,
		);
		if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
			return response.data.data.map((item) => {
				const nameStr = String(item.name || item.contactPerson || "");
				const nameParts = nameStr.trim().split(" ");
				return {
					id: String(item.id || item._id),
					name: String(item.name || item.contactPerson || item.companyName || "Kund"),
					companyName: String(item.companyName || item.name || "Kundföretag AB"),
					contactPerson: String(item.contactPerson || item.name || "Kontaktperson"),
					firstName: String(item.firstName || nameParts[0] || ""),
					lastName: String(item.lastName || nameParts.slice(1).join(" ") || ""),
					address: String(item.address || item.billingAddress || ""),
					postalCode: String(item.postalCode || item.zipCode || ""),
					city: String(item.city || ""),
					email: String(item.email || item.contactEmail || ""),
					phone: String(item.phone || item.mobile || item.contactPhone || ""),
					orgNumber: String(item.orgNumber || item.organizationNumber || ""),
					role: String(item.role || "Beställare"),
				};
			});
		}
	} catch {
		// Fallback to mock customers
	}
	return MOCK_CUSTOMERS_LIST;
}

export async function getSuppliersForEnquiryAction(): Promise<string[]> {
	try {
		const response = await axiosInstance.get<ApiResponse<Record<string, unknown>[]>>(
			API_PATH.SUPPLIERS.LIST,
		);
		if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
			return response.data.data.map((item) =>
				String(item.name || item.companyName || item.title || item),
			);
		}
	} catch {
		// Fallback to mock suppliers
	}
	return MOCK_AVAILABLE_SUPPLIERS;
}

export async function getEnquiryAvailableDocumentsAPIAction(): Promise<AvailableDocOption[]> {
	try {
		const response = await axiosInstance.get<ApiResponse<Record<string, unknown>[]>>(
			API_PATH.CALCULATIONS.LIST,
		);
		if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
			return response.data.data.map((doc, idx: number) => ({
				id: String(doc.id || doc._id || `doc-${idx}`),
				namn: String(doc.name || doc.namn || doc.title || "Dokument.pdf"),
				typ: String(doc.type || doc.typ || "PDF"),
				fileType: (doc.fileType || "pdf") as AvailableDocOption["fileType"],
			}));
		}
	} catch {
		// Fallback to mock available documents
	}
	return MOCK_AVAILABLE_DOCUMENTS;
}

export async function createEnquiryAPIAction(
	payload: CreateEnquiryPayload,
): Promise<ActionResult<{ id: string; enquiry_number?: string }>> {
	try {
		const endpoint = payload.calc_id
			? `${API_PATH.CALCULATIONS.BASE}/${payload.calc_id}/inquiries`
			: `${API_PATH.CALCULATIONS.BASE}/inquiries`;
		const response = await axiosInstance.post<
			ApiResponse<{ id: string; enquiry_number?: string }>
		>(endpoint, payload);
		if (response.data?.data) {
			return {
				success: true,
				data: response.data.data,
				error: null,
			};
		}
		return {
			success: true,
			data: {
				id: `inquiry_${Date.now()}`,
				enquiry_number: `ENQ-${Date.now().toString().slice(-4)}`,
			},
			error: null,
		};
	} catch (error: unknown) {
		const axiosErr = error as { response?: { data?: { message?: string } } };
		const errorMessage =
			axiosErr.response?.data?.message || "Kunde inte skapa förfrågan. Försök igen.";
		return {
			success: false,
			data: null,
			error: errorMessage,
		};
	}
}
