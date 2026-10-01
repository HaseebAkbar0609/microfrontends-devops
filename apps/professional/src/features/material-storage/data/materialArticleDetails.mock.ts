import type { MaterialArticle } from "../types/materialStorage.types";

/** An article as listed in materialStorage.mock.ts, before the fields "Visa artikel" shows are added. */
export type MaterialArticleBase = Omit<MaterialArticle, "description" | "supplierArticleNo" | "ean" | "defaultDepotId">;

/** Beskrivning per article. Gipsskiva 13 mm is the Figma example. */
const DESCRIPTIONS: Record<string, string> = {
	"art-100245": "Standardgipsskiva 13 × 1200 × 2400 mm",
	"art-200118": "Konstruktionsvirke C24, 45 × 95 mm",
	"art-310042": "Kopparrör för tappvatten, 15 × 1,0 mm",
	"art-410087": "Installationskabel FK 1,5 mm², svart",
	"art-510231": "Täckande väggfärg, helmatt, 10 liter",
	"art-610044": "Förzinkad träskruv 5 × 80 mm, torx",
	"art-100312": "Brandgipsskiva 15 × 1200 × 2500 mm",
	"art-100418": "OSB/3-skiva 12 × 1220 × 2440 mm",
	"art-100520": "Våtrumsskiva 12,5 × 900 × 2400 mm",
	"art-200205": "Regel C24, 45 × 70 mm",
	"art-200311": "Råspont gran, 22 × 95 mm",
	"art-200415": "Läkt gran, 25 × 48 mm",
	"art-310118": "PEX-rör i rör, 16 mm",
	"art-310225": "PP-avloppsrör 110 mm",
	"art-310330": "Klämringskoppling rak, 15 mm",
	"art-410112": "Installationskabel EKK 3G2,5",
	"art-410230": "Vägguttag 2-vägs, jordat, vitt",
	"art-410345": "Kopplingsdosa för infällt montage",
	"art-510118": "Lättspackel för väggar och tak, 10 liter",
	"art-510244": "Våtrumsfog, vit, 300 ml",
	"art-510390": "Grundfärg för trä, vit, 3 liter",
	"art-610102": "Gipsskruv 3,9 × 35 mm, 1000 st/fp",
	"art-610215": "Trådspik blank, 75 mm",
	"art-710010": "Mineralullsskiva 45 mm, λ 0,036",
	"art-710025": "Mineralullsskiva 95 mm, λ 0,036",
	"art-710040": "Cellplast EPS 100 mm",
};

const SUPPLIER_PREFIXES: Record<string, string> = {
	"Beijer Byggmaterial": "BG",
	Moelven: "MO",
	Ahlsell: "AH",
	Rexel: "RX",
	Colorama: "CO",
	Würth: "WU",
	Isover: "IS",
};

/** Figma's values for Gipsskiva 13 mm; the other articles get made-up ones. */
const FIGMA_EXAMPLE = { id: "art-100245", supplierArticleNo: "BG-131224", ean: "7391234567890" };

/** A valid-looking EAN-13 from a Swedish prefix and the article number, with its check digit. */
function mockEan(articleNo: string): string {
	const digits = `739123${articleNo.padStart(6, "0")}`;
	const sum = [...digits].reduce((total, digit, index) => total + Number(digit) * (index % 2 ? 3 : 1), 0);
	return `${digits}${(10 - (sum % 10)) % 10}`;
}

export function withArticleDetails(article: MaterialArticleBase): MaterialArticle {
	const isFigmaExample = article.id === FIGMA_EXAMPLE.id;
	return {
		...article,
		description: DESCRIPTIONS[article.id] ?? article.name,
		supplierArticleNo: isFigmaExample
			? FIGMA_EXAMPLE.supplierArticleNo
			: `${SUPPLIER_PREFIXES[article.supplierName] ?? "LEV"}-${(Number(article.articleNo) * 7) % 900000 + 100000}`,
		ean: isFigmaExample ? FIGMA_EXAMPLE.ean : mockEan(article.articleNo),
		// Träskruv is mostly kept in Uppsala, where most of it is; everything else in the main warehouse.
		defaultDepotId: article.id === "art-610044" ? "dep-002" : "dep-001",
	};
}
