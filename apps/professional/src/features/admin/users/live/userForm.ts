import type { AdminUser } from "./api";
import { NAME_MAX_LENGTH, TEXT_MAX_LENGTH, PASSWORD_MIN_LENGTH, PASSWORD_MAX_BYTES, LOGOUT_MIN_MINUTES, LOGOUT_MAX_MINUTES } from "./admin.constants";

export const TEXT_FIELDS = ["first_name", "last_name", "email", "phone_number", "personal_id", "user_credentials"] as const;
export type UserValues = Record<typeof TEXT_FIELDS[number], string> & {
  password: string; confirm_password: string; role: string; language: string;
  auto_logout: string; active: boolean; sms_authentication: boolean; send_invitation: boolean;
};
export function defaults(user?: AdminUser): UserValues {
  return { first_name: user?.first_name ?? "", last_name: user?.last_name ?? "", email: user?.email ?? "",
    phone_number: user?.phone_number ?? "", personal_id: user?.personal_id ?? "", user_credentials: user?.user_credentials ?? "",
    role: user?.role ?? "worker", language: user?.language_preference ?? "sv", auto_logout: user?.auto_logout?.toString() ?? "",
    active: user ? user.status === "active" : true, sms_authentication: user?.sms_authentication ?? false,
    send_invitation: true, password: "", confirm_password: "" };
}
export function validateUser(values: UserValues, user?: AdminUser): Record<string, string> {
  const errors: Record<string, string> = {};
  const editable = (key: string) => !user || user.editable_fields.includes(key);
  for (const key of ["first_name", "last_name"] as const) {
    if (editable(key) && (!values[key].trim() || values[key].trim().length > NAME_MAX_LENGTH || /[\u0000-\u001f]/.test(values[key]))) errors[key] = "proAdminRequired";
  }
  if (editable("email") && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()) || values.email.trim().length > TEXT_MAX_LENGTH)) errors.email = "proAdminBadEmail";
  if (editable("phone_number") && values.phone_number && !/^\+[1-9][0-9]{6,14}$/.test(values.phone_number.replace(/[ ()-]/g, ""))) errors.phone_number = "proAdminBadPhone";
  if (!user && (values.password.length < PASSWORD_MIN_LENGTH || new TextEncoder().encode(values.password).length > PASSWORD_MAX_BYTES || values.password !== values.confirm_password)) errors.confirm_password = "proAdminBadPassword";
  if (editable("auto_logout") && values.auto_logout && (!Number.isInteger(Number(values.auto_logout)) || Number(values.auto_logout) < LOGOUT_MIN_MINUTES || Number(values.auto_logout) > LOGOUT_MAX_MINUTES)) errors.auto_logout = "proAdminInvalid";
  for (const key of ["personal_id", "user_credentials"] as const) {
    if (editable(key) && (values[key].length > TEXT_MAX_LENGTH || /[\u0000-\u001f]/.test(values[key]))) errors[key] = "proAdminInvalid";
  }
  return errors;
}
export function userPayload(values: UserValues, related: Record<string, unknown>, user?: AdminUser) {
  const data: Record<string, unknown> = { ...values, ...related, email: values.email.trim().toLowerCase(),
    first_name: values.first_name.trim(), last_name: values.last_name.trim(), auto_logout: values.auto_logout ? Number(values.auto_logout) : null };
  for (const key of ["phone_number", "personal_id", "user_credentials"]) if (!data[key]) data[key] = null;
  if (!user) return data;
  const original: Record<string, unknown> = { ...defaults(user), department: user.department_id ?? null,
    position_id: user.position_id ?? null, permission_role_id: user.permission_role_id ?? null,
    group_ids: user.groups.map(g => g.id), module_permissions: user.module_permissions ?? {} };
  original.auto_logout = user.auto_logout ?? null;
  for (const key of ["phone_number", "personal_id", "user_credentials"]) if (!original[key]) original[key] = null;
  return Object.fromEntries(Object.entries(data).filter(([key, value]) => user.editable_fields.includes(key) && JSON.stringify(value) !== JSON.stringify(original[key])));
}
