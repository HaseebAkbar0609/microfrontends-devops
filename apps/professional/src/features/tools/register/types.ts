import { z } from "zod";

export const createCustomerSchema = z.object({
	// Step 1: BasicInfo
	companyName: z.string().min(1, "validationCompanyNameRequired"),
	orgNo: z.string().min(1, "validationOrgNoRequired"),
	customerNo: z.string().optional(),
	status: z.string().min(1, "placeholderSelectStatus"),
	mainCategory: z.string().min(1, "placeholderSelectCategory"),
	department: z.string().optional(),
	region: z.string().optional(),
	vatRegNo: z.string().optional(),
	visitingAddress: z.string().min(1, "placeholderAddress"),
	visitingPostalCode: z.string().min(1, "placeholderPostalCode"),
	visitingCity: z.string().min(1, "placeholderCity"),
	invoiceAddress: z.string().min(1, "placeholderAddress"),
	invoicePostalCode: z.string().min(1, "placeholderPostalCode"),
	invoiceCity: z.string().min(1, "placeholderCity"),
	bankName: z.string().optional(),
	bankAccount: z.string().optional(),
	bankgiro: z.string().optional(),
	plusgiro: z.string().optional(),
	iban: z.string().optional(),
	bic: z.string().optional(),

	// Step 2: Contact
	phone: z.string().min(1, "validationPhoneRequired"),
	email: z.string().min(1, "validationEmailRequired").email("validationEmailInvalid"),
	website: z.string().optional(),
	contactNotes: z.string().optional(),
	contactPerson1FirstName: z.string().min(1, "validationFirstNameRequired"),
	contactPerson1LastName: z.string().min(1, "validationLastNameRequired"),
	contactPerson1Mobile: z.string().optional(),
	contactPerson1Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson1Role: z.string().min(1, "placeholderSelectRole"),
	contactPerson1PersonalNo: z.string().optional(),
	contactPerson2FirstName: z.string().optional(),
	contactPerson2LastName: z.string().optional(),
	contactPerson2Mobile: z.string().optional(),
	contactPerson2Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson2Role: z.string().optional(),
	contactPerson2PersonalNo: z.string().optional(),
	contactPerson3FirstName: z.string().optional(),
	contactPerson3LastName: z.string().optional(),
	contactPerson3Mobile: z.string().optional(),
	contactPerson3Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson3Role: z.string().optional(),
	contactPerson3PersonalNo: z.string().optional(),
	contactPerson4FirstName: z.string().optional(),
	contactPerson4LastName: z.string().optional(),
	contactPerson4Mobile: z.string().optional(),
	contactPerson4Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson4Role: z.string().optional(),
	contactPerson4PersonalNo: z.string().optional(),
	contactPerson5FirstName: z.string().optional(),
	contactPerson5LastName: z.string().optional(),
	contactPerson5Mobile: z.string().optional(),
	contactPerson5Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson5Role: z.string().optional(),
	contactPerson5PersonalNo: z.string().optional(),

	// Step 3: Assessment
	notes: z.string().optional(),

	// Step 4: Invoice
	paymentTerms: z.string().min(1, "placeholderSelectPaymentTerms"),
	deliveryTerms: z.string().min(1, "placeholderSelectDeliveryTerms"),
	deliveryMethod: z.string().optional(),
	interestInvoicing: z.string().optional(),
	priceList: z.string().optional(),
	currency: z.string().min(1, "placeholderSelectCurrency"),
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

export type CreateCustomerFullData = CreateCustomerFormData & { ratings: Ratings; id?: string | null };

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
	orgNo: z.string().min(1, "validationOrgNoRequired"),
	vatRegNo: z.string().optional(),
	visitingAddress: z.string().min(1, "placeholderAddress"),
	visitingPostalCode: z.string().min(1, "placeholderPostalCode"),
	visitingCity: z.string().min(1, "placeholderCity"),
	invoiceAddress: z.string().min(1, "placeholderAddress"),
	invoicePostalCode: z.string().min(1, "placeholderPostalCode"),
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
	phone: z.string().optional(),
	email: z.string().email("validationEmailInvalid").or(z.literal("")),
	website: z.string().optional(),
	contactNotes: z.string().optional(),
	contactPerson1FirstName: z.string().optional(),
	contactPerson1LastName: z.string().optional(),
	contactPerson1Mobile: z.string().optional(),
	contactPerson1Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson1Role: z.string().optional(),
	contactPerson1PersonalNo: z.string().optional(),
	contactPerson2FirstName: z.string().optional(),
	contactPerson2LastName: z.string().optional(),
	contactPerson2Mobile: z.string().optional(),
	contactPerson2Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson2Role: z.string().optional(),
	contactPerson2PersonalNo: z.string().optional(),
	contactPerson3FirstName: z.string().optional(),
	contactPerson3LastName: z.string().optional(),
	contactPerson3Mobile: z.string().optional(),
	contactPerson3Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson3Role: z.string().optional(),
	contactPerson3PersonalNo: z.string().optional(),
	contactPerson4FirstName: z.string().optional(),
	contactPerson4LastName: z.string().optional(),
	contactPerson4Mobile: z.string().optional(),
	contactPerson4Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson4Role: z.string().optional(),
	contactPerson4PersonalNo: z.string().optional(),
	contactPerson5FirstName: z.string().optional(),
	contactPerson5LastName: z.string().optional(),
	contactPerson5Mobile: z.string().optional(),
	contactPerson5Email: z.string().email("validationEmailInvalid").or(z.literal("")),
	contactPerson5Role: z.string().optional(),
	contactPerson5PersonalNo: z.string().optional(),

	// Step 3: Assessment
	notes: z.string().optional(),
});

export type CreateSupplierFormData = z.infer<typeof createSupplierSchema>;

export type CreateSupplierFullData = CreateSupplierFormData & { ratings: Ratings; id?: string | null };

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
}

export interface GetPriceListRegisterListResponse {
	data: PriceListRegisterRow[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

// Create Price List Schema (TFS-441)
export const createPriceListSchema = z.object({
	kod: z.string().optional(),
	benamning: z.string().min(1, "validationPriceListNameRequired"),
	datum: z.string().min(1, "validationPriceListDateRequired"),
	skapadAv: z.string().min(1, "validationPriceListCreatedByRequired"),
	kommentar: z.string().optional(),
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
	calcCost: string;
	stock: number;
	reserved: number;
	selected: boolean;
}

