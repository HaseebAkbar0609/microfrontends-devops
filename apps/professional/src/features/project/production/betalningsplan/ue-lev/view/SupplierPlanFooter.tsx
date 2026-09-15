"use client";

import { CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

const BUTTON =
	"h-11 min-w-0 flex-1 cursor-pointer rounded-md px-3 text-sm font-medium shadow-none sm:flex-none sm:min-w-40 sm:px-8";

export interface SupplierPlanFooterProps {
	onCancel: () => void;
	onApprove: () => void;
	/** Why Godkänn is unavailable, or `null` when it can be pressed. */
	approveReason: TranslationKeys | null;
}

/**
 * Avbryt and Godkänn. The frame labels the button "Godkänd" — a state — with a
 * save icon; it approves, so it says Godkänn with a check.
 */
export function SupplierPlanFooter({ onCancel, onApprove, approveReason }: SupplierPlanFooterProps) {
	const t = useTranslate();

	return (
		<div className="sticky bottom-0 z-40 border-t border-slate-200 bg-white py-3">
			<div className="flex items-center justify-end gap-2 px-4 sm:gap-3 sm:px-6">
				<Button
					type="button"
					variant="secondary"
					onClick={onCancel}
					className={`${BUTTON} bg-slate-100 text-slate-900 hover:bg-slate-200`}
				>
					<Translate text={localizationConstants.btnAvbryt} />
				</Button>
				{/* Wrapped so the reason still shows as a tooltip on a disabled button. */}
				<span title={approveReason ? t(approveReason) : undefined} className="flex min-w-0 flex-1 sm:flex-none">
					<Button
						type="button"
						onClick={onApprove}
						disabled={Boolean(approveReason)}
						className={`${BUTTON} w-full gap-2 bg-[#111721] text-white hover:bg-slate-800`}
					>
						<CircleCheck className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.projectSupplierPlanApprove} />
					</Button>
				</span>
			</div>
			{approveReason && (
				<p className="px-4 pt-2 text-right text-xs text-slate-500 sm:px-6" aria-live="polite">
					<Translate text={approveReason} />
				</p>
			)}
		</div>
	);
}

export default SupplierPlanFooter;
