import {
	RotRutItem,
	RotRutCustomerLimit,
	RotRutKpiSummary,
	RegisterRotRutFormData,
} from "../types/rotRut.types";
import {
	ROT_RUT_ANNUAL_LIMIT,
	ROT_RUT_DEDUCTION_RATE,
	STORAGE_KEY_ROT_RUT,
} from "../constants/rotRut.constants";

const SEED_ROT_RUT_DATA: RotRutItem[] = [
	{
		id: "rot-1",
		invoiceId: "inv-1",
		invoiceNo: "F-2026-001",
		customerName: "Anna Lindberg",
		customerPersonalId: "19850412-3829",
		customerPersonalIdMasked: "19850412-****",
		propertyId: "Stockholm Vasastaden 1:42",
		type: "rot",
		description: "Målning och tapetsering av 3 rum och kök",
		laborCost: 42000,
		materialCost: 18000,
		totalAmount: 60000,
		deductionRate: ROT_RUT_DEDUCTION_RATE,
		deductionAmount: 12600,
		status: "approved",
		submissionDate: "2026-01-15",
		decisionDate: "2026-01-22",
		skatteverketReference: "SKV-2026-08412",
		createdAt: "2026-01-10T10:00:00Z",
	},
	{
		id: "rot-2",
		invoiceId: "inv-2",
		invoiceNo: "F-2026-002",
		customerName: "Lars Gustafsson",
		customerPersonalId: "19780923-1492",
		customerPersonalIdMasked: "19780923-****",
		propertyId: "Nacka Sickla 4:18",
		type: "rot",
		description: "Byte av avloppsstam och badrumsrenovering",
		laborCost: 75000,
		materialCost: 45000,
		totalAmount: 120000,
		deductionRate: ROT_RUT_DEDUCTION_RATE,
		deductionAmount: 22500,
		status: "approved",
		submissionDate: "2026-01-20",
		decisionDate: "2026-01-28",
		skatteverketReference: "SKV-2026-09234",
		createdAt: "2026-01-18T14:30:00Z",
	},
	{
		id: "rut-1",
		invoiceId: "inv-3",
		invoiceNo: "F-2026-003",
		customerName: "Sofia Bergman",
		customerPersonalId: "19901105-8241",
		customerPersonalIdMasked: "19901105-****",
		propertyId: "BRF Björken, Lgh 1201",
		apartmentNo: "1201",
		brfOrgNr: "769600-1234",
		type: "rut",
		description: "Hemstädning abonnemang och fönsterputs",
		laborCost: 12000,
		materialCost: 1500,
		totalAmount: 13500,
		deductionRate: ROT_RUT_DEDUCTION_RATE,
		deductionAmount: 3600,
		status: "submitted",
		submissionDate: "2026-02-10",
		skatteverketReference: "SKV-2026-11849",
		createdAt: "2026-02-08T09:15:00Z",
	},
	{
		id: "rot-3",
		invoiceId: "inv-4",
		invoiceNo: "F-2026-004",
		customerName: "Mikael Nilsson",
		customerPersonalId: "19690318-5531",
		customerPersonalIdMasked: "19690318-****",
		propertyId: "Uppsala Luthagen 12:3",
		type: "rot",
		description: "Takomläggning och plåtarbeten villa",
		laborCost: 90000,
		materialCost: 60000,
		totalAmount: 150000,
		deductionRate: ROT_RUT_DEDUCTION_RATE,
		deductionAmount: 27000,
		status: "submitted",
		submissionDate: "2026-02-14",
		skatteverketReference: "SKV-2026-12401",
		createdAt: "2026-02-12T11:45:00Z",
	},
	{
		id: "rut-2",
		invoiceId: "inv-5",
		invoiceNo: "F-2026-005",
		customerName: "Elin Wallin",
		customerPersonalId: "19880709-6623",
		customerPersonalIdMasked: "19880709-****",
		propertyId: "Täby Ensta 2:15",
		type: "rut",
		description: "Trädgårdsarbete och häckklippning",
		laborCost: 16000,
		materialCost: 2000,
		totalAmount: 18000,
		deductionRate: ROT_RUT_DEDUCTION_RATE,
		deductionAmount: 4800,
		status: "pending",
		createdAt: "2026-02-20T16:20:00Z",
	},
	{
		id: "rot-4",
		invoiceId: "inv-6",
		invoiceNo: "F-2026-006",
		customerName: "Johan Ekström",
		customerPersonalId: "19811230-7419",
		customerPersonalIdMasked: "19811230-****",
		propertyId: "Solna Råsunda 8:22",
		type: "rot",
		description: "Elinstallation och belysning altan",
		laborCost: 24000,
		materialCost: 11000,
		totalAmount: 35000,
		deductionRate: ROT_RUT_DEDUCTION_RATE,
		deductionAmount: 7200,
		status: "pending",
		createdAt: "2026-02-22T13:10:00Z",
	},
	{
		id: "rot-5",
		invoiceId: "inv-7",
		invoiceNo: "F-2026-007",
		customerName: "Karl Svensson",
		customerPersonalId: "19720401-2938",
		customerPersonalIdMasked: "19720401-****",
		propertyId: "Göteborg Haga 3:11",
		type: "rot",
		description: "Slipning och lackering av parkettgolv",
		laborCost: 30000,
		materialCost: 8000,
		totalAmount: 38000,
		deductionRate: ROT_RUT_DEDUCTION_RATE,
		deductionAmount: 9000,
		status: "rejected",
		submissionDate: "2026-01-18",
		decisionDate: "2026-01-25",
		rejectionReason:
			"Fastighetsbeteckningen överensstämmer ej med fastighetsregistret hos Lantmäteriet. Korrigera och skicka in på nytt.",
		createdAt: "2026-01-16T15:00:00Z",
	},
	{
		id: "rut-3",
		invoiceId: "inv-8",
		invoiceNo: "F-2026-008",
		customerName: "Karin Holmberg",
		customerPersonalId: "19920814-4120",
		customerPersonalIdMasked: "19920814-****",
		propertyId: "BRF Solrosen, Lgh 1102",
		apartmentNo: "1102",
		brfOrgNr: "769601-9988",
		type: "rut",
		description: "Flyttstädning 4 rok samt vindsförråd",
		laborCost: 18500,
		materialCost: 1200,
		totalAmount: 19700,
		deductionRate: ROT_RUT_DEDUCTION_RATE,
		deductionAmount: 5550,
		status: "approved",
		submissionDate: "2026-02-01",
		decisionDate: "2026-02-08",
		skatteverketReference: "SKV-2026-10772",
		createdAt: "2026-01-29T10:30:00Z",
	},
];

