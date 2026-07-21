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
	{ id: "dashboard", labelKey: localizationConstants.invoiceDashboard, href: "/tools/register/invoice-dashboard" },
	{ id: "overview", labelKey: localizationConstants.invoiceOverview, href: "/tools/register/invoice-overview" },
	{ id: "contractInvoicing", labelKey: localizationConstants.contractInvoicing, href: "/tools/register/contract-invoicing" },
	{ id: "settings", labelKey: localizationConstants.settings, href: "/tools/register/settings" },
	{ id: "register", labelKey: localizationConstants.registerDropdownLabel, href: "/tools/register" },
	{ id: "reports", labelKey: localizationConstants.reportsItem, href: "/tools/register/reports" },
	{ id: "templates", labelKey: localizationConstants.templates, href: "/tools/register/templates" },
	{ id: "protocols", labelKey: localizationConstants.protocolsItem, href: "/tools/register/protocols" },
	{ id: "documentCenter", labelKey: localizationConstants.documentCenterItem, href: "/tools/register/document-center" },
	{ id: "statistics", labelKey: localizationConstants.statisticsItem, href: "/tools/register/statistics" },
	{ id: "archive", labelKey: localizationConstants.archiveItem, href: "/tools/register/archive" },
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
						<Translate text={localizationConstants.invoice} />
					</span>
				</div>
				<ChevronsUpDown className="h-4 w-4 text-slate-500 cursor-pointer" aria-hidden />
			</div>

			{/* Sidebar Menu Items List */}
			<nav className="flex flex-1 flex-col gap-1.5 px-3 py-4 overflow-y-auto">
				{INVOICE_SUB_SIDEBAR_ITEMS.map((item) => {
					const isActive =
						item.href === "/tools/register"
							? pathname === "/tools/register" || pathname.startsWith("/tools/register/customer-register")
							: pathname === item.href || pathname.startsWith(`${item.href}/`);

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
