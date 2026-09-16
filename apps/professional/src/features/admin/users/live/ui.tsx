"use client";
import { useId, type InputHTMLAttributes, type ReactNode } from "react";
import { useTranslate } from "@/utils/translation/translate";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { errorKey } from "./api";

export const controlStyle = "h-10 w-full min-w-0 rounded-md border border-slate-300 bg-white px-3 text-sm disabled:opacity-60";
export function Field({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  const id = useId();
  return <label className="grid min-w-0 gap-1 text-sm" htmlFor={id}>{label}
    <input id={id} {...props} className={controlStyle} aria-invalid={!!error} aria-describedby={error ? id + "-error" : undefined} />
    {error && <span id={id + "-error"} role="alert" className="text-red-700">{error}</span>}
  </label>;
}
export function SelectField({ label, value, onChange, options, disabled }: { label: string; value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; disabled?: boolean }) {
  return <label className="grid min-w-0 gap-1 text-sm">{label}<select className={controlStyle} value={value} disabled={disabled} onChange={e => onChange(e.target.value)}>{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></label>;
}
export function State({ loading, error, empty, retry }: { loading?: boolean; error?: unknown; empty?: boolean; retry?: () => void }) {
  const t = useTranslate();
  if (error) return <div role="alert" className="flex flex-wrap items-center gap-3 py-3 text-sm text-red-700">{t(errorKey(error))}{retry && <Button variant="outline" onClick={retry}>{t("proAdminRetry")}</Button>}</div>;
  return loading || empty ? <p role="status" className="py-4 text-sm text-slate-600">{t(loading ? "proAdminLoading" : "proAdminEmpty")}</p> : null;
}
export function Confirm({ name, busy, onCancel, onConfirm, children }: { name: string; busy: boolean; onCancel: () => void; onConfirm: () => void; children?: ReactNode }) {
  const t = useTranslate();
  return <Dialog open onOpenChange={value => !value && !busy && onCancel()}><DialogContent className="max-w-md">
    <DialogTitle>{t("proAdminConfirm")}</DialogTitle><DialogDescription className="break-words">{t("proAdminConfirmAction", { name })}</DialogDescription>{children}
    <div className="flex justify-end gap-2"><Button variant="outline" disabled={busy} onClick={onCancel}>{t("proAdminCancel")}</Button><Button disabled={busy} onClick={onConfirm}>{t(busy ? "proAdminSaving" : "proAdminConfirm")}</Button></div>
  </DialogContent></Dialog>;
}
export const roleKey: Record<string, string> = { owner: "proAdminOwner", manage: "proAdminManage", worker: "proAdminWorker" };
export const statusKey: Record<string, string> = { active: "proAdminActive", pending: "proAdminPending", invited: "proAdminPending", inactive: "proAdminInactive", deactivated: "proAdminInactive" };
