import { z } from "zod";

export const createCustomerSchema = z.object({
	// Step 1: BasicInfo
	companyName: z.string().min(1, "validationCompanyNameRequired"),
	orgNo: z
		.string()
		.min(1, "validationOrgNoRequired")
		.refine((val) => /^[0-9\s-]+$/.test(val), { message: "validationOrgNoInvalid" }),
	customerNo: z.string().optional(),
	status: z.string().min(1, "placeholderSelectStatus"),
	mainCategory: z.string().min(1, "placeholderSelectCategory"),
	department: z.string().optional(),
	region: z.string().optional(),
	vatRegNo: z.string().optional(),
	visitingAddress: z.string().min(1, "placeholderAddress"),
	visitingPostalCode: z
		.string()
		.min(1, "placeholderPostalCode")
		.refine((val) => /^[0-9\s-]+$/.test(val), { message: "validationPostalCodeInvalid" }),
	visitingCity: z.string().min(1, "placeholderCity"),
	invoiceAddress: z.string().min(1, "placeholderAddress"),
	invoicePostalCode: z
		.string()
		.min(1, "placeholderPostalCode")
		.refine((val) => /^[0-9\s-]+$/.test(val), { message: "validationPostalCodeInvalid" }),
	invoiceCity: z.string().min(1, "placeholderCity"),
	bankName: z.string().optional(),
	bankAccount: z.string().optional(),
	bankgiro: z.string().optional(),
	plusgiro: z.string().optional(),
	iban: z.string().optional(),
	bic: z.string().optional(),

	// Step 2: Contact
	phone: z
		.string()
		.min(1, "validationPhoneRequired")
		.refine((val) => /^[0-9+\s-()]+$/.test(val), { message: "validationPhoneInvalid" }),
	email: z.string().min(1, "validationEmailRequired").email("validationEmailInvalid"),
	website: z.string().optional(),
	contactNotes: z.string().optional(),
	contactPerson1FirstName: z.string().min(1, "validationFirstNameRequired"),
	contactPerson1LastName: z.string().min(1, "validationLastNameRequired"),
	contactPerson1Mobile: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9+\s-()]+$/.test(val), { message: "validationPhoneInvalid" }),
	contactPerson1Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson1Role: z.string().min(1, "placeholderSelectRole"),
	contactPerson1PersonalNo: z.string().optional(),
	contactPerson2FirstName: z.string().optional(),
	contactPerson2LastName: z.string().optional(),
	contactPerson2Mobile: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9+\s-()]+$/.test(val), { message: "validationPhoneInvalid" }),
	contactPerson2Email: z.string().email("validationEmailInvalid").or(z.literal("")).optional(),
	contactPerson2Role: z.string().optional(),
	contactPerson2PersonalNo: z.string().optional(),
	contactPerson3FirstName: z.string().optional(),
	contactPerson3LastName: z.string().optional(),
	contactPerson3Mobile: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9+\s-()]+$/.test(val), { message: "validationPhoneInvalid" }),
	contactPerson3Email: z.string().email("validationEmailInvalid").or(z.literal("")).optional(),
	contactPerson3Role: z.string().optional(),
	contactPerson3PersonalNo: z.string().optional(),
	contactPerson4FirstName: z.string().optional(),
	contactPerson4LastName: z.string().optional(),
	contactPerson4Mobile: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9+\s-()]+$/.test(val), { message: "validationPhoneInvalid" }),
	contactPerson4Email: z.string().email("validationEmailInvalid").or(z.literal("")).optional(),
	contactPerson4Role: z.string().optional(),
	contactPerson4PersonalNo: z.string().optional(),
	contactPerson5FirstName: z.string().optional(),
	contactPerson5LastName: z.string().optional(),
	contactPerson5Mobile: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9+\s-()]+$/.test(val), { message: "validationPhoneInvalid" }),
	contactPerson5Email: z.string().email("validationEmailInvalid").or(z.literal("")).optional(),
	contactPerson5Role: z.string().optional(),
	contactPerson5PersonalNo: z.string().optional(),

	// Step 3: Assessment
	notes: z.string().optional(),

	// Step 4: Invoice
	paymentTerms: z.string().optional(),
	deliveryTerms: z.string().optional(),
	deliveryMethod: z.string().optional(),
	interestInvoicing: z.string().optional(),
	priceList: z.string().optional(),
	currency: z.string().optional(),
	invoiceDiscount: z.string().optional(),
	invoiceFee: z.string().optional(),
	shippingFee: z.string().optional(),
	pricesInclVat: z.string().optional(),
	ourReference: z.string().optional(),
	customerResponsible: z.string().optional(),
	externalReference: z.string().optional(),
	yourReference: z.string().optional(),
	vatNumber: z.string().optional(),
	vatType: z.string().optional(),
	salesAccount: z.string().optional(),
	costCenter: z.string().optional(),
	project: z.string().optional(),
});

