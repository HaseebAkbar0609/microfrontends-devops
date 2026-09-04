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
