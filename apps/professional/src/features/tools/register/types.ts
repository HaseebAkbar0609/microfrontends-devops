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
