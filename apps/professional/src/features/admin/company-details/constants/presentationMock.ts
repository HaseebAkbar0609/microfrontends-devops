export interface TeamMemberOption {
	id: string;
	role: string;
	name: string;
	handle: string;
}

export const TEAM_MEMBER_OPTIONS: TeamMemberOption[] = [
	{ id: "tm-1", role: "VD", name: "Rachel Meyers", handle: "@rachel" },
	{ id: "tm-2", role: "CEO", name: "Rachel Meyers", handle: "@rachel" },
	{ id: "tm-3", role: "Staff", name: "Rachel Meyers", handle: "@rachel" },
	{ id: "tm-4", role: "PM", name: "Rachel Meyers", handle: "@rachel" },
];

export const DEFAULT_SELECTED_TEAM_IDS = ["tm-1", "tm-2", "tm-3", "tm-4"];

export const PRESENTATION_ALLOWED_TYPES = [
	".ppt",
	".pptx",
	".doc",
	".docx",
	".pdf",
];
