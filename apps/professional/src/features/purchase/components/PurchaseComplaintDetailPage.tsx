"use client";

import { FileWarning } from "lucide-react";

import { ModulePageHeader } from "@/components/layout/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	PURCHASE_MODULE_BASE_URL,
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
} from "../data/purchaseNav.config";
import type { PurchaseComplaintRow } from "../types/purchase.types";
import {
	PurchaseComplaintStatusBadge,
	PurchaseComplaintTypeLabel,
} from "./PurchaseBadges";

export interface PurchaseComplaintDetailPageProps {
	complaint: PurchaseComplaintRow;
}

/**
 * Read-only complaint record. No detail design exists yet, so this stays lean:
 * the record header from the navigation guideline plus the row's own fields.
 */
export function PurchaseComplaintDetailPage({
	complaint,
}: PurchaseComplaintDetailPageProps) {
	const rows: [TranslationKeys, React.ReactNode][] = [
		[localizationConstants.purchaseColNumber, complaint.purchaseNo],
		[localizationConstants.purchaseColObject, complaint.object],
		[localizationConstants.purchaseColName, complaint.name],
		[localizationConstants.purchaseSupplierColName, complaint.supplier],
		[
			localizationConstants.purchaseComplaintColType,
			<PurchaseComplaintTypeLabel key="type" type={complaint.type} />,
		],
		[localizationConstants.purchaseComplaintColDate, complaint.date],
		[
			localizationConstants.statusLabel,
			<PurchaseComplaintStatusBadge
				key="status"
				status={complaint.status}
			/>,
		],
	];

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				record={{
					title: complaint.complaintNo,
					backHref: `${PURCHASE_MODULE_BASE_URL}/complaints`,
				}}
			/>

			<div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
				<Card className="max-w-2xl rounded-lg border border-slate-200 bg-white pb-4 shadow-none">
					<CardHeader className="flex h-12 flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
						<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
							<FileWarning className="h-5 w-5 text-slate-700" />
							<span>
								<Translate
									text={
										localizationConstants.purchaseComplaintDetails
									}
								/>
							</span>
						</CardTitle>
					</CardHeader>
					<CardContent className="px-4 py-0">
						<dl className="divide-y divide-slate-100">
							{rows.map(([label, value]) => (
								<div
									key={label}
									className="flex items-center justify-between gap-4 py-3"
								>
									<dt className="text-sm font-medium text-slate-700">
										<Translate text={label} />
									</dt>
									<dd className="text-sm text-slate-900">
										{value}
									</dd>
								</div>
							))}
						</dl>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

export default PurchaseComplaintDetailPage;
