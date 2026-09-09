"use client";

import { ExternalLink } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { MARKETING_EMPTY_CELL } from "../../constants/marketing.constants";
import { isSafeHttpUrl } from "../../schemas/registerSection.schema";
import type { MarketingField, MarketingRowValues } from "../../types";
import { findOption, formatCell, readValue } from "../../utils/registerValues";
import { MarketingBadge } from "../MarketingBadge";

type RegisterCellProps = {
	field: MarketingField;
	values: MarketingRowValues;
};

/** One table cell, rendered from the field's configured type. */
export function RegisterCell({ field, values }: RegisterCellProps) {
	const t = useTranslate();
	const raw = readValue(values, field);

	if (field.type === "select") {
		return <MarketingBadge option={findOption(field, raw)} fallback={raw} />;
	}

	if (field.type === "url") {
		// Only http(s) becomes an anchor, and never without noopener.
		if (!isSafeHttpUrl(raw)) {
			return <span className="text-slate-400">{MARKETING_EMPTY_CELL}</span>;
		}
		return (
			<a
				href={raw}
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex items-center gap-1 font-medium text-slate-900 underline underline-offset-2"
			>
				{t(localizationConstants.marketingOpenLink)}
				<ExternalLink className="size-3.5" aria-hidden />
			</a>
		);
	}

	const text = formatCell(values, field);
	if (!text) {
		return <span className="text-slate-400">{MARKETING_EMPTY_CELL}</span>;
	}

	return (
		<span
			className={
				field.type === "number" ? "tabular-nums text-slate-700" : "text-slate-700"
			}
		>
			{text}
		</span>
	);
}

export default RegisterCell;
