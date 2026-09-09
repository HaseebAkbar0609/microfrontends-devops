"use client";

import { Checkbox } from "@/components/ui/checkbox";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { MARKETING_OPTIONS } from "../../constants/marketingFieldOptions";
import { CONTACT_STATUS_IDS } from "../../hooks/useNewsletterAudience";
import type { NewsletterAudience } from "../../types";

const AUDIENCES: { id: NewsletterAudience; labelKey: string }[] = [
	{
		id: "tradespeople",
		labelKey: localizationConstants.marketingAudienceTradespeople,
	},
	{
		id: "privateIndividuals",
		labelKey: localizationConstants.marketingAudiencePrivate,
	},
	{ id: "all", labelKey: localizationConstants.marketingAudienceAll },
];

type NewsletterAudienceCardProps = {
	audience: NewsletterAudience;
	onAudienceChange: (audience: NewsletterAudience) => void;
	statuses: string[];
	onToggleStatus: (status: string) => void;
	subscribersOnly: boolean;
	onSubscribersOnlyChange: (value: boolean) => void;
};

/** Målgrupp, contact statuses and the opt-in gate. */
export function NewsletterAudienceCard({
	audience,
	onAudienceChange,
	statuses,
	onToggleStatus,
	subscribersOnly,
	onSubscribersOnlyChange,
}: NewsletterAudienceCardProps) {
	return (
		<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.marketingAudienceTitle} />
			</h2>

			<div className="mt-3 flex flex-wrap gap-2">
				{AUDIENCES.map((entry) => (
					<button
						key={entry.id}
						type="button"
						aria-pressed={audience === entry.id}
						onClick={() => onAudienceChange(entry.id)}
						className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
							audience === entry.id
								? "border-slate-900 bg-slate-900 text-white"
								: "border-slate-200 text-slate-700 hover:bg-slate-50"
						}`}
					>
						<Translate text={entry.labelKey} />
					</button>
				))}
			</div>

			<h3 className="mt-5 text-sm font-medium text-slate-700">
				<Translate text={localizationConstants.marketingStatusFilterTitle} />
			</h3>
			<div className="mt-2 flex flex-col gap-2">
				{CONTACT_STATUS_IDS.map((statusId) => {
					const option =
						MARKETING_OPTIONS[statusId as keyof typeof MARKETING_OPTIONS];
					return (
						<label
							key={statusId}
							className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
						>
							<Checkbox
								checked={statuses.includes(statusId)}
								onCheckedChange={() => onToggleStatus(statusId)}
							/>
							<Translate text={option.labelKey} />
						</label>
					);
				})}
			</div>

			<label className="mt-5 flex cursor-pointer items-center gap-2 text-sm text-slate-700">
				<Checkbox
					checked={subscribersOnly}
					onCheckedChange={(value) => onSubscribersOnlyChange(Boolean(value))}
				/>
				<Translate text={localizationConstants.marketingSubscribersOnly} />
			</label>
		</section>
	);
}

export default NewsletterAudienceCard;
