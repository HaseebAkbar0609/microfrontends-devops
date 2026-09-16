"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import type { CatalogPreview, CatalogStatus } from "./stripeCatalog.api";

const labels: Record<CatalogStatus, string> = {
  ready: localizationConstants.stripeCatalogReady, unchanged: localizationConstants.stripeCatalogUnchanged,
  free: localizationConstants.stripeCatalogFree, missing_product: localizationConstants.stripeCatalogMissingProduct,
  ambiguous_product: localizationConstants.stripeCatalogAmbiguousProduct, missing_price: localizationConstants.stripeCatalogMissingPrice,
  ambiguous_price: localizationConstants.stripeCatalogAmbiguousPrice,
};
const MINOR_UNITS = 100;
const periods: Record<string, string> = { monthly: localizationConstants.salesTermMonthlyLabel,
  quarterly: localizationConstants.salesTermQuarterlyLabel, yearly: localizationConstants.salesTermYearlyLabel };

export function CatalogTable({ preview }: { preview: CatalogPreview }) {
  const { t, i18n } = useTranslation();
  const money = useMemo(() => new Intl.NumberFormat(i18n.language, { style: "currency", currency: "SEK" }), [i18n.language]);
  return <div className="overflow-x-auto rounded-md border">
    <table className="w-full table-fixed text-left text-sm">
      <thead className="bg-muted"><tr>{[localizationConstants.stripeCatalogPlan, localizationConstants.stripeCatalogCurrent, localizationConstants.stripeCatalogProposed, localizationConstants.stripeCatalogStatus].map(key => <th key={key} className="p-3 align-top font-medium">{t(key)}</th>)}</tr></thead>
      <tbody>{preview.rows.map(row => <tr key={row.price_id} className="border-t align-top">
        <td className="break-words p-3"><strong>{row.plan_key}</strong><div>{t(periods[row.interval] ?? row.interval)}</div><div>{money.format(row.amount / MINOR_UNITS)}</div></td>
        <td className="break-all p-3 text-xs">{row.old_product_id}<br />{row.old_price_id}</td>
        <td className="break-all p-3 text-xs">{row.new_product_id}<br />{row.new_price_id}</td>
        <td className="break-words p-3">{t(labels[row.status])}</td>
      </tr>)}</tbody>
    </table>
  </div>;
}
