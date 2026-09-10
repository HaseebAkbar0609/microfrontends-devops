import axiosInstance from "@/lib/axiosInstance";
import { OfferList, OfferSendData, OfferSendImage, OfferSendFile } from "@/features/offer/types";
import {
	AvailableOffersApiResponse,
	OfferApiResponseItem,
	OffersListApiResponse,
} from "@/types/offer";
import { ApiResponse, ActionResult } from "@/types/api";

const OFFERS_LIST_PATH = "/professionals/quotes/quote-listing/offer_listing_by_status";
const AVAILABLE_OFFERS_PATH = "/professionals/quotes/quote-listing/offer_listing_to_quote";
const DEFAULT_PAGE_SIZE = 10;

export const OFFER_API_STATUS = {
	REQUESTED: "REQUESTED",
	OFFERED: "OFFERED",
	ACCEPTED: "ACCEPTED",
	AGREED: "AGREED",
	ARCHIVED: "ARCHIVED",
} as const;

export type OfferApiStatus = (typeof OFFER_API_STATUS)[keyof typeof OFFER_API_STATUS];

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

function formatOfferDate(value?: string | number): string {
	if (!value) return "—";
	const normalized = typeof value === "number" && value < 10_000_000_000 ? value * 1000 : value;
	const date = new Date(normalized);
	return Number.isNaN(date.getTime()) ? "—" : date.toISOString().split("T")[0];
}

export function mapItemToOfferList(item: OfferApiResponseItem): OfferList {
	const categories = Array.isArray(item.categories)
		? item.categories.map((category) => category.name).filter(Boolean).join(", ")
		: "";
	const hasAvailabilityMetrics = item.taken_count !== undefined || item.hit_count !== undefined;

	return {
		id: item.id || item.project_id || item.offer_id || "",
		idNumber: item.offer_code || item.project_code || "—",
		jobName: item.project_name || item.project_title || item.title || "—",
		date: formatOfferDate(item.created_at),
		type: item.project_type || item.type || "—",
		request: hasAvailabilityMetrics
			? `${item.taken_count ?? 0}/${item.hit_count ?? 0}`
			: item.professional_status || item.status || "—",
		municipality: item.municipality || item.city_name || item.city || "—",
		category: categories || item.category || "—",
		isFavorite: Boolean(item.is_bookmark),
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
			headers: params.companyId ? { "X-Company-ID": params.companyId } : undefined,
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

export interface ListAvailableOffersParams {
	page?: number;
	pageSize?: number;
	search?: string;
	companyId?: string;
}

export async function listAvailableOffersAPIAction(
	params: ListAvailableOffersParams,
): Promise<OffersListResult> {
	if (!params.companyId) {
		throw new Error("A company must be selected to fetch available offers");
	}

	const page = params.page ?? 1;
	const response = await axiosInstance.get<AvailableOffersApiResponse>(
		AVAILABLE_OFFERS_PATH,
		{
			params: {
				page,
				page_size: params.pageSize ?? DEFAULT_PAGE_SIZE,
				search: params.search || undefined,
			},
			headers: { "X-Company-ID": params.companyId },
		},
	);
	const payload = response.data?.data;

	return {
		items: (payload?.items ?? []).map(mapItemToOfferList),
		totalItems: payload?.total_items ?? 0,
		totalPages: payload?.total_pages ?? 0,
		currentPage: payload?.current_page ?? page,
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

export interface AgreementPartyPayload {
	id?: string;
	name: string;
	role: string;
	email?: string;
	phone?: string;
	address?: string;
	orgNumber?: string;
}

export interface AgreementRequestPayload {
	parties: AgreementPartyPayload[];
	documents: string[];
	templates: string[];
	price?: number;
	startDate?: string;
	endDate?: string;
	projectName?: string;
	quoteNumber?: string;
}

export interface AgreementResponseData {
	id: string;
	status?: string;
	createdAt?: string;
	[key: string]: unknown;
}

export async function createAgreementFromOfferAPIAction(
	offerId: string,
	data: AgreementRequestPayload,
): Promise<ActionResult<AgreementResponseData>> {
	try {
		const response = await axiosInstance.post<ApiResponse<AgreementResponseData>>(
			`/professionals/quotes/${offerId}/agreement`,
			data,
		);
		return { success: true, data: response.data?.data || { id: offerId }, error: null };
	} catch (error: unknown) {
		const apiError = error as { response?: { data?: { message?: string } } };
		const errorMessage = apiError.response?.data?.message || "Failed to create agreement";
		return { success: false, data: null, error: errorMessage };
	}
}
