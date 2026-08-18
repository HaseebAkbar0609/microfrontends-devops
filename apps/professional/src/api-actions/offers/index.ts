import axiosInstance from "@/lib/axiosInstance";
import { OfferList } from "@/features/offer/types";
import { OfferApiResponseItem, OffersListApiResponse } from "@/types/offer";
import { ApiResponse, ActionResult } from "@/types/api";

const OFFERS_LIST_PATH = "/professionals/quotes/quote-listing/offer_listing_by_status";
const DEFAULT_PAGE_SIZE = 10;

export interface ListOffersParams {
	status: string; // e.g. "REQUESTED", "OFFERED"
	page?: number;
	pageSize?: number;
	search?: string;
	companyId?: string;
}

export interface OffersListResult {
	items: OfferList[];
	totalItems: number;
	totalPages: number;
	currentPage: number;
}

function mapItemToOfferList(item: OfferApiResponseItem): OfferList {
	return {
		id: item.id || item.offer_id || "",
		idNumber: item.project_code || "N/A",
		jobName: item.project_title || item.title || "Unknown Job",
		date: item.created_at ? new Date(item.created_at).toISOString().split("T")[0] : "",
		type: item.project_type || "Standard",
		request: item.status || "Unknown",
		municipality: item.city || "",
		category: item.category || "",
		isFavorite: false,
	};
}

export async function listOffersAPIAction(
	params: ListOffersParams,
): Promise<OffersListResult> {
	if (!params.status) {
		throw new Error("status parameter is required to fetch offers");
	}

	const response = await axiosInstance.get<OffersListApiResponse>(
		OFFERS_LIST_PATH,
		{
			params: {
				status: params.status.toLowerCase(),
				page: params.page ?? 1,
				page_size: params.pageSize ?? DEFAULT_PAGE_SIZE,
				search: params.search || undefined,
			},
		},
	);
	
	const payload = response.data;

	return {
		items: (payload.data ?? []).map(mapItemToOfferList),
		totalItems: payload.total_items ?? 0,
		totalPages: payload.total_pages ?? 1,
		currentPage: payload.current_page ?? (params.page ?? 1),
	};
}

export async function getOfferByIdAPIAction(
	offerId: string,
): Promise<ActionResult<OfferList | null>> {
	try {
		const response = await axiosInstance.get<ApiResponse<OfferApiResponseItem>>(
			`/professionals/quotes/${offerId}`,
		);
		if (response.data?.data) {
			return {
				success: true,
				data: mapItemToOfferList(response.data.data),
				error: null,
			};
		}
		return { success: true, data: null, error: null };
	} catch {
		return { success: false, data: null, error: "Failed to fetch offer details" };
	}
}

export async function toggleOfferFavoriteAPIAction(
	offerId: string,
	isFavorite: boolean,
): Promise<ActionResult<boolean>> {
	try {
		await axiosInstance.post(`/professionals/quotes/${offerId}/favorite`, {
			isFavorite,
		});
		return { success: true, data: isFavorite, error: null };
	} catch {
		return { success: false, data: isFavorite, error: null };
	}
}
