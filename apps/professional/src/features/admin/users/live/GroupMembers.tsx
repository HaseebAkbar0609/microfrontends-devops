"use client";
import { useState } from "react";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/table/TablePagination";
import { useTranslate } from "@/utils/translation/translate";
import { ADMIN_PAGE_SIZE, useAdminQuery, useAdminWrite, type Option } from "./api";
import { Confirm, State } from "./ui";
import { MAX_MEMBERS_PER_REQUEST } from "./admin.constants";
import RemoteSelect from "./RemoteSelect";

type Member = { company_user_id: string; display_name: string; email: string };
export default function GroupMembers({ id }: { id: string }) {
  const t = useTranslate();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(ADMIN_PAGE_SIZE);
  const [selected, setSelected] = useState<Option[]>([]);
  const [remove, setRemove] = useState<Member>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const query = useAdminQuery<Member[]>(`groups/${id}/members`, { skip: (page - 1) * size, limit: size });
  const write = useAdminWrite();
  async function mutate(deleting = false) {
    if (busy) return;
    setBusy(true); setError(undefined);
    try {
      if (deleting && remove) await write("delete", `groups/${id}/members/${remove.company_user_id}`);
      else await write("post", `groups/${id}/members`, { member_ids: selected.map(u => u.id) });
      setSelected([]); setRemove(undefined); setPage(1); toast.success(t("proAdminSaved"));
    } catch (e) { setError(e); } finally { setBusy(false); }
  }
  return <section className="space-y-3 border-t pt-4"><h2 className="font-medium">{t("proAdminMembers")}</h2>
    <State loading={query.isPending} error={error || query.error} retry={() => void query.refetch()} empty={!query.isPending && !query.data?.data.length} />
    {!query.isError && query.data?.data.map(member => <div key={member.company_user_id} className="flex items-center justify-between gap-2 border-b py-2 text-sm"><span className="break-all">{member.display_name || member.email}</span><Button type="button" size="icon" variant="ghost" disabled={busy} title={t("proAdminRemove")} onClick={() => setRemove(member)}><X className="h-4 w-4" /></Button></div>)}
    <TablePagination currentPage={page} totalPages={query.data?.total_pages ?? 1} pageSize={size} onPageChange={setPage} onPageSizeChange={value => { setSize(value); setPage(1); }} />
    <RemoteSelect path="users/options" label={t("proAdminAdd") + " " + t("proAdminMembers")} selected={selected} onChange={setSelected} multiple disabled={busy} />
    <Button type="button" disabled={busy || !selected.length || selected.length > MAX_MEMBERS_PER_REQUEST} onClick={() => void mutate()}><Plus className="mr-2 h-4 w-4" />{t("proAdminAdd")}</Button>
    {remove && <Confirm name={remove.display_name || remove.email} busy={busy} onCancel={() => setRemove(undefined)} onConfirm={() => void mutate(true)}><State error={error} /></Confirm>}
  </section>;
}
