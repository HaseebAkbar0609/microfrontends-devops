"use client";
import { useTranslate } from "@/utils/translation/translate";
import { useAdminQuery } from "./api";
import { State } from "./ui";

export default function LicenseSummary() {
  const t = useTranslate();
  const query = useAdminQuery<{ plan_key: string; purchased: number; allocated: number; available: number }[]>("licenses/summary");
  const rows = (query.data?.data ?? []).filter(row => row.purchased > 0 || row.allocated > 0);
  return <section className="space-y-2"><h2 className="text-sm font-semibold">{t("adminUsersModulesTitle")}</h2><State loading={query.isPending} error={query.error} retry={() => void query.refetch()} empty={!query.isPending && !rows.length} />
    {!query.isError && rows.length > 0 && <>
      <div className="divide-y rounded-md border md:hidden">{rows.map(row => <dl key={row.plan_key} className="grid grid-cols-2 gap-3 p-3 text-sm">
        {([['adminUsersLicenseCol', row.plan_key], ['adminUsersPurchasedCol', row.purchased], ['adminUsersAllocatedCol', row.allocated], ['adminUsersAvailableCol', row.available]] as const).map(([key, value]) => <div key={key} className="min-w-0"><dt className="break-words text-slate-600">{t(key)}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>)}
      </dl>)}</div>
      <div className="hidden overflow-x-auto rounded-md border md:block"><table className="w-full text-left text-sm"><thead className="bg-slate-100"><tr>{["adminUsersLicenseCol", "adminUsersPurchasedCol", "adminUsersAllocatedCol", "adminUsersAvailableCol"].map(key => <th key={key} className="p-3 font-medium">{t(key)}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.plan_key} className="border-t"><td className="p-3">{row.plan_key}</td><td className="p-3">{row.purchased}</td><td className="p-3">{row.allocated}</td><td className="p-3">{row.available}</td></tr>)}</tbody></table></div>
    </>}
  </section>;
}
