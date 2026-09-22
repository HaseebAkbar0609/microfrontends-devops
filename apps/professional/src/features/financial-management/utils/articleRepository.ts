import type {
	ArticleRow,
	ArticleDetail,
	SupplierArticleRow,
	SupplierArticleDetail,
	CreateArticleFormData,
	ArticleImportMapping,
} from "../types/article.types";

const MOCK_ARTICLES: ArticleDetail[] = [
	{
		id: "art_001",
		isFavorite: true,
		articleNo: "1001",
		description: "Konsulttimme Senior Utvecklare",
		benamning: "Konsulttimme Senior Utvecklare",
		ean: "7350012345678",
		leverantor: "Acme Nordic AB",
		husarbete: "nej",
		supplierArticleNo: "ACME-1001",
		typHusarbete: "",
		enhet: "Tim",
		typAvArtikel: "Tjänst",
		lagerVara: "Nej",
		forsaljning: "3001",
		moms: "25%",
		forsaljningSE: "3001",
		forsaljningEU: "3002",
		lagerkonto: "1460",
		forsaljningEUMoms: "3003",
		forsaljningExport: "3004",
		inkop: "4001",
		priserA: "1 250,00",
		europrislista: "120,00",
		kampanj: "1 100,00",
		vipPriser: "1 050,00",
		kalkylkostnad: "650,00",
		bestallningspunkt: "0",
		iLager: "0",
		outPriceListA: "1 250,00 kr",
		calculatedCost: "650,00 kr",
		stock: "0",
		reserved: "0",
		available: "0",
		stockValue: "0,00 kr",
		status: "active",
		vikt: "0",
		langd: "0",
		bredd: "0",
		hojd: "0",
		material: "N/A",
		forsaljningSESkattskyldighet: "3001",
		momsSESkattskyldighet: "25%",
		forsaljningEUSkattskyldighet: "3002",
		lagerforandring: "4990",
		priceListRows: [
			{ id: "pl_001", name: "Standardprislista A", price: "1 250,00", currency: "SEK", validFrom: "2024-01-01" },
			{ id: "pl_002", name: "VIP-Kunder 2024", price: "1 050,00", currency: "SEK", validFrom: "2024-01-01" },
		],
	},
	{
		id: "art_002",
		isFavorite: false,
		articleNo: "1002",
		description: "Programvarulicens Årskvot",
		benamning: "Programvarulicens Årskvot",
		ean: "7350098765432",
		leverantor: "Nordic Cloud Solutions",
		husarbete: "nej",
		supplierArticleNo: "NCS-LIC-01",
		typHusarbete: "",
		enhet: "Styck",
		typAvArtikel: "Vara",
		lagerVara: "Ja",
		forsaljning: "3010",
		moms: "25%",
		forsaljningSE: "3010",
		forsaljningEU: "3011",
		lagerkonto: "1460",
		forsaljningEUMoms: "3012",
		forsaljningExport: "3013",
		inkop: "4010",
		priserA: "4 500,00",
		europrislista: "400,00",
		kampanj: "3 900,00",
		vipPriser: "3 800,00",
		kalkylkostnad: "2 500,00",
		bestallningspunkt: "10",
		iLager: "25",
		outPriceListA: "4 500,00 kr",
		calculatedCost: "2 500,00 kr",
		stock: "25",
		reserved: "5",
		available: "20",
		stockValue: "62 500,00 kr",
		status: "active",
		vikt: "0.1",
		langd: "10",
		bredd: "5",
		hojd: "2",
		material: "Digital",
		forsaljningSESkattskyldighet: "3010",
		momsSESkattskyldighet: "25%",
		forsaljningEUSkattskyldighet: "3011",
		lagerforandring: "4990",
		priceListRows: [
			{ id: "pl_003", name: "Standardprislista A", price: "4 500,00", currency: "SEK" },
		],
	},
	{
		id: "art_003",
		isFavorite: false,
		articleNo: "1003",
		description: "Projektledning & Arkitektur",
		benamning: "Projektledning & Arkitektur",
		ean: "7350024681357",
		leverantor: "Acme Nordic AB",
		husarbete: "nej",
		supplierArticleNo: "ACME-1003",
		typHusarbete: "",
		enhet: "Tim",
		typAvArtikel: "Tjänst",
		lagerVara: "Nej",
		forsaljning: "3001",
		moms: "25%",
		forsaljningSE: "3001",
		forsaljningEU: "3002",
		lagerkonto: "1460",
		forsaljningEUMoms: "3003",
		forsaljningExport: "3004",
		inkop: "4001",
		priserA: "1 500,00",
		europrislista: "140,00",
		kampanj: "1 350,00",
		vipPriser: "1 300,00",
		kalkylkostnad: "800,00",
		bestallningspunkt: "0",
		iLager: "0",
		outPriceListA: "1 500,00 kr",
		calculatedCost: "800,00 kr",
		stock: "0",
		reserved: "0",
		available: "0",
		stockValue: "0,00 kr",
		status: "active",
		vikt: "0",
		langd: "0",
		bredd: "0",
		hojd: "0",
		material: "N/A",
		forsaljningSESkattskyldighet: "3001",
		momsSESkattskyldighet: "25%",
		forsaljningEUSkattskyldighet: "3002",
		lagerforandring: "4990",
	},
	{
		id: "art_004",
		isFavorite: true,
		articleNo: "1004",
		description: "Nätverkskabel Cat6A 50m",
		benamning: "Nätverkskabel Cat6A 50m",
		ean: "7350055544332",
		leverantor: "Kabel Grossisten AB",
		husarbete: "nej",
		supplierArticleNo: "KG-C6A-50",
		typHusarbete: "",
		enhet: "Styck",
		typAvArtikel: "Vara",
		lagerVara: "Ja",
		forsaljning: "3020",
		moms: "25%",
		forsaljningSE: "3020",
		forsaljningEU: "3021",
		lagerkonto: "1460",
		forsaljningEUMoms: "3022",
		forsaljningExport: "3023",
		inkop: "4020",
		priserA: "499,00",
		europrislista: "45,00",
		kampanj: "399,00",
		vipPriser: "350,00",
		kalkylkostnad: "180,00",
		bestallningspunkt: "15",
		iLager: "45",
		outPriceListA: "499,00 kr",
		calculatedCost: "180,00 kr",
		stock: "45",
		reserved: "10",
		available: "35",
		stockValue: "8 100,00 kr",
		status: "active",
		vikt: "2.5",
		langd: "5000",
		bredd: "1",
		hojd: "1",
		material: "Koppar/PVC",
		forsaljningSESkattskyldighet: "3020",
		momsSESkattskyldighet: "25%",
		forsaljningEUSkattskyldighet: "3021",
		lagerforandring: "4990",
	},
	{
		id: "art_005",
		isFavorite: false,
		articleNo: "1005",
		description: "Installation & Driftsättning",
		benamning: "Installation & Driftsättning",
		ean: "7350066778899",
		leverantor: "Acme Nordic AB",
		husarbete: "ja",
		supplierArticleNo: "ACME-INST",
		typHusarbete: "RUT",
		enhet: "Tim",
		typAvArtikel: "Tjänst",
		lagerVara: "Nej",
		forsaljning: "3005",
		moms: "25%",
		forsaljningSE: "3005",
		forsaljningEU: "3006",
		lagerkonto: "1460",
		forsaljningEUMoms: "3007",
		forsaljningExport: "3008",
		inkop: "4001",
		priserA: "950,00",
		europrislista: "90,00",
		kampanj: "850,00",
		vipPriser: "800,00",
		kalkylkostnad: "450,00",
		bestallningspunkt: "0",
		iLager: "0",
		outPriceListA: "950,00 kr",
		calculatedCost: "450,00 kr",
		stock: "0",
		reserved: "0",
		available: "0",
		stockValue: "0,00 kr",
		status: "inactive",
		vikt: "0",
		langd: "0",
		bredd: "0",
		hojd: "0",
		material: "N/A",
		forsaljningSESkattskyldighet: "3005",
		momsSESkattskyldighet: "25%",
		forsaljningEUSkattskyldighet: "3006",
		lagerforandring: "4990",
	},
];

