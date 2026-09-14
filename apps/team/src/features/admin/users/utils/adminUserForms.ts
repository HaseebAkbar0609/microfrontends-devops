import type { AddUserFormValues } from "@/schemas/admin/addUser.schema";
import type { UserDetailsFormValues } from "@/schemas/admin/userDetails.schema";
import type { AdminUserDetail, CreateAdminUserRequest, UpdateAdminUserRequest } from "../types/adminUsers.types";
import { ADMIN_DEFAULT_LANGUAGE, ADMIN_DEFAULT_LOGOUT, ADMIN_DEFAULT_ROLE, ADMIN_OPTION_NONE, MINUTES_PER_HOUR } from "../constants/adminUsers.constants";

export function nullableOption(value?: string): string | null {
  return !value || value === ADMIN_OPTION_NONE ? null : value.trim() || null;
}

export function parseLogout(value: string): number | null {
  if (!value || value === ADMIN_OPTION_NONE) return null;
  if (!/^\d+(m|h)?$/i.test(value)) return NaN;
  return Number.parseInt(value, 10) * (value.toLowerCase().endsWith("h") ? MINUTES_PER_HOUR : 1);
}

export function normalizeSwedishPhone(value: string): string {
  const compact = value.trim().replace(/[\s()-]/g, "");
  if (compact.startsWith("0046")) return `+46${compact.slice(4)}`;
  if (compact.startsWith("0")) return `+46${compact.slice(1)}`;
  return compact;
}

export function userFormDefaults(user?: AdminUserDetail): AddUserFormValues {
  return {
    userCredentials: user?.user_credentials ?? "",
    password: "", confirmPassword: "",
    firstName: user?.first_name ?? "", lastName: user?.last_name ?? "",
    role: user?.permission_role_id ?? ADMIN_OPTION_NONE,
    accessRole: user?.role ?? ADMIN_DEFAULT_ROLE,
    department: user?.department_id ?? user?.department ?? ADMIN_OPTION_NONE,
    isActive: user ? user.status === "active" : true,
    generateEmailForNewPassword: false,
    personalNumber: user?.personal_id ?? "",
    smsAuthentication: user?.sms_authentication ?? false,
    email: user?.email ?? "", mobileNumber: user?.phone_number ?? "",
    language: user ? user.language_preference ?? ADMIN_OPTION_NONE : ADMIN_DEFAULT_LANGUAGE,
    automaticLogout: user ? (user.auto_logout == null ? ADMIN_OPTION_NONE : `${user.auto_logout}m`) : ADMIN_DEFAULT_LOGOUT,
  };
}

export function profilePayload(values: AddUserFormValues): UpdateAdminUserRequest {
  return {
    first_name: values.firstName.trim(), last_name: values.lastName.trim(),
    email: values.email.trim(), user_credentials: nullableOption(values.userCredentials),
    role: values.accessRole,
    phone_number: values.mobileNumber ? normalizeSwedishPhone(values.mobileNumber) || null : null,
    personal_id: nullableOption(values.personalNumber), language: nullableOption(values.language),
    department: nullableOption(values.department), permission_role_id: nullableOption(values.role),
    sms_authentication: values.smsAuthentication, auto_logout: parseLogout(values.automaticLogout),
  };
}

export function createUserPayload(values: AddUserFormValues): CreateAdminUserRequest {
  return {
    ...profilePayload(values), first_name: values.firstName.trim(), last_name: values.lastName.trim(),
    email: values.email.trim(), password: values.password ?? "", confirm_password: values.confirmPassword ?? "",
    role: values.accessRole, active: values.isActive, send_invitation: values.generateEmailForNewPassword,
  };
}

export function updateUserPayload(values: AddUserFormValues, user: AdminUserDetail): UpdateAdminUserRequest {
  const before = profilePayload(userFormDefaults(user));
  return changedEditablePayload(profilePayload(values), before, user);
}

function changedEditablePayload(after: UpdateAdminUserRequest, before: UpdateAdminUserRequest, user: AdminUserDetail): UpdateAdminUserRequest {
  return Object.fromEntries(Object.entries(after).filter(([key, value]) => {
    const field = key as keyof UpdateAdminUserRequest;
    return user.editable_fields?.includes(field) && JSON.stringify(value) !== JSON.stringify(before[field]);
  }));
}

export function detailsFormDefaults(user: AdminUserDetail): UserDetailsFormValues {
  const profile = userFormDefaults(user);
  return {
    accessRole: user.role, group: profile.department ?? ADMIN_OPTION_NONE,
    role: profile.role, type: user.position_id ?? ADMIN_OPTION_NONE,
    reports: user.module_permissions?.reports ?? false,
    registerImportant: user.module_permissions?.registerImportant ?? false,
    permissions: user.module_permissions ?? {},
  };
}

export function detailsPayload(values: UserDetailsFormValues, user: AdminUserDetail): UpdateAdminUserRequest {
  const permissions = Object.fromEntries(Object.entries(values.permissions ?? {}).filter((entry): entry is [string, boolean] => typeof entry[1] === "boolean"));
  if (values.reports !== (user.module_permissions?.reports ?? false)) permissions.reports = values.reports;
  if (values.registerImportant !== (user.module_permissions?.registerImportant ?? false)) permissions.registerImportant = values.registerImportant;
  return changedEditablePayload({
    role: values.accessRole,
    department: nullableOption(values.group), position_id: nullableOption(values.type),
    permission_role_id: nullableOption(values.role), module_permissions: permissions,
  }, {
    role: user.role, department: user.department_id ?? user.department ?? null,
    position_id: user.position_id ?? null, permission_role_id: user.permission_role_id ?? null,
    module_permissions: user.module_permissions ?? {},
  }, user);
}
