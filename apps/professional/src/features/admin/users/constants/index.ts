
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



export const ACCESS_LABELS: Record<AdminUserAccess, string> = {
	"sys-admin": "Sys-admin",
	admin: "Admin",
	user: "User",
};