export type CreateCustomerFormData = z.infer<typeof createCustomerSchema>;

export interface Ratings {
	economy: number;
	environment: number;
	quality: number;
	collaboration: number;
	punctuality: number;
	service: number;
}

export type RatingField = keyof Ratings;

export type CreateCustomerFullData = CreateCustomerFormData & { ratings: Ratings; documents?: CustomerDocument[]; id?: string | null };

// Customer Register List Types
export interface CustomerRegisterRow {
	id: string;
	customerNo: string;
	name: string;
	orgNo: string;
	address: string;
	postNr: string;
	city: string;
	country: string;
	phone: string;
	email: string;
	status: "active" | "inactive";
	dateAdded: string;
}

export interface GetCustomerRegisterListParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: "all" | "active" | "inactive";
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetCustomerRegisterListResponse {
	data: CustomerRegisterRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// Article Register Types
export interface ArticleRow {
	id: string;
	isFavorite: boolean;
	articleNo: string;
	description: string;
	outPriceListA: string;
	calculatedCost: string;
	stock: number;
	reserved: number;
	available: number;
	stockValue: string;
	status: "active" | "inactive";
}

export interface GetArticleListParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: "all" | "active" | "inactive";
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetArticleListResponse {
	data: ArticleRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// Supplier Register List Types
export interface SupplierRegisterRow {
	id: string;
	supplierNo: string;
	name: string;
	orgNo: string;
	address: string;
	postNr: string;
	city: string;
	country: string;
	phone: string;
	email: string;
	status: "active" | "inactive";
	dateAdded?: string;
}

export interface GetSupplierRegisterListParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: "all" | "active" | "inactive";
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetSupplierRegisterListResponse {
	data: SupplierRegisterRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// Supplier Article Register Types
export interface SupplierArticleRow {
	id: string;
	supplierArticleNo: string;
	supplierName: string;
	supplierDescription: string;
	purchasePrice: string;
	linkedToArticle: string;
	status: "mapped" | "unmapped";
}

export interface GetSupplierArticleListParams {
	page?: number;
	limit?: number;
	search?: string;
	supplier?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetSupplierArticleListResponse {
	data: SupplierArticleRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// Article Import Types
export interface ArticleImportColumn {
	fileColumn: string;
	fileValue: string;
	mappedField?: string;
}

export interface ArticleImportMapping {
	articleNumber?: string;
	name?: string;
	unit?: string;
	ean?: string;
	manufacturer?: string;
	manufacturerArticleNumber?: string;
	description?: string;
	model?: string;
	articleType?: string;
	active?: string;
	supplierNumber?: string;
	weight?: string;
	length?: string;
	width?: string;
	height?: string;
	material?: string;
}

export interface ArticleImportResult {
	successCount: number;
	failureCount: number;
	errors?: Array<{ row: number; message: string }>;
}

// Customer Detail Types
export interface CustomerContact {
	id: string;
	firstName: string;
	lastName: string;
	mobile: string;
	email: string;
	role: string;
	personalNo: string;
}

export interface CustomerDocument {
	id: string;
	date: string;
	name: string;
	type: string;
	url: string;
}

export interface CustomerDetail {
	id: string;
	customerNo: string;
	companyName: string;
	orgNo: string;
	status: "active" | "inactive";
	mainCategory: string;
	department: string;
	region: string;
	vatRegNo: string;
	// Addresses
	visitingAddress: string;
	visitingPostalCode: string;
	visitingCity: string;
	invoiceAddress: string;
	invoicePostalCode: string;
	invoiceCity: string;
	// Bank
	bankName: string;
	bankAccount: string;
	bankgiro: string;
	plusgiro: string;
	iban: string;
	bic: string;
	// Contact
	phone: string;
	email: string;
	website: string;
	contactNotes: string;
	// Contacts
	contacts: CustomerContact[];
	// Assessment
	ratings: Ratings;
	documents: CustomerDocument[];
	notes: string;
	// Invoice
	paymentTerms: string;
	deliveryTerms: string;
	deliveryMethod: string;
	interestInvoicing: string;
	priceList: string;
	currency: string;
	invoiceDiscount: string;
	invoiceFee: string;
	shippingFee: string;
	pricesInclVat: string;
	// References
	ourReference: string;
	customerResponsible: string;
	externalReference: string;
	yourReference: string;
	// Accounting
	vatNumber: string;
	vatType: string;
	salesAccount: string;
	costCenter: string;
	project: string;
}

// Supplier Detail Types (TFS-434)
export interface SupplierContact {
	id: string;
	firstName: string;
	lastName: string;
	mobile: string;
	email: string;
	role: string;
	personalNo: string;
}

export interface SupplierDocument {
	id: string;
	date: string;
	name: string;
	type: string;
	url: string;
}

export interface SupplierDetail {
	id: string;
	supplierNo: string;
	companyName: string;
	orgNo: string;
	status: "active" | "inactive";
	mainCategory: string;
	department: string;
	region: string;
	vatRegNo: string;
	// Addresses
	visitingAddress: string;
	visitingPostalCode: string;
	visitingCity: string;
	invoiceAddress: string;
	invoicePostalCode: string;
	invoiceCity: string;
	// Bank
	bankName: string;
	bankAccount: string;
	bankgiro: string;
	plusgiro: string;
	iban: string;
	bic: string;
	// Payment terms
	betalningsdagar: string;
	ranta: string;
	fakturaavgift: string;
	inkasso: string;
	// Contact
	phone: string;
	email: string;
	website: string;
	contactNotes: string;
	// Contacts
	contacts: SupplierContact[];
	// Assessment
	ratings: Ratings;
	documents: SupplierDocument[];
	notes: string;
}

// Supplier Article Detail Types (TFS-436)
export interface SupplierArticleDetail {
	id: string;
	articleNo: string;
	articleName: string;
	articleDescription: string;
	category: string;
	unitPrice: string;
	currency: string;
	taxVat: string;
	discountTiers: { minQty: string; discount: string }[];
	supplierName: string;
	supplierId: string;
	supplierArticleNo: string;
	supplierDescription: string;
	purchasePrice: string;
	leadTime: string;
	status: "active" | "inactive" | "discontinued";
	weight: string;
	length: string;
	width: string;
	height: string;
	material: string;
	linkedArticleNo: string;
	images: { id: string; url: string; name: string }[];
	documents: { id: string; name: string; type: string; url: string }[];
}

// Create Supplier Schema (TFS-433)
export const createSupplierSchema = z.object({
	// Step 1: GrundInfo
	supplierNo: z.string().optional(),
	status: z.string().min(1, "placeholderSelectStatus"),
	companyName: z.string().min(1, "validationCompanyNameRequired"),
	mainCategory: z.string().optional(),
	department: z.string().optional(),
	region: z.string().optional(),
	orgNo: z
		.string()
		.min(1, "validationOrgNoRequired")
		.refine((val) => /^[0-9\s-]+$/.test(val), { message: "validationOrgNoInvalid" }),
	vatRegNo: z.string().optional(),
	visitingAddress: z.string().min(1, "placeholderAddress"),
	visitingPostalCode: z
		.string()
		.min(1, "placeholderPostalCode")
		.refine((val) => /^[0-9\s-]+$/.test(val), { message: "validationPostalCodeInvalid" }),
	visitingCity: z.string().min(1, "placeholderCity"),
	invoiceAddress: z.string().min(1, "placeholderAddress"),
	invoicePostalCode: z
		.string()
		.min(1, "placeholderPostalCode")
		.refine((val) => /^[0-9\s-]+$/.test(val), { message: "validationPostalCodeInvalid" }),
	invoiceCity: z.string().min(1, "placeholderCity"),
	bankName: z.string().optional(),
	bankAccount: z.string().optional(),
	bankgiro: z.string().optional(),
	plusgiro: z.string().optional(),
	iban: z.string().optional(),
	bic: z.string().optional(),
	betalningsdagar: z.string().optional(),
	ranta: z.string().optional(),
	fakturaavgift: z.string().optional(),
	inkasso: z.string().optional(),

	// Step 2: Contact
	phone: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9+\s-()]+$/.test(val), { message: "validationPhoneInvalid" }),
	email: z.string().email("validationEmailInvalid").or(z.literal("")),
	website: z.string().optional(),
	contactNotes: z.string().optional(),
	contactPerson1FirstName: z.string().optional(),
	contactPerson1LastName: z.string().optional(),
	contactPerson1Mobile: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9+\s-()]+$/.test(val), { message: "validationPhoneInvalid" }),
	contactPerson1Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson1Role: z.string().optional(),
	contactPerson1PersonalNo: z.string().optional(),
	contactPerson2FirstName: z.string().optional(),
	contactPerson2LastName: z.string().optional(),
	contactPerson2Mobile: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9+\s-()]+$/.test(val), { message: "validationPhoneInvalid" }),
	contactPerson2Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson2Role: z.string().optional(),
	contactPerson2PersonalNo: z.string().optional(),
	contactPerson3FirstName: z.string().optional(),
	contactPerson3LastName: z.string().optional(),
	contactPerson3Mobile: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9+\s-()]+$/.test(val), { message: "validationPhoneInvalid" }),
	contactPerson3Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson3Role: z.string().optional(),
	contactPerson3PersonalNo: z.string().optional(),
	contactPerson4FirstName: z.string().optional(),
	contactPerson4LastName: z.string().optional(),
	contactPerson4Mobile: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9+\s-()]+$/.test(val), { message: "validationPhoneInvalid" }),
	contactPerson4Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson4Role: z.string().optional(),
	contactPerson4PersonalNo: z.string().optional(),
	contactPerson5FirstName: z.string().optional(),
	contactPerson5LastName: z.string().optional(),
	contactPerson5Mobile: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9+\s-()]+$/.test(val), { message: "validationPhoneInvalid" }),
	contactPerson5Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson5Role: z.string().optional(),
	contactPerson5PersonalNo: z.string().optional(),

	// Step 3: Assessment
	notes: z.string().optional(),
});

