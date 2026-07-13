import axiosInstance from "@/lib/axiosInstance";

export interface RotPayload {
	propertyId: string;
	personalId: string;
	coOwner: boolean;
}

export interface Owner {
	id: string;
	name: string;
	personalId: string;
	share: string;
}

export interface RotEntry {
	id: string;
	propertyId: string;
	address: string;
	createdAt: string;
	owners: {
		id: string;
		name: string;
	}[];
}

export const getOwners = async (_projectId: string): Promise<Owner[]> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve([
				{ id: "dummy-1", name: "Lars Andersson", personalId: "346 465 2416", share: "50%" },
				{ id: "dummy-2", name: "Anna Andersson", personalId: "346 465 2416", share: "50%" },
			]);
		}, 500);
	});
};

export const createRot = async (projectId: string, data: RotPayload) => {
	return axiosInstance.post(`/projects/${projectId}/rot`, data);
};

export const getRotEntries = async (
	_projectId: string,
	_params?: {
		page?: number;
		pageSize?: number;
		search?: string;
		sortBy?: string;
		sortOrder?: "asc" | "desc" | null;
	}
): Promise<{ success: boolean; data?: { rotEntries: RotEntry[]; totalItems: number }; error?: string }> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			let entries: RotEntry[] = [
				{
					id: "1",
					propertyId: "Property 1",
					address: "Stegatan 23",
					createdAt: "2026-02-01",
					owners: [
						{ id: "o1", name: "Anna Andersson" },
						{ id: "o2", name: "Anna Andersson" },
					],
				},
				{
					id: "2",
					propertyId: "Property 2",
					address: "Storgatan 45",
					createdAt: "2026-02-01",
					owners: [
						{ id: "o3", name: "Anna Andersson" },
						{ id: "o4", name: "Anna Andersson" },
					],
				},
				{
					id: "3",
					propertyId: "Property 3",
					address: "Kungsgatan 12",
					createdAt: "2026-02-01",
					owners: [
						{ id: "o5", name: "Anna Andersson" },
					],
				},
				{
					id: "4",
					propertyId: "Property 4",
					address: "Vasagatan 8",
					createdAt: "2026-02-01",
					owners: [],
				},
			];

			// Apply search filter if present
			const search = _params?.search?.toLowerCase();
			if (search) {
				entries = entries.filter(
					(e) =>
						e.propertyId.toLowerCase().includes(search) ||
						e.address.toLowerCase().includes(search) ||
						e.owners.some((o) => o.name.toLowerCase().includes(search))
				);
			}

			// Apply sorting if present
			const sortBy = _params?.sortBy;
			const sortOrder = _params?.sortOrder;
			if (sortBy && sortOrder) {
				entries = [...entries].sort((a, b) => {
					let valA = "";
					let valB = "";

					if (sortBy === "propertyId") {
						valA = a.propertyId;
						valB = b.propertyId;
					} else if (sortBy === "address") {
						valA = a.address;
						valB = b.address;
					} else if (sortBy === "createdAt") {
						valA = a.createdAt;
						valB = b.createdAt;
					}

					if (sortOrder === "asc") {
						return valA.localeCompare(valB);
					} else {
						return valB.localeCompare(valA);
					}
				});
			}

			// Paginate
			const page = _params?.page ?? 1;
			const pageSize = _params?.pageSize ?? 10;
			const startIndex = (page - 1) * pageSize;
			const paginatedEntries = entries.slice(startIndex, startIndex + pageSize);

			resolve({
				success: true,
				data: {
					rotEntries: paginatedEntries,
					totalItems: entries.length,
				},
			});
		}, 300);
	});
};
