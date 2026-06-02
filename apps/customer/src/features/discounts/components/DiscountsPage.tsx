"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DiscountCard } from "./DiscountCard";
import {
  DISCOUNT_CATEGORIES,
  DISCOUNT_SUPPLIERS,
  type Discount,
} from "../constants";
import { getDiscountsAPIAction } from "@/api-actions/discounts/list";

const BREADCRUMBS: BreadcrumbItem[] = [
  { label: localizationConstants.home, href: "/home" },
  { label: localizationConstants.tools, href: "#" },
  { label: localizationConstants.discounts },
];

export function DiscountsPage() {
  const [supplier, setSupplier] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getDiscountsAPIAction({ supplier, category }).then((result) => {
      if (!cancelled) {
        setDiscounts(result.data ?? []);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [supplier, category]);

  // Radix Select doesn't allow value="" on SelectItem; use sentinel to represent "no filter"
  const ALL = "__all__";

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={localizationConstants.discounts}
        breadcrumbs={BREADCRUMBS}
      />

      <div className="">
        <div className="bg-white">
          {/* Card header */}
          <div className="flex flex-col gap-1.5 pb-6 pl-5 pr-0 pt-0 mt-4">
            <h2 className="text-2xl font-semibold leading-none tracking-[-0.025em] text-[#020617]">
              {localizationConstants.discountsAllTitle}
            </h2>
            <p className="text-sm leading-5 text-[#64748B]">
              {localizationConstants.discountsSubtitle}
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 px-5 py-3">
            <Select
              value={supplier || ALL}
              onValueChange={(v) => setSupplier(v === ALL ? "" : v)}
            >
              <SelectTrigger className="w-[200px] rounded-[6px] border-0 bg-[#F1F5F9] px-3 py-1.5 h-auto text-sm font-semibold text-[#0A0A0A] shadow-none">
                <SelectValue placeholder={localizationConstants.discountsFilterSupplierPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>
                  {localizationConstants.discountsAllSuppliers}
                </SelectItem>
                {DISCOUNT_SUPPLIERS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={category || ALL}
              onValueChange={(v) => setCategory(v === ALL ? "" : v)}
            >
              <SelectTrigger className="w-[200px] rounded-[6px] border-0 bg-[#F1F5F9] px-3 py-1.5 h-auto text-sm font-semibold text-[#0A0A0A] shadow-none">
                <SelectValue placeholder={localizationConstants.discountsFilterCategoryPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>
                  {localizationConstants.discountsAllCategories}
                </SelectItem>
                {DISCOUNT_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Cards grid */}
          <div className="p-5">
            {loading ? (
              <p className="py-12 text-center text-sm text-slate-400">
                {localizationConstants.discountsLoading}
              </p>
            ) : discounts.length === 0 ? (
              <p className="py-12 text-center text-sm text-slate-400">
                {localizationConstants.discountsNotFound}
              </p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {discounts.map((discount) => (
                  <DiscountCard key={discount.id} discount={discount} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
