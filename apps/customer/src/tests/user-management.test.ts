import assert from "node:assert/strict";

import {
	DEFAULT_USER_PERMISSIONS,
	DUMMY_USERS,
	USER_PERMISSION_OPTIONS,
	USERS_COLUMNS,
} from "@/features/settings/users/constants";
import { createUserProfileSchema } from "@/features/settings/users/schemas/userProfile.schema";
import type { User } from "@/features/settings/users/types/types";
import {
	getSortedUsers,
	getUserManagementActions,
	getUserProfileActions,
	isPersonalNumberValid,
	isSwedishPhoneNumberValid,
	maskPersonalNumber,
} from "@/features/settings/users/utils/userFormatters";
import localizationConstants from "@/utils/translation/constants";
import { en } from "@/utils/translation/en";
import { sv } from "@/utils/translation/sv";

const validationMessages = {
	firstNameRequired: "First name is required",
	lastNameRequired: "Last name is required",
	mobileNumberRequired: "Mobile number is required",
	mobileNumberInvalid: "Enter a valid Swedish phone number",
	privateEmailInvalid: "Valid email is required",
	addressRequired: "Address is required",
	cityRequired: "City is required",
	postalCodeRequired: "Postal code is required",
	personalNumberFormat: "Use format YYYYMMDD-XXXX",
};

const userSchema = createUserProfileSchema(validationMessages);
const tests: Array<{ name: string; run: () => void }> = [];

function test(name: string, run: () => void) {
	tests.push({ name, run });
}

function toFormValues(user: User) {
	return {
		first_name: user.first_name,
		last_name: user.last_name,
		mobile_number: user.mobile_number,
		private_email: user.private_email,
		address: user.address,
		city: user.city,
		postal_code: user.postal_code,
		personal_number: user.personal_number,
		profile_photo: null,
		permissions: user.permissions,
	};
}

test("mock users satisfy the user management form contract", () => {
	assert.equal(DUMMY_USERS.length > 0, true);

	for (const user of DUMMY_USERS) {
		assert.doesNotThrow(() => userSchema.parse(toFormValues(user)));
		assert.equal(Boolean(user.id), true);
		assert.match(user.last_login, /^\d{4}-\d{2}-\d{2}T/);
		assert.ok(["admin", "users"].includes(user.account_type));
		assert.ok(["active", "deactivated"].includes(user.status));
	}
});

test("same validation works for API-shaped user data", () => {
	const apiUser: User = {
		id: "api-1",
		first_name: "Lars",
		last_name: "Andersson",
		mobile_number: "+46701234567",
		private_email: "lars.andersson@example.com",
		address: "Stengatan 10",
		city: "Solna",
		postal_code: "171 63",
		personal_number: "19720223-0000",
		date_created: "2026-02-01",
		account_type: "users",
		last_login: "2026-05-30T08:00:00Z",
		status: "active",
		permissions: {
			viewProjects: true,
			createProjects: true,
			editProjects: false,
			viewOffers: true,
			approveOffers: false,
			manageUsers: false,
		},
	};

	assert.doesNotThrow(() => userSchema.parse(toFormValues(apiUser)));
	assert.deepEqual(getUserManagementActions(apiUser), {
		canEdit: true,
		canActivate: false,
		canDeactivate: true,
	});
});

test("frontend validation rejects invalid email, phone, and personal number values", () => {
	const validUser = toFormValues(DUMMY_USERS[0]);

	assert.equal(
		userSchema.safeParse({ ...validUser, private_email: "invalid-email" }).success,
		false,
	);
	assert.equal(
		userSchema.safeParse({ ...validUser, mobile_number: "555-123-9999" }).success,
		false,
	);
	assert.equal(
		userSchema.safeParse({ ...validUser, personal_number: "199001011234" }).success,
		false,
	);
});

test("Swedish phone and personal number helpers support the required formats", () => {
	assert.equal(isSwedishPhoneNumberValid("070-123 45 67"), true);
	assert.equal(isSwedishPhoneNumberValid("0701234567"), true);
	assert.equal(isSwedishPhoneNumberValid("+46701234567"), true);
	assert.equal(isSwedishPhoneNumberValid("0046701234567"), true);
	assert.equal(isSwedishPhoneNumberValid("+15551234567"), false);

	assert.equal(isPersonalNumberValid("19900101-1234"), true);
	assert.equal(isPersonalNumberValid("199001011234"), false);
	assert.equal(maskPersonalNumber("19900101-1234"), "19900101-XXXX");
});

test("admin users can be edited but cannot be deactivated or activated from the list", () => {
	const adminUser = DUMMY_USERS.find((user) => user.account_type === "admin");
	assert.ok(adminUser);

	assert.deepEqual(getUserManagementActions(adminUser), {
		canEdit: true,
		canActivate: false,
		canDeactivate: false,
	});
});

