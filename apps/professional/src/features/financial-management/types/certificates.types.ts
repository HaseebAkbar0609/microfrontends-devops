export type CertificateStatus = "active" | "expiring" | "expired" | "pending" | "archived";

export interface CertificateItem {
	id: string;
	category: string;
	name: string; // Benämning
	objectType: string; // Objekt (e.g. "OR501", "P2025-001", "Order", "Projekt")
	objectId: string; // Object ID
	objectName: string; // Objekt Namn
	responsiblePerson: string; // Attest ansvarig
	responsibleRole: string; // Roll för Attestansvarig
	masterApprover?: string; // Masterattest
	masterRole?: string; // Roll för Masterattest
	status?: CertificateStatus;
	issueDate?: string;
	expiryDate?: string;
	description?: string;
	fileName?: string;
	fileSize?: string;
	fileType?: string;
	fileUrl?: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface CertificateFormData {
	id?: string;
	category: string;
	name: string;
	objectType: string;
	objectId: string;
	objectName: string;
	responsiblePerson: string;
	responsibleRole: string;
	masterApprover: string;
	masterRole: string;
	issueDate?: string;
	expiryDate?: string;
	description?: string;
	file?: File | null;
	fileName?: string;
	fileSize?: string;
	fileUrl?: string;
}

export interface CertificateFilterState {
	searchQuery: string;
	categoryFilter: string;
	statusFilter: CertificateStatus | "all";
}
