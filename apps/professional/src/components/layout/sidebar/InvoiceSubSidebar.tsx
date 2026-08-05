"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Folder, FolderOpen, ChevronsUpDown } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { cn } from "@/lib/utils";

export interface InvoiceSubSidebarItem {
	id: string;
	labelKey: string;
	href: string;
}

export const INVOICE_SUB_SIDEBAR_ITEMS: InvoiceSubSidebarItem[] = [
	{ id: "kunder", labelKey: localizationConstants.registerKunder, href: "/tools/register/customer" },
	{ id: "leverantorer", labelKey: localizationConstants.registerLeverantorer, href: "/tools/register/supplier" },
	{ id: "projekt", labelKey: localizationConstants.projectList, href: "/tools/register/project-list" },
	{ id: "order", labelKey: localizationConstants.orderList, href: "/tools/register/order-list" },
	{ id: "offerter", labelKey: localizationConstants.registerOfferter, href: "/tools/register/quote-list" },
	{ id: "prislistor", labelKey: localizationConstants.registerPrislistor, href: "/tools/register/price-list" },
	{ id: "artiklar", labelKey: localizationConstants.registerArtiklar, href: "/tools/register/articles" },
	{ id: "kontoplan", labelKey: localizationConstants.accountPlan, href: "/tools/register/account-plan" },
	{ id: "kostnadsstallen", labelKey: localizationConstants.registerKostnadsstallen, href: "/tools/register/cost-centre" },
	{ id: "wageTypes", labelKey: localizationConstants.wageTypes, href: "/tools/register/wage-type" },
];

export function InvoiceSubSidebar() {
	const pathname = usePathname();

	return (
		<aside className="sticky top-0 hidden md:flex h-full w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
			{/* Top Header / Module Selector Dropdown */}
			<div className="flex h-16 w-full items-center justify-between border-b border-slate-200 px-5">
				<div className="flex items-center gap-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111721] text-white font-semibold shadow-2xs">
						<ShoppingBag className="h-5 w-5 text-white" aria-hidden />
					</div>
					<span className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.registerDropdownLabel} />
					</span>
				</div>
				<ChevronsUpDown className="h-4 w-4 text-slate-500 cursor-pointer" aria-hidden />
			</div>

			{/* Sidebar Menu Items List */}
			<nav className="flex flex-1 flex-col gap-1.5 px-3 py-4 overflow-y-auto">
				{INVOICE_SUB_SIDEBAR_ITEMS.map((item) => {
					const isActive =
						pathname === item.href ||
						pathname.startsWith(`${item.href}/`) ||
						(item.href === "/tools/register/customer" && pathname === "/tools/register");

					const ItemIcon = isActive ? FolderOpen : Folder;

					return (
						<Link
							key={item.id}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
								isActive
									? "bg-[#111721] text-white shadow-xs"
									: "text-slate-700 hover:bg-slate-100/80 hover:text-slate-900"
							)}
						>
							<ItemIcon
								className={cn(
									"h-4 w-4 shrink-0",
									isActive ? "text-white" : "text-slate-500"
								)}
								aria-hidden
							/>
							<span className="truncate">
								<Translate text={item.labelKey} />
							</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
