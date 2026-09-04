"use client";

import { Suspense } from "react";

import { ModulePageHeader, SectionTabs } from "@/components/layout/navigation";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	purchaseComplaintDetailFor,
	purchaseComplaintMessagesFor,
} from "../data/purchaseComplaintDetail.mock";
import {
	PURCHASE_MODULE_BASE_URL,
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
} from "../data/purchaseNav.config";
import type { PurchaseComplaintRow } from "../types/purchase.types";
import { ComplaintHandlingTab } from "./complaint/ComplaintHandlingTab";
import { ComplaintInformationTab } from "./complaint/ComplaintInformationTab";
import { PurchaseComplaintStatusBadge } from "./PurchaseBadges";

export interface PurchaseComplaintDetailPageProps {
	complaint: PurchaseComplaintRow;
}

/**
 * The complaint record: Information and Hantering av reklamation.
 *
 * The frame draws a record-scoped left sidebar. That was declined on TFS-927,
 * TFS-929 and TFS-930 in favour of `ModulePageHeader` plus `SectionTabs`, and
 * the same call holds here so the module navigates one way throughout.
 */
export function PurchaseComplaintDetailPage({
	complaint,
}: PurchaseComplaintDetailPageProps) {
	const detail = purchaseComplaintDetailFor(complaint.id);
	const messages = purchaseComplaintMessagesFor(complaint.id);

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				record={{
					title: complaint.complaintNo,
					backHref: `${PURCHASE_MODULE_BASE_URL}/complaints`,
					// The frame puts the status beside the title; the record row
					// already has a slot for it, so no new header component.
					actions: (
						<PurchaseComplaintStatusBadge
							status={complaint.status}
						/>
					),
				}}
			/>

			<div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
				{!detail ? (
					<Card className="rounded-lg border border-slate-200 bg-white p-12 text-center shadow-none">
						<p className="text-sm text-slate-500">
							<Translate
								text={localizationConstants.purchaseInfoNone}
							/>
						</p>
					</Card>
				) : (
					/* `SectionTabs` reads the active section from the query
					   string, so it needs a Suspense boundary to prerender. */
					<Suspense fallback={null}>
						<SectionTabs
							items={[
								{
									id: "information",
									labelKey:
										localizationConstants.purchaseInfoTab,
								},
								{
									id: "handling",
									labelKey:
										localizationConstants.purchaseComplaintHandlingTab,
								},
							]}
							ariaLabel={complaint.complaintNo}
						>
							<TabsContent value="information" className="mt-4">
								<ComplaintInformationTab
									complaint={complaint}
									detail={detail}
								/>
							</TabsContent>

							<TabsContent value="handling" className="mt-4">
								<ComplaintHandlingTab
									complaintId={complaint.id}
									detail={detail}
									messages={messages}
								/>
							</TabsContent>
						</SectionTabs>
					</Suspense>
				)}
			</div>
		</div>
	);
}

export default PurchaseComplaintDetailPage;
