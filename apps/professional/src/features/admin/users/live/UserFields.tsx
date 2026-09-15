"use client";
import { useTranslate } from "@/utils/translation/translate";
import { NAME_MAX_LENGTH, TEXT_MAX_LENGTH, PASSWORD_MIN_LENGTH, LOGOUT_MIN_MINUTES, LOGOUT_MAX_MINUTES } from "./admin.constants";
import type { AdminUser } from "./api";
import { Field, SelectField, roleKey } from "./ui";
import { TEXT_FIELDS, type UserValues } from "./userForm";

const labels = { first_name: "proAdminFirst", last_name: "proAdminLast", email: "proAdminEmail", phone_number: "proAdminPhone", personal_id: "proAdminPersonal", user_credentials: "proAdminCredentials" };
export default function UserFields({ values, set, user, errors, roles }: { values: UserValues; set: <K extends keyof UserValues>(key: K, value: UserValues[K]) => void; user?: AdminUser; errors: Record<string, string>; roles: string[] }) {
  const t = useTranslate();
  const disabled = (key: string) => !!user && !user.editable_fields.includes(key);
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
    {TEXT_FIELDS.map(key => <Field key={key} label={t(labels[key])} value={values[key]} onChange={e => set(key, e.target.value)} disabled={disabled(key)} error={errors[key] ? t(errors[key]) : undefined} required={["first_name", "last_name", "email"].includes(key) && !disabled(key)} maxLength={key.includes("name") ? NAME_MAX_LENGTH : TEXT_MAX_LENGTH} type={key === "email" ? "email" : "text"} />)}
    {!user && <>{(["password", "confirm_password"] as const).map(key => <Field key={key} label={t(key === "password" ? "proAdminPassword" : "proAdminConfirmPassword")} value={values[key]} onChange={e => set(key, e.target.value)} type="password" autoComplete="new-password" required minLength={PASSWORD_MIN_LENGTH} error={errors[key] ? t(errors[key]) : undefined} />)}</>}
    <SelectField label={t("proAdminRole")} value={values.role} disabled={disabled("role") || !roles.length} onChange={value => set("role", value)} options={[...new Set([values.role, ...roles])].map(value => ({ value, label: t(roleKey[value] || value) }))} />
    <SelectField label={t("proAdminLanguage")} value={values.language} disabled={disabled("language")} onChange={value => set("language", value)} options={[{ value: "sv", label: "Svenska" }, { value: "en", label: "English" }]} />
    <Field label={t("proAdminLogout")} type="number" min={LOGOUT_MIN_MINUTES} max={LOGOUT_MAX_MINUTES} step={1} disabled={disabled("auto_logout")} value={values.auto_logout} onChange={e => set("auto_logout", e.target.value)} error={errors.auto_logout ? t(errors.auto_logout) : undefined} />
    {(["active", "sms_authentication", ...(!user ? ["send_invitation" as const] : [])] as const).map(key => <label key={key} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={values[key]} disabled={disabled(key)} onChange={e => set(key, e.target.checked)} />{t(key === "active" ? "proAdminActive" : key === "sms_authentication" ? "proAdminSms" : "proAdminInvite")}</label>)}
  </div>;
}