const MOCK_SUPPLIER_ARTICLES: SupplierArticleDetail[] = [
	{
		id: "sup_art_001",
		supplierArticleNo: "ACME-1001",
		supplierName: "Acme Nordic AB",
		supplierDescription: "Senior Konsulttimme IT & Utveckling",
		purchasePrice: "650,00 kr",
		linkedToArticle: "1001 - Konsulttimme Senior",
		status: "mapped",
		ean: "7350012345678",
		unit: "Tim",
		category: "Tjänster",
		weight: "0 kg",
		dimensions: "0 x 0 x 0 mm",
		material: "Tjänst",
		leadTimeDays: 0,
		images: [
			"https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&auto=format&fit=crop&q=80",
			"https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80",
		],
	},
	{
		id: "sup_art_002",
		supplierArticleNo: "NCS-LIC-01",
		supplierName: "Nordic Cloud Solutions",
		supplierDescription: "Enterprise Cloud License 1-Year Tier 1",
		purchasePrice: "2 500,00 kr",
		linkedToArticle: "1002 - Programvarulicens",
		status: "mapped",
		ean: "7350098765432",
		unit: "Styck",
		category: "Mjukvara",
		weight: "0.1 kg",
		dimensions: "10 x 5 x 2 mm",
		material: "Digital",
		leadTimeDays: 1,
		images: [
			"https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80",
		],
	},
	{
		id: "sup_art_003",
		supplierArticleNo: "KG-C6A-50",
		supplierName: "Kabel Grossisten AB",
		supplierDescription: "Cat6A U/FTP LSZH Grå 50m rulle",
		purchasePrice: "180,00 kr",
		linkedToArticle: "1004 - Nätverkskabel Cat6A",
		status: "mapped",
		ean: "7350055544332",
		unit: "Styck",
		category: "Hårdvara",
		weight: "2.5 kg",
		dimensions: "300 x 300 x 100 mm",
		material: "Koppar/PVC",
		leadTimeDays: 2,
		images: [
			"https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=600&auto=format&fit=crop&q=80",
		],
	},
	{
		id: "sup_art_004",
		supplierArticleNo: "KG-PATCH-2M",
		supplierName: "Kabel Grossisten AB",
		supplierDescription: "Patchkabel Cat6 RJ45 Blå 2m",
		purchasePrice: "25,00 kr",
		linkedToArticle: "-",
		status: "unmapped",
		ean: "7350077889900",
		unit: "Styck",
		category: "Hårdvara",
		weight: "0.08 kg",
		dimensions: "2000 x 10 x 10 mm",
		material: "Koppar/PVC",
		leadTimeDays: 1,
	},
];

