import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	CustomerRegisterRow,
	CustomerDetail,
	CustomerContact,
	CustomerDocument,
	CreateCustomerFullData,
	GetCustomerRegisterListParams,
	GetCustomerRegisterListResponse,
} from "../types";
import { MOCK_CUSTOMER_REGISTER_DATA } from "../mockdata/customers";
import { MOCK_CUSTOMER_DETAIL } from "../mockdata/customerDetail";

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
	dateAdded: String(item.date_added ?? item.dateAdded ?? "2024-01-15"),
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

export async function getCustomerDetailAPIAction(
	id: string,
): Promise<CustomerDetail> {
	try {
		const res = await axiosInstance.get(API_PATH.CUSTOMERS.GET(id));
		const data = res.data?.data;
		if (data) {
			return mapCustomerDetailFromApi(data);
		}
	} catch {
		// Fallback to mock data
	}

	const mock = MOCK_CUSTOMER_REGISTER_DATA.find((c) => c.id === id);
	if (mock) {
		return {
			...MOCK_CUSTOMER_DETAIL,
			id: mock.id,
			customerNo: mock.customerNo,
			companyName: mock.name,
			orgNo: mock.orgNo,
			status: mock.status,
			phone: mock.phone,
			email: mock.email,
			visitingAddress: mock.address,
			visitingPostalCode: mock.postNr,
			visitingCity: mock.city,
			invoiceAddress: mock.address,
			invoicePostalCode: mock.postNr,
			invoiceCity: mock.city,
		};
	}

	return MOCK_CUSTOMER_DETAIL;
}

function mapCustomerDetailFromApi(data: Record<string, unknown>): CustomerDetail {
	const rawContacts = Array.isArray(data.contact_persons) ? data.contact_persons : [];
	const contacts: CustomerContact[] = rawContacts.map((c: Record<string, unknown>, idx: number) => ({
		id: String(c.id ?? `c${idx + 1}`),
		firstName: String(c.first_name ?? c.firstName ?? ""),
		lastName: String(c.last_name ?? c.lastName ?? ""),
		mobile: String(c.mobile ?? ""),
		email: String(c.email ?? ""),
		role: String(c.role ?? ""),
		personalNo: String(c.personal_no ?? c.personalNo ?? ""),
	}));

	const rawDocs = Array.isArray(data.documents) ? data.documents : [];
	const documents: CustomerDocument[] = rawDocs.map((d: Record<string, unknown>, idx: number) => ({
		id: String(d.id ?? `d${idx + 1}`),
		date: String(d.date ?? ""),
		name: String(d.name ?? ""),
		type: String(d.type ?? "PDF"),
		url: String(d.url ?? ""),
	}));

	const rawRatings = (data.ratings as Record<string, number>) || {};

	return {
		id: String(data.id ?? ""),
		customerNo: String(data.customer_no ?? data.customerNo ?? "#M101"),
		companyName: String(data.company_name ?? data.name ?? ""),
		orgNo: String(data.org_no ?? data.orgNo ?? ""),
		status: (data.status as "active" | "inactive") ?? "active",
		mainCategory: String(data.main_category ?? data.mainCategory ?? ""),
		department: String(data.department ?? ""),
		region: String(data.region ?? ""),
		vatRegNo: String(data.vat_reg_no ?? data.vatRegNo ?? ""),
		visitingAddress: String(data.visiting_address ?? data.visitingAddress ?? ""),
		visitingPostalCode: String(data.visiting_postal_code ?? data.visitingPostalCode ?? ""),
		visitingCity: String(data.visiting_city ?? data.visitingCity ?? ""),
		invoiceAddress: String(data.invoice_address ?? data.invoiceAddress ?? ""),
		invoicePostalCode: String(data.invoice_postal_code ?? data.invoicePostalCode ?? ""),
		invoiceCity: String(data.invoice_city ?? data.invoiceCity ?? ""),
		bankName: String(data.bank_name ?? data.bankName ?? ""),
		bankAccount: String(data.bank_account ?? data.bankAccount ?? ""),
		bankgiro: String(data.bankgiro ?? ""),
		plusgiro: String(data.plusgiro ?? ""),
		iban: String(data.iban ?? ""),
		bic: String(data.bic ?? ""),
		phone: String(data.phone ?? ""),
		email: String(data.email ?? ""),
		website: String(data.website ?? ""),
		contactNotes: String(data.contact_notes ?? data.contactNotes ?? ""),
		contacts: contacts.length > 0 ? contacts : MOCK_CUSTOMER_DETAIL.contacts,
		ratings: {
			economy: Number(rawRatings.economy ?? 4),
			environment: Number(rawRatings.environment ?? 3),
			quality: Number(rawRatings.quality ?? 5),
			collaboration: Number(rawRatings.collaboration ?? 4),
			punctuality: Number(rawRatings.punctuality ?? 3),
			service: Number(rawRatings.service ?? 4),
		},
		documents: documents.length > 0 ? documents : MOCK_CUSTOMER_DETAIL.documents,
		notes: String(data.notes ?? MOCK_CUSTOMER_DETAIL.notes),
		paymentTerms: String(data.payment_terms ?? data.paymentTerms ?? "30 dagar"),
		deliveryTerms: String(data.delivery_terms ?? data.deliveryTerms ?? "Ex Works (EXW)"),
		deliveryMethod: String(data.delivery_method ?? data.deliveryMethod ?? "Email"),
		interestInvoicing: String(data.interest_invoicing ?? data.interestInvoicing ?? "Ja"),
		priceList: String(data.price_list ?? data.priceList ?? "Standard"),
		currency: String(data.currency ?? "SEK"),
		invoiceDiscount: String(data.invoice_discount ?? data.invoiceDiscount ?? ""),
		invoiceFee: String(data.invoice_fee ?? data.invoiceFee ?? ""),
		shippingFee: String(data.shipping_fee ?? data.shippingFee ?? ""),
		pricesInclVat: String(data.prices_incl_vat ?? data.pricesInclVat ?? ""),
		ourReference: String(data.our_reference ?? data.ourReference ?? "info"),
		customerResponsible: String(data.customer_responsible ?? data.customerResponsible ?? "Anna Svensson"),
		externalReference: String(data.external_reference ?? data.externalReference ?? ""),
		yourReference: String(data.your_reference ?? data.yourReference ?? "Info (Default)"),
		vatNumber: String(data.vat_number ?? data.vatNumber ?? ""),
		vatType: String(data.vat_type ?? data.vatType ?? "Standard"),
		salesAccount: String(data.sales_account ?? data.salesAccount ?? "info"),
		costCenter: String(data.cost_center ?? data.costCenter ?? "Info"),
		project: String(data.project ?? "info"),
	};
}
