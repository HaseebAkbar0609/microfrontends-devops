"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { pickCountKey } from "@/utils/pluralLabel";
import { useTranslate } from "@/utils/translation/translate";
import { findSectionKeyBySlug } from "../../constants/marketingGroups";
import { MARKETING_OPTIONS } from "../../constants/marketingFieldOptions";
import { useMarketingRegisters } from "../../hooks/useMarketingRegisters";
import {
	resolveSegmentId,
	useNewsletterAudience,
} from "../../hooks/useNewsletterAudience";
import {
	NEWSLETTER_EMPTY_VALUES,
	newsletterSchema,
	type NewsletterFormValues,
} from "../../schemas/newsletter.schema";
import type { NewsletterRecipient } from "../../types";
import {
	buildMailtoHref,
	buildRecipientCsv,
	downloadCsv,
	joinAddresses,
} from "../../utils/recipientExport";
import { MarketingModuleShell } from "../MarketingModuleShell";
import { NewsletterAudienceCard } from "./NewsletterAudienceCard";
import { NewsletterComposerCard } from "./NewsletterComposerCard";
import { RecipientListCard } from "./RecipientListCard";

const SENDOUT_KEY = findSectionKeyBySlug("nyhetsbrevsutskick") ?? "";

const AUDIENCE_LABEL_KEY = {
	tradespeople: localizationConstants.marketingAudienceTradespeople,
	privateIndividuals: localizationConstants.marketingAudiencePrivate,
} as const;

export default function NewsletterPage() {
	const { addRow } = useMarketingRegisters();
	const audienceState = useNewsletterAudience();
	const { recipients } = audienceState;
	const t = useTranslate();

	const form = useForm<NewsletterFormValues>({
		resolver: zodResolver(newsletterSchema),
		defaultValues: NEWSLETTER_EMPTY_VALUES,
		mode: "onSubmit",
	});

	const statusLabel = (status: string) => {
		const option = MARKETING_OPTIONS[status as keyof typeof MARKETING_OPTIONS];
		return option ? t(option.labelKey) : status;
	};

	const audienceLabel = (audience: NewsletterRecipient["audience"]) =>
		t(AUDIENCE_LABEL_KEY[audience]);

	const warnIfEmpty = () => {
		if (recipients.length > 0) return false;
		showToast("error", t(localizationConstants.marketingNoRecipientsToast));
		return true;
	};

	const copyAddresses = async () => {
		if (warnIfEmpty()) return;
		try {
			await navigator.clipboard.writeText(joinAddresses(recipients));
			showToast(
				"success",
				`${recipients.length} ${t(
					pickCountKey(
						recipients.length,
						localizationConstants.marketingCopiedSingular,
						localizationConstants.marketingCopiedPlural,
					),
				)}`,
			);
		} catch {
			showToast("error", t(localizationConstants.marketingCopyFailedToast));
		}
	};

	const downloadRecipients = () => {
		if (warnIfEmpty()) return;
		const headers = [
			t(localizationConstants.marketingFieldName),
			t(localizationConstants.marketingFieldEmail),
			t(localizationConstants.marketingFieldStatus),
			t(localizationConstants.marketingFieldType),
		];
		downloadCsv(
			`maillista-${audienceState.audience}.csv`,
			buildRecipientCsv(headers, recipients, statusLabel, audienceLabel),
		);
	};

	const openInMail = () => {
		if (warnIfEmpty()) return;
		const values = form.getValues();
		const result = buildMailtoHref(recipients, values.heading, values.body);
		if ("tooLong" in result) {
			void copyAddresses();
			showToast("info", t(localizationConstants.marketingMailtoTooLongToast));
			return;
		}
		window.location.href = result.href;
	};

	const submit = form.handleSubmit((values) => {
		addRow(SENDOUT_KEY, {
			rubrik: values.heading,
			innehall: values.body,
			malgrupp: audienceState.audience,
			segment: resolveSegmentId(audienceState.statuses),
			// Safe: this only ever runs from a click, never during render.
			datum: new Date().toISOString().slice(0, 10),
			status: "draft",
			mottagare: recipients.length,
			oppning: 0,
			ansvarig: values.owner,
		});
		form.reset(NEWSLETTER_EMPTY_VALUES);
		showToast("success", t(localizationConstants.marketingDraftSavedToast));
	});

	return (
		<MarketingModuleShell>
			<div className="@container grid grid-cols-1 gap-5 @4xl:grid-cols-[380px_minmax(0,1fr)]">
				<div className="flex flex-col gap-5">
					<NewsletterAudienceCard
						audience={audienceState.audience}
						onAudienceChange={audienceState.setAudience}
						statuses={audienceState.statuses}
						onToggleStatus={audienceState.toggleStatus}
						subscribersOnly={audienceState.subscribersOnly}
						onSubscribersOnlyChange={audienceState.setSubscribersOnly}
					/>
					<NewsletterComposerCard
						form={form}
						onSubmit={submit}
						onOpenInMail={openInMail}
					/>
				</div>

				<RecipientListCard
					recipients={recipients}
					onCopy={copyAddresses}
					onDownload={downloadRecipients}
				/>
			</div>
		</MarketingModuleShell>
	);
}