export async function getArticlesAPIAction(): Promise<{ data: ArticleRow[]; totalItems: number }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				data: [...MOCK_ARTICLES],
				totalItems: MOCK_ARTICLES.length,
			});
		}, 150);
	});
}

export async function getArticleDetailAPIAction(id: string): Promise<ArticleDetail> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const found = MOCK_ARTICLES.find((a) => a.id === id || a.articleNo === id);
			if (found) {
				resolve(found);
			} else {
				reject(new Error("Article not found"));
			}
		}, 150);
	});
}

export async function createArticleAPIAction(formData: CreateArticleFormData): Promise<ArticleDetail> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const newId = `art_${Date.now()}`;
			const newArticle: ArticleDetail = {
				id: newId,
				isFavorite: false,
				articleNo: formData.articleNr || String(1000 + MOCK_ARTICLES.length + 1),
				description: formData.benamning,
				benamning: formData.benamning,
				ean: formData.ean || "",
				leverantor: formData.leverantor,
				husarbete: formData.husarbete || "nej",
				supplierArticleNo: formData.supplierArticleNo || "",
				typHusarbete: formData.typHusarbete || "",
				enhet: formData.enhet,
				typAvArtikel: formData.typAvArtikel,
				lagerVara: formData.lagerVara || "Nej",
				forsaljning: formData.forsaljning,
				moms: formData.moms,
				forsaljningSE: formData.forsaljningSE || "",
				forsaljningEU: formData.forsaljningEU || "",
				lagerkonto: formData.lagerkonto || "",
				forsaljningEUMoms: formData.forsaljningEUMoms || "",
				forsaljningExport: formData.forsaljningExport || "",
				inkop: formData.inkop || "",
				priserA: formData.priserA || "0,00",
				europrislista: formData.europrislista || "",
				kampanj: formData.kampanj || "",
				vipPriser: formData.vipPriser || "",
				kalkylkostnad: formData.kalkylkostnad || "0,00",
				bestallningspunkt: formData.bestallningspunkt || "0",
				iLager: formData.iLager || "0",
				outPriceListA: `${formData.priserA || "0,00"} kr`,
				calculatedCost: `${formData.kalkylkostnad || "0,00"} kr`,
				stock: formData.stock || "0",
				reserved: formData.reserved || "0",
				available: formData.stock || "0",
				stockValue: "0,00 kr",
				status: formData.status || "active",
				vikt: formData.vikt || "",
				langd: formData.langd || "",
				bredd: formData.bredd || "",
				hojd: formData.hojd || "",
				material: formData.material || "",
				forsaljningSESkattskyldighet: formData.forsaljningSESkattskyldighet || "",
				momsSESkattskyldighet: formData.momsSESkattskyldighet || "",
				forsaljningEUSkattskyldighet: formData.forsaljningEUSkattskyldighet || "",
				lagerforandring: formData.lagerforandring || "",
				priceListRows: formData.priceListRows || [],
			};
			MOCK_ARTICLES.unshift(newArticle);
			resolve(newArticle);
		}, 200);
	});
}

