"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TablePagination } from "@/components/table/TablePagination";
import { useTranslate } from "@/utils/translation/translate";
import { ADMIN_PAGE_SIZE, useAdminQuery, type AdminUser, type Option } from "./api";
import { Field, SelectField, State, roleKey, statusKey } from "./ui";
import { TEXT_MAX_LENGTH } from "./admin.constants";
import RemoteSelect from "./RemoteSelect";
import UserActions from "./UserActions";
import LicenseSummary from "./LicenseSummary";

type Summary = { total_users: number; active_users: number; pending_users: number; deactivated_users: number };
export default function UserDirectory() {
  const t = useTranslate();
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [department, setDepartment] = useState<Option[]>([]);
  const [group, setGroup] = useState<Option[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(ADMIN_PAGE_SIZE);
  const [sort, setSort] = useState("created_at");
  const [direction, setDirection] = useState("desc");
  const filters = { search: search || undefined, role: role || undefined, status: status || undefined, department: department[0]?.id, group: group[0]?.id };
  const query = useAdminQuery<AdminUser[]>("users", { ...filters, skip: (page - 1) * pageSize, limit: pageSize, sort_by: sort, sort_dir: direction });
  const summary = useAdminQuery<Summary>("users/summary", filters);
  useEffect(() => { setPage(1); }, [search, role, status, department, group, sort, direction, pageSize]);
  useEffect(() => { if (query.data && page > Math.max(1, query.data.total_pages ?? 1)) setPage(Math.max(1, query.data.total_pages ?? 1)); }, [query.data, page]);
  const all = { value: "", label: t("proAdminAll") };
  const metrics: [keyof Summary, string][] = [["total_users", "proAdminTotal"], ["active_users", "proAdminActive"], ["pending_users", "proAdminPending"], ["deactivated_users", "proAdminInactive"]];
  return <div className="space-y-5">
    <LicenseSummary />
    <div className="flex flex-wrap justify-between gap-3"><Button asChild><Link href="/admin/user/create"><Plus className="mr-2 h-4 w-4" />{t("proAdminCreate")}</Link></Button><Button asChild variant="outline"><Link href="/admin/subscription">{t("proAdminLicenses")}</Link></Button></div>
    <State loading={summary.isPending} error={summary.error} retry={() => void summary.refetch()} />
    {summary.data && !summary.isError && <dl className="grid grid-cols-2 gap-4 border-y py-4 md:grid-cols-4">{metrics.map(([key, label]) => <div key={key}><dt className="text-sm text-slate-600">{t(label)}</dt><dd className="text-2xl font-semibold">{summary.data.data[key]}</dd></div>)}</dl>}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <Field label={t("proAdminSearch")} value={search} maxLength={TEXT_MAX_LENGTH} onChange={e => setSearch(e.target.value)} />
      <SelectField label={t("proAdminRole")} value={role} onChange={setRole} options={[all, ...Object.entries(roleKey).map(([value, key]) => ({ value, label: t(key) }))]} />
      <SelectField label={t("proAdminStatus")} value={status} onChange={setStatus} options={[all, ...["active", "pending", "deactivated"].map(value => ({ value, label: t(statusKey[value]) }))]} />
      <SelectField label={t("proAdminSort")} value={sort} onChange={setSort} options={[["created_at", "proAdminCreated"], ["first_name", "proAdminName"], ["email", "proAdminEmail"], ["role", "proAdminRole"], ["status", "proAdminStatus"], ["last_login", "proAdminLastLogin"]].map(([value, key]) => ({ value, label: t(key) }))} />
      <RemoteSelect path="groups" label={t("proAdminDepartment")} selected={department} onChange={setDepartment} />
      <RemoteSelect path="groups" label={t("proAdminGroups")} selected={group} onChange={setGroup} />
      <SelectField label={t("proAdminSort")} value={direction} onChange={setDirection} options={[{ value: "asc", label: t("proAdminAscending") }, { value: "desc", label: t("proAdminDescending") }]} />
    </div>
    <State loading={query.isPending} error={query.error} retry={() => void query.refetch()} empty={!query.isPending && !query.data?.data.length} />
    {!query.isError && !!query.data?.data.length && <>
      <div className="divide-y rounded-md border bg-white lg:hidden">{query.data.data.map(user => <article key={user.id} className="min-w-0 space-y-3 p-4 text-sm">
        <div className="min-w-0"><h3 className="break-words font-semibold">{user.display_name || t("proAdminPending")}</h3><p className="break-all text-slate-600">{user.email}</p></div>
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">{([
          ["proAdminRole", t(roleKey[user.role] || user.role)],
          ["proAdminStatus", t(statusKey[user.status] || user.status)],
          ["proAdminDepartment", user.department || t("proAdminNone")],
          ["proAdminGroups", user.groups.map(g => g.name).join(", ") || t("proAdminNone")],
          ["proAdminPermissionRole", user.permission_role_name || t("proAdminNone")],
          ["proAdminLicense", user.license || t("staffLicenseNone")],
        ] as const).map(([key, value]) => <div key={key} className="min-w-0"><dt className="text-slate-600">{t(key)}</dt><dd className="break-words font-medium">{value}</dd></div>)}</dl>
        <div className="flex items-center justify-between border-t pt-2"><span className="text-slate-600">{t("proAdminActions")}</span><UserActions user={user} /></div>
      </article>)}</div>
      <div className="hidden overflow-x-auto rounded-md border bg-white lg:block"><table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-100"><tr>{["proAdminName", "proAdminEmail", "proAdminRole", "proAdminStatus", "proAdminDepartment", "proAdminGroups", "proAdminPermissionRole", "proAdminLicense", "proAdminActions"].map(key => <th key={key} className="p-3 font-medium">{t(key)}</th>)}</tr></thead><tbody>{query.data.data.map(user => <tr key={user.id} className="border-t">
      <td className="p-3">{user.display_name || t("proAdminPending")}</td><td className="max-w-56 break-all p-3">{user.email}</td><td className="p-3">{t(roleKey[user.role] || user.role)}</td><td className="p-3">{t(statusKey[user.status] || user.status)}</td><td className="p-3">{user.department || t("proAdminNone")}</td><td className="p-3">{user.groups.map(g => g.name).join(", ") || t("proAdminNone")}</td><td className="p-3">{user.permission_role_name || t("proAdminNone")}</td><td className="p-3">{user.license || t("staffLicenseNone")}</td><td className="p-3"><UserActions user={user} /></td>
    </tr>)}</tbody></table></div>
    </>}
    <TablePagination currentPage={page} totalPages={query.data?.total_pages ?? 1} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize} />
  </div>;
}
