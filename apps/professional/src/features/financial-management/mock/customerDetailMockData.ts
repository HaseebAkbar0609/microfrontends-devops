import type { CustomerDetailData } from "../types/customerDetail.types";

export const DEFAULT_CUSTOMER_DETAIL_M101: CustomerDetailData = {
	id: "cust-1",
	customerNo: "#M101",
	entityType: "company",
	name: "Bygg & Design AB",
	orgNo: "556677-8899",
	vatRegNo: "SE556677889901",
	gln: "-",
	peppolId: "-",

	// Bank Info
	bankName: "Handelsbanken",
	bankAccount: "6123 456 789",
	bankgiro: "123-4567",
	plusgiro: "45 67 89-0",
	iban: "SE1234567890123456789012",
	bic: "ESSESESS",

	// Visiting Address
	visitingAddress: "Storgatan 15",
	visitingPostalCode: "111 22",
	visitingCity: "Stockholm",
	visitingCountry: "Sverige",

	// Invoice Address
	invoiceAddress: "Box 123",
	invoicePostalCode: "111 20",
	invoiceCity: "Stockholm",
	invoiceCountry: "Sverige",

	// Contact Information
	phone: "08-123 45 67",
	email: "info@byggdesign.se",
	website: "www.byggdesign.se",
	contactPersons: [
		{
			id: "cp-1",
			firstName: "Anna",
			lastName: "Andersson",
			mobilePhone: "070-123 45 67",
			email: "anna@byggdesign.se",
			role: "Projektledare",
			personalNo: "19850101-1234",
		},
		{
			id: "cp-2",
			firstName: "Erik",
			lastName: "Johansson",
			mobilePhone: "070-987 65 43",
			email: "erik@byggdesign.se",
			role: "Ekonomiansvarig",
			personalNo: "19800512-5678",
		},
	],

	// Assessment
	ratings: {
		solvency: 5,
		cooperation: 4,
		clarity: 5,
		availability: 4,
		environment: 5,
		timeliness: 4,
	},
	documents: [
		{
			id: "doc-1",
			name: "Kreditrapport_2024.pdf",
			size: "245 KB",
			type: "application/pdf",
			dateAdded: "2024-02-10",
		},
		{
			id: "doc-2",
			name: "Avtal_ByggDesign.pdf",
			size: "1.2 MB",
			type: "application/pdf",
			dateAdded: "2024-01-15",
		},
	],
	notes:
		"Kunden önskar alltid samlingsfaktura i slutet av varje månad. Kontaktperson för tekniska frågor är Anna Andersson.",

	// Invoicing & Terms
	paymentTerms: "30 dagar",
	deliveryTerms: "Fritt vårt lager",
	deliveryMethod: "PostNord Företagspaket",
	overdueInterest: "8.5 %",
	invoiceMethod: "E-postfaktura",
	invoiceEmail: "faktura@byggdesign.se",
	priceList: "Standardprislista 2024",
	invoiceDiscount: "0 %",
	invoiceFee: "0,00 kr",
	shippingFee: "0,00 kr",
	pricesInclVat: "Exkl. moms",
	interestInvoicing: "Ja",

	// References
	ourReference: "Johan Svensson",
	customerResponsible: "Johan Svensson",
	yourReference: "Anna Andersson",
	externalReference: "PO-2024-089",

	// Accounting
	vatNumber: "SE556677889901",
	vatType: "25 % (Standard)",
	salesAccount: "3001 Försäljning Sverige 25%",
	costCenter: "100 Administration",
	project: "PRJ-1002 Kontorsanpassning",

	// ROT / RUT
	isRotRutEnabled: true,
	rotRutType: "ROT (30 %)",
	propertyDesignation: "Malmen 1:24",
	apartmentNumber: "1201",
	brfOrgNo: "716400-1234",
};
