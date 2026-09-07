import localizationConstants from "@/utils/translation/constants";
import type { SupportAgent } from "../types";

/**
 * Seed roster until the API lands. Only `useSupportTickets` and the agent
 * hooks read this file, so swapping in a query later is a one-file change.
 * Agent names are record content, not UI copy; the role is a translation key.
 */
export const SUPPORT_AGENTS_SEED: SupportAgent[] = [
	{ id: "a1", name: "Anna Lindqvist", country: "Sverige", line: "first", online: true, activeTickets: 6, roleKey: localizationConstants.supportRoleLead },
	{ id: "a2", name: "Marcus Ek", country: "Sverige", line: "first", online: true, activeTickets: 4, roleKey: localizationConstants.supportRoleAgent },
	{ id: "a3", name: "Ingrid Dahl", country: "Norge", line: "first", online: true, activeTickets: 3, roleKey: localizationConstants.supportRoleAgent },
	{ id: "a4", name: "Mikko Virtanen", country: "Finland", line: "first", online: false, activeTickets: 0, roleKey: localizationConstants.supportRoleAgent },
	{ id: "a5", name: "Sofie Jensen", country: "Danmark", line: "first", online: true, activeTickets: 2, roleKey: localizationConstants.supportRoleAgent },
	{ id: "a6", name: "David Rehn", country: "Global", line: "second", online: true, activeTickets: 5, roleKey: localizationConstants.supportRoleSpecialist },
	{ id: "a7", name: "Priya Nair", country: "Global", line: "second", online: true, activeTickets: 3, roleKey: localizationConstants.supportRoleSpecialist },
	{ id: "a8", name: "Johan Berg", country: "Global", line: "second", online: false, activeTickets: 0, roleKey: localizationConstants.supportRoleArchitect },
];
