import type { PurchaseDetail, PurchaseItem } from "../types/purchase.types";

export const INITIAL_PURCHASES: PurchaseItem[] = [
	{
		id: "PUR-01",
		number: "01",
		category: "handmaskin",
		type: "Borrmaskin",
		brand: "Hilti",
		designation: "H367829",
		price: 4500,
		supplier: "Hilti",
		address: "Frejgatan",
		postalCode: "11345",
		city: "Stockholm",
		phone: "0855050",
		email: "info@hilti.com",
		file: "filename.pdf",
		status: "ready",
		additionalInfo:
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
		documents: [
			{
				id: "doc-1",
				date: "2024-05-10",
				name: "filename.pdf",
				fileType: "PDF",
			},
			{
				id: "doc-2",
				date: "2024-05-10",
				name: "filename.pdf",
				fileType: "PDF",
			},
		],
	},
	{
		id: "PUR-02",
		number: "02",
		category: "handmaskin",
		type: "Borrmaskin",
		brand: "Hilti",
		designation: "H367829",
		price: 4500,
		supplier: "Hilti",
		address: "Frejgatan",
		postalCode: "11345",
		city: "Stockholm",
		phone: "0855050",
		email: "info@hilti.com",
		file: "filename.pdf",
		status: "ready",
		additionalInfo:
			"Maskinen är godkänd för professionell borrning i betong och stål. Inkluderar snabbchuck och dammsugsadapter.",
		documents: [
			{
				id: "doc-3",
				date: "2024-05-10",
				name: "filename.pdf",
				fileType: "PDF",
			},
		],
	},
	{
		id: "PUR-03",
		number: "03",
		category: "handmaskin",
		type: "Borrmaskin",
		brand: "Hilti",
		designation: "H367829",
		price: 4500,
		supplier: "Hilti",
		address: "Frejgatan",
		postalCode: "11345",
		city: "Stockholm",
		phone: "0855050",
		email: "info@hilti.com",
		file: "filename.pdf",
		status: "ready",
		additionalInfo:
			"Standardutrustning för snickeri och montage. Regelbunden service utförd av Hilti Center.",
		documents: [
			{
				id: "doc-4",
				date: "2024-05-10",
				name: "filename.pdf",
				fileType: "PDF",
			},
		],
	},
	{
		id: "PUR-04",
		number: "04",
		category: "handmaskin",
		type: "Borrmaskin",
		brand: "Hilti",
		designation: "H367829",
		price: 4500,
		supplier: "Hilti",
		address: "Frejgatan",
		postalCode: "11345",
		city: "Stockholm",
		phone: "0855050",
		email: "info@hilti.com",
		file: "filename.pdf",
		status: "ready",
		additionalInfo:
			"Utrustad med aktiv vridmomentskontroll (ATC) och vibrationsdämpning (AVR).",
		documents: [
			{
				id: "doc-5",
				date: "2024-05-10",
				name: "filename.pdf",
				fileType: "PDF",
			},
		],
	},
	{
		id: "PUR-05",
		number: "05",
		category: "handmaskin",
		type: "Borrmaskin",
		brand: "Hilti",
		designation: "H367829",
		price: 4500,
		supplier: "Hilti",
		address: "Frejgatan",
		postalCode: "11345",
		city: "Stockholm",
		phone: "0855050",
		email: "info@hilti.com",
		file: "filename.pdf",
		status: "ready",
		additionalInfo:
			"Batteridriven borrhammare med hög prestanda och lång driftstid.",
		documents: [
			{
				id: "doc-6",
				date: "2024-05-10",
				name: "filename.pdf",
				fileType: "PDF",
			},
		],
	},
	{
		id: "PUR-06",
		number: "06",
		category: "handmaskin",
		type: "Borrmaskin",
		brand: "Hilti",
		designation: "H367829",
		price: 4500,
		supplier: "Hilti",
		address: "Frejgatan",
		postalCode: "11345",
		city: "Stockholm",
		phone: "0855050",
		email: "info@hilti.com",
		file: "filename.pdf",
		status: "ready",
		additionalInfo: "Inköpt för team Väst. Full garanti till 2026-12-31.",
		documents: [
			{
				id: "doc-7",
				date: "2024-05-10",
				name: "filename.pdf",
				fileType: "PDF",
			},
		],
	},
	{
		id: "PUR-07",
		number: "07",
		category: "tunga_maskiner",
		type: "Grävmaskin",
		brand: "Volvo",
		designation: "EC220E",
		price: 1850000,
		supplier: "Swecon Anläggningsmaskiner",
		address: "Industrigatan 12",
		postalCode: "41755",
		city: "Göteborg",
		phone: "031-755 00 00",
		email: "order@swecon.se",
		file: "volvo_ec220e_manual.pdf",
		status: "ready",
		additionalInfo:
			"Bandgrävare med Stage V-motor och Dig Assist-system för exakt schaktning.",
		documents: [
			{
				id: "doc-8",
				date: "2024-04-15",
				name: "volvo_ec220e_manual.pdf",
				fileType: "PDF",
			},
		],
	},
	{
		id: "PUR-08",
		number: "08",
		category: "tunga_maskiner",
		type: "Hjullastare",
		brand: "Caterpillar",
		designation: "CAT 950M",
		price: 2400000,
		supplier: "Zeppelin Sverige",
		address: "Maskinvägen 4",
		postalCode: "21376",
		city: "Malmö",
		phone: "040-680 50 00",
		email: "kontakt@zeppelin.se",
		file: "cat_950m_spec.pdf",
		status: "ready",
		additionalInfo:
			"Hjullastare för tung materialhantering med våg och snabbfäste.",
		documents: [
			{
				id: "doc-9",
				date: "2024-03-20",
				name: "cat_950m_spec.pdf",
				fileType: "PDF",
			},
		],
	},
	{
		id: "PUR-09",
		number: "09",
		category: "tunga_maskiner",
		type: "Mobilkran",
		brand: "Liebherr",
		designation: "LTM 1060",
		price: 4900000,
		supplier: "Liebherr-Sverige AB",
		address: "Kranvägen 8",
		postalCode: "19461",
		city: "Upplands Väsby",
		phone: "08-594 115 00",
		email: "info.lsv@liebherr.com",
		file: "liebherr_ltm1060_cert.pdf",
		status: "ready",
		additionalInfo:
			"60-tons mobilkran med 48 meters teleskopbom. Fullständigt besiktigad och godkänd.",
		documents: [
			{
				id: "doc-10",
				date: "2024-02-10",
				name: "liebherr_ltm1060_cert.pdf",
				fileType: "PDF",
			},
		],
	},
	{
		id: "PUR-10",
		number: "10",
		category: "fordon",
		type: "Transportbil",
		brand: "Volkswagen",
		designation: "Transporter T6.1",
		price: 420000,
		supplier: "Din Bil Sverige",
		address: "Haga Norra",
		postalCode: "16970",
		city: "Solna",
		phone: "08-503 330 00",
		email: "transport@dinbil.se",
		file: "vw_t6_garanti.pdf",
		status: "ready",
		additionalInfo:
			"Servicebil med komplett bilinredning, dragkrok och 4Motion fyrhjulsdrift.",
		documents: [
			{
				id: "doc-11",
				date: "2024-05-01",
				name: "vw_t6_garanti.pdf",
				fileType: "PDF",
			},
		],
	},
	{
		id: "PUR-11",
		number: "11",
		category: "fordon",
		type: "Skåpbil",
		brand: "Mercedes-Benz",
		designation: "Sprinter 317",
		price: 560000,
		supplier: "Veho Bil",
		address: "Smista Allé 15",
		postalCode: "14174",
		city: "Segeltorp",
		phone: "08-449 80 00",
		email: "smista@vehobil.se",
		file: "mb_sprinter_order.pdf",
		status: "ready",
		additionalInfo:
			"Stor skåpbil med 14 m3 lastvolym, backkamera och automatväxellåda.",
		documents: [
			{
				id: "doc-12",
				date: "2024-01-25",
				name: "mb_sprinter_order.pdf",
				fileType: "PDF",
			},
		],
	},
	{
		id: "PUR-12",
		number: "12",
		category: "ovrigt",
		type: "Elverk",
		brand: "Atlas Copco",
		designation: "QAS 60",
		price: 175000,
		supplier: "Atlas Copco Rental",
		address: "Sickla Industriväg 19",
		postalCode: "13154",
		city: "Nacka",
		phone: "08-743 80 00",
		email: "rental.sweden@atlascopco.com",
		file: "atlas_qas60_cert.pdf",
		status: "ready",
		additionalInfo:
			"Ljudisolerat dieselelverk på 60 kVA. Utrustad med miljövänlig Stage V-motor.",
		documents: [
			{
				id: "doc-13",
				date: "2024-05-02",
				name: "atlas_qas60_cert.pdf",
				fileType: "PDF",
			},
		],
	},
];

