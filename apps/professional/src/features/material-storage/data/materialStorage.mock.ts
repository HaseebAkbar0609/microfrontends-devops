import type {
	MaterialArticle,
	MaterialDepot,
	MaterialStockEntry,
} from "../types/materialStorage.types";
import { withArticleDetails, type MaterialArticleBase } from "./materialArticleDetails.mock";

/**
 * Mock data for Materialhantering until the backend has depots and stock per depot.
 * The first six Huvudlager rows are the ones in the Figma overview frame.
 */

export const MOCK_MATERIAL_DEPOTS: MaterialDepot[] = [
	{ id: "dep-001", name: "Huvudlager – Stockholm", isDefault: true },
	{ id: "dep-002", name: "Depå Uppsala", isDefault: false },
	{ id: "dep-003", name: "Servicebil 04", isDefault: false },
	{ id: "dep-004", name: "Servicebil 07", isDefault: false },
];

const BASE_ARTICLES: MaterialArticleBase[] = [
	{ id: "art-100245", articleNo: "100245", name: "Gipsskiva 13 mm", supplierName: "Beijer Byggmaterial", categoryId: "boards", unit: "pcs", purchasePrice: 85, salesPrice: 129, minStockLevel: 50, reorderPoint: 100 },
	{ id: "art-200118", articleNo: "200118", name: "Konstruktionsvirke 45×95", supplierName: "Moelven", categoryId: "timber", unit: "m", purchasePrice: 32.5, salesPrice: 54.9, minStockLevel: 300, reorderPoint: 500 },
	{ id: "art-310042", articleNo: "310042", name: "Kopparrör 15 mm", supplierName: "Ahlsell", categoryId: "pipes", unit: "m", purchasePrice: 68, salesPrice: 109, minStockLevel: 200, reorderPoint: 250 },
	{ id: "art-410087", articleNo: "410087", name: "FK-kabel 1,5 mm²", supplierName: "Rexel", categoryId: "electrical", unit: "m", purchasePrice: 8.9, salesPrice: 16.9, minStockLevel: 200, reorderPoint: 300 },
	{ id: "art-510231", articleNo: "510231", name: "Väggfärg Vit 10 L", supplierName: "Colorama", categoryId: "paint", unit: "pcs", purchasePrice: 299, salesPrice: 599, minStockLevel: 20, reorderPoint: 25 },
	{ id: "art-610044", articleNo: "610044", name: "Träskruv 5×80", supplierName: "Würth", categoryId: "fasteners", unit: "pcs", purchasePrice: 0.85, salesPrice: 1.9, minStockLevel: 500, reorderPoint: 1000 },
	{ id: "art-100312", articleNo: "100312", name: "Gipsskiva 15 mm brand", supplierName: "Beijer Byggmaterial", categoryId: "boards", unit: "pcs", purchasePrice: 112, salesPrice: 169, minStockLevel: 40, reorderPoint: 80 },
	{ id: "art-100418", articleNo: "100418", name: "OSB-skiva 12 mm", supplierName: "Beijer Byggmaterial", categoryId: "boards", unit: "pcs", purchasePrice: 189, salesPrice: 279, minStockLevel: 20, reorderPoint: 40 },
	{ id: "art-100520", articleNo: "100520", name: "Våtrumsskiva 12,5 mm", supplierName: "Beijer Byggmaterial", categoryId: "boards", unit: "pcs", purchasePrice: 142, salesPrice: 219, minStockLevel: 15, reorderPoint: 30 },
	{ id: "art-200205", articleNo: "200205", name: "Reglar 45×70", supplierName: "Moelven", categoryId: "timber", unit: "m", purchasePrice: 21.9, salesPrice: 36.9, minStockLevel: 500, reorderPoint: 800 },
	{ id: "art-200311", articleNo: "200311", name: "Råspont 22×95", supplierName: "Moelven", categoryId: "timber", unit: "m", purchasePrice: 14.5, salesPrice: 24.9, minStockLevel: 150, reorderPoint: 300 },
	{ id: "art-200415", articleNo: "200415", name: "Läkt 25×48", supplierName: "Moelven", categoryId: "timber", unit: "m", purchasePrice: 7.2, salesPrice: 12.9, minStockLevel: 200, reorderPoint: 400 },
	{ id: "art-310118", articleNo: "310118", name: "PEX-rör 16 mm", supplierName: "Ahlsell", categoryId: "pipes", unit: "m", purchasePrice: 12.4, salesPrice: 22.9, minStockLevel: 100, reorderPoint: 200 },
	{ id: "art-310225", articleNo: "310225", name: "Avloppsrör 110 mm", supplierName: "Ahlsell", categoryId: "pipes", unit: "m", purchasePrice: 89, salesPrice: 149, minStockLevel: 20, reorderPoint: 30 },
	{ id: "art-310330", articleNo: "310330", name: "Kopparkoppling 15 mm", supplierName: "Ahlsell", categoryId: "pipes", unit: "pcs", purchasePrice: 24.5, salesPrice: 42, minStockLevel: 50, reorderPoint: 100 },
	{ id: "art-410112", articleNo: "410112", name: "EKK-kabel 3G2,5", supplierName: "Rexel", categoryId: "electrical", unit: "m", purchasePrice: 18.6, salesPrice: 32.9, minStockLevel: 100, reorderPoint: 200 },
	{ id: "art-410230", articleNo: "410230", name: "Vägguttag 2-vägs", supplierName: "Rexel", categoryId: "electrical", unit: "pcs", purchasePrice: 74.5, salesPrice: 129, minStockLevel: 20, reorderPoint: 40 },
	{ id: "art-410345", articleNo: "410345", name: "Kopplingsdosa", supplierName: "Rexel", categoryId: "electrical", unit: "pcs", purchasePrice: 12.9, salesPrice: 24.9, minStockLevel: 50, reorderPoint: 100 },
	{ id: "art-510118", articleNo: "510118", name: "Spackel 10 L", supplierName: "Colorama", categoryId: "paint", unit: "pcs", purchasePrice: 189, salesPrice: 329, minStockLevel: 10, reorderPoint: 20 },
	{ id: "art-510244", articleNo: "510244", name: "Fogmassa vit 300 ml", supplierName: "Colorama", categoryId: "paint", unit: "pcs", purchasePrice: 49, salesPrice: 89, minStockLevel: 20, reorderPoint: 40 },
	{ id: "art-510390", articleNo: "510390", name: "Grundfärg 3 L", supplierName: "Colorama", categoryId: "paint", unit: "pcs", purchasePrice: 219, salesPrice: 389, minStockLevel: 10, reorderPoint: 15 },
	{ id: "art-610102", articleNo: "610102", name: "Gipsskruv 3,9×35", supplierName: "Würth", categoryId: "fasteners", unit: "pkg", purchasePrice: 89, salesPrice: 149, minStockLevel: 20, reorderPoint: 30 },
	{ id: "art-610215", articleNo: "610215", name: "Spik 75 mm", supplierName: "Würth", categoryId: "fasteners", unit: "kg", purchasePrice: 38, salesPrice: 69, minStockLevel: 25, reorderPoint: 50 },
	{ id: "art-710010", articleNo: "710010", name: "Mineralull 45 mm", supplierName: "Isover", categoryId: "insulation", unit: "m2", purchasePrice: 32, salesPrice: 55, minStockLevel: 80, reorderPoint: 150 },
	{ id: "art-710025", articleNo: "710025", name: "Mineralull 95 mm", supplierName: "Isover", categoryId: "insulation", unit: "m2", purchasePrice: 58, salesPrice: 95, minStockLevel: 60, reorderPoint: 120 },
	{ id: "art-710040", articleNo: "710040", name: "Cellplast 100 mm", supplierName: "Isover", categoryId: "insulation", unit: "m2", purchasePrice: 74, salesPrice: 125, minStockLevel: 30, reorderPoint: 60 },
];

