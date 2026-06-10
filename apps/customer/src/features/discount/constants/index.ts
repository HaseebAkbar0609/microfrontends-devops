import type { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";
import type { DiscountPartner, DiscountOffer, BannerSlide } from "../types/types";

export const DISCOUNT_DETAIL_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.tools, href: "#" },
	{ label: localizationConstants.discounts, href: "/discounts" },
];

export const DUMMY_DISCOUNT_PARTNER: DiscountPartner = {
	id: "1",
	avatarUrl: "/images/partners/beijer-logo.png",
	initials: "BB",
	name: "Beijer Byggmaterial",
	category: "Bygg & Renovering",
	location: "Stockholm, Sweden",
	rating: 5.0,
	reviewCount: 48,
	isVerified: true,
	isTopSupplier: true,
	isOnline: true,
	phone: "08–580 50 50",
	email: "info@pellebygg.se",
	website: "www.pellebygg.se",
	languages: "Svenska, English",
	lastActive: "Aktiv senaste 2 dagar",
};

export const DUMMY_BANNER_SLIDES: BannerSlide[] = [
	{
		id: "1",
		backgroundImage: "/images/partners/banner-slide-1.png",
		logoUrl: "/images/partners/beijer-logo.png",
		logoAlt: "Beijer Byggmaterial",
	},
	{
		id: "2",
		backgroundImage: "/images/partners/banner-slide-1.png",
		logoUrl: "/images/partners/beijer-logo.png",
		logoAlt: "Beijer Byggmaterial",
	},
	{
		id: "3",
		backgroundImage: "/images/partners/banner-slide-1.png",
		logoUrl: "/images/partners/beijer-logo.png",
		logoAlt: "Beijer Byggmaterial",
	},
	{
		id: "4",
		backgroundImage: "/images/partners/banner-slide-1.png",
		logoUrl: "/images/partners/beijer-logo.png",
		logoAlt: "Beijer Byggmaterial",
	},
];

const OFFER_GALLERY = [
	"/images/partners/offer-gallery.png",
	"/images/partners/offer-gallery.png",
	"/images/partners/offer-gallery.png",
	"/images/partners/offer-gallery.png",
];

export const DUMMY_DISCOUNT_OFFERS: DiscountOffer[] = [
	{
		id: "1",
		title: "Köks erbjudande 25 % under februari",
		categoryTag: "KITCHEN",
		description:
			"Ta del av vårt fina köks erbjudande under februari Månad hos våra butiker.",
		discountCode: "TKKITCHEN25",
		galleryImages: OFFER_GALLERY,
	},
	{
		id: "2",
		title: "Köks erbjudande 50 % under februari",
		categoryTag: "Badrum",
		description:
			"Ta del av vårt fina köks erbjudande under februari Månad hos våra butiker.",
		discountCode: "TKBATHRUM50",
		galleryImages: OFFER_GALLERY,
	},
];
