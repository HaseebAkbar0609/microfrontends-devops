"use client";

import { Suspense } from "react";

import { ModulePageHeader, SectionTabs } from "@/components/layout/navigation";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import {
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
	purchaseBreadcrumbs,
} from "../../data/purchaseNav.config";
import { usePurchaseQaBoard } from "../../hooks/usePurchaseQaBoard";
import { PurchaseQaBoard } from "./PurchaseQaBoard";

/**
 * The module's Fråga/Svar screen, replacing the Coming Soon placeholder.
 *
 * The frame draws a record-scoped header ("Inköps 1501 / Fråga/Svar"), but its
 * Företag filter spans two companies — which only means something across
 * records — and the module tab already points here. Built at module scope, as
 * the record sidebar has been declined on every purchase screen since TFS-927.
 */
export function PurchaseQaPage() {
	/**
	 * One instance for both tabs: archiving on Alla has to be visible under
	 * Arkiv, which it is not when each tab holds its own copy of the list.
	 */
	const board = usePurchaseQaBoard();

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				breadcrumbs={purchaseBreadcrumbs(
					localizationConstants.purchaseTabQa,
				)}
			/>

			<div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
				{/* `SectionTabs` reads the active section from the query
				    string, so it needs a Suspense boundary to prerender. */}
				<Suspense fallback={null}>
					<SectionTabs
						items={[
							{
								id: "all",
								labelKey:
									localizationConstants.purchaseQaTabAll,
							},
							{
								id: "archive",
								labelKey: localizationConstants.archive,
							},
						]}
						ariaLabel={PURCHASE_MODULE_TITLE}
					>
						<TabsContent value="all" className="mt-4">
							<PurchaseQaBoard board={board} />
						</TabsContent>

						<TabsContent value="archive" className="mt-4">
							<PurchaseQaBoard board={board} archivedOnly />
						</TabsContent>
					</SectionTabs>
				</Suspense>
			</div>
		</div>
	);
}

export default PurchaseQaPage;
