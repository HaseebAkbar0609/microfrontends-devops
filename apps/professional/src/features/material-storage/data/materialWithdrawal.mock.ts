import type { MaterialLinkTarget, MaterialWorkStep } from "../types/materialTransaction.types";

/**
 * What "Ta ut material" can link a withdrawal to, until the Project, Order and
 * Invoice modules offer it. PRJ-2026-0147 and "Innerväggar plan 2" are the Figma
 * example; the invoices are drafts, the only kind that can still take new lines.
 */

export const MOCK_MATERIAL_LINK_TARGETS: MaterialLinkTarget[] = [
	{ id: "prj-2026-0147", type: "project", reference: "PRJ-2026-0147", name: "Renovering Storgatan 12" },
	{ id: "prj-2026-0152", type: "project", reference: "PRJ-2026-0152", name: "Nybyggnation Villa Ekbacken" },
	{ id: "prj-2026-0158", type: "project", reference: "PRJ-2026-0158", name: "Kontorsombyggnad Kungsgatan 8" },
	{ id: "prj-2026-0163", type: "project", reference: "PRJ-2026-0163", name: "Badrumsrenovering Brf Linden" },
	{ id: "ord-2026-0321", type: "order", reference: "ORD-2026-0321", name: "Service elcentral – Brf Solgården" },
	{ id: "ord-2026-0334", type: "order", reference: "ORD-2026-0334", name: "Vattenläcka kök – Andersson" },
	{ id: "ord-2026-0340", type: "order", reference: "ORD-2026-0340", name: "Byte av golvbrunn – Lindqvist" },
	{ id: "fak-2026-0088", type: "invoice", reference: "FAK-2026-0088", name: "Brf Solgården" },
	{ id: "fak-2026-0091", type: "invoice", reference: "FAK-2026-0091", name: "Fastighets AB Norrport" },
	{ id: "fak-2026-0095", type: "invoice", reference: "FAK-2026-0095", name: "Karlsson Bygg & Fastighet" },
];

export const MOCK_MATERIAL_WORK_STEPS: MaterialWorkStep[] = [
	{ id: "ws-0147-1", projectId: "prj-2026-0147", name: "Rivning" },
	{ id: "ws-0147-2", projectId: "prj-2026-0147", name: "Innerväggar plan 1" },
	{ id: "ws-0147-3", projectId: "prj-2026-0147", name: "Innerväggar plan 2" },
	{ id: "ws-0147-4", projectId: "prj-2026-0147", name: "El och belysning" },
	{ id: "ws-0152-1", projectId: "prj-2026-0152", name: "Grund och platta" },
	{ id: "ws-0152-2", projectId: "prj-2026-0152", name: "Stomresning" },
	{ id: "ws-0152-3", projectId: "prj-2026-0152", name: "Isolering och ytskikt" },
	{ id: "ws-0158-1", projectId: "prj-2026-0158", name: "Rumsindelning" },
	{ id: "ws-0158-2", projectId: "prj-2026-0158", name: "Undertak" },
	{ id: "ws-0163-1", projectId: "prj-2026-0163", name: "Rivning" },
	{ id: "ws-0163-2", projectId: "prj-2026-0163", name: "Tätskikt" },
	{ id: "ws-0163-3", projectId: "prj-2026-0163", name: "Rördragning" },
];
