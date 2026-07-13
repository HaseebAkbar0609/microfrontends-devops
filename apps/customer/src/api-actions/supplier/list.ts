import type { ActionResult } from "@/types/api";
import type { Supplier } from "@/features/suppliers/types/types";

const MOCK_SUPPLIERS: Supplier[] = [
	{
		id: "1",
		companyName: "Pelle bygg",
		orgNo: "556123-4567",
		contactPersonName: "Peter Svensson",
		email: "peter@pellebygg.se",
		mobileNumber: "070-123 45 61",
	},
	{
		id: "2",
		companyName: "Nisse bygg",
		orgNo: "556234-5678",
		contactPersonName: "Nisse Olsson",
		email: "nisse@nissebygg.se",
		mobileNumber: "070-123 45 62",
	},
	{
		id: "3",
		companyName: "CL bygg",
		orgNo: "556345-6789",
		contactPersonName: "Conny Larson",
		email: "conny@clbygg.se",
		mobileNumber: "070-123 45 63",
	},
	{
		id: "4",
		companyName: "Karlssons VVS",
		orgNo: "556456-7890",
		contactPersonName: "Karl Karlsson",
		email: "karl@karlssonsvvs.se",
		mobileNumber: "070-123 45 64",
	},
	{
		id: "5",
		companyName: "Lindgren El",
		orgNo: "556567-8901",
		contactPersonName: "Eva Lindgren",
		email: "eva@lindgrenel.se",
		mobileNumber: "070-123 45 65",
	},
	{
		id: "6",
		companyName: "Ström Måleri",
		orgNo: "556678-9012",
		contactPersonName: "Anders Ström",
		email: "anders@strommaleri.se",
		mobileNumber: "070-123 45 66",
	},
	{
		id: "7",
		companyName: "Berg & Söner",
		orgNo: "556789-0123",
		contactPersonName: "Johan Berg",
		email: "johan@bergsooner.se",
		mobileNumber: "070-123 45 67",
	},
	{
		id: "8",
		companyName: "Hansson Mark",
		orgNo: "556890-1234",
		contactPersonName: "Maria Hansson",
		email: "maria@hanssonmark.se",
		mobileNumber: "070-123 45 68",
	},
	{
		id: "9",
		companyName: "Nilsson Tak",
		orgNo: "556901-2345",
		contactPersonName: "Lars Nilsson",
		email: "lars@nilssontak.se",
		mobileNumber: "070-123 45 69",
	},
	{
		id: "10",
		companyName: "Eriksson Golv",
		orgNo: "557012-3456",
		contactPersonName: "Sara Eriksson",
		email: "sara@erikssongolv.se",
		mobileNumber: "070-123 45 70",
	},
];

export interface GetSuppliersParams {
	page?: number;
	pageSize?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: string;
}

export interface SuppliersListPayload {
	suppliers: Supplier[];
	totalItems: number;
}

export async function getSuppliersAPIAction(
	params: GetSuppliersParams = {},
): Promise<ActionResult<SuppliersListPayload>> {
	const { page = 1, pageSize = 10, search, sortBy, sortOrder } = params;

	try {
		let filtered = [...MOCK_SUPPLIERS];

		if (search && search.trim()) {
			const term = search.trim().toLowerCase();
			filtered = filtered.filter(
				(s) =>
					s.companyName.toLowerCase().includes(term) ||
					s.orgNo.toLowerCase().includes(term) ||
					s.contactPersonName.toLowerCase().includes(term) ||
					s.email.toLowerCase().includes(term),
			);
		}

		if (sortBy && sortBy !== "actions") {
			filtered.sort((a, b) => {
				const aVal = a[sortBy as keyof Supplier] ?? "";
				const bVal = b[sortBy as keyof Supplier] ?? "";
				const cmp = String(aVal).localeCompare(String(bVal));
				return sortOrder === "desc" ? -cmp : cmp;
			});
		}

		const totalItems = filtered.length;
		const start = (page - 1) * pageSize;
		const suppliers = filtered.slice(start, start + pageSize);

		return { success: true, data: { suppliers, totalItems }, error: null };
	} catch {
		return {
			success: false,
			data: null,
			error: "Failed to load suppliers",
		};
	}
}
