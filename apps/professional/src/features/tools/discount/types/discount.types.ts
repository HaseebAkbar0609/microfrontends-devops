/**
 * Data model for the Tools / Discount view.
 *
 * TFS-1044 ships frontend-only: `discountService` resolves these shapes from a
 * static dataset. The field names mirror the Customer dashboard's
 * `/api/v1/discounts` response so the eventual Professional API can be dropped
 * in by replacing the service with an api-action of the same signature.
 */

export type DiscountStatus = "active" | "upcoming" | "expired";

/** One card in the discount list/grid. */
export interface Discount {
	id: string;
	/** Partner whose detail view this card links to. */
	partnerId: string;
	/** Partner/supplier that provides the offer. */
	supplier: string;
	category: string;
	name: string;
	description: string;
	discountPct: number;
	status: DiscountStatus;
	/** Redeemable code; absent when the partner uses on-site identification. */
	code?: string | null;
	/** ISO-8601 date (YYYY-MM-DD). */
	validFrom: string;
	/** ISO-8601 date (YYYY-MM-DD). */
	validTo: string;
	thumbnailUrl?: string | null;
	logoUrl?: string | null;
}

/** Supplier profile shown in the left column of the detail view. */
export interface DiscountPartner {
	id: string;
	avatarUrl?: string | null;
	initials: string;
	name: string;
	category: string;
	location?: string | null;
	rating?: number | null;
	reviewCount?: number | null;
	isVerified?: boolean;
	isTopSupplier?: boolean;
	isOnline?: boolean;
	phone?: string | null;
	email?: string | null;
	website?: string | null;
	languages?: string | null;
	lastActive?: string | null;
}

/** One redeemable offer listed on a partner's detail view. */
export interface DiscountOffer {
	id: string;
	title: string;
	categoryTag: string;
	description: string;
	discountCode: string;
	galleryImages?: string[];
}

export interface BannerSlide {
	id: string;
	backgroundImage: string;
	logoUrl?: string;
	logoAlt?: string;
}

export interface DiscountPartnerDetail {
	partner: DiscountPartner | null;
	offers: DiscountOffer[];
	bannerSlides?: BannerSlide[];
}

/** Options backing the toolbar selects. */
export interface DiscountFilters {
	suppliers: string[];
	categories: string[];
}

export interface DiscountQuery {
	supplier?: string;
	category?: string;
	status?: DiscountStatus | "";
}
