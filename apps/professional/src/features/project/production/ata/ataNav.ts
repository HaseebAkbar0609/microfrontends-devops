import { projectRecordUrl } from "../projectProductionNav.config";
import { ATA_SUPPLIER_QUERY_PARAM, ATA_SUPPLIER_SECTION } from "./leverantor/supplierAta.config";

/** Where the project record's ÄTA screens live. `create` is a static segment, matched before `[ataId]`. */
export const ataUrls = {
	list: (projectId: string) => `${projectRecordUrl(projectId)}/ata`,
	create: (projectId: string) => `${projectRecordUrl(projectId)}/ata/create`,
	/** Visa detaljer: the saved ÄTA opened on step 2. */
	view: (projectId: string, ataId: string) =>
		`${projectRecordUrl(projectId)}/ata/${encodeURIComponent(ataId)}`,
	/** Redigera: the saved ÄTA opened on step 1. */
	edit: (projectId: string, ataId: string) =>
		`${projectRecordUrl(projectId)}/ata/${encodeURIComponent(ataId)}/edit`,
	/** ÄTA-Leverantör /UE, optionally with one supplier selected. */
	supplierList: (projectId: string, supplierId?: string) => {
		const params = new URLSearchParams({ section: ATA_SUPPLIER_SECTION });
		if (supplierId) params.set(ATA_SUPPLIER_QUERY_PARAM, supplierId);
		return `${projectRecordUrl(projectId)}/ata?${params.toString()}`;
	},
	/** A supplier's ÄTA. `leverantor` is a static segment, matched before `[ataId]`. */
	supplierView: (projectId: string, ataId: string) =>
		`${projectRecordUrl(projectId)}/ata/leverantor/${encodeURIComponent(ataId)}`,
};
