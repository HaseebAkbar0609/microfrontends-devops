"use client";

import { CircleCheck } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";

import { Button } from "@/components/ui/button";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { AtaRailFigures } from "../../form/AtaRailFigures";
import type { SupplierAtaFormValues } from "./supplierAtaFormSchema";
import { SupplierAtaLinkSelect } from "./SupplierAtaLinkSelect";

export interface SupplierAtaRailProps {
	control: Control<SupplierAtaFormValues>;
	numberLabel: string;
	projectNo: string;
	projectCity: string;
	clientCity: string;
	customerAtas: { id: string; number: number }[];
	locked: boolean;
	approveReason: TranslationKeys | null;
	onApprove: () => void;
}

/**
 * View ÄTA's right-hand card: no steps here, just the ÄTA's figures from the
 * live draft, Koppla Äta and Godkänna.
 */
export function SupplierAtaRail({ control, numberLabel, projectNo, projectCity, clientCity, customerAtas, locked, approveReason, onApprove }: SupplierAtaRailProps) {
	const t = useTranslate();
	const lineItems = useWatch({ control, name: "lineItems" });

	return (
		<div className="order-first w-full shrink-0 xl:order-none xl:w-80">
			<div className="sticky top-4 space-y-4 rounded-lg border border-slate-200 bg-white p-4">
				<AtaRailFigures numberLabel={numberLabel} projectNo={projectNo} projectCity={projectCity} clientCity={clientCity} lineItems={lineItems} />
				<div className="border-t border-slate-200 pt-4">
					<SupplierAtaLinkSelect control={control} customerAtas={customerAtas} disabled={locked} />
				</div>
				<div className="border-t border-slate-200 pt-4">
					<span title={approveReason ? t(approveReason) : undefined} className="flex">
						<Button
							type="button"
							onClick={onApprove}
							disabled={Boolean(approveReason)}
							className="h-10 w-full cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800"
						>
							<CircleCheck className="h-4 w-4" aria-hidden />
							<Translate text={localizationConstants.viewAtaBtnApprove} />
						</Button>
					</span>
					{approveReason && (
						<p className="pt-2 text-xs text-slate-500">
							<Translate text={approveReason} />
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default SupplierAtaRail;
