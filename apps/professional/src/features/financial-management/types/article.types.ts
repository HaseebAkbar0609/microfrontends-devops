export interface ArticleRow {
	id: string;
	isFavorite: boolean;
	articleNo: string;
	description: string;
	outPriceListA: string;
	calculatedCost: string;
	stock: string;
	reserved: string;
	available: string;
	stockValue: string;
	country?: string;
	status: "active" | "inactive";
}

export interface SupplierArticleRow {
	id: string;
	supplierArticleNo: string;
	supplierName: string;
	supplierDescription: string;
	purchasePrice: string;
	linkedToArticle: string;
	status: "mapped" | "unmapped";
}

export interface PriceListRow {
	id: string;
	name: string;
	price: string;
	currency?: string;
	validFrom?: string;
	validTo?: string;
	isFavorite?: boolean;
	benamning?: string;
	prisUt?: string;
	prisKalkyl?: string;
	tgPercent?: string;
	tbSek?: string;
	kostnad?: string;
	andringsDatum?: string;
	statistik?: string;
}

export interface ArticleDetail extends ArticleRow {
	benamning: string;
	ean: string;
	leverantor: string;
	husarbete: string;
	supplierArticleNo: string;
	typHusarbete: string;
	enhet: string;
	typAvArtikel: string;
	lagerVara: string;
	forsaljning: string;
	moms: string;
	forsaljningSE: string;
	forsaljningEU: string;
	lagerkonto: string;
	forsaljningEUMoms: string;
	forsaljningExport: string;
	inkop: string;
	priserA: string;
	europrislista: string;
	kampanj: string;
	vipPriser: string;
	kalkylkostnad: string;
	bestallningspunkt: string;
	iLager: string;
	vikt: string;
	langd: string;
	bredd: string;
	hojd: string;
	material: string;
	forsaljningSESkattskyldighet: string;
	momsSESkattskyldighet: string;
	forsaljningEUSkattskyldighet: string;
	lagerforandring: string;
	priceListRows?: PriceListRow[];
}

export interface SupplierArticleDetail extends SupplierArticleRow {
	ean?: string;
	unit?: string;
	category?: string;
	weight?: string;
	dimensions?: string;
	material?: string;
	leadTimeDays?: number;
	images?: string[];
}

export interface CreateArticleFormData {
	articleNr?: string;
	benamning: string;
	ean?: string;
	leverantor: string;
	husarbete?: string;
	supplierArticleNo?: string;
	typHusarbete?: string;
	enhet: string;
	typAvArtikel: string;
	lagerVara?: string;
	forsaljning: string;
	moms: string;
	forsaljningSE?: string;
	forsaljningEU?: string;
	lagerkonto?: string;
	forsaljningEUMoms?: string;
	forsaljningExport?: string;
	inkop?: string;
	priserA?: string;
	europrislista?: string;
	kampanj?: string;
	vipPriser?: string;
	kalkylkostnad?: string;
	bestallningspunkt?: string;
	iLager?: string;
	stock?: string;
	reserved?: string;
	status?: "active" | "inactive";
	vikt?: string;
	langd?: string;
	bredd?: string;
	hojd?: string;
	material?: string;
	forsaljningSESkattskyldighet: string;
	momsSESkattskyldighet?: string;
	forsaljningEUSkattskyldighet?: string;
	lagerforandring?: string;
	priceListRows?: PriceListRow[];
}

export type ArticleImportMapping = Record<string, string>;

export interface ArticleImportColumn {
	fileColumn: string;
	fileValue: string;
	mappedField?: string;
}

export interface ArticleKpiStats {
	totalArticles: number;
	activeArticles: number;
	mappedArticles: number;
}
