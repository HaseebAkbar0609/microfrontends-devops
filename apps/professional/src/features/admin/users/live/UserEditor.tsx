"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import { useAdminQuery, useAdminWrite, fieldErrors, type AdminUser, type Option } from "./api";
import { State, Confirm } from "./ui";
import { defaults, validateUser, userPayload, type UserValues } from "./userForm";
import UserFields from "./UserFields";
import RemoteSelect from "./RemoteSelect";
import Permissions from "./Permissions";
import UserActions from "./UserActions";

export default function UserEditor({ id }: { id?: string }) {
  const query = useAdminQuery<AdminUser>(`users/${id}`, undefined, !!id);
  return <div className="space-y-4 p-6"><State loading={!!id && query.isPending} error={query.error} retry={() => void query.refetch()} />{(!id || query.data && !query.isError) && <UserForm key={id || "create"} user={query.data?.data} />}</div>;
}
function UserForm({ user }: { user?: AdminUser }) {
  const t = useTranslate();
  const router = useRouter();
  const write = useAdminWrite();
  const access = useAdminQuery<string[]>("access/options");
  const [values, setValues] = useState(() => defaults(user));
  const [groups, setGroups] = useState<Option[]>(user?.groups ?? []);
  const [department, setDepartment] = useState<Option[]>(user?.department_id ? [{ id: user.department_id, name: user.department || user.department_id }] : []);
  const [position, setPosition] = useState(user?.position_id ?? "");
  const [permissionRole, setPermissionRole] = useState(user?.permission_role_id ?? "");
  const positions = useAdminQuery<Option[]>("types/options");
  const roles = useAdminQuery<Option[]>("roles/options");
  const [permissions, setPermissions] = useState(user?.module_permissions ?? {});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<unknown>();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const set = <K extends keyof UserValues>(key: K, value: UserValues[K]) => setValues(old => ({ ...old, [key]: value }));
  const disabled = (field: string) => !!user && !user.editable_fields.includes(field);
  const editable = !user || user.available_actions.includes("edit");
  async function save() {
    if (busy || !editable) return;
    const validation = validateUser(values, user);
    setErrors(validation); setError(undefined);
    if (Object.keys(validation).length) { setConfirming(false); return; }
    setBusy(true);
    try {
      const data = userPayload(values, { group_ids: groups.map(g => g.id), department: department[0]?.id ?? null,
        position_id: position || null, permission_role_id: permissionRole || null, module_permissions: permissions }, user);
      await write(user ? "patch" : "post", user ? `users/${user.id}` : "users", data);
      toast.success(t("proAdminSaved")); router.push("/admin/user");
    } catch (e) { setError(e); setErrors(fieldErrors(e)); } finally { setBusy(false); setConfirming(false); }
  }
  return <>
    <div className="flex flex-wrap items-center justify-between gap-3"><h1 className="text-xl font-semibold">{t(user ? "proAdminEdit" : "proAdminCreate")} · {t("proAdminUsers")}</h1>{user && <UserActions user={user} />}</div>
    <Button asChild variant="outline"><Link href="/admin/user"><ArrowLeft className="mr-2 h-4 w-4" />{t("proAdminUsers")}</Link></Button>
    <State error={error || access.error || positions.error || roles.error} retry={() => { void access.refetch(); void positions.refetch(); void roles.refetch(); }} />
    {user?.pending_email && <p role="status" className="break-all text-sm text-amber-800">{t("proAdminPendingEmail", { email: user.pending_email })}</p>}
    <form onSubmit={e => { e.preventDefault(); if (user) setConfirming(true); else void save(); }} className="space-y-5">
      <fieldset disabled={busy || !editable} className="min-w-0 space-y-6 rounded-md border bg-white p-4">
        <UserFields values={values} set={set} user={user} errors={errors} roles={user?.allowed_roles ?? access.data?.data ?? []} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <RemoteSelect path="groups" label={t("proAdminGroups")} selected={groups} onChange={setGroups} multiple disabled={disabled("group_ids")} />
          <RemoteSelect path="groups" label={t("proAdminDepartment")} selected={department} onChange={setDepartment} disabled={disabled("department")} />
          {([["position_id", "proAdminPosition", position, setPosition, positions], ["permission_role_id", "proAdminPermissionRole", permissionRole, setPermissionRole, roles]] as const).map(([field, key, value, change, query]) => <label key={field} className="grid gap-1 text-sm">{t(key)}<select className="h-10 rounded-md border bg-white px-3" value={value} onChange={e => change(e.target.value)} disabled={disabled(field) || query.isPending || query.isError}><option value="">{t("proAdminNone")}</option>{value && !query.data?.data.some(o => o.id === value) && <option value={value}>{field === "position_id" ? user?.position : user?.permission_role_name}</option>}{query.data?.data.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}</select>{errors[field] && <span role="alert" className="text-red-700">{errors[field]}</span>}</label>)}
        </div>
        {Object.entries(errors).filter(([key]) => ["group_ids", "department", "module_permissions", "role"].includes(key)).map(([key, message]) => <p key={key} role="alert" className="text-sm text-red-700">{message}</p>)}
        <Permissions value={permissions} onChange={setPermissions} disabled={disabled("module_permissions")} />
      </fieldset>
      <div className="flex justify-end gap-2"><Button asChild variant="outline" disabled={busy}><Link href="/admin/user">{t("proAdminCancel")}</Link></Button><Button type="submit" disabled={busy || !editable || access.isPending || access.isError}><Save className="mr-2 h-4 w-4" />{t(busy ? "proAdminSaving" : "proAdminSave")}</Button></div>
    </form>
    {confirming && <Confirm name={user?.display_name || user?.email || ""} busy={busy} onCancel={() => setConfirming(false)} onConfirm={() => void save()} />}
  </>;
}