export type CreateSupplierFormData = z.infer<typeof createSupplierSchema>;

export type CreateSupplierFullData = CreateSupplierFormData & { ratings: Ratings; documents?: CustomerDocument[]; id?: string | null };

// Create Article Schema (TFS-438)
export const createArticleSchema = z.object({
	// Step 1: Grund information
	articleNr: z.string().optional(),
	benamning: z.string().min(1, "validationArticleNameRequired"),
	ean: z.string().optional(),
	leverantor: z.string().min(1, "validationArticleSupplierRequired"),
	husarbete: z.string().optional(),
	supplierArticleNo: z.string().optional(),
	typHusarbete: z.string().optional(),
	enhet: z.string().min(1, "validationArticleUnitRequired"),
	typAvArtikel: z.string().min(1, "validationArticleTypeRequired"),
	lagerVara: z.string().optional(),
	// Prislista rows
	priceListRows: z
		.array(
			z.object({
				id: z.string(),
				priceList: z.string(),
				benamning: z.string(),
				prisUt: z.string(),
				prisKalkyl: z.string(),
				tgProcent: z.string(),
				tbSek: z.string(),
				kostnad: z.string(),
				andringsDatum: z.string(),
			}),
		)
		.optional(),
	// Bokörings uppgifter - Step 1
	forsaljning: z.string().min(1, "validationArticleSalesRequired"),
	moms: z.string().min(1, "validationArticleVatRequired"),
	forsaljningSE: z.string().optional(),
	forsaljningEU: z.string().optional(),
	lagerkonto: z.string().optional(),
	forsaljningEUMoms: z.string().optional(),
	forsaljningExport: z.string().optional(),
	inkop: z.string().optional(),
	// Step 2: Strukturerad info - Priser
	priserA: z.string().optional(),
	europrislista: z.string().optional(),
	kampanj: z.string().optional(),
	vipPriser: z.string().optional(),
	// Bokörings uppgifter - Step 2
	kalkylkostnad: z.string().optional(),
	bestallningspunkt: z.string().optional(),
	iLager: z.string().optional(),
	// Lagerplats
	vikt: z.string().optional(),
	langd: z.string().optional(),
	bredd: z.string().optional(),
	hojd: z.string().optional(),
	material: z.string().optional(),
	// Bokföringsuppgifter - Step 2
	forsaljningSESkattskyldighet: z.string().min(1, "validationArticleSalesRequired"),
	momsSESkattskyldighet: z.string().optional(),
	forsaljningEUSkattskyldighet: z.string().optional(),
	lagerforandring: z.string().optional(),
});

