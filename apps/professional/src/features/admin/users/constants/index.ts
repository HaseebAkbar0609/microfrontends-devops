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
