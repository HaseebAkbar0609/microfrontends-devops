"use client";

import { Suspense } from "react";
import { SectionTabs } from "@/components/layout/navigation";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { OrderQaBoard } from "./components/OrderQaBoard";
import { useOrderQaBoard } from "./hooks/useOrderQaBoard";

export interface OrderQaOverviewPageProps {
	orderId: string;
}

/**
 * Q&A section for Order Production module.
 *
 * Provides Alla / Arkiv section tabs, search, multi-select filters,
 * and 3 Kanban columns (New, Opened, Answered) for quality assurance questions.
 */
export function OrderQaOverviewPage({ orderId }: OrderQaOverviewPageProps) {
	const t = useTranslate();
	const board = useOrderQaBoard(orderId);

	return (
		<div className="w-full flex flex-col font-sans">
			<Suspense fallback={null}>
				<SectionTabs
					items={[
						{ id: "all", labelKey: localizationConstants.projectQaTabAll },
						{ id: "archive", labelKey: localizationConstants.archive },
					]}
					ariaLabel={t(localizationConstants.orderQaTitle)}
				>
					<TabsContent value="all" className="mt-4 focus-visible:outline-none">
						<OrderQaBoard board={board} />
					</TabsContent>
					<TabsContent value="archive" className="mt-4 focus-visible:outline-none">
						<OrderQaBoard board={board} archivedOnly />
					</TabsContent>
				</SectionTabs>
			</Suspense>
		</div>
	);
}

export default OrderQaOverviewPage;
