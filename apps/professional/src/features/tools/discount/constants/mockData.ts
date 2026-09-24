import type { Discount, DiscountPartnerDetail } from "../types/discount.types";

/**
 * Static dataset backing the Tools / Discount view until the Professional
 * discounts API exists (TFS-1044). Shapes mirror the Customer dashboard's
 * `/api/v1/discounts` payloads — see `discountService` for the swap point.
 */

const LOCAL_THUMBNAIL = "/images/discounts/discount-thumbnail-602f3b.png";
const BAUHAUS_LOGO = "/images/discounts/bauhouse-logo.svg";
const BEIJER_LOGO = "/images/discounts/beijer-logo.svg";

/** Remote gallery imagery — `images.unsplash.com` is allowlisted in next.config.js. */
const GALLERY = {
	timber: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
	tools: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=800",
	paint: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800",
	site: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
	warehouse: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800",
	van: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=800",
} as const;

export const DISCOUNTS: Discount[] = [
	{
		id: "bauhaus-pro-materials",
		partnerId: "bauhaus",
		supplier: "Bauhaus",
		category: "Byggmaterial",
		name: "20% on building materials",
		description:
			"Professional pricing on timber, insulation and plasterboard across all Bauhaus warehouses in Sweden.",
		discountPct: 20,
		status: "active",
		code: "TFS-BAUHAUS20",
		validFrom: "2026-01-01",
		validTo: "2026-12-31",
		thumbnailUrl: LOCAL_THUMBNAIL,
		logoUrl: BAUHAUS_LOGO,
	},
	{
		id: "beijer-power-tools",
		partnerId: "beijer-byggmaterial",
		supplier: "Beijer Byggmaterial",
		category: "Verktyg",
		name: "15% on power tools",
		description:
			"Discount on cordless drills, saws and measuring equipment when ordering through your company account.",
		discountPct: 15,
		status: "active",
		code: "TFS-BEIJER15",
		validFrom: "2026-03-01",
		validTo: "2026-11-30",
		thumbnailUrl: LOCAL_THUMBNAIL,
		logoUrl: BEIJER_LOGO,
	},
	{
		id: "bauhaus-paint-autumn",
		partnerId: "bauhaus",
		supplier: "Bauhaus",
		category: "Färg",
		name: "10% on interior paint",
		description:
			"Trade discount on interior paint, primer and painting accessories for scheduled renovation projects.",
		discountPct: 10,
		status: "active",
		code: "TFS-PAINT10",
		validFrom: "2026-02-15",
		validTo: "2026-10-31",
		thumbnailUrl: LOCAL_THUMBNAIL,
		logoUrl: BAUHAUS_LOGO,
	},
	{
		id: "beijer-winter-insulation",
		partnerId: "beijer-byggmaterial",
		supplier: "Beijer Byggmaterial",
		category: "Byggmaterial",
		name: "25% on winter insulation",
		description:
			"Seasonal campaign on mineral wool and weather protection, opening ahead of the winter build season.",
		discountPct: 25,
		status: "upcoming",
		code: "TFS-WINTER25",
		validFrom: "2026-11-01",
		validTo: "2027-03-31",
		thumbnailUrl: LOCAL_THUMBNAIL,
		logoUrl: BEIJER_LOGO,
	},
	{
		id: "nordic-rental-machines",
		partnerId: "nordic-rental",
		supplier: "Nordic Rental",
		category: "Maskinuthyrning",
		name: "30% on machine rental",
		description:
			"Reduced daily rates on lifts, excavators and compactors booked at least one week in advance.",
		discountPct: 30,
		status: "upcoming",
		code: "TFS-RENTAL30",
		validFrom: "2026-10-01",
		validTo: "2027-01-31",
		thumbnailUrl: LOCAL_THUMBNAIL,
		logoUrl: null,
	},
	{
		id: "nordic-rental-transport",
		partnerId: "nordic-rental",
		supplier: "Nordic Rental",
		category: "Transport",
		name: "12% on site transport",
		description:
			"Discounted delivery and collection of materials between your warehouse and active project sites.",
		discountPct: 12,
		status: "expired",
		code: "TFS-TRANSPORT12",
		validFrom: "2025-06-01",
		validTo: "2026-06-30",
		thumbnailUrl: LOCAL_THUMBNAIL,
		logoUrl: null,
	},
	{
		id: "bauhaus-safety-gear",
		partnerId: "bauhaus",
		supplier: "Bauhaus",
		category: "Skyddsutrustning",
		name: "18% on safety equipment",
		description:
			"Helmets, harnesses and protective clothing certified for construction sites, redeemed in store.",
		discountPct: 18,
		status: "expired",
		code: null,
		validFrom: "2025-09-01",
		validTo: "2026-08-31",
		thumbnailUrl: LOCAL_THUMBNAIL,
		logoUrl: BAUHAUS_LOGO,
	},
];

