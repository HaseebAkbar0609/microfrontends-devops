const DEFAULT_PAGE_SIZE = 10;

export type ProfessionalStatus = "active" | "inactive" | "pending";

export interface ProfessionalRow {
	id: string;
	customerNo: string;
	companyName: string;
	orgNo: string;
	category: string;
	contactPerson: string;
	email: string;
	phone: string;
	city: string;
	status: ProfessionalStatus;
}

export interface ListProfessionalsParams {
	page?: number;
	pageSize?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: string;
}

export interface ProfessionalsListResult {
	items: ProfessionalRow[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
}

// Mock data — replace with real API call when endpoint is ready
const MOCK_DATA: ProfessionalRow[] = [
	{ id: "1",  customerNo: "2025-01", companyName: "Byggbolaget AB",       orgNo: "5595010-1002", category: "Bygg",      contactPerson: "Erik Andersson",  email: "erik@example.com",    phone: "940 987 6574", city: "Järfälla", status: "active" },
	{ id: "2",  customerNo: "2025-02", companyName: "Måleri AB",            orgNo: "5595010-2003", category: "Målare",    contactPerson: "Sofia Vergara",   email: "sofia@example.com",   phone: "940 987 6574", city: "Järfälla", status: "active" },
	{ id: "3",  customerNo: "2025-03", companyName: "Elektriker AB",        orgNo: "000000-0000",  category: "Elektriker",contactPerson: "Magnus Karlsson", email: "magnus@example.com",  phone: "940 987 6574", city: "Järfälla", status: "active" },
	{ id: "4",  customerNo: "2025-04", companyName: "Städbolag AB",         orgNo: "000000-0001",  category: "Städbolag", contactPerson: "Anna Lindqvist",  email: "anna@example.com",    phone: "940 987 6574", city: "Järfälla", status: "active" },
	{ id: "5",  customerNo: "2025-05", companyName: "VVS Proffs AB",        orgNo: "5595010-3004", category: "VVS",       contactPerson: "Lars Nilsson",    email: "lars@example.com",    phone: "940 987 6574", city: "Stockholm",status: "active" },
	{ id: "6",  customerNo: "2025-06", companyName: "Takläggning Nord",     orgNo: "5595010-4005", category: "Tak",       contactPerson: "Maria Ström",     email: "maria@example.com",   phone: "940 987 6574", city: "Uppsala",  status: "active" },
	{ id: "7",  customerNo: "2025-07", companyName: "Golvspecialisten",     orgNo: "5595010-5006", category: "Golv",      contactPerson: "Peter Berg",      email: "peter@example.com",   phone: "940 987 6574", city: "Järfälla", status: "active" },
	{ id: "8",  customerNo: "2025-08", companyName: "Fasad & Mark",         orgNo: "5595010-6007", category: "Fasad",     contactPerson: "Karin Holm",      email: "karin@example.com",   phone: "940 987 6574", city: "Solna",    status: "active" },
	{ id: "9",  customerNo: "2025-09", companyName: "Snickeri & Bygg",      orgNo: "5595010-7008", category: "Snickeri",  contactPerson: "Johan Eriksson",  email: "johan@example.com",   phone: "940 987 6574", city: "Järfälla", status: "active" },
	{ id: "10", customerNo: "2025-10", companyName: "Rörinstallationer AB", orgNo: "5595010-8009", category: "VVS",       contactPerson: "Eva Sjöberg",     email: "eva@example.com",     phone: "940 987 6574", city: "Täby",     status: "active" },
	{ id: "11", customerNo: "2025-11", companyName: "Markarbeten AB",       orgNo: "5595010-9010", category: "Mark",      contactPerson: "Anders Björk",    email: "anders@example.com",  phone: "940 987 6574", city: "Stockholm",status: "active" },
	{ id: "12", customerNo: "2025-12", companyName: "Fönster & Dörrar AB",  orgNo: "5595010-0011", category: "Fönster",   contactPerson: "Lena Persson",    email: "lena@example.com",    phone: "940 987 6574", city: "Järfälla", status: "active" },
	{ id: "13", customerNo: "2025-13", companyName: "Isolering Nord",       orgNo: "5595011-1012", category: "Isolering", contactPerson: "Mikael Söder",    email: "mikael@example.com",  phone: "940 987 6574", city: "Uppsala",  status: "active" },
	{ id: "14", customerNo: "2025-14", companyName: "Badrum & Kakel",       orgNo: "5595011-2013", category: "Badrum",    contactPerson: "Cecilia Vass",    email: "cecilia@example.com", phone: "940 987 6574", city: "Solna",    status: "active" },
	{ id: "15", customerNo: "2025-15", companyName: "Köksrenovering AB",    orgNo: "5595011-3014", category: "Kök",       contactPerson: "Thomas Gran",     email: "thomas@example.com",  phone: "940 987 6574", city: "Täby",     status: "active" },
];

function applyMockFilters(
	params: ListProfessionalsParams,
): ProfessionalsListResult {
	const { page = 1, pageSize = DEFAULT_PAGE_SIZE, search, sortBy, sortOrder } = params;

	let filtered = [...MOCK_DATA];

	if (search?.trim()) {
		const term = search.trim().toLowerCase();
		filtered = filtered.filter(
			(p) =>
				p.companyName.toLowerCase().includes(term) ||
				p.customerNo.toLowerCase().includes(term) ||
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
): Promise<ProfessionalsListResult> {
	return applyMockFilters(params);
}
