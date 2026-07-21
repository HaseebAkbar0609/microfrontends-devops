import axiosInstance from "@/lib/axiosInstance";

const PROFESSIONALS_ACCOUNTS_PATH = "/api/v1/teams/professionals/accounts";
const DEFAULT_PAGE_SIZE = 10;
const MOCK_ENABLE = true;

export type ProfessionalStatus = "active" | "inactive" | "pending" | "archived";
export type PendingProfessionalStatus = ProfessionalStatus;

export interface ProfessionalRow {
	id: string;
	contactUserId: string;
	companyName: string;
	orgNo: string;
	category: string;
	contactPerson: string;
	email: string;
	phone: string;
	city: string;
	status: ProfessionalStatus;
}

export type PendingProfessionalRow = ProfessionalRow;

export interface ListProfessionalsParams {
	page?: number;
	pageSize?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: string;
}

export interface ProfessionalsListResult<T = ProfessionalRow> {
	items: T[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
}

export type PendingSortField = keyof Omit<ProfessionalRow, "id" | "status"> | null;

// Backend response shape
interface ProfessionalCategoryInfo {
	id: string;
	name: string;
}

interface ProfessionalAccountItem {
	company_id: string;
	company_name?: string | null;
	organization_number?: string | null;
	category?: ProfessionalCategoryInfo | null;
	contact_person?: string | null;
	contact_user_id?: string | null;
	email?: string | null;
	phone?: string | null;
	city?: string | null;
	status?: string | null;
}

interface ProfessionalsListApiResponse {
	success: boolean;
	message: string;
	data: ProfessionalAccountItem[];
	total_pages: number;
	total_items: number;
	current_page: number;
	page_size: number;
}

function mapItemToRow(item: ProfessionalAccountItem): ProfessionalRow {
	return {
		id: item.company_id,
		contactUserId: item.contact_user_id ?? "",
		companyName: item.company_name ?? "",
		orgNo: item.organization_number ?? "",
		category: item.category?.name ?? "",
		contactPerson: item.contact_person ?? "",
		email: item.email ?? "",
		phone: item.phone ?? "",
		city: item.city ?? "",
		status: (item.status ?? "pending") as ProfessionalStatus,
	};
}

// Mock data — disabled by default; set MOCK_ENABLE=true locally to use
export const MOCK_DATA: ProfessionalRow[] = [
	{ id: "1",  contactUserId: "2025-01", companyName: "Byggbolaget AB",       orgNo: "5595010-1002", category: "Bygg",       contactPerson: "Erik Andersson",  email: "erik@example.com",    phone: "940 987 6574", city: "Järfälla",  status: "active" },
	{ id: "2",  contactUserId: "2025-02", companyName: "Måleri AB",            orgNo: "5595010-2003", category: "Målare",     contactPerson: "Sofia Vergara",   email: "sofia@example.com",   phone: "940 987 6574", city: "Järfälla",  status: "active" },
	{ id: "3",  contactUserId: "2025-03", companyName: "Elektriker AB",        orgNo: "000000-0000",  category: "Elektriker", contactPerson: "Magnus Karlsson", email: "magnus@example.com",  phone: "940 987 6574", city: "Järfälla",  status: "active" },
	{ id: "4",  contactUserId: "2025-04", companyName: "Städbolag AB",         orgNo: "000000-0001",  category: "Städbolag",  contactPerson: "Anna Lindqvist",  email: "anna@example.com",    phone: "940 987 6574", city: "Järfälla",  status: "active" },
	{ id: "5",  contactUserId: "2025-05", companyName: "VVS Proffs AB",        orgNo: "5595010-3004", category: "VVS",        contactPerson: "Lars Nilsson",    email: "lars@example.com",    phone: "940 987 6574", city: "Stockholm", status: "active" },
	{ id: "6",  contactUserId: "2025-06", companyName: "Takläggning Nord",     orgNo: "5595010-4005", category: "Tak",        contactPerson: "Maria Ström",     email: "maria@example.com",   phone: "940 987 6574", city: "Uppsala",   status: "active" },
	{ id: "7",  contactUserId: "2025-07", companyName: "Golvspecialisten",     orgNo: "5595010-5006", category: "Golv",       contactPerson: "Peter Berg",      email: "peter@example.com",   phone: "940 987 6574", city: "Järfälla",  status: "active" },
	{ id: "8",  contactUserId: "2025-08", companyName: "Fasad & Mark",         orgNo: "5595010-6007", category: "Fasad",      contactPerson: "Karin Holm",      email: "karin@example.com",   phone: "940 987 6574", city: "Solna",     status: "active" },
	{ id: "9",  contactUserId: "2025-09", companyName: "Snickeri & Bygg",      orgNo: "5595010-7008", category: "Snickeri",   contactPerson: "Johan Eriksson",  email: "johan@example.com",   phone: "940 987 6574", city: "Järfälla",  status: "active" },
	{ id: "10", contactUserId: "2025-10", companyName: "Rörinstallationer AB", orgNo: "5595010-8009", category: "VVS",        contactPerson: "Eva Sjöberg",     email: "eva@example.com",     phone: "940 987 6574", city: "Täby",      status: "active" },
	{ id: "p1", contactUserId: "2025-11", companyName: "Nya Elbolaget AB",     orgNo: "5595010-9001", category: "Elektriker", contactPerson: "Erik Andersson",  email: "erikh@example.com",   phone: "940 987 6574", city: "Malmö",     status: "pending" },
	{ id: "p2", contactUserId: "2025-12", companyName: "Takläggning Syd",      orgNo: "5595010-9002", category: "Tak",        contactPerson: "Maria Lindgren",  email: "marialg@example.com", phone: "940 987 6574", city: "Göteborg",  status: "pending" },
];

function applyMockFilters(
	params: ListProfessionalsParams & { status?: ProfessionalStatus },
): ProfessionalsListResult<ProfessionalRow> {
	const { page = 1, pageSize = DEFAULT_PAGE_SIZE, search, sortBy, sortOrder, status } = params;

	let filtered = status ? MOCK_DATA.filter((p) => p.status === status) : [...MOCK_DATA];

	if (search?.trim()) {
		const term = search.trim().toLowerCase();
		filtered = filtered.filter(
			(p) =>
				p.companyName.toLowerCase().includes(term) ||
				p.orgNo.toLowerCase().includes(term) ||
				p.contactPerson.toLowerCase().includes(term) ||
				p.email.toLowerCase().includes(term) ||
				p.category.toLowerCase().includes(term) ||
				p.city.toLowerCase().includes(term),
		);
	}

	if (sortBy && sortBy !== "status") {
		filtered.sort((a, b) => {
			const aVal = String(a[sortBy as keyof ProfessionalRow] ?? "");
			const bVal = String(b[sortBy as keyof ProfessionalRow] ?? "");
			const cmp = aVal.localeCompare(bVal);
			return sortOrder === "desc" ? -cmp : cmp;
		});
	}

	const totalItems = filtered.length;
	const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
	const start = (page - 1) * pageSize;

	return {
		items: filtered.slice(start, start + pageSize),
		totalItems,
		totalPages,
		currentPage: page,
	};
}

export async function listProfessionalsAPIAction(
	params: ListProfessionalsParams = {},
): Promise<ProfessionalsListResult<ProfessionalRow>> {
	if (MOCK_ENABLE) {
		return applyMockFilters({ ...params, status: "active" });
	}

	const response = await axiosInstance.get<ProfessionalsListApiResponse>(
		PROFESSIONALS_ACCOUNTS_PATH,
		{
			params: {
				page: params.page ?? 1,
				page_size: params.pageSize ?? DEFAULT_PAGE_SIZE,
				search: params.search || undefined,
				status: "active",
			},
		},
	);
	const payload = response.data;

	return {
		items: (payload.data ?? []).map(mapItemToRow),
		totalItems: payload.total_items ?? 0,
		totalPages: payload.total_pages ?? 1,
		currentPage: payload.current_page ?? (params.page ?? 1),
	};
}

export async function listPendingProfessionalsAPIAction(
	params: ListProfessionalsParams = {},
): Promise<ProfessionalsListResult<PendingProfessionalRow>> {
	if (MOCK_ENABLE) {
		return applyMockFilters({ ...params, status: "pending" });
	}

	const response = await axiosInstance.get<ProfessionalsListApiResponse>(
		PROFESSIONALS_ACCOUNTS_PATH,
		{
			params: {
				page: params.page ?? 1,
				page_size: params.pageSize ?? DEFAULT_PAGE_SIZE,
				search: params.search || undefined,
				status: "pending",
			},
		},
	);
	const payload = response.data;

	return {
		items: (payload.data ?? []).map(mapItemToRow),
		totalItems: payload.total_items ?? 0,
		totalPages: payload.total_pages ?? 1,
		currentPage: payload.current_page ?? (params.page ?? 1),
	};
}