type Listener = () => void;

class RotRutRepository {
	private items: RotRutItem[] = [];
	private listeners: Set<Listener> = new Set();
	private isInitialized = false;

	constructor() {
		this.init();
	}

	private init(): void {
		if (this.isInitialized) return;
		if (typeof window !== "undefined") {
			try {
				const saved = window.localStorage.getItem(STORAGE_KEY_ROT_RUT);
				if (saved) {
					this.items = JSON.parse(saved);
				} else {
					this.items = [...SEED_ROT_RUT_DATA];
					this.persist();
				}
			} catch {
				this.items = [...SEED_ROT_RUT_DATA];
			}
		} else {
			this.items = [...SEED_ROT_RUT_DATA];
		}
		this.isInitialized = true;
	}

	private persist(): void {
		if (typeof window !== "undefined") {
			try {
				window.localStorage.setItem(STORAGE_KEY_ROT_RUT, JSON.stringify(this.items));
			} catch {
				// Silently fallback if storage is restricted
			}
		}
		this.notify();
	}

	private notify(): void {
		this.listeners.forEach((l) => l());
	}

	public subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}

	public getAll(): RotRutItem[] {
		this.init();
		return [...this.items];
	}

	public getKpiSummary(customItems?: RotRutItem[]): RotRutKpiSummary {
		this.init();
		const list = customItems || this.items;
		let totalRotApplied = 0;
		let totalRutApplied = 0;
		let totalPending = 0;
		let totalPendingCount = 0;
		let totalApproved = 0;
		let totalApprovedCount = 0;
		let totalRejected = 0;
		let totalRejectedCount = 0;

		for (const item of list) {
			if (item.type === "rot") {
				totalRotApplied += item.deductionAmount;
			} else {
				totalRutApplied += item.deductionAmount;
			}

			if (item.status === "pending") {
				totalPending += item.deductionAmount;
				totalPendingCount++;
			} else if (item.status === "approved") {
				totalApproved += item.deductionAmount;
				totalApprovedCount++;
			} else if (item.status === "rejected") {
				totalRejected += item.deductionAmount;
				totalRejectedCount++;
			}
		}

		return {
			totalRotApplied,
			totalRutApplied,
			totalPending,
			totalPendingCount,
			totalApproved,
			totalApprovedCount,
			totalRejected,
			totalRejectedCount,
			totalCount: list.length,
		};
	}

	public getCustomerLimits(customItems?: RotRutItem[]): RotRutCustomerLimit[] {
		this.init();
		const list = customItems || this.items;
		const customerMap = new Map<
			string,
			{
				customerName: string;
				customerPersonalIdMasked: string;
				rotUsed: number;
				rutUsed: number;
			}
		>();

		for (const item of list) {
			const existing = customerMap.get(item.customerPersonalId) || {
				customerName: item.customerName,
				customerPersonalIdMasked: item.customerPersonalIdMasked,
				rotUsed: 0,
				rutUsed: 0,
			};

			if (item.type === "rot") {
				existing.rotUsed += item.deductionAmount;
			} else {
				existing.rutUsed += item.deductionAmount;
			}

			customerMap.set(item.customerPersonalId, existing);
		}

		const result: RotRutCustomerLimit[] = [];
		customerMap.forEach((val, personalId) => {
			const totalUsed = val.rotUsed + val.rutUsed;
			const remainingLimit = Math.max(0, ROT_RUT_ANNUAL_LIMIT - totalUsed);
			const percentUsed = Math.min(100, Math.round((totalUsed / ROT_RUT_ANNUAL_LIMIT) * 100));

			result.push({
				customerId: personalId,
				customerName: val.customerName,
				customerPersonalIdMasked: val.customerPersonalIdMasked,
				annualLimit: ROT_RUT_ANNUAL_LIMIT,
				rotUsed: val.rotUsed,
				rutUsed: val.rutUsed,
				totalUsed,
				remainingLimit,
				percentUsed,
			});
		});

		return result.sort((a, b) => b.percentUsed - a.percentUsed);
	}

	public createDeduction(formData: RegisterRotRutFormData): RotRutItem {
		this.init();
		const deductionAmount = Math.round(formData.laborCost * ROT_RUT_DEDUCTION_RATE);
		const totalAmount = formData.laborCost + formData.materialCost;
		const cleanPid = formData.customerPersonalId.replace(/\s+/g, "");
		const masked =
			cleanPid.length >= 8
				? `${cleanPid.slice(0, 8)}-****`
				: `${cleanPid.slice(0, 6)}-****`;

		const newItem: RotRutItem = {
			id: `rotrut-${Date.now()}`,
			invoiceId: formData.invoiceId,
			invoiceNo: `F-2026-${String(this.items.length + 1).padStart(3, "0")}`,
			customerName: formData.customerName,
			customerPersonalId: cleanPid,
			customerPersonalIdMasked: masked,
			propertyId: formData.propertyId,
			apartmentNo: formData.apartmentNo,
			brfOrgNr: formData.brfOrgNr,
			type: formData.type,
			description: formData.description,
			laborCost: formData.laborCost,
			materialCost: formData.materialCost,
			totalAmount,
			deductionRate: ROT_RUT_DEDUCTION_RATE,
			deductionAmount,
			status: "pending",
			createdAt: new Date().toISOString(),
		};

		this.items = [newItem, ...this.items];
		this.persist();
		return newItem;
	}

	public batchSubmitToSkatteverket(ids: string[]): {
		submittedCount: number;
		totalDeductionAmount: number;
	} {
		this.init();
		const idSet = new Set(ids);
		let submittedCount = 0;
		let totalDeductionAmount = 0;
		const today = new Date().toISOString().split("T")[0];

		this.items = this.items.map((item) => {
			if (idSet.has(item.id) && (item.status === "pending" || item.status === "rejected")) {
				submittedCount++;
				totalDeductionAmount += item.deductionAmount;
				return {
					...item,
					status: "submitted" as const,
					submissionDate: today,
					skatteverketReference: `SKV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
					rejectionReason: undefined,
				};
			}
			return item;
		});

		this.persist();
		return { submittedCount, totalDeductionAmount };
	}

	public resubmitDeduction(
		id: string,
		updatedFields: Partial<RotRutItem>,
	): RotRutItem | undefined {
		this.init();
		const index = this.items.findIndex((item) => item.id === id);
		if (index === -1) return undefined;

		const current = this.items[index];
		const updatedLabor = updatedFields.laborCost ?? current.laborCost;
		const updatedMaterial = updatedFields.materialCost ?? current.materialCost;
		const deductionAmount = Math.round(updatedLabor * ROT_RUT_DEDUCTION_RATE);

		const updated: RotRutItem = {
			...current,
			...updatedFields,
			laborCost: updatedLabor,
			materialCost: updatedMaterial,
			totalAmount: updatedLabor + updatedMaterial,
			deductionAmount,
			status: "submitted",
			submissionDate: new Date().toISOString().split("T")[0],
			skatteverketReference: `SKV-2026-${Math.floor(10000 + Math.random() * 90000)}`,
			rejectionReason: undefined,
		};

		this.items[index] = updated;
		this.persist();
		return updated;
	}

	public deleteDeduction(id: string): boolean {
		this.init();
		const prevLen = this.items.length;
		this.items = this.items.filter((item) => item.id !== id);
		if (this.items.length !== prevLen) {
			this.persist();
			return true;
		}
		return false;
	}
}

export const rotRutRepository = new RotRutRepository();
