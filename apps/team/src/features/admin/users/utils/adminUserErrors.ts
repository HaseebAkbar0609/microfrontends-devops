import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import localizationConstants from "@/utils/translation/constants";

const profileFields = {
  first_name: "firstName", last_name: "lastName", email: "email", password: "password",
  confirm_password: "confirmPassword", phone_number: "mobileNumber", personal_id: "personalNumber",
  user_credentials: "userCredentials", department: "department", permission_role_id: "role",
  sms_authentication: "smsAuthentication", auto_logout: "automaticLogout", language: "language",
  role: "accessRole",
} as const;
const detailFields = { role: "accessRole", department: "group", permission_role_id: "role", position_id: "type", module_permissions: "permissions" } as const;

function record(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null ? value as Record<string, unknown> : {};
}

export function adminErrorBody(error: unknown) {
  return record(record(record(error).response).data);
}

export function adminErrorMessage(error: unknown): string {
  const body = adminErrorBody(error);
  const code = String(body.message ?? "");
  if (/EMAIL.*(RESTRICT|PROTECT|SELF_SERVICE)|CANNOT.*EMAIL/.test(code)) return localizationConstants.adminEmailRestricted;
  if (/PROFILE.*(RESTRICT|PROTECT)|GLOBAL.*(PROFILE|IDENTITY)/.test(code)) return localizationConstants.adminProfileRestricted;
  if (/ALREADY.*(EXIST|MEMBER)|EMAIL.*(EXIST|USE)|EXISTING_USER/.test(code)) return localizationConstants.adminEmailConflict;
  if (/VALIDATION/.test(code)) return localizationConstants.adminValidationFailed;
  if (/FORBIDDEN|PERMISSION|OWNER|HIERARCHY|SELF_/.test(code)) return localizationConstants.adminReadOnly;
  return localizationConstants.adminActionError;
}

export function adminFieldErrors(error: unknown): Record<string, string> {
  const body = adminErrorBody(error);
  const errors = record(body.errors);
  const details = Array.isArray(body.details) ? body.details : Array.isArray(body.detail) ? body.detail : [];
  const mapped: Record<string, string> = {};
  for (const [field, value] of Object.entries(errors)) {
    const message = Array.isArray(value) ? value[0] : value;
    if (typeof message === "string") mapped[field] = message;
  }
  for (const item of details) {
    const detail = record(item);
    const field = typeof detail.field === "string" ? detail.field : Array.isArray(detail.loc) ? detail.loc.filter((part) => part !== "body").join(".") : "";
    if (field && typeof detail.msg === "string") mapped[field] = detail.msg;
  }
  return mapped;
}

export function applyAdminFormError<T extends FieldValues>(form: UseFormReturn<T>, error: unknown, mode: "profile" | "details") {
  const fields: Record<string, string> = mode === "profile" ? profileFields : detailFields;
  const mapped = adminFieldErrors(error);
  const generalMessage = adminErrorMessage(error);
  const isEmailError = mode === "profile" && [localizationConstants.adminEmailRestricted, localizationConstants.adminEmailConflict].includes(generalMessage as typeof localizationConstants.adminEmailRestricted);
  if (isEmailError) mapped.email = generalMessage;
  for (const [apiField, message] of Object.entries(mapped)) {
    const name = fields[apiField] ?? fields[apiField.split(".")[0]];
    if (name) form.setError(name as FieldPath<T>, { type: "server", message }, { shouldFocus: true });
  }
  // Always keep a visible form-level error, including unmapped hierarchy/reference errors.
  form.setError("root.server", { type: "server", message: generalMessage });
  return generalMessage;
}
