"use client";

import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import { ChevronRight, Slash } from "lucide-react";

export type BreadcrumbItemType = {
  label?: string;
  href?: string;
  translationKey?: string;
};

export type DynamicBreadcrumbProps = {
  items?: BreadcrumbItemType[];
  className?: string;
  separator?: React.ReactNode;
  variant?: "large" | "small";
  segmentLabelMap?: Record<string, string>;
  homeHref?: string;
  homeTranslationKey?: string;
};

function getItemLabel(item: BreadcrumbItemType) {
  if (item.translationKey) {
    return <Translate text={item.translationKey} />;
  }
  return item.label ?? "";
}

export default function DynamicBreadcrumb({
  items: propItems,
  className,
  separator,
  variant = "large",
  segmentLabelMap,
  homeHref = "/",
  homeTranslationKey,
}: DynamicBreadcrumbProps) {
  // Breadcrumbs are controlled by the parent via `items`.
  // Intentionally does not derive breadcrumbs from the current pathname.
  void segmentLabelMap;
  void homeHref;
  void homeTranslationKey;

  const items: BreadcrumbItemType[] = propItems ?? [];

  if (items.length === 0) return null;

  const defaultSeparator =
    variant === "small" ? (
      <ChevronRight className="!w-3.5 !h-3.5 text-slate-400" strokeWidth="2" />
    ) : (
      <Slash
        className="rotate-[-20deg] !w-[18px] !h-[18px]"
        strokeWidth="2"
      />
    );

  return (
    <Breadcrumb className={cn(variant === "small" ? "mb-1" : "mb-2")}>
      <BreadcrumbList
        className={cn(variant === "small" ? "text-xs font-normal text-slate-500 gap-1" : "font-normal", className)}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const labelNode = getItemLabel(item);

          return (
            <BreadcrumbItem
              key={item.href ?? `crumb-${index}`}
              className="flex items-center text-xs font-normal gap-1"
            >
              {index !== 0 && (
                <BreadcrumbSeparator className="text-slate-400">
                  {separator ?? defaultSeparator}
                </BreadcrumbSeparator>
              )}

              {isLast || !item.href ? (
                <BreadcrumbPage className={cn(variant === "small" ? "text-xs" : undefined, "ml-0 font-normal text-slate-500")}>{labelNode}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href} className={cn(variant === "small" ? "text-xs" : undefined, "font-normal text-slate-500 hover:text-slate-900 transition-colors")}>{labelNode}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
