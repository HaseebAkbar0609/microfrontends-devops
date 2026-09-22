import { mockDate } from "@/features/project/constants/mockData";
import type { ProjectQuestion } from "@/features/project/production/fraga-svar/types";

/** The frame's "12 augusti", as an offset from the frozen mock date. */
const FRAME_DAY = 19;

/**
 * Questions on each design projekt's Fråga/Svar board.
 *
 * 6001 follows the frame: two in New, one in Opened, two answered, one
 * archived. Dates come from `mockDate` — deterministic, never `new Date()`.
 */
export const SEEDED_DESIGN_QUESTIONS: ProjectQuestion[] = [
	{
		id: "qa-design-6001-1",
		projectId: "6001",
		sender: "Kalle Svensson",
		company: "Pelles Måleri",
		badge: "UE",
		message: "Hej, undrar om ni skickar över kontrollplan",
		date: mockDate(FRAME_DAY),
		status: "new",
		archived: false,
		type: "project",
		function: "construction",
	},
	{
		id: "qa-design-6001-2",
		projectId: "6001",
		sender: "Kalle Svensson",
		company: "Pelles Måleri",
		badge: "Fråga",
		message: "Vilken ritning gäller för entrén?",
		date: mockDate(FRAME_DAY),
		status: "new",
		archived: false,
		type: "project",
		function: "painting",
	},
	{
		id: "qa-design-6001-3",
		projectId: "6001",
		sender: "Anna Lind",
		company: "Fastighetsbolaget",
		badge: "Beställare",
		message: "Kan ni bekräfta startdatumet för projekteringen?",
		date: mockDate(FRAME_DAY - 1),
		status: "opened",
		archived: false,
		type: "project",
		function: "construction",
	},
	{
		id: "qa-design-6001-4",
		projectId: "6001",
		sender: "Anna Lind",
		company: "Fastighetsbolaget",
		badge: "Fråga",
		message: "Har ni uppdaterat konstruktionsritningarna?",
		date: mockDate(FRAME_DAY - 2),
		status: "answered",
		archived: false,
		type: "project",
		function: "construction",
		answerUser: "Stefan Eriksson",
		answerText: "Ja, de är uppladdade under Handlingar.",
		answerDate: mockDate(FRAME_DAY - 2),
	},
	{
		id: "qa-design-6001-5",
		projectId: "6001",
		sender: "Kalle Svensson",
		company: "Pelles Måleri",
		badge: "Beställare",
		message: "Vilket VVS-system är valt för projektet?",
		date: mockDate(FRAME_DAY - 3),
		status: "answered",
		archived: false,
		type: "project",
		function: "plumbing",
		answerUser: "Stefan Eriksson",
		answerText: "Databladet ligger under Handlingar.",
		answerDate: mockDate(FRAME_DAY - 2),
	},
	{
		id: "qa-design-6001-6",
		projectId: "6001",
		sender: "Lars Nilsson",
		company: "Rörläggarna AB",
		badge: "Supplier",
		message: "Gäller samma leveransadress för VVS-materialet?",
		date: mockDate(FRAME_DAY - 14),
		status: "answered",
		archived: true,
		type: "order",
		function: "plumbing",
		answerUser: "Stefan Eriksson",
		answerText: "Ja, ingen ändring.",
		answerDate: mockDate(FRAME_DAY - 13),
	},
];
