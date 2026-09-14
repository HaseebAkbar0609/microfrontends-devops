import type {
	AuthorityItem,
	AuthorityFormData,
	AuthorityComment,
	AuthorityAttachment,
} from "../types/authorities.types";
import { AUTHORITIES_STORAGE_KEY } from "../constants/authorities.constants";

const DEFAULT_COMPANY_DETAILS = {
	companyName: "Cleaning Services AB",
	address: "Industrivägen 42, 123 45 Stockholm",
	vatNumber: "SE556123456701",
	orgNumber: "556123-4567",
	fTax: true,
	bankName: "Swedbank",
	bankNumber: "8327-9, 123 456 789-0",
	iban: "SE35 5000 0000 0583 9825 7466",
	bic: "SWEDSESS",
	swishNumber: "123 456 7890",
	email: "info@cleaningservices.se",
	phone: "08-123 456 78",
	paymentTermsNotice:
		"Betalning kan göras via bankgiro, Swish eller direktöverföring till angivet IBAN-nummer. Vid försenad betalning tillkommer påminnelseavgift och dröjsmålsränta enligt lag.",
};

const SEED_DATA: AuthorityItem[] = [
	{
		id: "001",
		caseNr: "001",
		category: "Govt Docs",
		authorityName: "Skatteverket",
		subject: "info",
		documentName: "info",
		date: "2024-05-10",
		dueDate: "2024-06-10",
		status: "approved",
		responsiblePerson: "Erik Eriksson",
		referenceNumber: "SKV-2024-001",
		invoiceNumber: "#4560",
		paymentTerms: "30 dagar netto",
		contractNumber: "AVT-2024-001",
		fileType: "PDF",
		fileName: "Kontrakt.pdf",
		fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
		customer: {
			companyName: "AB Fastighetsutveckling",
			contactPerson: "Anna Andersson",
			address: "Storgatan 15",
			postalCodeCity: "111 22 Stockholm",
			email: "anna.andersson@abfastighet.se",
			phone: "+46 70 123 45 67",
		},
		supplier: {
			companyName: "Cleaning Services AB",
			contactPerson: "Erik Eriksson",
			address: "Industrivägen 42",
			postalCodeCity: "123 45 Stockholm",
			email: "erik@cleaningservices.se",
			phone: "+46 70 987 65 43",
		},
		project: {
			projectNumber: "PROJ-2025-042",
			projectName: "Kontorsstädning Storgatan",
		},
		lineItems: [
			{
				id: "li-1",
				articleNumber: "1001",
				description: "Aconto 3",
				quantity: 10,
				unit: "tim",
				price: 750,
				subtotal: 10000,
				handling: "Rabatt 5%",
			},
			{
				id: "li-2",
				articleNumber: "1002",
				description: "Elektriker",
				quantity: 1,
				unit: "styck",
				price: 150000,
				subtotal: 150000,
				handling: "Påslag",
			},
			{
				id: "li-3",
				articleNumber: "1002",
				description: "Arbete",
				quantity: 10,
				unit: "tim",
				price: 500,
				subtotal: 5000,
				handling: "Rotavdrag",
			},
		],
		totals: {
			subtotal: 22460.0,
			freightFee: 0.0,
			invoiceFee: 0.0,
			totalExclVat: 22460.0,
			vatRate: 0.25,
			vatAmount: 5615.0,
			note: "Ombyggnad av badrum enligt avtal, delbetalning 1 av 4. Egenkontroller utförda och avstämda. Bifogar betalningsplan, redovisning och underlag. Tack för ert förtroende! Betalning sker enligt överenskomna villkor. Vid frågor, vänligen kontakta oss på info@cleaningservices.se eller ring 08-123 456 78.",
		},
		companyDetails: DEFAULT_COMPANY_DETAILS,
		comments: [
			{
				id: "c-1",
				author: "Erik Eriksson",
				date: "2026-01-20",
				message: "Kunden verkar ha ekonomiska problem men är villig att samarbeta.",
			},
			{
				id: "c-2",
				author: "Maria Nilsson",
				date: "2026-01-18",
				message: "Har skickat betalningsplan via e-post.",
			},
		],
		attachments: [
			{
				id: "att-1",
				name: "Kontrakt.pdf",
				fileType: "PDF",
				date: "2024-05-10",
				fileSize: "1.4 MB",
			},
		],
		createdAt: "2024-05-10T08:00:00Z",
		updatedAt: "2024-05-10T08:00:00Z",
	},
	{
		id: "002",
		caseNr: "002",
		category: "Financial",
		authorityName: "Bolagsverket",
		subject: "info",
		documentName: "info",
		date: "2024-05-10",
		dueDate: "2024-06-15",
		status: "submitted",
		responsiblePerson: "Erik Eriksson",
		referenceNumber: "BOL-2024-884",
		invoiceNumber: "#4561",
		fileType: "DOC",
		fileName: "Kontrakt.pdf",
		fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
		companyDetails: DEFAULT_COMPANY_DETAILS,
		comments: [],
		attachments: [],
		createdAt: "2024-05-10T09:00:00Z",
		updatedAt: "2024-05-10T09:00:00Z",
	},
	{
		id: "003",
		caseNr: "003",
		category: "Financial",
		authorityName: "Försäkringskassan",
		subject: "info",
		documentName: "info",
		date: "2024-05-10",
		dueDate: "2024-06-20",
		status: "pending",
		responsiblePerson: "Maria Nilsson",
		referenceNumber: "FK-2024-102",
		invoiceNumber: "#4562",
		fileType: "DOC",
		fileName: "Kontrakt.pdf",
		fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
		companyDetails: DEFAULT_COMPANY_DETAILS,
		comments: [],
		attachments: [],
		createdAt: "2024-05-10T10:00:00Z",
		updatedAt: "2024-05-10T10:00:00Z",
	},
	{
		id: "004",
		caseNr: "004",
		category: "Financial",
		authorityName: "Kronofogden",
		subject: "info",
		documentName: "info",
		date: "2024-05-10",
		dueDate: "2024-06-25",
		status: "action_required",
		responsiblePerson: "Erik Eriksson",
		referenceNumber: "KFM-2024-991",
		invoiceNumber: "#4563",
		fileType: "DOC",
		fileName: "Kontrakt.pdf",
		fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
		companyDetails: DEFAULT_COMPANY_DETAILS,
		comments: [],
		attachments: [],
		createdAt: "2024-05-10T11:00:00Z",
		updatedAt: "2024-05-10T11:00:00Z",
	},
	{
		id: "005",
		caseNr: "005",
		category: "Financial",
		authorityName: "Pensionsmyndigheten",
		subject: "info",
		documentName: "info",
		date: "2024-05-10",
		dueDate: "2024-06-30",
		status: "approved",
		responsiblePerson: "Maria Nilsson",
		referenceNumber: "PM-2024-554",
		invoiceNumber: "#4564",
		fileType: "DOC",
		fileName: "Kontrakt.pdf",
		fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
		companyDetails: DEFAULT_COMPANY_DETAILS,
		comments: [],
		attachments: [],
		createdAt: "2024-05-10T12:00:00Z",
		updatedAt: "2024-05-10T12:00:00Z",
	},
	{
		id: "006",
		caseNr: "006",
		category: "Financial",
		authorityName: "Skatteverket",
		subject: "info",
		documentName: "info",
		date: "2024-05-10",
		dueDate: "2024-07-01",
		status: "submitted",
		responsiblePerson: "Erik Eriksson",
		referenceNumber: "SKV-2024-772",
		invoiceNumber: "#4565",
		fileType: "DOC",
		fileName: "Kontrakt.pdf",
		fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
		companyDetails: DEFAULT_COMPANY_DETAILS,
		comments: [],
		attachments: [],
		createdAt: "2024-05-10T13:00:00Z",
		updatedAt: "2024-05-10T13:00:00Z",
	},
	{
		id: "M101",
		caseNr: "#M101",
		category: "Financial",
		authorityName: "Kronofogden",
		subject: "Inkassoärende Cleaning Services AB",
		documentName: "Faktura Inkasso Cleaning Services AB",
		date: "2025-01-22",
		dueDate: "2025-02-21",
		status: "action_required",
		responsiblePerson: "Erik Eriksson",
		referenceNumber: "KFM-2025-M101",
		invoiceNumber: "#4563",
		paymentTerms: "30 dagar netto",
		contractNumber: "AVT-2025-001",
		fileType: "PDF",
		fileName: "Faktura_4563.pdf",
		fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
		customer: {
			companyName: "AB Fastighetsutveckling",
			contactPerson: "Anna Andersson",
			address: "Storgatan 15",
			postalCodeCity: "111 22 Stockholm",
			email: "anna.andersson@abfastighet.se",
			phone: "+46 70 123 45 67",
		},
		supplier: {
			companyName: "Cleaning Services AB",
			contactPerson: "Erik Eriksson",
			address: "Industrivägen 42",
			postalCodeCity: "123 45 Stockholm",
			email: "erik@cleaningservices.se",
			phone: "+46 70 987 65 43",
		},
		project: {
			projectNumber: "PROJ-2025-042",
			projectName: "Kontorsstädning Storgatan",
		},
		lineItems: [
			{
				id: "li-1",
				articleNumber: "1001",
				description: "Aconto 3",
				quantity: 10,
				unit: "tim",
				price: 750,
				subtotal: 10000,
				handling: "Rabatt 5%",
			},
			{
				id: "li-2",
				articleNumber: "1002",
				description: "Elektriker",
				quantity: 1,
				unit: "styck",
				price: 150000,
				subtotal: 150000,
				handling: "Påslag",
			},
			{
				id: "li-3",
				articleNumber: "1002",
				description: "Arbete",
				quantity: 10,
				unit: "tim",
				price: 500,
				subtotal: 5000,
				handling: "Rotavdrag",
			},
		],
		totals: {
			subtotal: 22460.0,
			freightFee: 0.0,
			invoiceFee: 0.0,
			totalExclVat: 22460.0,
			vatRate: 0.25,
			vatAmount: 5615.0,
			note: "Ombyggnad av badrum enligt avtal, delbetalning 1 av 4. Egenkontroller utförda och avstämda. Bifogar betalningsplan, redovisning och underlag. Tack för ert förtroende! Betalning sker enligt överenskomna villkor. Vid frågor, vänligen kontakta oss på info@cleaningservices.se eller ring 08-123 456 78.",
		},
		companyDetails: DEFAULT_COMPANY_DETAILS,
		comments: [
			{
				id: "c-101",
				author: "Erik Eriksson",
				date: "2026-01-20",
				message: "Kunden verkar ha ekonomiska problem men är villig att samarbeta.",
			},
			{
				id: "c-102",
				author: "Erik Eriksson",
				date: "2026-01-20",
				message: "Kunden verkar ha ekonomiska problem men är villig att samarbeta.",
			},
			{
				id: "c-103",
				author: "Maria Nilsson",
				date: "2026-01-18",
				message: "Har skickat betalningsplan via e-post.",
			},
		],
		attachments: [
			{
				id: "att-101",
				name: "Kontrakt.pdf",
				fileType: "PDF",
				date: "2024-05-10",
				fileSize: "2.1 MB",
			},
			{
				id: "att-102",
				name: "Kontrakt.pdf",
				fileType: "DOC",
				date: "2024-05-10",
				fileSize: "1.1 MB",
			},
		],
		createdAt: "2025-01-22T08:00:00Z",
		updatedAt: "2025-01-22T08:00:00Z",
	},
];

