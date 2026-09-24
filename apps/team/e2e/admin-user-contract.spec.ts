import { test, expect } from "@playwright/test";
import { userFormDefaults, updateUserPayload, createUserPayload, detailsFormDefaults, detailsPayload, parseLogout } from "../src/features/admin/users/utils/adminUserForms";
import { allowedUserActions } from "../src/features/admin/users/utils/adminUserTable";
import { getAddUserSchema } from "../src/schemas/admin/addUser.schema";
import type { AdminUserDetail } from "../src/features/admin/users/types/adminUsers.types";

const user: AdminUserDetail = {
  id: "test-user", first_name: "QA", last_name: "Owner", display_name: "QA Owner",
  email: "qa@example.com", role: "owner", status: "active", sms_authentication: true,
  auto_logout: 240, language_preference: "sv", phone_number: "+46701234567",
  department_id: "00000000-0000-4000-8000-000000000001",
  permission_role_id: "00000000-0000-4000-8000-000000000002",
  available_actions: ["edit", "deactivate"], allowed_roles: ["owner", "manage", "worker"],
  editable_fields: ["first_name", "last_name", "email", "phone_number", "department", "role", "permission_role_id", "auto_logout", "sms_authentication", "module_permissions"],
  module_permissions: { reports: true },
};

test("unchanged edit preserves owner, department and system settings", () => {
  const values = userFormDefaults(user);
  expect(values.accessRole).toBe("owner");
  expect(values.smsAuthentication).toBe(true);
  expect(parseLogout(values.automaticLogout)).toBe(240);
  expect(updateUserPayload(values, user)).toEqual({});
});

test("clearing phone sends null, without resetting role or email", () => {
  expect(updateUserPayload({ ...userFormDefaults(user), mobileNumber: "" }, user)).toEqual({ phone_number: null });
});

test("server-owned editable fields limit the PATCH", () => {
  const readonly = { ...user, editable_fields: [] };
  expect(updateUserPayload({ ...userFormDefaults(user), email: "other@example.com", accessRole: "worker" }, readonly)).toEqual({});
});

test("details permission change remains one atomic payload", () => {
  const values = detailsFormDefaults(user);
  expect(detailsPayload(values, user)).toEqual({});
  expect(detailsPayload({ ...values, reports: false }, user)).toEqual({ module_permissions: { reports: false } });
});

for (const [name, patch] of [
  ["blank name", { firstName: "   " }],
  ["invalid email", { email: "not-email" }],
  ["invalid phone", { mobileNumber: "not-phone" }],
  ["short password", { password: "short", confirmPassword: "short" }],
  ["mismatched password", { confirmPassword: "different123" }],
  ["bcrypt byte limit", { password: "\u00e4".repeat(40), confirmPassword: "\u00e4".repeat(40) }],
  ["logout bound", { automaticLogout: "1441m" }],
] as const) {
  test(`form rejects ${name}`, () => {
    const values = { ...userFormDefaults(user), password: "LocalPassword123", confirmPassword: "LocalPassword123", ...patch };
    expect(getAddUserSchema().safeParse(values).success).toBe(false);
  });
}

test("valid creation preserves role and normalizes Swedish phone", () => {
  const values = { ...userFormDefaults(user), password: "LocalPassword123", confirmPassword: "LocalPassword123", mobileNumber: "070 123 45 67" };
  expect(getAddUserSchema().safeParse(values).success).toBe(true);
  expect(createUserPayload(values)).toMatchObject({ role: "owner", phone_number: "+46701234567", auto_logout: 240 });
});

test("lifecycle and server actions both gate available commands", () => {
  expect(allowedUserActions({ status: "active", available_actions: ["edit", "resend", "deactivate"] })).toEqual(["edit", "deactivate"]);
  expect(allowedUserActions({ status: "pending", available_actions: ["resend", "activate"] })).toEqual(["resend"]);
});