export const MOCK_PURCHASES = INITIAL_PURCHASES;

// Module-level reactive store
let purchaseStore: PurchaseItem[] = [...INITIAL_PURCHASES];
const listeners = new Set<() => void>();

function notify() {
	listeners.forEach((l) => l());
}

export function subscribePurchases(listener: () => void) {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

export function getAllPurchases(): PurchaseItem[] {
	return purchaseStore;
}

export function getPurchaseById(id: string): PurchaseDetail | undefined {
	const item = purchaseStore.find((p) => p.id === id || p.number === id);
	if (!item) return undefined;
	return {
		...item,
		additionalInfo:
			item.additionalInfo ||
			"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries.",
		documents: item.documents && item.documents.length > 0 ? item.documents : [
			{
				id: "doc-default-1",
				date: "2024-05-10",
				name: "filename.pdf",
				fileType: "PDF",
			},
			{
				id: "doc-default-2",
				date: "2024-05-10",
				name: "filename.pdf",
				fileType: "PDF",
			},
		],
	};
}

export function addPurchaseItem(item: PurchaseItem) {
	purchaseStore = [item, ...purchaseStore];
	notify();
}

export function updatePurchaseItem(id: string, updated: Partial<PurchaseItem>) {
	purchaseStore = purchaseStore.map((p) => (p.id === id ? { ...p, ...updated } : p));
	notify();
}

export function deletePurchaseItem(id: string) {
	purchaseStore = purchaseStore.filter((p) => p.id !== id);
	notify();
}

export function archivePurchaseItem(id: string) {
	purchaseStore = purchaseStore.map((p) =>
		p.id === id ? { ...p, status: "archived" } : p
	);
	notify();
}

export function restorePurchaseItem(id: string) {
	purchaseStore = purchaseStore.map((p) =>
		p.id === id ? { ...p, status: "ready" } : p
	);
	notify();
}

export function getActivePurchases(): PurchaseItem[] {
	return purchaseStore.filter((p) => p.status !== "archived");
}

export function getArchivedPurchases(): PurchaseItem[] {
	return purchaseStore.filter((p) => p.status === "archived");
}
