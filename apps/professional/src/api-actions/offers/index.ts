import axiosInstance from "@/lib/axiosInstance";
import { OfferList, OfferSendData } from "@/features/offer/types";
import {
	AvailableOffersApiResponse,
	OfferApiResponseItem,
	OffersListApiResponse,
} from "@/types/offer";
import { ApiResponse, ActionResult } from "@/types/api";
import { authStorage } from "@/lib/authStorage";

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
		id: item.project_id || item.id || item.offer_id || "",
		projectId: item.project_id || item.id || "",
		mappingId: item.mapping_id,
		quoteId: item.quote_id,
		agreementId: item.agreement_id,
		agreementStatus: item.agreement_status,
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
		totalPrice: Number(item.total_quote_price ?? item.preliminary_budget ?? 0) || 0,
		contactName: [item.project_contact_first_name, item.project_contact_last_name].filter(Boolean).join(" "),
		contactPhone: item.project_contact_phone || "",
		contactEmail: item.project_contact_email || "",
		seenStatus: typeof item.seen_status === "object" && item.seen_status ? item.seen_status.status || "" : String(item.seen_status || ""),
		openedAt: typeof item.seen_status === "object" && item.seen_status?.opened_at ? formatOfferDate(item.seen_status.opened_at) : undefined,
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
			`/professionals/quotes/quote-listing/project/${offerId}`,
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
			`/professionals/quotes/quote-listing/project/${offerId}`,
			{ params: { required_preliminary_budget: true } },
		);
		if (response.data?.data) {
			const item = response.data.data;
			return {
				success: true,
				data: {
					id: item.project_id || item.id || offerId,
					mappingId: item.mapping_id,
					quoteId: item.quote_id,
					agreementId: item.agreement_id,
					agreementStatus: item.agreement_status,
					title: item.project_name || item.project_title || item.title || "—",
					postedDate: formatOfferDate(item.created_at),
					type: item.project_type || item.type || "—",
					badges: [item.project_type, item.city_name, item.country_name].filter(Boolean) as string[],
					customer: {
						name: [item.contact_details?.first_name, item.contact_details?.last_name].filter(Boolean).join(" ") || "—",
						email: item.contact_details?.email || "—",
						phone: item.contact_details?.phone || "—",
						address: item.contact_details?.address || item.address || "—",
					},
					description: item.project_description || "—",
					images: (item.media ?? []).filter((file) => file.content_type?.startsWith("image/") && file.url).map((file) => ({ id: file.media_id || file.url || "", label: file.file_name || "Image", src: file.url })),
					extraImagesCount: 0,
					documents: (item.media ?? []).filter((file) => !file.content_type?.startsWith("image/") && file.url).map((file) => ({ id: file.media_id || file.url || "", label: file.file_name || "Document", src: file.url })),
					drawings: [],
					preliminaryBudgetPrice: typeof item.preliminary_budget === "object" && item.preliminary_budget
						? String(item.preliminary_budget.preliminary_budget ?? item.total_quote_price ?? "—")
						: String(item.preliminary_budget ?? item.total_quote_price ?? "—"),
					offerDateLatest: typeof item.preliminary_budget === "object" && item.preliminary_budget?.budget_date ? formatOfferDate(item.preliminary_budget.budget_date) : "—",
					isFavorite: Boolean(item.is_bookmark),
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
		await axiosInstance.post(`/professionals/quotes/project-bookmark/toggle`, {
			project_id: offerId,
			is_bookmark: isFavorite,
		});
		return { success: true, data: isFavorite, error: null };
	} catch {
		return { success: false, data: isFavorite, error: null };
	}
}

export async function updateOfferStatusAPIAction(
	mappingId: string,
	status: OfferApiStatus,
): Promise<ActionResult<string>> {
	try {
		await axiosInstance.patch(`/professionals/quotes/quote-listing/offer/${mappingId}/status`, {
			status: status.toLowerCase(),
		});
		return { success: true, data: status, error: null };
	} catch (error: unknown) {
		const apiError = error as { response?: { data?: { message?: string } } };
		return { success: false, data: null, error: apiError.response?.data?.message || "Failed to update offer" };
	}
}

export async function deleteOfferAPIAction(mappingId: string): Promise<ActionResult<void>> {
	try {
		await axiosInstance.delete(`/professionals/quotes/quote-listing/offer/${mappingId}`);
		return { success: true, data: undefined, error: null };
	} catch (error: unknown) {
		const apiError = error as { response?: { data?: { message?: string } } };
		return { success: false, data: null, error: apiError.response?.data?.message || "Failed to delete offer" };
	}
}

export async function addOfferCommentAPIAction(mappingId: string, body: string): Promise<ActionResult<void>> {
	try {
		const company = authStorage.getCompanyData() as { id?: string } | null;
		if (!company?.id) throw new Error("Company is not selected");
		await axiosInstance.post(`/companies/${company.id}/content`, {
			kind: "offer_comment",
			reference_id: mappingId,
			body,
		});
		return { success: true, data: undefined, error: null };
	} catch (error: unknown) {
		const apiError = error as { response?: { data?: { message?: string } }; message?: string };
		return { success: false, data: null, error: apiError.response?.data?.message || apiError.message || "Failed to save comment" };
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
	mappingId?: string;
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
		const contacts = data.parties.map((party) => {
			const parts = party.name.trim().split(/\s+/);
			return {
				first_name: parts.shift() || party.role,
				last_name: parts.join(" ") || "—",
				email: party.email || null,
				mobile: party.phone || null,
				role: party.role,
			};
		});
		const response = await axiosInstance.post<ApiResponse<AgreementResponseData>>(
			`/professionals/agreement/create`,
			{
				offerMappingId: data.mappingId || null,
				avdelning: "Offer",
				objekt: data.projectName || `Offer ${offerId}`,
				motpart: data.parties.find((party) => party.role === "customer")?.name || null,
				anteckning: data.quoteNumber || offerId,
				startdatum: data.startDate || null,
				slutdatum: data.endDate || null,
				contacts,
				documents: data.documents.map((id) => ({ id })),
			},
		);
		return { success: true, data: response.data?.data || { id: offerId }, error: null };
	} catch (error: unknown) {
		const apiError = error as { response?: { data?: { message?: string } } };
		const errorMessage = apiError.response?.data?.message || "Failed to create agreement";
		return { success: false, data: null, error: errorMessage };
	}
}
