import type { CustomerUserData } from "@/api-actions/users";
import type { User } from "../types/types";
import { DEFAULT_USER_PERMISSIONS } from "../constants";

function formatApiDate(rawDate?: number | string | null): string {
	if (!rawDate) return new Date().toISOString().split("T")[0];
	try {
		let d: Date;
		if (typeof rawDate === "number") {
			d = new Date(rawDate > 1e11 ? rawDate : rawDate * 1000);
		} else {
			d = new Date(rawDate);
		}
		if (isNaN(d.getTime())) return new Date().toISOString().split("T")[0];
		return d.toISOString().split("T")[0];
	} catch {
		return new Date().toISOString().split("T")[0];
	}
}

export function mapApiUserToUser(apiUser: CustomerUserData): User {
	const createdAtFormatted = formatApiDate(apiUser.created_at);

	return {
		id: apiUser.id,
		first_name: apiUser.first_name || "",
		last_name: apiUser.last_name || "",
		mobile_number: apiUser.phone_number || "",
		private_email: apiUser.email || "",
		address: apiUser.address || "",
		city: apiUser.city_name || "",
		city_id: apiUser.city_id || null,
		country_id: apiUser.country_id || null,
		postal_code: apiUser.postal_code || "",
		personal_number: apiUser.personal_id || "",
		profile_photo: apiUser.profile_picture_url || null,
		date_created: createdAtFormatted,
		account_type:
			!apiUser.created_by ||
			apiUser.user_type === "admin" ||
			apiUser.user_type === "owner"
				? "admin"
				: "users",
		last_login: createdAtFormatted,
		status:
			apiUser.status === "inactive" || apiUser.status === "deactivated"
				? "deactivated"
				: "active",
		permissions: {
			...DEFAULT_USER_PERMISSIONS,
			...(apiUser.permissions || {}),
		},
		created_by: apiUser.created_by || null,
	};
}

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
