"use client";

import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { pickCountKey } from "@/utils/pluralLabel";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { NewsletterRecipient } from "../../types";
import { RecipientRow } from "./RecipientRow";

type RecipientListCardProps = {
	recipients: NewsletterRecipient[];
	onCopy: () => void;
	onDownload: () => void;
};

/** The live recipient list, derived from the two contact registers. */
export function RecipientListCard({
	recipients,
	onCopy,
	onDownload,
}: RecipientListCardProps) {
	const t = useTranslate();
	const count = recipients.length;

	return (
		<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<div className="flex flex-wrap items-start justify-between gap-3">
				<div>
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.marketingRecipientsTitle} />
					</h2>
					<p className="mt-0.5 text-sm text-slate-500 tabular-nums">
						{`${count} ${t(
							pickCountKey(
								count,
								localizationConstants.marketingRecipientSingular,
								localizationConstants.marketingRecipientPlural,
							),
						)}`}
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="cursor-pointer"
						onClick={onCopy}
					>
						<Copy className="size-4" aria-hidden />
						<Translate
							text={localizationConstants.marketingCopyAddressesButton}
						/>
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="cursor-pointer"
						onClick={onDownload}
					>
						<Download className="size-4" aria-hidden />
						<Translate
							text={localizationConstants.marketingDownloadCsvButton}
						/>
					</Button>
				</div>
			</div>

			{count === 0 ? (
				<p className="mt-6 text-sm text-slate-500">
					<Translate text={localizationConstants.marketingNoRecipients} />
				</p>
			) : (
				<ul className="mt-3 flex flex-col">
					{recipients.map((recipient) => (
						<RecipientRow
							key={`${recipient.audience}-${recipient.email}`}
							recipient={recipient}
						/>
					))}
				</ul>
			)}
		</section>
	);
}

export default RecipientListCard;