export type CreateArticleFormData = z.infer<typeof createArticleSchema>;

export interface PriceListRow {
	id: string;
	priceList: string;
	benamning: string;
	prisUt: string;
	prisKalkyl: string;
	tgProcent: string;
	tbSek: string;
	kostnad: string;
	andringsDatum: string;
}

// Article Detail Types (TFS-439)
export interface ArticleDetail {
	id: string;
	articleNo: string;
	benamning: string;
	ean: string;
	leverantor: string;
	leverantorId: string;
	husarbete: string;
	supplierArticleNo: string;
	typHusarbete: string;
	enhet: string;
	typAvArtikel: string;
	lagerVara: string;
	priceListRows: PriceListRow[];
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
}

// Price List Types (TFS-440)
export interface PriceListRegisterRow {
	id: string;
	isFavorite: boolean;
	kod: string;
	prislista: string;
	kategori: string;
	valuta?: string;
	giltigFran?: string;
	giltigTill?: string;
	status?: "active" | "draft" | "expired";
	kopplad: number;
	skapadAv: string;
	datum: string;
	senastUppdaterad: string;
}

export interface GetPriceListRegisterListParams {
	page?: number;
	limit?: number;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
	status?: string;
	currency?: string;
	category?: string;
}

export interface GetPriceListRegisterListResponse {
	data: PriceListRegisterRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// Create Price List Schema (TFS-441)
const noHtmlRegex = /^[^<>]*$/;

export const createPriceListSchema = z.object({
	kod: z.string().regex(noHtmlRegex, "validationInvalidCharacters").optional(),
	benamning: z.string().min(1, "validationPriceListNameRequired").regex(noHtmlRegex, "validationInvalidCharacters"),
	datum: z.string().min(1, "validationPriceListDateRequired"),
	giltigFran: z.string().optional(),
	giltigTill: z.string().optional(),
	skapadAv: z.string().min(1, "validationPriceListCreatedByRequired"),
	valuta: z.string().optional(),
	kommentar: z.string().regex(noHtmlRegex, "validationInvalidCharacters").optional(),
	kategori: z.string().min(1, "validationPriceListCategoryRequired"),
	enhet: z.string().min(1, "validationPriceListUnitRequired"),
	kund: z.string().optional(),
	leverantor: z.string().optional(),
});

export type CreatePriceListFormData = z.infer<typeof createPriceListSchema>;

export interface PriceListArticleRow {
	id: string;
	articleNo: string;
	benamning: string;
	outPriceListA: string;
	customPrice?: string;
	calcCost: string;
	stock: number;
	reserved: number;
	selected: boolean;
}

// Price List Detail Types (TFS-442)
export interface PriceListDetail {
	id: string;
	kod: string;
	benamning: string;
	datum: string;
	giltigFran: string;
	giltigTill: string;
	skapadAv: string;
	valuta: string;
	kommentar: string;
	kategori: string;
	enhet: string;
	kund: string[];
	leverantor: string[];
	articles: PriceListDetailArticle[];
	// Price update settings (TFS-717)
	baseCalculation?: string;
	updatePriceList?: string;
	calculation?: string;
	rounding?: string;
	increaseDecrease?: string;
	percentage?: string;
}

export interface PriceListDetailArticle {
	id: string;
	isFavorite: boolean;
	articleNo: string;
	benamning: string;
	utprislistaA: string;
	kalkylKostnad: string;
	lager: number;
	reserverat: number;
	disponibelt: number;
	lagervarde: string;
	land: string;
	status: "active" | "inactive";
}

// Cost Center Register Types (TFS-446)
export const detailIdSchema = z.string().trim().min(1).regex(/^[a-zA-Z0-9_-]+$/);

export const costCenterDetailSchema = z.object({
	id: z.string(),
	kod: z.string(),
	benamning: z.string(),
	anteckningar: z.string().optional().default(""),
	status: z.enum(["active", "inactive"]).default("active"),
	description: z.string().optional(),
	createdDate: z.string().optional(),
	lastUpdated: z.string().optional(),
});

export interface CostCenterRegisterRow {
	id: string;
	kod: string;
	benamning: string;
	anteckningar: string;
	status: "active" | "inactive";
	selected?: boolean;
}

export type CostCenterDetail = z.infer<typeof costCenterDetailSchema>;

export interface GetCostCenterListParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetCostCenterListResponse {
	data: CostCenterRegisterRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export const createCostCenterSchema = z.object({
	kod: z
		.string()
		.min(1, "validationCostCenterCodeRequired")
		.refine((val) => /^[0-9a-zA-Z_-]+$/.test(val), { message: "validationCodeInvalid" }),
	benamning: z.string().min(1, "validationCostCenterNameRequired"),
	anteckningar: z.string().optional(),
	status: z.string().default("active"),
});

export type CreateCostCenterFormData = z.infer<typeof createCostCenterSchema>;

// Account Plan Types (TFS-443)
export interface AccountPlanRow {
	id: string;
	accountNumber: string;
	accountName: string;
	accountType: string;
	vatCode: string;
	sru: string;
	autoAccount: string;
	openingBalance: string;
	budget: string;
	status: "active" | "inactive";
}

export interface AccountPlanDetail extends AccountPlanRow {
	costCenterMode?: "obligatoriskt" | "tillatet" | "ejTillatet";
	projectMode?: "obligatoriskt" | "tillatet" | "ejTillatet";
	suggestedCostCenter?: string;
	suggestedProject?: string;
	description?: string;
}

export interface GetAccountPlanListParams {
	page?: number;
	limit?: number;
	search?: string;
	accountType?: string;
	status?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetAccountPlanListResponse {
	data: AccountPlanRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

const isValidOptionalNumber = (val?: string): boolean => {
	if (!val) return true;
	const trimmed = val.trim();
	if (!trimmed) return true;
	const normalized = trimmed.replace(/\s/g, "").replace(",", ".");
	if (!normalized) return true;
	const num = Number(normalized);
	return Number.isFinite(num);
};

export const createAccountPlanSchema = z.object({
	accountNumber: z
		.string()
		.min(1, "validationAccountNumberRequired")
		.refine((val) => /^[0-9]+$/.test(val), { message: "validationCodeInvalid" }),
	accountName: z.string().min(1, "validationAccountNameRequired"),
	accountType: z.string().optional().default("Asset"),
	openingBalance: z
		.string()
		.optional()
		.refine(isValidOptionalNumber, {
			message: "validationNumberInvalid",
		}),
	accountStatus: z.string().optional().default("active"),
	vatCode: z.string().optional(),
	sru: z.string().optional(),
	autoAccount: z.string().optional(),
	budget: z
		.string()
		.optional()
		.refine(isValidOptionalNumber, {
			message: "validationNumberInvalid",
		}),
	costCenterMode: z.enum(["obligatoriskt", "tillatet", "ejTillatet"]).optional().default("obligatoriskt"),
	projectMode: z.enum(["obligatoriskt", "tillatet", "ejTillatet"]).optional().default("obligatoriskt"),
	suggestedCostCenter: z.string().optional(),
	suggestedProject: z.string().optional(),
	description: z.string().optional(),
});

export type CreateAccountPlanFormData = z.infer<typeof createAccountPlanSchema>;

export const budgetRegisterRowSchema = z.object({
	id: z.string(),
	budgetnr: z.string(),
	budgetName: z.string(),
	datum: z.string(),
	totalKostnad: z.string(),
	totalInkomst: z.string(),
	status: z.enum(["active", "inactive"]),
	isFavorite: z.boolean().optional().default(false),
});

export type BudgetRegisterRow = z.infer<typeof budgetRegisterRowSchema>;

export interface BudgetVsActual {
	budget_amount: number;
	actual_spend: number;
	difference: number;
	percent_used: number;
}

export interface BudgetExpenseBreakdownEntry {
	category: string;
	budgeted: number;
	actual: number;
}

export interface BudgetRegisterDetail {
	id: string;
	budgetnr: string;
	name: string;
	date?: string;
	totalCost?: string;
	totalIncome?: string;
	totalAmount?: number;
	currency?: string;
	category?: string;
	startDate?: string;
	endDate?: string;
	description?: string;
	status: "active" | "inactive";
	isFavorite?: boolean;
	budgetVsActual?: BudgetVsActual;
	expenseBreakdown?: BudgetExpenseBreakdownEntry[];
	createdAt?: string;
}

export interface GetBudgetListParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetBudgetListResponse {
	data: BudgetRegisterRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

export const createBudgetSchema = z.object({
	budgetNr: z.string().optional(),
	budgetName: z.string().min(1, "validationBudgetNameRequired"),
	totalAmount: z
		.string()
		.min(1, "validationBudgetTotalAmountRequired")
		.refine((val) => !isNaN(Number(val.replace(/\s/g, "").replace(",", "."))), {
			message: "validationBudgetTotalAmountInvalid",
		}),
	currency: z.string().min(1, "validationBudgetCurrencyRequired"),
	category: z.string().min(1, "validationBudgetCategoryRequired"),
	startDate: z.string().min(1, "validationBudgetStartDateRequired"),
	endDate: z.string().min(1, "validationBudgetEndDateRequired"),
	description: z.string().optional(),
	avvikBudget: z.boolean(),
	overheadBudget: z.boolean(),
	distribution: z.string().optional(),
	budgetRows: z.array(z.any()).optional(),
});

export type CreateBudgetFormData = z.infer<typeof createBudgetSchema>;

export const wageTypeSchema = z.object({
	id: z.string(),
	code: z.string(),
	name: z.string(),
	personalType: z.string().optional().default("Tjänsteman"),
	wageForm: z.string().optional().default("Fast lön"),
	transactionType: z.string().optional().default("Bruttolön"),
	unit: z.string(),
	preliminaryTax: z.string().optional().default("Ja 30%"),
	employerContribution: z.string().optional().default("Ja 30%"),
	createdAt: z.string(),
	updatedAt: z.string(),
	accountDebit: z.string().optional(),
	accountCredit: z.string().optional(),
	accountOppositeAG: z.string().optional(),
	agUnderlag: z.boolean().optional().default(false),
	semestergrundad: z.boolean().optional().default(false),
	agiCode: z.string().optional(),
	description: z.string().optional(),
	factor: z.string().optional(),
	status: z.enum(["active", "inactive"]),
});

export type WageTypeRow = z.infer<typeof wageTypeSchema>;

export const createWageTypeSchema = z.object({
	code: z
		.string()
		.min(1, "validationWageTypeCodeRequired")
		.refine((val) => /^[0-9a-zA-Z_-]+$/.test(val), { message: "validationCodeInvalid" }),
	name: z.string().min(1, "validationWageTypeNameRequired"),
	personalType: z.string().optional().default("Tjänsteman"),
	wageForm: z.string().optional().default("Fast lön"),
	transactionType: z.string().optional().default("Bruttolön"),
	unit: z.string().min(1, "validationWageTypeUnitRequired"),
	preliminaryTax: z.string().optional(),
	employerContribution: z.string().optional(),
	accountDebit: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9]+$/.test(val), { message: "validationCodeInvalid" }),
	accountCredit: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9]+$/.test(val), { message: "validationCodeInvalid" }),
	accountOppositeAG: z
		.string()
		.optional()
		.refine((val) => !val || /^[0-9]+$/.test(val), { message: "validationCodeInvalid" }),
	agUnderlag: z.boolean().optional().default(false),
	semestergrundad: z.boolean().optional().default(false),
	agiCode: z.string().optional(),
	description: z.string().optional(),
	factor: z
		.string()
		.optional()
		.refine(isValidOptionalNumber, { message: "validationNumberInvalid" }),
	status: z.enum(["active", "inactive"]).optional().default("active"),
});

export type CreateWageTypeFormData = z.infer<typeof createWageTypeSchema>;

export interface GetWageTypeListParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface GetWageTypeListResponse {
	data: WageTypeRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

