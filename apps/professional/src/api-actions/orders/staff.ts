import { API_PATH } from "@/constants/api";
import axiosInstance from "@/lib/axiosInstance";
import type { ActionResult, ApiResponse, ApiError } from "@/types/api";
import type {
	StaffLedgerItem,
	StaffFilterState,
	AddStaffPayload,
} from "@/features/orders/staff/types/staff.types";
import { MOCK_STAFF_LEDGER_ITEMS } from "@/features/orders/staff/data/staff.mock";

export async function getStaffLedgerAction(
	orderId: string,
	filters?: Partial<StaffFilterState>,
	pagination?: { page?: number; pageSize?: number }
): Promise<ActionResult<{ items: StaffLedgerItem[]; totalCount: number }>> {
	try {
		const basePath = API_PATH.ORDERS.STAFF(orderId);
		const queryParams = new URLSearchParams();
		if (filters?.supplier && filters.supplier !== "all") {
			queryParams.set("supplier", filters.supplier);
		}
		if (filters?.startDate) {
			queryParams.set("startDate", filters.startDate);
		}
		if (filters?.endDate) {
			queryParams.set("endDate", filters.endDate);
		}
		if (filters?.isLoggedInNow) {
			queryParams.set("isLoggedInNow", "true");
		}
		if (filters?.searchQuery) {
			queryParams.set("search", filters.searchQuery);
		}
		if (pagination?.page) {
			queryParams.set("page", String(pagination.page));
		}
		if (pagination?.pageSize) {
			queryParams.set("pageSize", String(pagination.pageSize));
		}

		const queryString = queryParams.toString();
		const url = queryString ? `${basePath}?${queryString}` : basePath;

		const res = await axiosInstance.get<
			ApiResponse<StaffLedgerItem[] | { items: StaffLedgerItem[]; totalCount: number }>
		>(url);

		if (res.data?.data) {
			const resData = res.data.data;
			if (Array.isArray(resData)) {
				return {
					success: true,
					data: {
						items: resData,
						totalCount: (res.data as unknown as { total?: number })?.total ?? resData.length,
					},
					error: null,
				};
			}
			if (typeof resData === "object" && "items" in resData && Array.isArray(resData.items)) {
				return {
					success: true,
					data: {
						items: resData.items,
						totalCount: resData.totalCount ?? resData.items.length,
					},
					error: null,
				};
			}
		}

		// Fallback to client-side filtering on mock data for development
		let filtered = [...MOCK_STAFF_LEDGER_ITEMS];
		if (filters?.supplier && filters.supplier !== "all") {
			filtered = filtered.filter(
				(item) => item.ue.toLowerCase() === filters.supplier?.toLowerCase()
			);
		}
		if (filters?.searchQuery) {
			const q = filters.searchQuery.toLowerCase();
			filtered = filtered.filter(
				(item) =>
					item.name.toLowerCase().includes(q) ||
					item.role.toLowerCase().includes(q) ||
					item.personNumber.includes(q) ||
					item.ue.toLowerCase().includes(q)
			);
		}

		const page = pagination?.page || 1;
		const pageSize = pagination?.pageSize || 10;
		const start = (page - 1) * pageSize;
		const paginated = filtered.slice(start, start + pageSize);

		return {
			success: true,
			data: {
				items: paginated,
				totalCount: filtered.length,
			},
			error: null,
		};
	} catch (error: unknown) {
		const apiError = error as ApiError;
		let filtered = [...MOCK_STAFF_LEDGER_ITEMS];
		if (filters?.supplier && filters.supplier !== "all") {
			filtered = filtered.filter(
				(item) => item.ue.toLowerCase() === filters.supplier?.toLowerCase()
			);
		}
		const page = pagination?.page || 1;
		const pageSize = pagination?.pageSize || 10;
		const start = (page - 1) * pageSize;
		const paginated = filtered.slice(start, start + pageSize);

		return {
			success: true,
			data: {
				items: paginated,
				totalCount: filtered.length,
			},
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function addStaffRegistrationAction(
	orderId: string,
	payload: AddStaffPayload
): Promise<ActionResult<StaffLedgerItem>> {
	try {
		const res = await axiosInstance.post<ApiResponse<StaffLedgerItem>>(
			API_PATH.ORDERS.STAFF(orderId),
			payload
		);
		if (res.data?.data) {
			return { success: true, data: res.data.data, error: null };
		}

		const newItem: StaffLedgerItem = {
			id: `staff-${Date.now()}`,
			date: payload.date || new Date().toISOString().split("T")[0],
			personNumber: payload.personNumber,
			name: payload.name,
			role: payload.role,
			isOwnStaff: payload.isOwnStaff ?? true,
			ue: payload.ue || "-",
			timeIn: payload.timeIn || "07:00",
			timeOut: payload.timeOut || "16:00",
			tool: payload.tool || "App Timeflow Work",
			phone: payload.phone || "-",
			email: payload.email || "-",
			status: "active",
		};
		return { success: true, data: newItem, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const newItem: StaffLedgerItem = {
			id: `staff-${Date.now()}`,
			date: payload.date || new Date().toISOString().split("T")[0],
			personNumber: payload.personNumber,
			name: payload.name,
			role: payload.role,
			isOwnStaff: payload.isOwnStaff ?? true,
			ue: payload.ue || "-",
			timeIn: payload.timeIn || "07:00",
			timeOut: payload.timeOut || "16:00",
			tool: payload.tool || "App Timeflow Work",
			phone: payload.phone || "-",
			email: payload.email || "-",
			status: "active",
		};
		return {
			success: true,
			data: newItem,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function deleteStaffRegistrationAction(
	orderId: string,
	staffId: string
): Promise<ActionResult<boolean>> {
	try {
		await axiosInstance.delete(API_PATH.ORDERS.STAFF_DETAIL(orderId, staffId));
		return { success: true, data: true, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		return {
			success: true,
			data: true,
			error: apiError.response?.data?.message || null,
		};
	}
}

export async function updateStaffRegistrationAction(
	orderId: string,
	staffId: string,
	payload: Partial<AddStaffPayload>
): Promise<ActionResult<StaffLedgerItem>> {
	try {
		const res = await axiosInstance.put<ApiResponse<StaffLedgerItem>>(
			API_PATH.ORDERS.STAFF_DETAIL(orderId, staffId),
			payload
		);
		if (res.data?.data) {
			return { success: true, data: res.data.data, error: null };
		}
		const existing =
			MOCK_STAFF_LEDGER_ITEMS.find((s) => s.id === staffId) || MOCK_STAFF_LEDGER_ITEMS[0];
		const updated: StaffLedgerItem = {
			...existing,
			...payload,
			id: staffId,
		};
		return { success: true, data: updated, error: null };
	} catch (error: unknown) {
		const apiError = error as ApiError;
		const existing =
			MOCK_STAFF_LEDGER_ITEMS.find((s) => s.id === staffId) || MOCK_STAFF_LEDGER_ITEMS[0];
		const updated: StaffLedgerItem = {
			...existing,
			...payload,
			id: staffId,
		};
		return {
			success: true,
			data: updated,
			error: apiError.response?.data?.message || null,
		};
	}
}