/** Partner detail keyed by `Discount.partnerId` — the `[id]` route resolves against this. */
export const DISCOUNT_PARTNER_DETAILS: Record<string, DiscountPartnerDetail> = {
	bauhaus: {
		partner: {
			id: "bauhaus",
			avatarUrl: BAUHAUS_LOGO,
			initials: "BH",
			name: "Bauhaus",
			category: "Byggmaterial",
			location: "Stockholm, Sweden",
			rating: 4.8,
			reviewCount: 214,
			isVerified: true,
			isTopSupplier: true,
			isOnline: true,
			phone: "+46 8 555 123 00",
			email: "pro@bauhaus.example",
			website: "www.bauhaus.example",
			languages: "Svenska, English",
			lastActive: "Active today",
		},
		offers: [
			{
				id: "bauhaus-pro-materials",
				title: "20% on building materials",
				categoryTag: "Byggmaterial",
				description:
					"Professional pricing on timber, insulation and plasterboard across all Bauhaus warehouses in Sweden. Present the code at checkout or add it to your company order.",
				discountCode: "TFS-BAUHAUS20",
				galleryImages: [
					GALLERY.timber,
					GALLERY.warehouse,
					GALLERY.site,
					GALLERY.tools,
				],
			},
			{
				id: "bauhaus-paint-autumn",
				title: "10% on interior paint",
				categoryTag: "Färg",
				description:
					"Trade discount on interior paint, primer and painting accessories for scheduled renovation projects.",
				discountCode: "TFS-PAINT10",
				galleryImages: [GALLERY.paint, GALLERY.tools, GALLERY.site],
			},
			{
				id: "bauhaus-safety-gear",
				title: "18% on safety equipment",
				categoryTag: "Skyddsutrustning",
				description:
					"Helmets, harnesses and protective clothing certified for construction sites. This campaign has ended — no code is issued.",
				discountCode: "",
				galleryImages: [GALLERY.site],
			},
		],
		bannerSlides: [
			{
				id: "bauhaus-banner-1",
				backgroundImage: GALLERY.warehouse,
				logoUrl: BAUHAUS_LOGO,
				logoAlt: "Bauhaus",
			},
			{
				id: "bauhaus-banner-2",
				backgroundImage: GALLERY.timber,
				logoUrl: BAUHAUS_LOGO,
				logoAlt: "Bauhaus",
			},
		],
	},
	"beijer-byggmaterial": {
		partner: {
			id: "beijer-byggmaterial",
			avatarUrl: BEIJER_LOGO,
			initials: "BB",
			name: "Beijer Byggmaterial",
			category: "Byggmaterial",
			location: "Göteborg, Sweden",
			rating: 4.6,
			reviewCount: 131,
			isVerified: true,
			isTopSupplier: false,
			isOnline: false,
			phone: "+46 31 555 220 00",
			email: "foretag@beijer.example",
			website: "www.beijer.example",
			languages: "Svenska",
			lastActive: "Active 2 days ago",
		},
		offers: [
			{
				id: "beijer-power-tools",
				title: "15% on power tools",
				categoryTag: "Verktyg",
				description:
					"Discount on cordless drills, saws and measuring equipment when ordering through your company account.",
				discountCode: "TFS-BEIJER15",
				galleryImages: [GALLERY.tools, GALLERY.warehouse, GALLERY.site],
			},
			{
				id: "beijer-winter-insulation",
				title: "25% on winter insulation",
				categoryTag: "Byggmaterial",
				description:
					"Seasonal campaign on mineral wool and weather protection, opening ahead of the winter build season.",
				discountCode: "TFS-WINTER25",
				galleryImages: [GALLERY.timber, GALLERY.site],
			},
		],
		bannerSlides: [
			{
				id: "beijer-banner-1",
				backgroundImage: GALLERY.site,
				logoUrl: BEIJER_LOGO,
				logoAlt: "Beijer Byggmaterial",
			},
		],
	},
	"nordic-rental": {
		partner: {
			id: "nordic-rental",
			avatarUrl: null,
			initials: "NR",
			name: "Nordic Rental",
			category: "Maskinuthyrning",
			location: "Malmö, Sweden",
			rating: 4.3,
			reviewCount: 58,
			isVerified: false,
			isTopSupplier: false,
			isOnline: true,
			phone: "+46 40 555 880 00",
			email: "hyra@nordicrental.example",
			website: "www.nordicrental.example",
			languages: "Svenska, English, Dansk",
			lastActive: "Active today",
		},
		offers: [
			{
				id: "nordic-rental-machines",
				title: "30% on machine rental",
				categoryTag: "Maskinuthyrning",
				description:
					"Reduced daily rates on lifts, excavators and compactors booked at least one week in advance.",
				discountCode: "TFS-RENTAL30",
				galleryImages: [GALLERY.site, GALLERY.van, GALLERY.warehouse],
			},
			{
				id: "nordic-rental-transport",
				title: "12% on site transport",
				categoryTag: "Transport",
				description:
					"Discounted delivery and collection of materials between your warehouse and active project sites.",
				discountCode: "TFS-TRANSPORT12",
				galleryImages: [GALLERY.van, GALLERY.warehouse],
			},
		],
		bannerSlides: [],
	},
};
