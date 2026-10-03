import { PersonalProcessItem, ProcessChecklistItem } from "../types/personalProcess.types";

export const DEFAULT_CHECKLIST_TEMPLATE: ProcessChecklistItem[] = [
	{
		id: "chk_1",
		title: "Employment contract created",
		isCompleted: true,
		completedDate: "2025-11-05",
	},
	{
		id: "chk_2",
		title: "Contract signed by employee",
		isCompleted: true,
		completedDate: "2025-11-05",
	},
	{
		id: "chk_3",
		title: "Personal details completed",
		isCompleted: true,
		completedDate: "2025-11-05",
	},
	{
		id: "chk_4",
		title: "Bank details collected",
		isCompleted: false,
	},
	{
		id: "chk_5",
		title: "Tax / payroll registration completed",
		isCompleted: false,
	},
	{
		id: "chk_6",
		title: "Work permit / eligibility verified",
		isCompleted: false,
	},
	{
		id: "chk_7",
		title: "Manager assigned",
		isCompleted: false,
	},
];

export const INITIAL_PROCESS_LIST: PersonalProcessItem[] = [
	{
		id: "0101",
		title: "Onboarding - start",
		date: "2026-01-01",
		category: "onboarding",
		status: "active",
		checklist: [
			{ id: "chk_101_1", title: "Employment contract created", isCompleted: true, completedDate: "2025-11-05" },
			{ id: "chk_101_2", title: "Contract signed by employee", isCompleted: true, completedDate: "2025-11-05" },
			{ id: "chk_101_3", title: "Personal details completed", isCompleted: true, completedDate: "2025-11-05" },
			{ id: "chk_101_4", title: "Bank details collected", isCompleted: false },
			{ id: "chk_101_5", title: "Tax / payroll registration completed", isCompleted: false },
			{ id: "chk_101_6", title: "Work permit / eligibility verified", isCompleted: false },
			{ id: "chk_101_7", title: "Manager assigned", isCompleted: false },
		],
		documents: [
			{ id: "doc_101_1", date: "2024-05-10", name: "Arbetsbeskrivning", fileFormat: "PDF", fileSize: "1.2 MB" },
			{ id: "doc_101_2", date: "2024-05-10", name: "Policy", fileFormat: "PDF", fileSize: "850 KB" },
			{ id: "doc_101_3", date: "2024-05-10", name: "Policy", fileFormat: "PDF", fileSize: "920 KB" },
		],
	},
	{
		id: "002",
		title: "Onboarding - First day",
		date: "2026-01-02",
		category: "onboarding",
		status: "active",
		checklist: [
			{ id: "chk_102_1", title: "Welcome package handed out", isCompleted: true, completedDate: "2026-01-02" },
			{ id: "chk_102_2", title: "IT equipment and access cards", isCompleted: true, completedDate: "2026-01-02" },
			{ id: "chk_102_3", title: "Team introduction lunch", isCompleted: true, completedDate: "2026-01-02" },
			{ id: "chk_102_4", title: "Security briefing", isCompleted: false },
		],
		documents: [
			{ id: "doc_102_1", date: "2024-05-10", name: "Introduktionsprogram", fileFormat: "PDF", fileSize: "1.5 MB" },
		],
	},
	{
		id: "003",
		title: "Onboarding - Första månad",
		date: "2026-01-03",
		category: "onboarding",
		status: "active",
		checklist: [
			{ id: "chk_103_1", title: "First 30-day follow-up review", isCompleted: true, completedDate: "2026-01-03" },
			{ id: "chk_103_2", title: "Training modules check-in", isCompleted: false },
			{ id: "chk_103_3", title: "Feedback discussion with manager", isCompleted: false },
		],
		documents: [
			{ id: "doc_103_1", date: "2024-05-10", name: "Uppföljningsprotokoll 30 dagar", fileFormat: "PDF", fileSize: "940 KB" },
		],
	},
];
