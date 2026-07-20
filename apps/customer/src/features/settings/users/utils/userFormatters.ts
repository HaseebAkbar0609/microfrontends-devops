import type { User } from "../types/types";

export type UserSortField =
	| "first_name"
	| "date_created"
	| "account_type"
	| "last_login"
	| "status";

export type UserSortOrder = "asc" | "desc";

export function maskPersonalNumber(value: string) {
	if (!value) return "";
	return value.replace(/\d{4}$/, "XXXX");
}

export function isPersonalNumberValid(value: string) {
	return /^\d{8}-\d{4}$/.test(value);
}

export function isSwedishPhoneNumberValid(value: string) {
	const normalized = value.replace(/[\s()-]/g, "");
	return /^(?:\+46|0046|0)[1-9]\d{6,9}$/.test(normalized);
}

export function getUserManagementActions(user: User) {
	const isAdminUser = user.account_type === "admin";

	return {
		canEdit: true,
		canActivate: !isAdminUser && user.status === "deactivated",
		canDeactivate: !isAdminUser && user.status === "active",
	};
}

export function getUserProfileActions({
	mode,
	isOwnProfile,
	readOnly,
}: {
	mode: "create" | "edit";
	isOwnProfile: boolean;
	readOnly: boolean;
}) {
	return {
		canDeleteUser: mode === "edit" && !isOwnProfile && !readOnly,
	};
}

function getSortValue(user: User, field: UserSortField) {
	if (field === "first_name") {
		return `${user.first_name} ${user.last_name}`.toLocaleLowerCase();
	}

	if (field === "date_created" || field === "last_login") {
		return new Date(user[field]).getTime();
	}

	return user[field].toLocaleLowerCase();
}

export function getSortedUsers(
	users: User[],
	sortBy: string,
	sortOrder: string,
) {
	const sortableFields: UserSortField[] = [
		"first_name",
		"date_created",
		"account_type",
		"last_login",
		"status",
	];

	if (
		!sortableFields.includes(sortBy as UserSortField) ||
		(sortOrder !== "asc" && sortOrder !== "desc")
	) {
		return users;
	}

	const field = sortBy as UserSortField;
	const direction = sortOrder as UserSortOrder;

	return [...users].sort((left, right) => {
		const leftValue = getSortValue(left, field);
		const rightValue = getSortValue(right, field);

		if (leftValue < rightValue) return direction === "asc" ? -1 : 1;
		if (leftValue > rightValue) return direction === "asc" ? 1 : -1;
		return 0;
	});
}

function parseSafeDate(val?: number | string | null): string {
	if (!val) return new Date().toISOString().split("T")[0];
	if (typeof val === "number") {
		return new Date(val * 1000).toISOString().split("T")[0];
	}
	try {
		return new Date(val).toISOString().split("T")[0];
	} catch {
		return new Date().toISOString().split("T")[0];
	}
}

export function mapApiUserToUser(p: {
	id: string;
	email: string;
	first_name?: string | null;
	last_name?: string | null;
	status?: string | null;
	phone_number?: string | null;
	postal_code?: string | null;
	address?: string | null;
	city_id?: string | null;
	city_name?: string | null;
	country_id?: string | null;
	personal_id?: string | null;
	profile_picture_url?: string | null;
	created_at?: number | string | null;
	created_by?: string | null;
	permissions?: {
		viewProjects?: boolean;
		createProjects?: boolean;
		editProjects?: boolean;
		viewOffers?: boolean;
		approveOffers?: boolean;
		manageUsers?: boolean;
	} | null;
}, fallbackId?: string): User {
	return {
		id: p.id ?? fallbackId ?? "",
		first_name: p.first_name ?? "",
		last_name: p.last_name ?? "",
		profile_photo: p.profile_picture_url ?? null,
		mobile_number: p.phone_number ?? "",
		private_email: p.email ?? "",
		address: p.address ?? "",
		city: p.city_name ?? p.city_id ?? "",
		city_id: p.city_id ?? null,
		country_id: p.country_id || "8d3b611b-6609-4302-b35c-9e42df7e8edb",
		postal_code: p.postal_code ?? "",
		personal_number: p.personal_id ?? "",
		date_created: parseSafeDate(p.created_at),
		account_type: p.created_by ? "users" : "admin",
		last_login: "",
		status: p.status === "inactive" || p.status === "deactivated" ? "deactivated" : "active",
		permissions: {
			viewProjects: p.permissions?.viewProjects ?? false,
			createProjects: p.permissions?.createProjects ?? false,
			editProjects: p.permissions?.editProjects ?? false,
			viewOffers: p.permissions?.viewOffers ?? false,
			approveOffers: p.permissions?.approveOffers ?? false,
			manageUsers: p.permissions?.manageUsers ?? false,
		},
		created_by: p.created_by,
	};
}

