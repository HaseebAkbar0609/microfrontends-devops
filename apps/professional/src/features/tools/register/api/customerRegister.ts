import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	CustomerRegisterRow,
	CreateCustomerFullData,
	GetCustomerRegisterListParams,
	GetCustomerRegisterListResponse,
} from "../types";
import { MOCK_CUSTOMER_REGISTER_DATA } from "../mockdata/customers";

export type { CustomerRegisterRow };

const mapCustomerFromApi = (item: Record<string, unknown>): CustomerRegisterRow => ({
	id: String(item.id ?? ""),
	customerNo: String(item.customer_no ?? item.customerNo ?? ""),
	name: String(item.name ?? item.company_name ?? ""),
	orgNo: String(item.org_no ?? item.orgNo ?? ""),
	address: String(item.address ?? item.visiting_address ?? ""),
	postNr: String(item.postal_code ?? item.postNr ?? item.visiting_postal_code ?? ""),
	city: String(item.city ?? item.visiting_city ?? ""),
	country: String(item.country ?? "Sverige"),
	phone: String(item.phone ?? ""),
	email: String(item.email ?? ""),
	status: (item.status as "active" | "inactive") ?? "active",
});

const mapCustomerToApi = (data: CreateCustomerFullData): Record<string, unknown> => ({
	company_name: data.companyName,
	org_no: data.orgNo,
	customer_no: data.customerNo || null,
	status: data.status,
	main_category: data.mainCategory,
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
	phone: data.phone,
	email: data.email,
	website: data.website || null,
	contact_notes: data.contactNotes || null,
	contact_persons: [
		{
			first_name: data.contactPerson1FirstName,
			last_name: data.contactPerson1LastName,
			mobile: data.contactPerson1Mobile || null,
			email: data.contactPerson1Email || null,
			role: data.contactPerson1Role,
			personal_no: data.contactPerson1PersonalNo || null,
		},
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
	payment_terms: data.paymentTerms,
	delivery_terms: data.deliveryTerms,
	delivery_method: data.deliveryMethod || null,
	interest_invoicing: data.interestInvoicing || null,
	price_list: data.priceList || null,
	currency: data.currency,
	invoice_discount: data.invoiceDiscount || null,
	invoice_fee: data.invoiceFee || null,
	shipping_fee: data.shippingFee || null,
	prices_incl_vat: data.pricesInclVat || null,
	our_reference: data.ourReference || null,
	customer_responsible: data.customerResponsible || null,
	external_reference: data.externalReference || null,
	your_reference: data.yourReference || null,
	vat_number: data.vatNumber || null,
	vat_type: data.vatType || null,
	sales_account: data.salesAccount || null,
	cost_center: data.costCenter || null,
	project: data.project || null,
});

export async function getCustomerRegisterListAPIAction(
	params?: GetCustomerRegisterListParams,
): Promise<GetCustomerRegisterListResponse> {
	try {
		const queryParams: Record<string, string | number> = {};
		if (params?.page) queryParams.page = params.page;
		if (params?.limit) queryParams.limit = params.limit;
		if (params?.search) queryParams.search = params.search;
		if (params?.status && params.status !== "all") queryParams.status = params.status;
		if (params?.sortBy) queryParams.sort_by = params.sortBy;
		if (params?.sortOrder) queryParams.sort_order = params.sortOrder;

		const res = await axiosInstance.get(API_PATH.CUSTOMERS.LIST, { params: queryParams });
		const data = res.data?.data;

		if (data?.items) {
			return {
				data: (data.items as Record<string, unknown>[]).map(mapCustomerFromApi),
				total: data?.total ?? 0,
				page: data?.page ?? params?.page ?? 1,
				limit: data?.limit ?? params?.limit ?? 10,
				totalPages: Math.ceil((data?.total ?? 0) / (data?.limit ?? params?.limit ?? 10)),
			};
		}
	} catch {
		// Fallback to local mock data if backend endpoint is unavailable or returns 404
	}

	const page = Math.max(1, params?.page ?? 1);
	const limit = Math.max(1, params?.limit ?? 10);
	const search = params?.search?.toLowerCase().trim();
	const status = params?.status ?? "all";
	const sortBy = params?.sortBy;
	const sortOrder = params?.sortOrder;

	let filtered = [...MOCK_CUSTOMER_REGISTER_DATA];

	if (search) {
		filtered = filtered.filter(
			(item) =>
				item.customerNo.toLowerCase().includes(search) ||
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

export async function createCustomerAPIAction(
	data: CreateCustomerFullData,
): Promise<{ id: string }> {
	const payload = mapCustomerToApi(data);
	try {
		const res = await axiosInstance.post(API_PATH.CUSTOMERS.CREATE, payload);
		return { id: String(res.data?.data?.id ?? Date.now()) };
	} catch {
		// Fallback for development offline simulation
		return { id: String(Date.now()) };
	}
}

export async function saveDraftAPIAction(
	data: CreateCustomerFullData,
): Promise<{ id: string }> {
	const payload = { ...mapCustomerToApi(data), is_draft: true };

	try {
		if (data.id) {
			const res = await axiosInstance.patch(API_PATH.CUSTOMERS.UPDATE(data.id), payload);
			return { id: String(res.data?.data?.id ?? data.id) };
		}

		const res = await axiosInstance.post(API_PATH.CUSTOMERS.CREATE, payload);
		return { id: String(res.data?.data?.id ?? Date.now()) };
	} catch {
		// Fallback for development offline simulation
		return { id: data.id || String(Date.now()) };
	}
}

export async function uploadCustomerFileAPIAction(
	file: File,
): Promise<{ id: string; url: string }> {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("media_type", "customer_document");

	try {
		const res = await axiosInstance.post(API_PATH.CUSTOMERS.UPLOAD_FILE, formData);
		return {
			id: String(res.data?.data?.id ?? Date.now()),
			url: String(res.data?.data?.url ?? ""),
		};
	} catch {
		// Fallback for development offline simulation
		return {
			id: String(Date.now()),
			url: "",
		};
	}
}
