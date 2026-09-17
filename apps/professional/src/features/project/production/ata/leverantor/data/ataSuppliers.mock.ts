import type { AtaSupplier } from "../types";

/**
 * The subcontractors and suppliers sending each project ÄTAs, in the grouped
 * frame's order. 5000's Pelles Måleri matches the Betalningsplan and Fråga/Svar
 * seeds; 5002 has none, for the empty state.
 */
export const SEEDED_ATA_SUPPLIERS: AtaSupplier[] = [
	{ id: "5001-lev-1", projectId: "5001", name: "Pelle Målare" },
	{ id: "5001-lev-2", projectId: "5001", name: "Rörmokare" },
	{ id: "5001-lev-3", projectId: "5001", name: "Elektriker" },
	{ id: "5001-lev-4", projectId: "5001", name: "Städare" },
	{ id: "5001-lev-5", projectId: "5001", name: "Köksleverantör" },
	{ id: "5001-lev-6", projectId: "5001", name: "Sotare" },
	{ id: "5000-lev-1", projectId: "5000", name: "Pelles Måleri" },
];
