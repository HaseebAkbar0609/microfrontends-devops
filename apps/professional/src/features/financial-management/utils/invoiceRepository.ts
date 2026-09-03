import { InvoiceItem, ReminderItem } from "../types/invoice.types";
import {
	InvoiceDetailData,
	InvoiceDetailLineItem,
	InvoiceDetailPaymentPlanItem,
	InvoiceDetailTimeReportItem,
	InvoiceHistoryEvent,
} from "../types/invoiceDetail.types";
import { CreateInvoiceFormData } from "../types/createInvoice.types";
import { MOCK_INVOICE_LIST, MOCK_REMINDERS_LIST } from "../mock/invoiceMockData";
import { MOCK_INVOICE_DETAILS } from "../mock/invoiceDetailMockData";
import {
	INVOICES_STORAGE_KEY,
	DETAILS_STORAGE_KEY,
} from "../constants/invoice.constants";

/**
 * Client Storage Security Layer
 * Note: In production, financial data is securely retrieved from the authenticated API
 * and stored strictly in-memory. For local client prototypes, cached records are encoded
 * to prevent plain-text exposure on shared workstations.
 */
function secureEncode(data: unknown): string {
	try {
		return btoa(encodeURIComponent(JSON.stringify(data)));
	} catch {
		return JSON.stringify(data);
	}
}

function secureDecode<T>(payload: string): T | null {
	try {
		return JSON.parse(decodeURIComponent(atob(payload))) as T;
	} catch {
		try {
			return JSON.parse(payload) as T;
		} catch {
			return null;
		}
	}
}

type Listener = () => void;
const listeners = new Set<Listener>();

function notifyListeners() {
	listeners.forEach((listener) => {
		try {
			listener();
		} catch (e) {
			console.error("Error in invoice repository listener", e);
		}
	});
}

// In-memory singletons
let inMemoryInvoices: InvoiceItem[] | null = null;
let inMemoryDetails: Record<string, InvoiceDetailData> | null = null;

function initializeRepository() {
	if (inMemoryInvoices && inMemoryDetails) return;

	if (typeof window !== "undefined") {
		try {
			const storedList = localStorage.getItem(INVOICES_STORAGE_KEY);
			const storedDetails = localStorage.getItem(DETAILS_STORAGE_KEY);

			if (storedList) {
				const parsedList = secureDecode<InvoiceItem[]>(storedList);
				if (Array.isArray(parsedList) && parsedList.length > 0) {
					inMemoryInvoices = parsedList;
				}
			}

			if (storedDetails) {
				const parsedDetails = secureDecode<Record<string, InvoiceDetailData>>(storedDetails);
				if (parsedDetails && typeof parsedDetails === "object") {
					inMemoryDetails = parsedDetails;
				}
			}
		} catch (e) {
			console.error("Failed to load invoice store from localStorage", e);
		}
	}

	if (!inMemoryInvoices) {
		inMemoryInvoices = [...MOCK_INVOICE_LIST];
	}

	if (!inMemoryDetails) {
		inMemoryDetails = { ...MOCK_INVOICE_DETAILS };

		// Ensure every mock list invoice has a generated default detail
		inMemoryInvoices.forEach((inv) => {
			if (!inMemoryDetails![inv.id]) {
				inMemoryDetails![inv.id] = createDefaultDetailFromItem(inv);
			}
		});
	}
}

function persistRepository() {
	if (typeof window === "undefined") return;
	try {
		if (inMemoryInvoices) {
			localStorage.setItem(INVOICES_STORAGE_KEY, secureEncode(inMemoryInvoices));
		}
		if (inMemoryDetails) {
			localStorage.setItem(DETAILS_STORAGE_KEY, secureEncode(inMemoryDetails));
		}
	} catch (e) {
		console.error("Failed to persist invoice store to localStorage", e);
	}
}

