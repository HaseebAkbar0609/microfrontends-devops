"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
	label: string;
	href?: string;
}

interface PageHeaderProps {
	title: string;
	breadcrumbs?: BreadcrumbItem[];
	className?: string;
}

export function PageHeader({ title, breadcrumbs, className }: PageHeaderProps) {
	return (
		<div className={cn("border-b border-slate-200 px-5", className)}>
			<div className="flex flex-col gap-2 py-3">
				<h1 className="text-2xl font-semibold leading-8 text-[#0A0A0A]">
					{title}
				</h1>

				{breadcrumbs && breadcrumbs.length > 0 && (
					<nav aria-label="Breadcrumb">
						<ol className="flex flex-wrap items-center gap-1">
							{breadcrumbs.map((item, index) => {
								const isLast = index === breadcrumbs.length - 1;
								return (
									<li key={index} className="flex items-center gap-1">
										{index > 0 && (
											<ChevronRight className="h-4 w-4 shrink-0 text-slate-400" />
										)}
										{isLast || !item.href ? (
											<span className="text-sm font-normal leading-5 text-[#020617]">
												{item.label}
											</span>
										) : (
											<Link
												href={item.href}
												className="text-sm font-normal leading-5 text-slate-500 hover:text-slate-700"
											>
												{item.label}
											</Link>
										)}
									</li>
								);
							})}
						</ol>
					</nav>
				)}
			</div>
		</div>
	);
}
