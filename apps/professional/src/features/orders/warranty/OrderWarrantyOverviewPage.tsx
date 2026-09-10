"use client";

import { PageHeader } from "@/components/layout/PageHeader";
import { orderBreadcrumbs } from "@/features/orders/data/orderNav.config";
import { WarrantyFeature } from "@/features/warranty/WarrantyFeature";
import localizationConstants from "@/utils/translation/constants";

/**
 * The Order module's Garantiåtaganden route.
 *
 * Chrome only — the screen itself lives in `features/warranty`, shared with the
 * opened-order tab and the Project module.
 */
export function OrderWarrantyOverviewPage() {
	return (
		<div className="flex flex-1 flex-col bg-white">
			<PageHeader
				title={localizationConstants.warrantyCommitments}
				breadcrumbs={orderBreadcrumbs(
					localizationConstants.warrantyCommitments,
				)}
				className="border-b-0 px-6 pt-6 pb-2 sm:pt-7"
			/>

			<WarrantyFeature />
		</div>
	);
}

export default OrderWarrantyOverviewPage;
