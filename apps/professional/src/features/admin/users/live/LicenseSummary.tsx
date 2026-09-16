"use client";
import { useTranslate } from "@/utils/translation/translate";
import { useAdminQuery } from "./api";
import { State } from "./ui";

export default function LicenseSummary() {
  const t = useTranslate();
  const query = useAdminQuery<{ plan_key: string; purchased: number; allocated: number; available: number }[]>("licenses/summary");
  const rows = (query.data?.data ?? []).filter(row => row.purchased > 0 || row.allocated > 0);
  return <section className="space-y-2"><h2 className="text-sm font-semibold">{t("adminUsersModulesTitle")}</h2><State loading={query.isPending} error={query.error} retry={() => void query.refetch()} empty={!query.isPending && !rows.length} />
    {!query.isError && rows.length > 0 && <div className="overflow-x-auto rounded-md border"><table className="w-full text-left text-sm"><thead className="bg-slate-100"><tr>{["adminUsersLicenseCol", "adminUsersPurchasedCol", "adminUsersAllocatedCol", "adminUsersAvailableCol"].map(key => <th key={key} className="p-3 font-medium">{t(key)}</th>)}</tr></thead><tbody>{rows.map(row => <tr key={row.plan_key} className="border-t"><td className="p-3">{row.plan_key}</td><td className="p-3">{row.purchased}</td><td className="p-3">{row.allocated}</td><td className="p-3">{row.available}</td></tr>)}</tbody></table></div>}
  </section>;
}
