"use client";

import type { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Checkbox } from "@/components/ui/checkbox";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { OFFER_CHANNELS, type OfferChannel } from "../constants/offers";
import type { NewOfferValues } from "../schemas/newOffer.schema";

const CHANNEL_LABELS: Record<OfferChannel, TranslationKeys> = {
	b2c: localizationConstants.b2cColumnLabel,
	b2b: localizationConstants.b2b,
};

/** Checkboxes for the channels a new offer is sent for approval in. */
export function OfferChannelsField({ control }: { control: Control<NewOfferValues> }) {
	const { t } = useTranslation();

	return (
		<FormField
			control={control}
			name="channels"
			render={({ field }) => (
				<FormItem className="grid gap-2">
					<p className="text-sm font-medium leading-none">{t(localizationConstants.partnerOfferChannelsLabel)}</p>
					<div className="flex gap-6">
						{OFFER_CHANNELS.map((channel) => (
							<label key={channel} className="flex cursor-pointer items-center gap-2 text-sm">
								<Checkbox
									checked={field.value.includes(channel)}
									onCheckedChange={(checked) =>
										field.onChange(
											checked === true
												? [...field.value, channel]
												: field.value.filter((selected) => selected !== channel),
										)
									}
									onBlur={field.onBlur}
								/>
								{t(CHANNEL_LABELS[channel])}
							</label>
						))}
					</div>
					<FormMessage translate={t} />
				</FormItem>
			)}
		/>
	);
}
