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
import { BreadcrumbItem } from "@/types/user";
import { Translate } from "@/utils/translation/translate";

interface PageHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  breadcrumbs,
  className,
  children,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 border-b border-slate-200  px-5 py-3",
        className,
      )}
    >
      <h1 className="text-2xl font-semibold text-[#0A0A0A] leading-tight">
        <Translate text={title} />
      </h1>

      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb>
          <BreadcrumbList className="flex items-center flex-wrap gap-1">
            {breadcrumbs.map((item, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <BreadcrumbUIItem
                  key={`${item.label}-${index}`}
                  className="flex items-center gap-1"
                >
                  {index !== 0 && <BreadcrumbSeparator />}
                  {isLast ? (
                    <BreadcrumbPage className="text-sm font-normal text-slate-800">
                      <Translate text={item.label} />
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link
                        href={item.href || "#"}
                        className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
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
      {children}
    </div>
  );
}
