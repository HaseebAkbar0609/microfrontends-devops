import axiosInstance from "@/lib/axiosInstance";
import { API_PATH } from "@/constants/api";
import type {
	SupplierRegisterRow,
	CreateSupplierFullData,
	SupplierDetail,
	SupplierContact,
	SupplierDocument,
	GetSupplierRegisterListParams,
	GetSupplierRegisterListResponse,
} from "../types";
import { normalizeRegisterStatus } from "../utils/registerHelpers";

export type { SupplierRegisterRow };

const SUPPLIER_SORT_MAP: Record<string, string> = {
	supplierNo: "supplier_no",
	name: "company_name",
	orgNo: "org_no",
	postNr: "postal_code",
	city: "visiting_city",
	address: "visiting_address",
	status: "status",
	dateAdded: "created_at",
	companyName: "company_name",
	createdAt: "created_at",
	updatedAt: "updated_at",
};

const mapSupplierFromApi = (item: Record<string, unknown>): SupplierRegisterRow => ({
	id: String(item.id ?? ""),
	supplierNo: String(item.supplier_no ?? item.supplierNo ?? ""),
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

const mapSupplierToApi = (data: CreateSupplierFullData): Record<string, unknown> => ({
	company_name: data.companyName,
	org_no: data.orgNo,
	supplier_no: data.supplierNo || null,
	status: normalizeRegisterStatus(data.status),
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
	documents: data.documents || [],
	notes: data.notes || null,
});

export async function getSupplierRegisterListAPIAction(
	params?: GetSupplierRegisterListParams,
): Promise<GetSupplierRegisterListResponse> {
	const queryParams: Record<string, string | number> = {};
	if (params?.page) queryParams.page = params.page;
	if (params?.limit) queryParams.limit = params.limit;
	if (params?.search) queryParams.search = params.search;
	if (params?.status && params.status !== "all") queryParams.status = params.status;
	if (params?.sortBy) queryParams.sort_by = SUPPLIER_SORT_MAP[params.sortBy] ?? params.sortBy;
	if (params?.sortOrder) queryParams.sort_order = params.sortOrder;

	const res = await axiosInstance.get(API_PATH.SUPPLIERS.LIST, { params: queryParams });

	const items = res.data?.data;
	if (!Array.isArray(items)) {
		throw new Error("Invalid supplier list response");
	}

	return {
		data: (items as Record<string, unknown>[]).map(mapSupplierFromApi),
		total: Number(res.data?.total_items ?? items.length),
		page: Number(res.data?.current_page ?? params?.page ?? 1),
		limit: Number(res.data?.page_size ?? params?.limit ?? 10),
		totalPages: Number(res.data?.total_pages ?? 1),
	};
}

export async function createSupplierAPIAction(
	data: CreateSupplierFullData,
): Promise<{ id: string }> {
	const payload = mapSupplierToApi(data);

	if (data.id) {
		const res = await axiosInstance.put(
			API_PATH.SUPPLIERS.UPDATE(data.id),
			payload,
		);
		return { id: String(res.data?.data?.id ?? data.id) };
	}

	const res = await axiosInstance.post(
		API_PATH.SUPPLIERS.CREATE,
		payload,
	);
	return { id: String(res.data?.data?.id ?? "") };
}

export async function saveSupplierDraftAPIAction(
	data: CreateSupplierFullData,
): Promise<{ id: string }> {
	const payload = { ...mapSupplierToApi(data), is_draft: true };

	if (data.id) {
		const res = await axiosInstance.put(API_PATH.SUPPLIERS.UPDATE(data.id), payload);
		return { id: String(res.data?.data?.id ?? data.id) };
	}

	const res = await axiosInstance.post(API_PATH.SUPPLIERS.CREATE, payload);
	return { id: String(res.data?.data?.id ?? "") };
}

export async function deleteSupplierAPIAction(id: string): Promise<void> {
	await axiosInstance.delete(API_PATH.SUPPLIERS.DELETE(id));
}

export async function uploadSupplierFileAPIAction(
	file: File,
): Promise<{ id: string; url: string }> {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("media_type", "supplier_document");

	const res = await axiosInstance.post(API_PATH.SUPPLIERS.UPLOAD_FILE, formData);
	const data = res.data?.data;
	const id = String(data?.id ?? "");
	const url = String(data?.url ?? data?.file_url_path ?? data?.signed_url ?? "");

	if (!id) {
		throw new Error("Invalid upload response");
	}

	return { id, url };
}

export async function getSupplierDetailAPIAction(
	id: string,
): Promise<SupplierDetail> {
	const res = await axiosInstance.get(API_PATH.SUPPLIERS.GET(id));
	const data = res.data?.data;
	if (!data) {
		throw new Error("Supplier not found");
	}
	return mapSupplierDetailFromApi(data);
}

function mapSupplierDetailFromApi(data: Record<string, unknown>): SupplierDetail {
	const rawContacts = Array.isArray(data.contacts)
		? data.contacts
		: Array.isArray(data.contact_persons)
			? data.contact_persons
			: [];
	const contacts: SupplierContact[] = rawContacts.map((c: Record<string, unknown>, idx: number) => ({
		id: String(c.id ?? `c${idx + 1}`),
		firstName: String(c.first_name ?? c.firstName ?? ""),
		lastName: String(c.last_name ?? c.lastName ?? ""),
		mobile: String(c.mobile ?? ""),
		email: String(c.email ?? ""),
		role: String(c.role ?? ""),
		personalNo: String(c.personal_no ?? c.personalNo ?? ""),
	}));

	const rawDocs = Array.isArray(data.documents) ? data.documents : [];
	const documents: SupplierDocument[] = rawDocs.map((d: Record<string, unknown>, idx: number) => ({
		id: String(d.id ?? `d${idx + 1}`),
		date: String(d.date ?? ""),
		name: String(d.name ?? ""),
		type: String(d.type ?? "PDF"),
		url: String(d.url ?? ""),
	}));

	const rawRatings = (data.ratings as Record<string, number>) || {};

	return {
		id: String(data.id ?? ""),
		supplierNo: String(data.supplier_no ?? data.supplierNo ?? ""),
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
		betalningsdagar: String(data.betalningsdagar ?? ""),
		ranta: String(data.ranta ?? ""),
		fakturaavgift: String(data.fakturaavgift ?? ""),
		inkasso: String(data.inkasso ?? ""),
		phone: String(data.phone ?? ""),
		email: String(data.email ?? ""),
		website: String(data.website ?? ""),
		contactNotes: String(data.contact_notes ?? data.contactNotes ?? ""),
		contacts,
		ratings: {
			economy: Number(rawRatings.economy ?? 0),
			environment: Number(rawRatings.environment ?? 0),
			quality: Number(rawRatings.quality ?? 0),
			collaboration: Number(rawRatings.collaboration ?? 0),
			punctuality: Number(rawRatings.punctuality ?? 0),
			service: Number(rawRatings.service ?? 0),
		},
		documents,
		notes: String(data.notes ?? ""),
	};
}
