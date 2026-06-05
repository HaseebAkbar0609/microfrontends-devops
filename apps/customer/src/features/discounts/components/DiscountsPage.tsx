"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
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
  const t = useTranslate();
  const [supplier, setSupplier] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  // Tracks whether a fetch is in-flight to prevent double-fetches
  const fetchingRef = useRef(false);

  const fetchPage = useCallback(
    async (pageNum: number, isFirst: boolean) => {
      if (fetchingRef.current) return;
      fetchingRef.current = true;
      if (isFirst) setInitialLoading(true);
      else setLoadingMore(true);

      const result = await getDiscountsAPIAction({ supplier, category, page: pageNum });

      if (result.success && result.data) {
        const { items, hasMore: more } = result.data;
        setDiscounts((prev) => (isFirst ? items : [...prev, ...items]));
        setHasMore(more);
      }

      if (isFirst) setInitialLoading(false);
      else setLoadingMore(false);
      fetchingRef.current = false;
    },
    [supplier, category],
  );

  // Reset when filters change
  useEffect(() => {
    setDiscounts([]);
    setPage(1);
    setHasMore(true);
    fetchPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplier, category]);

  // Fetch when page advances (skip page 1 — already handled by filter effect)
  useEffect(() => {
    if (page === 1) return;
    fetchPage(page, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // IntersectionObserver: when sentinel enters viewport, load next page
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !fetchingRef.current) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore]);

  const ALL = "__all__";

  return (
    <div className="flex flex-1 flex-col">
      <PageHeader
        title={localizationConstants.discounts}
        breadcrumbs={BREADCRUMBS}
      />

      <div className="bg-white">
        {/* Card header */}
        <div className="flex flex-col gap-1.5 pb-6 pl-5 pr-0 pt-0 mt-4">
          <h2 className="text-2xl font-semibold leading-none tracking-[-0.025em] text-[#020617]">
            <Translate text={localizationConstants.discountsAllTitle} />
          </h2>
          <p className="text-sm leading-5 text-[#64748B]">
            <Translate text={localizationConstants.discountsSubtitle} />
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 px-5 py-3">
          <Select
            value={supplier || ALL}
            onValueChange={(v) => setSupplier(v === ALL ? "" : v)}
          >
            <SelectTrigger className="w-[200px] rounded-[6px] border-0 bg-[#F1F5F9] px-3 py-1.5 h-auto text-sm font-semibold text-[#0A0A0A] shadow-none">
              <SelectValue placeholder={t(localizationConstants.discountsFilterSupplierPlaceholder)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>
                <Translate text={localizationConstants.discountsAllSuppliers} />
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
              <SelectValue placeholder={t(localizationConstants.discountsFilterCategoryPlaceholder)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>
                <Translate text={localizationConstants.discountsAllCategories} />
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
          {initialLoading ? (
            <p className="py-12 text-center text-sm text-slate-400">
              <Translate text={localizationConstants.discountsLoading} />
            </p>
          ) : discounts.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-400">
              <Translate text={localizationConstants.discountsNotFound} />
            </p>
          ) : (
            <div className="flex flex-wrap gap-4">
              {discounts.map((discount) => (
                <DiscountCard key={discount.id} discount={discount} />
              ))}
            </div>
          )}

          {/* Load-more spinner */}
          {loadingMore && (
            <p className="py-6 text-center text-sm text-slate-400">
              <Translate text={localizationConstants.discountsLoading} />
            </p>
          )}

          {/* Sentinel — triggers next page when scrolled into view */}
          <div ref={sentinelRef} className="h-1" />
        </div>
      </div>
    </div>
  );
}
