"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

const TABS = [
	{ labelKey: localizationConstants.invoice,        href: "/module/financial-management/invoice" },
	{ labelKey: localizationConstants.economy,        href: "/module/financial-management/economy" },
	{ labelKey: localizationConstants.forecast,       href: "/module/financial-management/forecast" },
	{ labelKey: localizationConstants.personnel,      href: "/module/financial-management/personnel" },
	{ labelKey: localizationConstants.law,            href: "/module/financial-management/law" },
	{ labelKey: localizationConstants.debtCollection, href: "/module/financial-management/debt-collection" },
];

export default function FinancialManagementLayout({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Breadcrumb + tab bar */}
			<div className="border-b border-slate-200 px-6 pt-4">
				<nav className="mb-3 flex items-center gap-1 text-xs text-slate-400">
					<span>Home</span>
					<span>›</span>
					<span>Module</span>
					<span>›</span>
					<span className="text-slate-600">
						<Translate text={localizationConstants.financialManagement} />
					</span>
				</nav>
				<div className="flex gap-6 overflow-x-auto">
					{TABS.map((tab) => {
						const isActive = pathname.startsWith(tab.href);
						return (
							<Link
								key={tab.href}
								href={tab.href}
								className={cn(
									"cursor-pointer whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors",
									isActive
										? "border-slate-900 text-slate-900"
										: "border-transparent text-slate-500 hover:text-slate-700",
								)}
							>
								<Translate text={tab.labelKey} />
							</Link>
						);
					})}
				</div>
			</div>

			{/* Page content */}
			<div className="flex flex-1 flex-col overflow-y-auto">
				{children}
			</div>
		</div>
	);
}
