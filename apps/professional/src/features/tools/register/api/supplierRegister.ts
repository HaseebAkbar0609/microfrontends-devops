import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import { SupplierRegisterRow, MOCK_SUPPLIER_REGISTER_DATA } from "../mockdata/suppliers";
import type { CreateSupplierFullData, SupplierDetail } from "../types";

export type { SupplierRegisterRow };

export interface GetSupplierRegisterListParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: "all" | "active" | "inactive";
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetSupplierRegisterListResponse {
	data: SupplierRegisterRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

const mapSupplierToApi = (data: CreateSupplierFullData): Record<string, unknown> => ({
	company_name: data.companyName,
	org_no: data.orgNo,
	supplier_no: data.supplierNo || null,
	status: data.status,
	main_category: data.mainCategory || null,
	department: data.department || null,
	region: data.region || null,
	vat_reg_no: data.vatRegNo || null,
	visiting_address: data.visitingAddress,
	visiting_postal_code: data.visitingPostalCode,
	visiting_city: data.visitingCity,
	invoice_address: data.invoiceAddress,
	invoice_postal_code: data.invoicePostalCode,
	invoice_city: data.invoiceCity,
	bank_name: data.bankName || null,
	bank_account: data.bankAccount || null,
	bankgiro: data.bankgiro || null,
	plusgiro: data.plusgiro || null,
	iban: data.iban || null,
	bic: data.bic || null,
	betalningsdagar: data.betalningsdagar || null,
	ranta: data.ranta || null,
	fakturaavgift: data.fakturaavgift || null,
	inkasso: data.inkasso || null,
	phone: data.phone || null,
	email: data.email || null,
	website: data.website || null,
	contact_notes: data.contactNotes || null,
	contact_persons: [
		...(data.contactPerson1FirstName
			? [
					{
						first_name: data.contactPerson1FirstName,
						last_name: data.contactPerson1LastName || "",
						mobile: data.contactPerson1Mobile || null,
						email: data.contactPerson1Email || null,
						role: data.contactPerson1Role || "",
						personal_no: data.contactPerson1PersonalNo || null,
					},
				]
			: []),
		...(data.contactPerson2FirstName
			? [
					{
						first_name: data.contactPerson2FirstName,
						last_name: data.contactPerson2LastName || "",
						mobile: data.contactPerson2Mobile || null,
						email: data.contactPerson2Email || null,
						role: data.contactPerson2Role || "",
						personal_no: data.contactPerson2PersonalNo || null,
					},
				]
			: []),
		...(data.contactPerson3FirstName
			? [
					{
						first_name: data.contactPerson3FirstName,
						last_name: data.contactPerson3LastName || "",
						mobile: data.contactPerson3Mobile || null,
						email: data.contactPerson3Email || null,
						role: data.contactPerson3Role || "",
						personal_no: data.contactPerson3PersonalNo || null,
					},
				]
			: []),
		...(data.contactPerson4FirstName
			? [
					{
						first_name: data.contactPerson4FirstName,
						last_name: data.contactPerson4LastName || "",
						mobile: data.contactPerson4Mobile || null,
						email: data.contactPerson4Email || null,
						role: data.contactPerson4Role || "",
						personal_no: data.contactPerson4PersonalNo || null,
					},
				]
			: []),
		...(data.contactPerson5FirstName
			? [
					{
						first_name: data.contactPerson5FirstName,
						last_name: data.contactPerson5LastName || "",
						mobile: data.contactPerson5Mobile || null,
						email: data.contactPerson5Email || null,
						role: data.contactPerson5Role || "",
						personal_no: data.contactPerson5PersonalNo || null,
					},
				]
			: []),
	],
	ratings: data.ratings,
	notes: data.notes || null,
});

export async function getSupplierRegisterListAPIAction(
	params?: GetSupplierRegisterListParams,
): Promise<GetSupplierRegisterListResponse> {
	const page = Math.max(1, params?.page ?? 1);
	const limit = Math.max(1, params?.limit ?? 10);
	const search = params?.search?.toLowerCase().trim();
	const status = params?.status ?? "all";
	const sortBy = params?.sortBy;
	const sortOrder = params?.sortOrder;

	await new Promise((resolve) => setTimeout(resolve, 150));

	let filtered = [...MOCK_SUPPLIER_REGISTER_DATA];

	if (search) {
		filtered = filtered.filter(
			(item) =>
				item.supplierNo.toLowerCase().includes(search) ||
				item.name.toLowerCase().includes(search) ||
				item.orgNo.toLowerCase().includes(search) ||
				item.email.toLowerCase().includes(search) ||
				item.city.toLowerCase().includes(search) ||
				item.phone.toLowerCase().includes(search) ||
				item.address.toLowerCase().includes(search),
		);
	}

	if (status && status !== "all") {
		filtered = filtered.filter((item) => item.status === status);
	}

	if (sortBy) {
		filtered.sort((a, b) => {
			const aVal = String((a as unknown as Record<string, unknown>)[sortBy] ?? "");
			const bVal = String((b as unknown as Record<string, unknown>)[sortBy] ?? "");
			const cmp = aVal.localeCompare(bVal);
			return sortOrder === "desc" ? -cmp : cmp;
		});
	}

	const total = filtered.length;
	const totalPages = Math.ceil(total / limit) || 1;
	const startIndex = (page - 1) * limit;
	const paginatedData = filtered.slice(startIndex, startIndex + limit);

	return {
		data: paginatedData,
		total,
		page,
		limit,
		totalPages,
	};
}

export async function createSupplierAPIAction(
	data: CreateSupplierFullData,
): Promise<{ id: string }> {
	const payload = mapSupplierToApi(data);
	try {
		const res = await axiosInstance.post(API_PATH.SUPPLIERS.CREATE, payload);
		return { id: String(res.data?.data?.id ?? Date.now()) };
	} catch {
		return { id: String(Date.now()) };
	}
}

export async function saveSupplierDraftAPIAction(
	data: CreateSupplierFullData,
): Promise<{ id: string }> {
	const payload = { ...mapSupplierToApi(data), is_draft: true };

	try {
		if (data.id) {
			const res = await axiosInstance.patch(API_PATH.SUPPLIERS.UPDATE(data.id), payload);
			return { id: String(res.data?.data?.id ?? data.id) };
		}

		const res = await axiosInstance.post(API_PATH.SUPPLIERS.CREATE, payload);
		return { id: String(res.data?.data?.id ?? Date.now()) };
	} catch {
		return { id: data.id || String(Date.now()) };
	}
}

export async function uploadSupplierFileAPIAction(
	file: File,
): Promise<{ id: string; url: string }> {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("media_type", "supplier_document");

	try {
		const res = await axiosInstance.post(API_PATH.SUPPLIERS.UPLOAD_FILE, formData);
		return {
			id: String(res.data?.data?.id ?? Date.now()),
			url: String(res.data?.data?.url ?? ""),
		};
	} catch {
		return {
			id: String(Date.now()),
			url: "",
		};
	}
}

export async function getSupplierDetailAPIAction(
	id: string,
): Promise<SupplierDetail> {
	try {
		const res = await axiosInstance.get(API_PATH.SUPPLIERS.GET(id));
		if (res.data?.data) {
			return res.data.data as SupplierDetail;
		}
	} catch {
		// Fallback to mock data on error or dev
	}
	const { MOCK_SUPPLIER_DETAIL } = await import("../mockdata/supplierDetail");
	return { ...MOCK_SUPPLIER_DETAIL, id };
}
