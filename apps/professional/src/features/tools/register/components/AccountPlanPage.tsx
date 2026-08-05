"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { AccountPlanTable } from "./AccountPlanTable";

interface AccountPlanPageProps {
	activeTab?: string;
}

function AccountPlanContent({ activeTab: initialTab }: { activeTab: string }) {
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const subtabParam = searchParams.get("subtab") ?? initialTab;

	const updateTab = useCallback(
		(tab: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("subtab", tab);
			window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
		},
		[pathname, searchParams],
	);

	return (
		<div className="flex flex-col gap-6 p-6">
			{/* Breadcrumbs & Page Header */}
			<div className="flex flex-col gap-1">
				<h1 className="text-2xl font-bold tracking-tight text-slate-900">
					<Translate text={localizationConstants.accountPlan} />
				</h1>

				<nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
					<Link href="/" className="hover:text-slate-900 transition-colors">
						<Translate text={localizationConstants.home} />
					</Link>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<Link href="/tools" className="hover:text-slate-900 transition-colors">
						<Translate text={localizationConstants.tools} />
					</Link>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<Link href="/tools/register" className="hover:text-slate-900 transition-colors">
						<Translate text={localizationConstants.register} />
					</Link>
					<ChevronRight className="h-3.5 w-3.5 text-slate-400" aria-hidden />
					<span className="text-slate-900">
						<Translate text={localizationConstants.accountPlan} />
					</span>
				</nav>
			</div>

			{/* Shadcn UI Tabs */}
			<Tabs value={subtabParam} onValueChange={updateTab} className="w-full flex-1 flex flex-col">
				<div className="border-b border-slate-200">
					<TabsList variant="line" className="gap-8 bg-transparent p-0 -mb-px">
						<TabsTrigger value="kontoplan" className="pb-3 pt-1 text-sm font-semibold">
							<Translate text={localizationConstants.accountPlanTab} />
						</TabsTrigger>
						<TabsTrigger value="import" className="pb-3 pt-1 text-sm font-semibold">
							<Translate text={localizationConstants.importAccountPlanTab} />
						</TabsTrigger>
					</TabsList>
				</div>

				<TabsContent value="kontoplan" className="flex-1 pt-4">
					<Suspense fallback={<div className="py-8 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
						<AccountPlanTable activeTab={subtabParam} />
					</Suspense>
				</TabsContent>
				<TabsContent value="import" className="flex-1 pt-4" />
			</Tabs>
		</div>
	);
}

export function AccountPlanPage({ activeTab = "kontoplan" }: AccountPlanPageProps) {
	return (
		<Suspense fallback={<div className="p-6 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
			<AccountPlanContent activeTab={activeTab} />
		</Suspense>
	);
}
