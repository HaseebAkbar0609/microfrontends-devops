import { ArrowUpDown } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { QuoteStatus } from "@/features/leads/types";

type SortLabelProps = {
	label: string;
};

export function SortLabel({ label }: SortLabelProps) {
	return (
		<span className="inline-flex items-center gap-2">
			<span>{label}</span>
			<ArrowUpDown className="size-3.5 text-slate-400" />
		</span>
	);
}

export function QuoteStatusPill({ status }: { status: QuoteStatus }) {
	const { labelKey, className } = getQuoteStatusStyle(status);
	return (
		<span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${className}`}>
			<Translate text={labelKey} />
		</span>
	);
}

function getQuoteStatusStyle(status: QuoteStatus) {
	switch (status) {
		case "received":
			return {
				labelKey: localizationConstants.receivedQuoteLabel,
				className: "bg-emerald-50 text-emerald-700",
			};
		case "invited":
			return {
				labelKey: localizationConstants.invitedLabel,
				className: "bg-blue-100 text-blue-700",
			};
		case "estimated":
			return {
				labelKey: localizationConstants.estimatedLabel,
				className: "bg-blue-100 text-blue-700",
			};
		default:
			return {
				labelKey: localizationConstants.waitingForQuoteLabel,
				className: "bg-warning text-warning",
			};
	}
}
