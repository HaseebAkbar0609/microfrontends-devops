import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem as BreadcrumbUIItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import { BreadcrumbItem } from "@/types/common";

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function PageHeader({ title, breadcrumbs, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-b border-slate-200 px-5 py-3",
        className
      )}
    >
      <h1 className="font-sans font-semibold text-2xl leading-8 tracking-normal align-middle text-[#0A0A0A]">
        <Translate text={title} />
      </h1>

      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList className="flex items-center flex-wrap gap-1 text-[#64748B]">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <BreadcrumbUIItem
                  key={`${item.label}-${index}`}
                  className="flex items-center gap-1 text-sm!"
                >
                  {index !== 0 && <BreadcrumbSeparator className="text-[#64748B]" />}
                  {isLast ? (
                    <BreadcrumbPage className="font-sans text-sm leading-5 tracking-normal text-[#64748B] font-normal!">
                      <Translate text={item.label} />
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href || "#"}
                        className="font-sans font-normal text-sm leading-5 tracking-normal text-[#64748B] hover:text-[#0A0A0A] transition-colors"
                      >
                        <Translate text={item.label} />
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbUIItem>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}
    </div>
  );
}
