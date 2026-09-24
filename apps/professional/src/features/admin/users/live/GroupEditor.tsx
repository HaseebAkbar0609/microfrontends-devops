"use client";
import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTranslate } from "@/utils/translation/translate";
import { useAdminQuery, useAdminWrite, fieldErrors, type Group, type Option } from "./api";
import { Field, SelectField, State, controlStyle } from "./ui";
import { TEXT_MAX_LENGTH, DESCRIPTION_MAX_LENGTH, MAX_MEMBERS_PER_REQUEST } from "./admin.constants";
import RemoteSelect from "./RemoteSelect";
import Permissions from "./Permissions";
import GroupMembers from "./GroupMembers";

export default function GroupEditor({ id, onClose }: { id?: string; onClose: () => void }) {
  const t = useTranslate();
  const [blocked, setBlocked] = useState(false);
  const query = useAdminQuery<Group>(`groups/${id}`, undefined, !!id);
  return <Dialog open onOpenChange={value => !value && !blocked && onClose()}><DialogContent showCloseButton={!blocked} className="max-h-[90dvh] max-w-3xl overflow-y-auto"><DialogHeader><DialogTitle>{t(id ? "proAdminEdit" : "proAdminCreate")} · {t("proAdminGroups")}</DialogTitle><DialogDescription className="sr-only">{t("proAdminGroups")}</DialogDescription></DialogHeader>
    <State loading={!!id && query.isPending} error={query.error} retry={() => void query.refetch()} />
    {(!id || query.data && !query.isError) && <GroupForm key={id || "create"} group={query.data?.data} onClose={onClose} setBlocked={setBlocked} />}
  </DialogContent></Dialog>;
}
function GroupForm({ group, onClose, setBlocked }: { group?: Group; onClose: () => void; setBlocked: (value: boolean) => void }) {
  const t = useTranslate();
  const write = useAdminWrite();
  const [name, setName] = useState(group?.name ?? "");
  const [description, setDescription] = useState(group?.description ?? "");
  const [status, setStatus] = useState(group?.status ?? "active");
  const [parent, setParent] = useState<Option[]>(group?.parent_group_id ? [{ id: group.parent_group_id, name: group.parent_group_name }] : []);
  const [members, setMembers] = useState<Option[]>([]);
  const [permissions, setPermissions] = useState(group?.module_permissions ?? {});
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<unknown>();
  async function save() {
    if (busy) return;
    if (!name.trim()) { setErrors({ name: t("proAdminRequired") }); return; }
    setBusy(true); setBlocked(true); setErrors({}); setError(undefined);
    try {
      // Existing memberships are edited separately; never overwrite a paginated list.
      const data = { name: name.trim(), description: description || null, status, parent_group_id: parent[0]?.id ?? null,
        module_permissions: permissions, ...(!group ? { initial_member_ids: members.map(m => m.id) } : {}) };
      await write(group ? "patch" : "post", group ? `groups/${group.id}` : "groups", data);
      toast.success(t("proAdminSaved")); onClose();
    } catch (e) { setError(e); setErrors(fieldErrors(e)); } finally { setBusy(false); setBlocked(false); }
  }
  return <div className="space-y-5"><State error={error} />
    <form onSubmit={e => { e.preventDefault(); void save(); }} className="space-y-4"><fieldset disabled={busy} className="min-w-0 space-y-4">
      <Field label={t("proAdminName")} value={name} maxLength={TEXT_MAX_LENGTH} required onChange={e => setName(e.target.value)} error={errors.name} />
      <label className="grid gap-1 text-sm">{t("proAdminDescription")}<textarea className={controlStyle + " h-24 py-2"} value={description} maxLength={DESCRIPTION_MAX_LENGTH} onChange={e => setDescription(e.target.value)} /></label>
      <SelectField label={t("proAdminStatus")} value={status} onChange={setStatus} options={[{ value: "active", label: t("proAdminActive") }, { value: "inactive", label: t("proAdminInactive") }]} />
      <RemoteSelect path="groups" label={t("proAdminParent")} selected={parent} onChange={setParent} exclude={group?.id} />
      {errors.parent_group_id && <p role="alert" className="text-sm text-red-700">{errors.parent_group_id}</p>}
      {!group && <RemoteSelect path="users/options" label={t("proAdminMembers")} selected={members} onChange={setMembers} multiple />}
      <Permissions value={permissions} onChange={setPermissions} />
      {Object.entries(errors).filter(([key]) => key !== "name" && key !== "parent_group_id").map(([key, message]) => <p key={key} role="alert" className="text-sm text-red-700">{message}</p>)}
    </fieldset><div className="flex justify-end gap-2"><Button type="button" variant="outline" disabled={busy} onClick={onClose}>{t("proAdminCancel")}</Button><Button type="submit" disabled={busy || members.length > MAX_MEMBERS_PER_REQUEST}><Save className="mr-2 h-4 w-4" />{t(busy ? "proAdminSaving" : "proAdminSave")}</Button></div></form>
    {group && <GroupMembers id={group.id} />}
  </div>;
}
