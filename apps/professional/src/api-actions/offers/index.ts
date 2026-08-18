import axiosInstance from "@/lib/axiosInstance";
import { OfferList, OfferSendData, OfferSendImage, OfferSendFile } from "@/features/offer/types";
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

export async function getOfferDetailByIdAPIAction(
	offerId: string,
): Promise<ActionResult<OfferSendData | null>> {
	try {
		const response = await axiosInstance.get<ApiResponse<OfferApiResponseItem>>(
			`/professionals/quotes/${offerId}`,
		);
		if (response.data?.data) {
			const item = response.data.data;
			return {
				success: true,
				data: {
					id: item.id || item.offer_id || offerId,
					title: item.project_title || item.title || "Köksrenoveringsjobb",
					postedDate: item.created_at ? new Date(item.created_at).toISOString().split("T")[0] : "2024-12-18",
					type: item.project_type || "Express",
					badges: [
						(item.project_type as string) || "Expressen är bättre",
						(item.region as string) || "Stockholm",
						(item.city as string) || "Järfälla",
					],
					customer: {
						name: (item.customer_name as string) || "Anna Andersson",
						email: (item.customer_email as string) || "anna@example.com",
						phone: (item.customer_phone as string) || "076000000",
						address: (item.customer_address as string) || "Storgatan 16, 18880 Stockholm.",
					},
					description:
						(item.description as string) ||
						"Företaget behöver Beprövad erfarenhet av köksrenovering eller inredning. Ett skarpt öga för designtrender och en passion för att skapa snygga och funktionella utrymmen.",
					images: Array.isArray(item.images)
						? (item.images as OfferSendImage[])
						: [
								{ id: "img-1", label: "Photo.img", src: "/offer-details.png" },
								{ id: "img-2", label: "Photo.img", src: "/offer-details.png" },
								{ id: "img-3", label: "Photo.img", src: "/offer-details.png" },
						  ],
					extraImagesCount: (item.extra_images_count as number) || 6,
					documents: Array.isArray(item.documents)
						? (item.documents as OfferSendFile[])
						: [
								{ id: "doc-1", label: "Förmulärsmall #1.doc" },
								{ id: "doc-2", label: "Förmulärsmall #1.doc" },
								{ id: "doc-3", label: "projekt.pdf" },
						  ],
					drawings: Array.isArray(item.drawings)
						? (item.drawings as OfferSendFile[])
						: [
								{ id: "drawing-1", label: "projekt.pdf" },
								{ id: "drawing-2", label: "bild 1" },
								{ id: "drawing-3", label: "bild 1" },
								{ id: "drawing-4", label: "bild 1" },
						  ],
					preliminaryBudgetPrice: (item.preliminary_budget as string) || "550,000",
					offerDateLatest: (item.latest_offer_date as string) || "2025-04-15",
				},
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