class AuthoritiesRepository {
	private data: AuthorityItem[] = [];
	private initialized = false;

	private init() {
		if (this.initialized) return;

		if (typeof window !== "undefined") {
			try {
				const stored = window.sessionStorage.getItem(AUTHORITIES_STORAGE_KEY);
				if (stored) {
					this.data = JSON.parse(stored);
					this.initialized = true;
					return;
				}
			} catch {
				// storage error fallback
			}
		}

		this.data = JSON.parse(JSON.stringify(SEED_DATA));
		this.saveToStorage();
		this.initialized = true;
	}

	private saveToStorage() {
		if (typeof window !== "undefined") {
			try {
				window.sessionStorage.setItem(
					AUTHORITIES_STORAGE_KEY,
					JSON.stringify(this.data),
				);
			} catch {
				// storage error ignored
			}
		}
	}

	getAll(): AuthorityItem[] {
		this.init();
		return [...this.data];
	}

	getById(id: string): AuthorityItem | undefined {
		this.init();
		const cleanId = id.replace(/^#/, "");
		return this.data.find(
			(item) =>
				item.id === id ||
				item.id === cleanId ||
				item.caseNr === id ||
				item.caseNr === `#${cleanId}` ||
				item.caseNr === cleanId,
		);
	}

	create(payload: AuthorityFormData): AuthorityItem {
		this.init();
		const newId = payload.id || String(this.data.length + 1).padStart(3, "0");
		const newItem: AuthorityItem = {
			id: newId,
			caseNr: payload.caseNr || newId,
			category: payload.category || "Govt Docs",
			authorityName: payload.authorityName || "Skatteverket",
			subject: payload.subject || payload.documentName || "Ärende",
			documentName: payload.documentName || payload.subject || "Dokument",
			date: payload.date || new Date().toISOString().slice(0, 10),
			dueDate: payload.dueDate,
			status: payload.status || "pending",
			responsiblePerson: payload.responsiblePerson || "Erik Eriksson",
			referenceNumber: payload.referenceNumber,
			invoiceNumber: payload.invoiceNumber || `#${Math.floor(1000 + Math.random() * 9000)}`,
			paymentTerms: payload.paymentTerms || "30 dagar netto",
			contractNumber: payload.contractNumber || `AVT-2025-${newId}`,
			fileType: payload.fileType || "PDF",
			fileName: payload.fileName || "Kontrakt.pdf",
			fileUrl: payload.fileUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
			customer: {
				companyName: "AB Fastighetsutveckling",
				contactPerson: "Anna Andersson",
				address: "Storgatan 15",
				postalCodeCity: "111 22 Stockholm",
				email: "anna.andersson@abfastighet.se",
				phone: "+46 70 123 45 67",
			},
			supplier: {
				companyName: "Cleaning Services AB",
				contactPerson: "Erik Eriksson",
				address: "Industrivägen 42",
				postalCodeCity: "123 45 Stockholm",
				email: "erik@cleaningservices.se",
				phone: "+46 70 987 65 43",
			},
			project: {
				projectNumber: "PROJ-2025-042",
				projectName: "Kontorsstädning Storgatan",
			},
			lineItems: [
				{
					id: `li-${Date.now()}-1`,
					articleNumber: "1001",
					description: "Aconto 3",
					quantity: 10,
					unit: "tim",
					price: 750,
					subtotal: 10000,
					handling: "Rabatt 5%",
				},
				{
					id: `li-${Date.now()}-2`,
					articleNumber: "1002",
					description: "Elektriker",
					quantity: 1,
					unit: "styck",
					price: 150000,
					subtotal: 150000,
					handling: "Påslag",
				},
			],
			totals: {
				subtotal: 22460.0,
				freightFee: 0.0,
				invoiceFee: 0.0,
				totalExclVat: 22460.0,
				vatRate: 0.25,
				vatAmount: 5615.0,
				note: "Ombyggnad av badrum enligt avtal, delbetalning 1 av 4. Egenkontroller utförda och avstämda. Bifogar betalningsplan, redovisning och underlag.",
			},
			companyDetails: DEFAULT_COMPANY_DETAILS,
			comments: [],
			attachments: (payload.attachments || []).map((att) => ({
				...att,
				id: att.id || `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
			})),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		this.data.unshift(newItem);
		this.saveToStorage();
		return newItem;
	}

	update(id: string, payload: Partial<AuthorityFormData>): AuthorityItem | undefined {
		this.init();
		const idx = this.data.findIndex((item) => item.id === id || item.caseNr === id);
		if (idx === -1) return undefined;

		this.data[idx] = {
			...this.data[idx],
			...payload,
			updatedAt: new Date().toISOString(),
		};
		this.saveToStorage();
		return this.data[idx];
	}

	delete(id: string): boolean {
		this.init();
		const before = this.data.length;
		this.data = this.data.filter((item) => item.id !== id && item.caseNr !== id);
		if (this.data.length !== before) {
			this.saveToStorage();
			return true;
		}
		return false;
	}

	addComment(id: string, message: string, author = "Erik Eriksson"): AuthorityComment | undefined {
		this.init();
		const item = this.getById(id);
		if (!item) return undefined;

		const newComment: AuthorityComment = {
			id: `c-${Date.now()}`,
			author,
			date: new Date().toISOString().slice(0, 10),
			message,
		};

		item.comments = [newComment, ...(item.comments || [])];
		this.saveToStorage();
		return newComment;
	}

	addAttachment(id: string, attachment: Omit<AuthorityAttachment, "id">): AuthorityAttachment | undefined {
		this.init();
		const item = this.getById(id);
		if (!item) return undefined;

		const newAtt: AuthorityAttachment = {
			...attachment,
			id: `att-${Date.now()}`,
		};

		item.attachments = [newAtt, ...(item.attachments || [])];
		this.saveToStorage();
		return newAtt;
	}

	resetData(): void {
		this.data = JSON.parse(JSON.stringify(SEED_DATA));
		this.saveToStorage();
	}
}

export const authoritiesRepository = new AuthoritiesRepository();