test("non-admin users expose deactivate or activate based on status", () => {
	const activeUser = DUMMY_USERS.find(
		(user) => user.account_type === "users" && user.status === "active",
	);
	const deactivatedUser = DUMMY_USERS.find(
		(user) => user.account_type === "users" && user.status === "deactivated",
	);

	assert.ok(activeUser);
	assert.ok(deactivatedUser);
	assert.deepEqual(getUserManagementActions(activeUser), {
		canEdit: true,
		canActivate: false,
		canDeactivate: true,
	});
	assert.deepEqual(getUserManagementActions(deactivatedUser), {
		canEdit: true,
		canActivate: true,
		canDeactivate: false,
	});
});

test("detail page delete action is available for other users only", () => {
	assert.deepEqual(
		getUserProfileActions({
			mode: "edit",
			isOwnProfile: false,
			readOnly: false,
		}),
		{ canDeleteUser: true },
	);

	assert.deepEqual(
		getUserProfileActions({
			mode: "edit",
			isOwnProfile: true,
			readOnly: false,
		}),
		{ canDeleteUser: false },
	);

	assert.deepEqual(
		getUserProfileActions({
			mode: "create",
			isOwnProfile: false,
			readOnly: false,
		}),
		{ canDeleteUser: false },
	);

	assert.deepEqual(
		getUserProfileActions({
			mode: "edit",
			isOwnProfile: false,
			readOnly: true,
		}),
		{ canDeleteUser: false },
	);
});

test("frontend sorting orders mock or API user data by selected column", () => {
	assert.deepEqual(
		getSortedUsers(DUMMY_USERS, "first_name", "asc").map((user) => user.first_name),
		["David", "Emily", "Jane", "John", "Michael"],
	);

	assert.deepEqual(
		getSortedUsers(DUMMY_USERS, "first_name", "desc").map((user) => user.first_name),
		["Michael", "John", "Jane", "Emily", "David"],
	);

	assert.deepEqual(
		getSortedUsers(DUMMY_USERS, "date_created", "asc").map((user) => user.id),
		["1", "2", "3", "4", "5"],
	);

	assert.deepEqual(
		getSortedUsers(DUMMY_USERS, "last_login", "desc").map((user) => user.id),
		["2", "1", "5", "3", "4"],
	);

	assert.deepEqual(
		getSortedUsers(DUMMY_USERS, "actions", "asc").map((user) => user.id),
		DUMMY_USERS.map((user) => user.id),
	);
});

test("list columns and permission labels stay aligned with the approved Figma copy", () => {
	assert.deepEqual(
		USERS_COLUMNS.map((column) => column.label),
		[
			localizationConstants.displayName,
			localizationConstants.dateCreated,
			localizationConstants.accountType,
			localizationConstants.lastLogin,
			localizationConstants.status,
			localizationConstants.actions,
		],
	);

	assert.deepEqual(
		USER_PERMISSION_OPTIONS.map((permission) => permission.label),
		[
			localizationConstants.userFormPermissionViewProjects,
			localizationConstants.userFormPermissionViewOffers,
			localizationConstants.userFormPermissionCreateProjects,
			localizationConstants.userFormPermissionEditProjects,
			localizationConstants.userFormPermissionApproveOffers,
			localizationConstants.userFormPermissionManageUsers,
		],
	);

	assert.deepEqual(
		USER_PERMISSION_OPTIONS.map((permission) => en[permission.label]),
		[
			"System",
			"Create quote request",
			"Create project",
			"Delete project",
			"Change project",
			"Archive",
		],
	);

	assert.deepEqual(
		USER_PERMISSION_OPTIONS.map((permission) => sv[permission.label]),
		[
			"System",
			"Skapa Offert förfrågan",
			"Skapa projekt",
			"Radera projekt",
			"Ändra i projekt",
			"Arkivera",
		],
	);
});

test("profile field labels stay aligned with the approved Figma copy", () => {
	const labelKeys = [
		localizationConstants.userFormProfileTab,
		localizationConstants.userFormUserDetailsTitle,
		localizationConstants.userFormFirstNameLabel,
		localizationConstants.userFormLastNameLabel,
		localizationConstants.userFormMobileNumberLabel,
		localizationConstants.userFormPrivateEmailLabel,
		localizationConstants.userFormAddressLabel,
		localizationConstants.userFormCityLabel,
		localizationConstants.userFormPostalCodeLabel,
		localizationConstants.userFormPersonalNumberLabel,
	];

	assert.deepEqual(
		labelKeys.map((key) => sv[key]),
		[
			"Overview",
			"User detaljer",
			"Förnamn",
			"Efternamn",
			"Mobile nr",
			"Mail privat",
			"Adress",
			"Ort",
			"Post nr",
			"Personnummer",
		],
	);
});

test("default permissions keep new mocked or API users restricted until changed", () => {
	assert.deepEqual(DEFAULT_USER_PERMISSIONS, {
		viewProjects: false,
		createProjects: false,
		editProjects: false,
		viewOffers: false,
		approveOffers: false,
		manageUsers: false,
	});
});

let failed = 0;

for (const { name, run } of tests) {
	try {
		run();
		console.log(`PASS ${name}`);
	} catch (error) {
		failed += 1;
		console.error(`FAIL ${name}`);
		console.error(error);
	}
}

if (failed > 0) {
	process.exitCode = 1;
} else {
	console.log(`All ${tests.length} user management tests passed.`);
}
