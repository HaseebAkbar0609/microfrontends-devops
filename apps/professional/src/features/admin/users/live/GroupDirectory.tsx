"use client";
import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/table/TablePagination";
import { useTranslate } from "@/utils/translation/translate";
import { ADMIN_PAGE_SIZE, useAdminQuery, useAdminWrite, type Group, type Option } from "./api";
import { Field, SelectField, State, Confirm } from "./ui";
import { TEXT_MAX_LENGTH } from "./admin.constants";
import RemoteSelect from "./RemoteSelect";
import GroupEditor from "./GroupEditor";

export default function GroupDirectory() {
  const t = useTranslate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [parent, setParent] = useState<Option[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(ADMIN_PAGE_SIZE);
  const [sort, setSort] = useState("name");
  const [direction, setDirection] = useState("asc");
  const [editor, setEditor] = useState<string>();
  const [remove, setRemove] = useState<Group>();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<unknown>();
  const write = useAdminWrite();
  const query = useAdminQuery<Group[]>("groups", { search: search || undefined, status: status || undefined, parent_group_id: parent[0]?.id,
    skip: (page - 1) * size, limit: size, sort_by: sort, sort_dir: direction });
  useEffect(() => { setPage(1); }, [search, status, parent, size, sort, direction]);
  useEffect(() => { if (query.data && page > Math.max(1, query.data.total_pages ?? 1)) setPage(Math.max(1, query.data.total_pages ?? 1)); }, [query.data, page]);
  async function confirmDelete() {
    if (!remove || busy) return;
    setBusy(true); setError(undefined);
    try { await write("delete", `groups/${remove.id}`); setRemove(undefined); } catch (e) { setError(e); } finally { setBusy(false); }
  }
  return <div className="space-y-5"><Button onClick={() => setEditor("")}><Plus className="mr-2 h-4 w-4" />{t("proAdminCreate")}</Button>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Field label={t("proAdminSearch")} value={search} maxLength={TEXT_MAX_LENGTH} onChange={e => setSearch(e.target.value)} />
      <SelectField label={t("proAdminStatus")} value={status} onChange={setStatus} options={[{ value: "", label: t("proAdminAll") }, { value: "active", label: t("proAdminActive") }, { value: "inactive", label: t("proAdminInactive") }]} />
      <SelectField label={t("proAdminSort")} value={sort} onChange={setSort} options={[{ value: "name", label: t("proAdminName") }, { value: "created_at", label: t("proAdminCreated") }, { value: "status", label: t("proAdminStatus") }]} />
      <SelectField label={t("proAdminSort")} value={direction} onChange={setDirection} options={[{ value: "asc", label: t("proAdminAscending") }, { value: "desc", label: t("proAdminDescending") }]} />
      <RemoteSelect path="groups" label={t("proAdminParent")} selected={parent} onChange={setParent} />
    </div>
    <State loading={query.isPending} error={query.error} empty={!query.isPending && !query.data?.data.length} retry={() => void query.refetch()} />
    {!query.isError && <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{query.data?.data.map(group => <article key={group.id} className="flex min-w-0 flex-col gap-3 rounded-md border bg-white p-4"><h2 className="break-words text-base font-semibold">{group.name}</h2><p className="break-words text-sm text-slate-600">{group.description}</p><div className="mt-auto flex flex-wrap items-center justify-between gap-2 text-sm"><span>{t(group.status === "active" ? "proAdminActive" : "proAdminInactive")} · {t("proAdminMembers")}: {group.member_count}</span><div className="flex gap-1"><Button variant="ghost" size="icon" title={t("proAdminEdit")} onClick={() => setEditor(group.id)}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" title={t("proAdminDelete")} onClick={() => { setRemove(group); setError(undefined); }}><Trash2 className="h-4 w-4" /></Button></div></div></article>)}</div>}
    <TablePagination currentPage={page} totalPages={query.data?.total_pages ?? 1} pageSize={size} onPageChange={setPage} onPageSizeChange={setSize} />
    {editor !== undefined && <GroupEditor id={editor || undefined} onClose={() => setEditor(undefined)} />}
    {remove && <Confirm name={remove.name} busy={busy} onCancel={() => setRemove(undefined)} onConfirm={() => void confirmDelete()}><State error={error} /></Confirm>}
  </div>;
}