function createDefaultDetailFromItem(inv: InvoiceItem): InvoiceDetailData {
	const defaultHistory: InvoiceHistoryEvent[] = [
		{
			id: `h-${inv.id}-1`,
			date: inv.invoiceDate,
			time: "09:00",
			type: "created",
			description: "Faktura skapad",
			actor: inv.projectLeader,
		},
	];

	return {
		id: inv.id,
		invoiceNo: inv.invoiceNo,
		ocr: inv.ocr || `${inv.invoiceNo}456301`,
		status:
			inv.status === "paid"
				? "betald"
				: inv.status === "sent"
					? "skickad"
					: inv.status === "saved"
						? "utkast"
						: inv.status === "overdue"
							? "förfallen"
							: "startade",
		invoiceTemplate: "Standard",
		attachTimeReport: true,
		attachUnderlag: true,
		isCreditInvoice: false,
		projectName: `${inv.object} - ${inv.customer}`,
		projectNumber: `PROJ-${inv.invoiceNo}`,
		contactPerson: inv.projectLeader,
		projectSum: inv.total * 3,
		invoicedEarlier: inv.total * 1.5,
		invoiceInclThis: inv.total * 2.5,
		invoiceDate: inv.invoiceDate,
		dueDate: inv.dueDate,
		rotRut: "Ingen",
		paymentPlanName: "30 dagar netto",
		pricingModel: inv.type === "fastpris" ? "Fastpris" : "Löpande",
		category: inv.contractType || "Service & Entreprenad",
		customer: inv.customer,
		customerOrgNr: "556123-4567",
		customerAddress: `${inv.location}, Sverige`,
		customerEmail: `kontakt@${inv.customer.toLowerCase().replace(/\s+/g, "")}.se`,
		customerPhone: "+46 70 123 45 67",
		supplierName: "Cleaning Services AB",
		supplierContact: "Erik Eriksson",
		supplierAddress: "Industrivägen 42, 123 45 Stockholm",
		supplierEmail: "info@cleaningservices.se",
		supplierPhone: "08-123 456 78",
		comments: "Fakturan avser utförda entreprenadarbeten enligt avtal.",
		history: defaultHistory,
		lineItems: [
			{
				id: `item-${inv.id}-1`,
				articleId: "1001",
				description: "Aconto 1",
				quantity: 1,
				unit: "st",
				unitPrice: inv.total,
				delsumma: inv.total,
				handlingType: "none",
				handlingPercentage: 0,
				adjustment: 0,
				total: inv.total,
				ks: 10,
			},
		],
		paymentPlanItems: [
			{
				id: `pp-${inv.id}-1`,
				invoiceNo: inv.invoiceNo,
				date: inv.invoiceDate,
				description: "Delbetalning 1",
				quantity: 1,
				unit: "st",
				unitPrice: inv.total,
				withheld: 0,
				amount: inv.total,
				paid: inv.status === "paid" ? inv.total : 0,
				cost: inv.total,
			},
		],
		timeReportItems: [
			{
				id: `tr-${inv.id}-1`,
				date: inv.invoiceDate,
				employee: inv.projectLeader,
				regularHours: 8,
				unit: "tim",
				ataHours: 2,
				totalHours: 10,
				ks: 10,
				comments: "Utförda arbeten enligt överenskommelse.",
			},
		],
		underlagItems: [
			{
				id: `und-${inv.id}-1`,
				date: inv.invoiceDate,
				supplier: "Bygg Material AB",
				supplierInvoiceNo: `SUP-${inv.invoiceNo}`,
				amount: Math.round(inv.total * 0.4),
				unit: "st",
				ataNo: 1,
				markupPercent: 10,
				markupAmount: Math.round(inv.total * 0.04),
				ks: 10,
				subtotal: Math.round(inv.total * 0.44),
				comments: "Materialinköp för projektet.",
			},
		],
	};
}

