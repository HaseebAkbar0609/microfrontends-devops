export type AdminUserAccess = "sys-admin" | "admin" | "user";
export type AdminUserLicense = "Standard" | "PRO";

export interface LicenseRow {
	id: string;
	license: string;
	purchased: number;
	allocated: number;
	available: number | null;
}

export interface AdminUser {
	id: string;
	name: string;
	personNo: string;
	access: AdminUserAccess;
	license: AdminUserLicense;
	addons: string;
	group: string;
	role: string;
	type: string;
}

export const LICENSE_ROWS: LicenseRow[] = [
	{
		id: "start",
		license: "Start",
		purchased: 1,
		allocated: 1,
		available: null,
	},
	{
		id: "standard",
		license: "Standard",
		purchased: 10,
		allocated: 6,
		available: 4,
	},
	{ id: "pro", license: "PRO", purchased: 5, allocated: 3, available: 2 },
	{
		id: "timeflow-work",
		license: "Timeflow work",
		purchased: 10,
		allocated: 7,
		available: 3,
	},
	{ id: "drive", license: "Drive", purchased: 5, allocated: 4, available: 1 },
	{
		id: "rutplan",
		license: "Rutplan",
		purchased: 1,
		allocated: 1,
		available: 0,
	},
];

export const DUMMY_ADMIN_USERS: AdminUser[] = [
	{
		id: "1",
		name: "Kalle Andersson",
		personNo: "710405-1010",
		access: "sys-admin",
		license: "Standard",
		addons: "Drive, Metric",
		group: "Ekonomi",
		role: "Manager",
		type: "VD",
	},
	{
		id: "2",
		name: "Sten Svensson",
		personNo: "710405-1011",
		access: "admin",
		license: "PRO",
		addons: "Rut-plan",
		group: "Service",
		role: "Manager",
		type: "Arbetschef",
	},
	{
		id: "3",
		name: "Sture Larsson",
		personNo: "710405-1012",
		access: "user",
		license: "PRO",
		addons: "",
		group: "Overhead",
		role: "Projektledare",
		type: "Platschef",
	},
	{
		id: "4",
		name: "Stina Jonasson",
		personNo: "710405-1013",
		access: "admin",
		license: "Standard",
		addons: "Drive",
		group: "Entreprenad",
		role: "Ekonomi",
		type: "Ekonom",
	},
	{
		id: "5",
		name: "Petra Karlsson",
		personNo: "710405-1014",
		access: "user",
		license: "PRO",
		addons: "Drive",
		group: "Kalkyl",
		role: "Service",
		type: "Snickare",
	},
	{
		id: "6",
		name: "Uran Lindqvist",
		personNo: "710405-1015",
		access: "user",
		license: "Standard",
		addons: "Drive",
		group: "Inköp",
		role: "Service",
		type: "Snickare",
	},
];

export const ACCESS_LABELS: Record<AdminUserAccess, string> = {
	"sys-admin": "Sys-admin",
	admin: "Admin",
	user: "User",
};

// ─── User settings (overview) page — static data until the APIs are ready ────

export interface SettingsUser {
	id: string;
	name: string;
	handle: string;
}

export const SETTINGS_USERS: SettingsUser[] = [
	{ id: "rachel", name: "Rachel Meyers", handle: "@rachel" },
	{ id: "kalle", name: "Kalle Andersson", handle: "@kalle" },
	{ id: "sten", name: "Sten Svensson", handle: "@sten" },
	{ id: "stina", name: "Stina Jonasson", handle: "@stina" },
];

export const USER_GROUP_OPTIONS = [
	"Ekonomi",
	"Service",
	"Overhead",
	"Entreprenad",
	"Kalkyl",
	"Inköp",
];

export const USER_ROLE_OPTIONS = [
	"Manager",
	"Ekonomi",
	"Service",
	"Projektledare",
];

export const USER_TYPE_OPTIONS = [
	"Arbetschef",
	"VD",
	"Platschef",
	"Ekonom",
	"Snickare",
];

export interface ProgramModule {
	id: string;
	name: string;
	checked: boolean;
}

export interface ProgramGroup {
	id: string;
	title: string;
	modules: ProgramModule[];
}

export const PROGRAM_GROUPS: ProgramGroup[] = [
	{
		id: "start",
		title: "Start",
		modules: [
			{ id: "faktura", name: "Faktura", checked: false },
			{ id: "prognos", name: "Prognos", checked: true },
			{ id: "personal", name: "Personal", checked: false },
			{ id: "inkasso", name: "Inkasso", checked: true },
			{ id: "juridik", name: "Juridik", checked: true },
		],
	},
	{
		id: "standard",
		title: "Standard",
		modules: [
			{ id: "order", name: "Order", checked: false },
			{ id: "projekt", name: "Projekt", checked: true },
			{ id: "inkop", name: "Inköp", checked: false },
			{ id: "kma", name: "KMA", checked: true },
			{ id: "maskin-fordon", name: "Maskin-Fordon", checked: true },
			{ id: "projektering", name: "Projektering", checked: false },
		],
	},
	{
		id: "pro",
		title: "Pro",
		modules: [
			{ id: "offert", name: "Offert", checked: true },
			{ id: "b2b", name: "B2B", checked: false },
			{ id: "kalkyl", name: "Kalkyl", checked: true },
			{ id: "avtal", name: "Avtal", checked: true },
			{ id: "mallar", name: "Mallar", checked: false },
			{ id: "marknad-salj", name: "Marknad-Sälj", checked: true },
			{ id: "data-it", name: "Data-IT", checked: true },
			{ id: "ledningsstod", name: "Ledningsstöd", checked: true },
		],
	},
];

export function addDummyAdminUser(user: Omit<AdminUser, "id">) {
	DUMMY_ADMIN_USERS.push({
		...user,
		id: String(DUMMY_ADMIN_USERS.length + 1),
	});
}
