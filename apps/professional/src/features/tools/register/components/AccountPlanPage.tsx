"use client";

import { Suspense, useCallback } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { AccountPlanTable } from "./AccountPlanTable";

interface AccountPlanPageProps {
	activeTab?: string;
}

function AccountPlanContent({ activeTab: initialTab }: { activeTab: string }) {
	const searchParams = useSearchParams();
	const pathname = usePathname();

	const activeTab = initialTab;

	const updateTab = useCallback(
		(tab: string) => {
			const params = new URLSearchParams(searchParams.toString());
			params.set("subtab", tab);
			window.history.replaceState(null, "", `${pathname}?${params.toString()}`);
		},
		[pathname, searchParams],
	);

	return (
		<div className="flex flex-col gap-4 h-full">
			<Tabs value={activeTab} onValueChange={updateTab} className="w-full flex-1 flex flex-col">
				<TabsContent value="kontoplan" className="flex-1">
					<Suspense fallback={<div className="py-8 text-center text-sm text-slate-500"><Translate text={localizationConstants.genericLoading} /></div>}>
						<AccountPlanTable activeTab={activeTab} />
					</Suspense>
				</TabsContent>
				<TabsContent value="import" className="flex-1" />
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
