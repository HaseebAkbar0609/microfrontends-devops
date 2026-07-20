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
