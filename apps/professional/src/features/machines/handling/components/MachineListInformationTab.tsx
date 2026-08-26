"use client";

import { Info, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { MachineListDetail } from "../types/machineHandling.types";

/** Label above a read-only value, as used across the three cards. */
function Field({ labelKey, value }: { labelKey: TranslationKeys; value: string }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-sm font-medium text-slate-900">
				<Translate text={labelKey} />
			</span>
			<span className="text-sm text-slate-500">{value || "—"}</span>
		</div>
	);
}

function SectionCard({
	titleKey,
	action,
	children,
}: {
	titleKey: TranslationKeys;
	action?: React.ReactNode;
	children: React.ReactNode;
}) {
	return (
		<Card>
			<CardHeader className="flex h-14 flex-row items-center justify-between border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium">
					<Info className="h-5 w-5 text-slate-700" />
					<Translate text={titleKey} />
				</CardTitle>
				{action}
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
}

/**
 * "Maskin Information" tab of a machine list: the project it belongs to, who is
 * responsible for the machines, and the cost split between internal and hired
 * machines.
 */
export function MachineListInformationTab({
	detail,
}: {
	detail: MachineListDetail;
}) {
	return (
		<div className="flex flex-col gap-6">
			<SectionCard titleKey={localizationConstants.machineListInformation}>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
					<Field
						labelKey={localizationConstants.machineListProjectNo}
						value={detail.projectNo}
					/>
					<Field
						labelKey={localizationConstants.machineListProjectName}
						value={detail.projectName}
					/>
					<Field
						labelKey={localizationConstants.machineListProjectAddress}
						value={detail.projectAddress}
					/>
					<Field
						labelKey={localizationConstants.machineListPostalCode}
						value={detail.postalCode}
					/>
					<Field
						labelKey={localizationConstants.machineListCity}
						value={detail.city}
					/>
					<Field
						labelKey={localizationConstants.machineHandlingStart}
						value={detail.startDate}
					/>
					<Field
						labelKey={localizationConstants.machineHandlingEnd}
						value={detail.endDate}
					/>
				</div>
			</SectionCard>

			<SectionCard
				titleKey={localizationConstants.machineListResponsible}
				action={
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="h-8 cursor-pointer gap-1.5 border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100"
					>
						<Pencil className="h-3.5 w-3.5" />
						<Translate text={localizationConstants.actionEdit} />
					</Button>
				}
			>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
					<Field
						labelKey={localizationConstants.machineListResponsiblePerson}
						value={detail.responsibleName}
					/>
					<Field
						labelKey={localizationConstants.machineListEmail}
						value={detail.responsibleEmail}
					/>
					<Field
						labelKey={localizationConstants.machineListPhone}
						value={detail.responsiblePhone}
					/>
				</div>
			</SectionCard>

			<SectionCard titleKey={localizationConstants.machineListCosts}>
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
					<Field
						labelKey={localizationConstants.machineListTotalCost}
						value={detail.totalCost}
					/>
					<Field
						labelKey={localizationConstants.machineListInternalCost}
						value={detail.internalCost}
					/>
					<Field
						labelKey={localizationConstants.machineListExternalCost}
						value={detail.externalCost}
					/>
				</div>
			</SectionCard>
		</div>
	);
}