export const MOCK_MATERIAL_ARTICLES: MaterialArticle[] = BASE_ARTICLES.map(withArticleDetails);

/** [in stock, reserved] per depot. An article a depot does not carry has no entry. */
const STOCK_BY_ARTICLE: Record<string, Record<string, [number, number]>> = {
	"art-100245": { "dep-001": [320, 40], "dep-002": [45, 0], "dep-003": [35, 0] },
	"art-200118": { "dep-001": [1150, 150], "dep-002": [420, 0] },
	"art-310042": { "dep-001": [210, 30], "dep-002": [60, 0] },
	"art-410087": { "dep-001": [650, 250], "dep-002": [300, 50], "dep-003": [150, 0] },
	"art-510231": { "dep-001": [18, 3], "dep-002": [30, 6] },
	"art-610044": { "dep-001": [0, 0], "dep-002": [2000, 200], "dep-003": [600, 0], "dep-004": [400, 0] },
	"art-100312": { "dep-001": [140, 20], "dep-002": [30, 0] },
	"art-100418": { "dep-001": [64, 12] },
	"art-100520": { "dep-001": [22, 10] },
	"art-200205": { "dep-001": [2400, 300], "dep-002": [800, 0] },
	"art-200311": { "dep-001": [380, 0] },
	"art-200415": { "dep-001": [90, 0] },
	"art-310118": { "dep-001": [500, 120], "dep-002": [150, 0], "dep-004": [80, 0] },
	"art-310225": { "dep-001": [48, 6] },
	"art-310330": { "dep-001": [0, 0], "dep-003": [40, 0], "dep-004": [60, 10] },
	"art-410112": { "dep-001": [300, 100], "dep-004": [120, 0] },
	"art-410230": { "dep-001": [86, 10], "dep-002": [40, 0], "dep-003": [24, 4] },
	"art-410345": { "dep-001": [150, 40], "dep-003": [60, 0], "dep-004": [30, 0] },
	"art-510118": { "dep-001": [25, 0], "dep-002": [12, 0] },
	"art-510244": { "dep-001": [60, 24], "dep-003": [12, 0], "dep-004": [0, 0] },
	"art-510390": { "dep-001": [8, 2] },
	"art-610102": { "dep-001": [45, 5], "dep-002": [25, 0], "dep-003": [8, 0] },
	"art-610215": { "dep-001": [120, 0] },
	"art-710010": { "dep-001": [260, 60], "dep-002": [120, 0] },
	"art-710025": { "dep-001": [140, 90] },
	"art-710040": { "dep-001": [75, 0], "dep-002": [40, 0] },
};

export const MOCK_MATERIAL_STOCK: MaterialStockEntry[] = Object.entries(
	STOCK_BY_ARTICLE,
).flatMap(([articleId, byDepot]) =>
	Object.entries(byDepot).map(([depotId, [inStock, reserved]]) => ({
		articleId,
		depotId,
		inStock,
		reserved,
	})),
);
