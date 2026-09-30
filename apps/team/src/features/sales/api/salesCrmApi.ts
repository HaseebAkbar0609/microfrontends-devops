import axios from "@/lib/axiosInstance";
import type { SalesActivity, SalesCompany } from "../types";

const ROOT = "/api/v1/teams/sales/crm";

type Page = { data: SalesCompany[]; total_pages: number };
type Single = { data: SalesCompany };

export type SalesCompanyInput = Omit<
	SalesCompany,
	"id" | "createdAt" | "order" | "payment" | "version" | "professionalCompanyId"
>;

export function companyInput(company: SalesCompany): SalesCompanyInput {
	const {
		id: _id,
		createdAt: _createdAt,
		order: _order,
		payment: _payment,
		version: _version,
		professionalCompanyId: _professionalCompanyId,
		...body
	} = company;
	return body;
}

export async function listSalesCompanies(): Promise<SalesCompany[]> {
	const result: SalesCompany[] = [];
	let page = 1;
	let totalPages = 1;
	while (page <= totalPages) {
		const response = await axios.get<Page>(ROOT, {
			params: { page, page_size: 100 },
		});
		result.push(...response.data.data);
		totalPages = response.data.total_pages;
		page += 1;
	}
	return result;
}

export async function createSalesCompany(body: SalesCompanyInput) {
	return (await axios.post<Single>(ROOT, body)).data.data;
}

export async function createSalesCompanies(companies: SalesCompanyInput[]) {
	return (await axios.post<{ data: SalesCompany[] }>(`${ROOT}/bulk`, { companies })).data.data;
}

export async function patchSalesCompany(id: string, patch: Partial<SalesCompanyInput>) {
	return (await axios.patch<Single>(`${ROOT}/${id}`, patch)).data.data;
}

export async function archiveSalesCompany(id: string) {
	await axios.delete(`${ROOT}/${id}`);
}

/** Appends one activity. Unlike a PATCH of the whole list, it cannot erase a colleague's. */
export async function addSalesActivity(recordId: string, activity: SalesActivity) {
	return (await axios.post<{ data: SalesActivity }>(`${ROOT}/${recordId}/activities`, activity)).data.data;
}

export async function patchSalesActivity(
	recordId: string,
	activityId: string,
	changes: Partial<Omit<SalesActivity, "id">>,
) {
	return (await axios.patch<{ data: SalesActivity }>(
		`${ROOT}/${recordId}/activities/${activityId}`,
		changes,
	)).data.data;
}

export async function linkProfessionalAccount(recordId: string, companyId: string) {
	return (await axios.post<Single>(`${ROOT}/${recordId}/professional-account`, {
		company_id: companyId,
	})).data.data;
}