export const invoiceRepository = {
	subscribe(listener: Listener): () => void {
		listeners.add(listener);
		return () => listeners.delete(listener);
	},

	getInvoices(): InvoiceItem[] {
		initializeRepository();
		return inMemoryInvoices ? [...inMemoryInvoices] : [];
	},

	getReminders(): ReminderItem[] {
		return [...MOCK_REMINDERS_LIST];
	},

	getInvoiceDetail(id: string): InvoiceDetailData | null {
		initializeRepository();
		if (!inMemoryDetails) return null;

		if (inMemoryDetails[id]) {
			return { ...inMemoryDetails[id] };
		}

		// Fallback: look in list items
		const item = inMemoryInvoices?.find((inv) => inv.id === id);
		if (item) {
			const generated = createDefaultDetailFromItem(item);
			inMemoryDetails[id] = generated;
			persistRepository();
			return { ...generated };
		}

		return null;
	},

	saveInvoiceDetail(updates: InvoiceDetailData): void {
		initializeRepository();
		if (!inMemoryDetails || !inMemoryInvoices) return;

		inMemoryDetails[updates.id] = { ...updates };

		// Sync to invoice list item
		const listIndex = inMemoryInvoices.findIndex((inv) => inv.id === updates.id);
		if (listIndex !== -1) {
			const old = inMemoryInvoices[listIndex];
			inMemoryInvoices[listIndex] = {
				...old,
				customer: updates.customer,
				invoiceDate: updates.invoiceDate,
				dueDate: updates.dueDate,
				status:
					updates.status === "betald"
						? "paid"
						: updates.status === "skickad"
							? "sent"
							: updates.status === "utkast"
								? "saved"
								: updates.status === "förfallen"
									? "overdue"
									: old.status,
			};
		}

		persistRepository();
		notifyListeners();
	},

	markInvoiceAsPaid(id: string): void {
		initializeRepository();
		if (!inMemoryInvoices || !inMemoryDetails) return;

		const today = new Date().toISOString().split("T")[0];

		// Update in list
		inMemoryInvoices = inMemoryInvoices.map((inv) => {
			if (inv.id === id) {
				return {
					...inv,
					status: "paid",
					balance: 0,
					fullyPaidDate: today,
				};
			}
			return inv;
		});

		// Update in detail
		if (inMemoryDetails[id]) {
			const newEvent: InvoiceHistoryEvent = {
				id: `h-${Date.now()}`,
				date: today,
				time: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }),
				type: "payment_received",
				description: "Fakturan markerades som fullt betald",
				actor: "Användare",
			};

			inMemoryDetails[id] = {
				...inMemoryDetails[id],
				status: "betald",
				history: [newEvent, ...(inMemoryDetails[id].history || [])],
			};
		}

		persistRepository();
		notifyListeners();
	},

	creditInvoice(id: string): void {
		initializeRepository();
		if (!inMemoryInvoices || !inMemoryDetails) return;

		const today = new Date().toISOString().split("T")[0];

		inMemoryInvoices = inMemoryInvoices.map((inv) => {
			if (inv.id === id) {
				return {
					...inv,
					status: "saved",
					balance: 0,
				};
			}
			return inv;
		});

		if (inMemoryDetails[id]) {
			const newEvent: InvoiceHistoryEvent = {
				id: `h-${Date.now()}`,
				date: today,
				time: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }),
				type: "credited",
				description: "Kreditfaktura skapad",
				actor: "Användare",
			};

			inMemoryDetails[id] = {
				...inMemoryDetails[id],
				status: "krediterad",
				isCreditInvoice: true,
				history: [newEvent, ...(inMemoryDetails[id].history || [])],
			};
		}

		persistRepository();
		notifyListeners();
	},

	sendInvoice(idOrIds: string | string[]): void {
		initializeRepository();
		if (!inMemoryInvoices || !inMemoryDetails) return;

		const targetIds = new Set(Array.isArray(idOrIds) ? idOrIds : [idOrIds]);
		const today = new Date().toISOString().split("T")[0];

		inMemoryInvoices = inMemoryInvoices.map((inv) => {
			if (targetIds.has(inv.id)) {
				return {
					...inv,
					status: "sent",
				};
			}
			return inv;
		});

		targetIds.forEach((id) => {
			if (inMemoryDetails![id]) {
				const newEvent: InvoiceHistoryEvent = {
					id: `h-${Date.now()}`,
					date: today,
					time: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }),
					type: "sent",
					description: "Faktura skickad till kund via e-post",
					actor: "Användare",
				};

				inMemoryDetails![id] = {
					...inMemoryDetails![id],
					status: "skickad",
					history: [newEvent, ...(inMemoryDetails![id].history || [])],
				};
			}
		});

		persistRepository();
		notifyListeners();
	},

	deleteInvoice(id: string): void {
		initializeRepository();
		if (!inMemoryInvoices || !inMemoryDetails) return;

		inMemoryInvoices = inMemoryInvoices.filter((inv) => inv.id !== id);
		delete inMemoryDetails[id];

		persistRepository();
		notifyListeners();
	},

	archiveInvoice(id: string): void {
		initializeRepository();
		if (!inMemoryInvoices) return;

		inMemoryInvoices = inMemoryInvoices.filter((inv) => inv.id !== id);

		persistRepository();
		notifyListeners();
	},

	createInvoice(
		formData: CreateInvoiceFormData,
		calculations: { attErhalla: number; delsumma: number },
		status: "saved" | "sent" = "saved",
	): string {
		initializeRepository();
		if (!inMemoryInvoices || !inMemoryDetails) return "";

		const id = `inv-${Date.now()}`;
		const today = new Date().toISOString().split("T")[0];

		const newListItem: InvoiceItem = {
			id,
			invoiceNo: formData.invoiceNo || `${Math.floor(1000 + Math.random() * 9000)}`,
			ocr: `${formData.invoiceNo || "4563"}456301`,
			object: formData.category === "Order" ? "Order" : "Projekt",
			type:
				formData.pricingModel === "fastpris"
					? "fastpris"
					: formData.pricingModel === "budget"
						? "budget"
						: "hourly",
			customer: formData.customer || "Kund",
			invoiceDate: formData.invoiceDate || today,
			costCenter: formData.lineItems[0]?.costCenter || "10",
			projectLeader: formData.contactPerson || "Projektledare",
			location: "Stockholm",
			contractType: formData.category || "Service & Entreprenad",
			total: calculations.attErhalla,
			balance: status === "saved" ? calculations.attErhalla : calculations.attErhalla,
			currency: "SEK",
			dueDate: "2026-03-31",
			status,
		};

		const lineItems: InvoiceDetailLineItem[] = formData.lineItems.map((item, idx) => ({
			id: `item-${id}-${idx}`,
			articleId: item.articleId,
			description: item.description,
			quantity: item.quantity,
			unit: item.unit,
			unitPrice: item.unitPrice,
			delsumma: item.subtotal,
			handlingType:
				item.handlingType === "discount"
					? "rabatt"
					: item.handlingType === "markup"
						? "påslag"
						: item.handlingType === "rotrut"
							? "rot/rut"
							: "none",
			handlingPercentage: item.handlingPercentage,
			adjustment: item.adjustmentAmount,
			total: item.total,
			ks: 10,
		}));

		const paymentPlanItems: InvoiceDetailPaymentPlanItem[] = formData.paymentPlanItems.map(
			(pp, idx) => ({
				id: `pp-${id}-${idx}`,
				invoiceNo: pp.invoiceNo,
				date: pp.date,
				description: pp.description,
				quantity: pp.quantity,
				unit: pp.unit,
				unitPrice: pp.unitPrice,
				withheld: pp.withheld,
				amount: pp.amount,
				paid: pp.paid,
				cost: pp.cost,
			}),
		);

		const timeReportItems: InvoiceDetailTimeReportItem[] = formData.timeReportItems.map(
			(tr, idx) => ({
				id: `tr-${id}-${idx}`,
				date: tr.date,
				employee: tr.employee,
				regularHours: tr.workHours,
				unit: tr.unit,
				ataHours: tr.ataHours,
				totalHours: tr.totalHours,
				ks: 10,
				comments: tr.comments,
			}),
		);

		const initialHistory: InvoiceHistoryEvent[] = [
			{
				id: `h-${Date.now()}`,
				date: today,
				time: new Date().toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }),
				type: status === "sent" ? "sent" : "created",
				description: status === "sent" ? "Faktura skapad och skickad" : "Faktura skapad som utkast",
				actor: formData.contactPerson || "Användare",
			},
		];

		const newDetail: InvoiceDetailData = {
			id,
			invoiceNo: newListItem.invoiceNo,
			ocr: newListItem.ocr,
			status: status === "sent" ? "skickad" : "utkast",
			invoiceTemplate: formData.template || "Standard",
			attachTimeReport: formData.attachTimeReport,
			attachUnderlag: formData.attachDocumentation,
			isCreditInvoice: formData.isCreditInvoice,
			projectName: formData.projectName || "Nytt Projekt",
			projectNumber: formData.projectNumber || `PROJ-${newListItem.invoiceNo}`,
			contactPerson: formData.contactPerson || "Kontaktperson",
			projectSum: formData.projectSum || calculations.attErhalla,
			invoicedEarlier: formData.invoicedEarlier || 0,
			invoiceInclThis: (formData.invoicedEarlier || 0) + calculations.attErhalla,
			invoiceDate: formData.invoiceDate || today,
			dueDate: "2026-03-31",
			rotRut: formData.rotRutType === "rot" ? "ROT" : formData.rotRutType === "rut" ? "RUT" : "Ingen",
			paymentPlanName: "30 dagar netto",
			pricingModel:
				formData.pricingModel === "fastpris"
					? "Fastpris"
					: formData.pricingModel === "budget"
						? "Budget"
						: "Löpande räkning",
			category: formData.category || "Service & Entreprenad",
			customer: formData.customer || "Kund",
			customerOrgNr: "556123-4567",
			customerAddress: "Storgatan 15, 111 22 Stockholm",
			customerEmail: "kund@foretag.se",
			customerPhone: "+46 70 123 45 67",
			supplierName: "Cleaning Services AB",
			supplierContact: "Erik Eriksson",
			supplierAddress: "Industrivägen 42, 123 45 Stockholm",
			supplierEmail: "info@cleaningservices.se",
			supplierPhone: "08-123 456 78",
			comments: formData.comments || "",
			history: initialHistory,
			lineItems,
			paymentPlanItems,
			timeReportItems,
			underlagItems: [],
		};

		inMemoryInvoices = [newListItem, ...inMemoryInvoices];
		inMemoryDetails[id] = newDetail;

		persistRepository();
		notifyListeners();

		return id;
	},
};