export async function updateArticleAPIAction(id: string, formData: Partial<CreateArticleFormData>): Promise<ArticleDetail> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const index = MOCK_ARTICLES.findIndex((a) => a.id === id || a.articleNo === id);
			if (index !== -1) {
				const existing = MOCK_ARTICLES[index];
				const updated: ArticleDetail = {
					...existing,
					...formData,
					description: formData.benamning ?? existing.description,
					outPriceListA: formData.priserA ? `${formData.priserA} kr` : existing.outPriceListA,
					calculatedCost: formData.kalkylkostnad ? `${formData.kalkylkostnad} kr` : existing.calculatedCost,
				};
				MOCK_ARTICLES[index] = updated;
				resolve(updated);
			} else {
				reject(new Error("Article not found"));
			}
		}, 200);
	});
}

export async function deleteArticleAPIAction(id: string): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const index = MOCK_ARTICLES.findIndex((a) => a.id === id || a.articleNo === id);
			if (index !== -1) {
				MOCK_ARTICLES.splice(index, 1);
			}
			resolve();
		}, 150);
	});
}

export async function toggleArticleFavoriteAPIAction(id: string): Promise<boolean> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const found = MOCK_ARTICLES.find((a) => a.id === id || a.articleNo === id);
			if (found) {
				found.isFavorite = !found.isFavorite;
				resolve(found.isFavorite);
			} else {
				resolve(false);
			}
		}, 100);
	});
}

export async function getSupplierArticlesAPIAction(): Promise<{ data: SupplierArticleRow[]; totalItems: number }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				data: [...MOCK_SUPPLIER_ARTICLES],
				totalItems: MOCK_SUPPLIER_ARTICLES.length,
			});
		}, 150);
	});
}

export async function getSupplierArticleDetailAPIAction(id: string): Promise<SupplierArticleDetail> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			const found = MOCK_SUPPLIER_ARTICLES.find((a) => a.id === id || a.supplierArticleNo === id);
			if (found) {
				resolve(found);
			} else {
				reject(new Error("Supplier article not found"));
			}
		}, 150);
	});
}

export async function deleteSupplierArticleAPIAction(id: string): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const index = MOCK_SUPPLIER_ARTICLES.findIndex((a) => a.id === id || a.supplierArticleNo === id);
			if (index !== -1) {
				MOCK_SUPPLIER_ARTICLES.splice(index, 1);
			}
			resolve();
		}, 150);
	});
}

export async function importArticleAPIAction(
	_file: File,
	_mapping: ArticleImportMapping,
): Promise<{ successCount: number; failureCount: number }> {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({
				successCount: 15,
				failureCount: 0,
			});
		}, 400);
	});
}

export async function downloadArticleImportTemplateAPIAction(): Promise<void> {
	return new Promise((resolve) => {
		setTimeout(() => {
			const templateCsv =
				"Artikelnummer;Benämning;EAN;Leverantör;Enhet;Typ;Försäljning;Moms;Pris A;Kalkylkostnad\n1001;Exempelartikel;7350000000000;Acme AB;Styck;Vara;3001;25%;100,00;50,00";
			const blob = new Blob([templateCsv], { type: "text/csv;charset=utf-8;" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "artikel_import_mall.csv";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			resolve();
		}, 200);
	});
}
