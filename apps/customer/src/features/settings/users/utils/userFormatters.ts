import type { User } from "../types/types";

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
