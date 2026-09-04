"use client";

import { Suspense } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { BudgetRegisterTable } from "@/features/tools/register/components/BudgetRegisterTable";

function BudgetContent() {
	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Breadcrumbs & Page Header */}
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold tracking-tight text-slate-900">
					<Translate text={localizationConstants.budgetTitle} />
				</h1>

				<nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
					<Link href="/" className="hover:text-slate-900 transition-colors">
						<Translate text={localizationConstants.home} />
					</Link>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span>
						<Translate text={localizationConstants.moduleItem} />
					</span>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span>
						<Translate text={localizationConstants.invoice} />
					</span>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span className="text-slate-900">
						<Translate text={localizationConstants.registerDropdownLabel} />
					</span>
				</nav>
			</div>

			{/* Sub Tabs Bar matching Figma */}
			<div className="border-b border-slate-200">
				<div className="flex gap-8">
					<button
						type="button"
						className="border-b-2 border-slate-900 pb-3 text-sm font-semibold text-slate-900 cursor-pointer"
					>
						<Translate text={localizationConstants.budgetListTab} />
					</button>
				</div>
			</div>

			{/* Budget Table */}
			<BudgetRegisterTable />
		</div>
	);
}

export default function Page() {
	return (
		<Suspense fallback={<div className="p-6 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
			<BudgetContent />
		</Suspense>
	);
}