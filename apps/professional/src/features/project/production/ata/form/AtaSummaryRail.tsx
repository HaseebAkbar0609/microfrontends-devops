"use client";

import { Send } from "lucide-react";
import { useWatch, type Control } from "react-hook-form";

import { StepRail } from "@/components/common/StepRail";
import { Button } from "@/components/ui/button";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ATA_STEP_KEYS } from "../projectAta.config";
import type { AtaFormValues } from "./ataFormSchema";
import { AtaRailFigures } from "./AtaRailFigures";

export interface AtaSummaryRailProps {
	control: Control<AtaFormValues>;
	step: number;
	number: number;
	/** The project number without its `#`, the frame's "PRJ092" badge. */
	projectNo: string;
	projectCity: string;
	sendReason: TranslationKeys | null;
	onSend: () => void;
}

/**
 * Skapa ÄTA's right-hand card: the step bar (the shared `StepRail`), the ÄTA's
 * figures from the live draft, and Skicka.
 */
export function AtaSummaryRail({ control, step, number, projectNo, projectCity, sendReason, onSend }: AtaSummaryRailProps) {
	const t = useTranslate();
	const [lineItems, clientCity] = useWatch({ control, name: ["lineItems", "client.city"] });

	return (
		<StepRail current={step} steps={ATA_STEP_KEYS} className="order-first xl:order-none xl:w-80">
			<div className="border-t border-slate-200 pt-4">
				<AtaRailFigures
					numberLabel={String(number)}
					projectNo={projectNo}
					projectCity={projectCity}
					clientCity={clientCity}
					lineItems={lineItems}
				/>
			</div>
			<div className="border-t border-slate-200 pt-4">
				<span title={sendReason ? t(sendReason) : undefined} className="flex">
					<Button
						type="button"
						onClick={onSend}
						disabled={Boolean(sendReason)}
						className="h-10 w-full cursor-pointer gap-2 bg-[#111721] text-white hover:bg-slate-800"
					>
						<Send className="h-4 w-4" aria-hidden />
						<Translate text={localizationConstants.createAtaBtnSend} />
					</Button>
				</span>
				{sendReason && (
					<p className="pt-2 text-xs text-slate-500">
						<Translate text={sendReason} />
					</p>
				)}
			</div>
		</StepRail>
	);
}

export default AtaSummaryRail;
