"use client";

import { Send } from "lucide-react";

import { PermissionGate } from "@/components/common/PermissionGate";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { ComplaintStep } from "../useCreateComplaintForm";

export interface ComplaintStepRailProps {
	step: ComplaintStep;
	totalSteps: number;
	onSend: () => void;
}

/**
 * The wizard's right-hand rail: how far along the form is, and — on the last
 * step — the button that sends it.
 *
 * Pulled out of `CreateComplaintPage` to match the sibling wizard's
 * `create-order/components/OrderStepRail.tsx`. The two are deliberately not one
 * component: the order rail is narrower, lists its steps and carries a supplier
 * link, and merging them would restyle a screen this ticket does not touch.
 */
export function ComplaintStepRail({
	step,
	totalSteps,
	onSend,
}: ComplaintStepRailProps) {
	const t = useTranslate();

	return (
		<div className="w-full shrink-0 xl:w-80">
			<div className="sticky top-4 space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-none">
				<div className="space-y-2.5">
					<p className="text-sm font-medium text-slate-900">
						<Translate
							text={localizationConstants.complaintCreateStep}
						/>{" "}
						{step}/{totalSteps}
					</p>
					<div
						className="h-1.5 w-full rounded-full bg-slate-200"
						role="progressbar"
						aria-valuenow={step}
						aria-valuemin={1}
						aria-valuemax={totalSteps}
						aria-label={t(localizationConstants.complaintCreateStep)}
						aria-valuetext={`${t(localizationConstants.complaintCreateStep)} ${step}/${totalSteps}`}
					>
						<div
							className="h-1.5 rounded-full bg-slate-900 transition-all"
							style={{
								width: `${(step / totalSteps) * 100}%`,
							}}
						/>
					</div>
				</div>

				{step === totalSteps && (
					<PermissionGate permission="CREATE_PURCHASE">
						<Button
							type="button"
							onClick={onSend}
							className="h-10 w-full cursor-pointer gap-2 rounded-md bg-[#111721] text-sm font-medium text-white hover:bg-slate-800"
						>
							<Send className="h-4 w-4" aria-hidden />
							<Translate
								text={localizationConstants.complaintCreateSend}
							/>
						</Button>
					</PermissionGate>
				)}
			</div>
		</div>
	);
}

export default ComplaintStepRail;
