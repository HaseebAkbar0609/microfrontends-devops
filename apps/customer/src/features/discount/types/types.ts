export interface DiscountPartner {
	id: string;
	avatarUrl?: string;
	initials: string;
	name: string;
	category: string;
	location: string;
	rating: number;
	reviewCount: number;
	isVerified: boolean;
	isTopSupplier: boolean;
	isOnline: boolean;
	phone: string;
	email: string;
	website: string;
	languages: string;
	lastActive: string;
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
	partner: DiscountPartner;
	offers: DiscountOffer[];
}
