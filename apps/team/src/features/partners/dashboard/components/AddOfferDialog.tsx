"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormInput } from "@/components/form";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import type { PartnerImage } from "../constants/imageBank";
import {
	OFFER_DISCOUNT_MAX_PERCENT,
	OFFER_DISCOUNT_MIN_PERCENT,
	type PartnerOfferRow,
} from "../constants/offers";
import { EMPTY_NEW_OFFER, newOfferSchema, type NewOfferValues } from "../schemas/newOffer.schema";
import { OfferChannelsField } from "./OfferChannelsField";
import { OfferImagePicker } from "./OfferImagePicker";

type AddOfferDialogProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	existingNames: string[];
	images: PartnerImage[];
	onCreated: (offer: PartnerOfferRow) => void;
	onGoToImageBank: () => void;
};

/** Creates an offer. Each chosen channel starts as pending until an admin approves it. */
export function AddOfferDialog({
	open,
	onOpenChange,
	existingNames,
	images,
	onCreated,
	onGoToImageBank,
}: AddOfferDialogProps) {
	const { t } = useTranslation();
	const form = useForm<NewOfferValues>({
		resolver: zodResolver(newOfferSchema),
		defaultValues: EMPTY_NEW_OFFER,
		mode: "onSubmit",
	});

	const handleOpenChange = (nextOpen: boolean) => {
		if (!nextOpen) form.reset(EMPTY_NEW_OFFER);
		onOpenChange(nextOpen);
	};

	// The schema has already trimmed the text fields by the time this runs.
	const submit = form.handleSubmit(({ offerName, startDate, endDate, discount, channels, imageId }) => {
		const taken = existingNames.some((existing) => existing.trim().toLowerCase() === offerName.toLowerCase());
		if (taken) {
			form.setError("offerName", { message: localizationConstants.partnerOfferNameTaken });
			return;
		}
		const image = images.find((candidate) => candidate.id === imageId);
		if (!image) {
			form.setError("imageId", { message: localizationConstants.partnerOfferImageRequired });
			return;
		}
		onCreated({
			id: crypto.randomUUID(),
			startDate,
			endDate,
			offerName,
			b2c: channels.includes("b2c") ? "pending" : "n/a",
			b2b: channels.includes("b2b") ? "pending" : "n/a",
			discount: `${Number(discount)} %`,
			status: "active",
			image,
		});
		showToast("success", t(localizationConstants.partnerOfferAddedToast));
		handleOpenChange(false);
	});

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>{t(localizationConstants.addOfferButton)}</DialogTitle>
					<DialogDescription>{t(localizationConstants.partnerAddOfferDescription)}</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={submit} className="space-y-4" noValidate>
						<div className="grid gap-4 sm:grid-cols-2">
							<FormInput control={form.control} name="offerName" label={localizationConstants.nameLabel} />
							<FormInput
								control={form.control}
								name="discount"
								type="number"
								label={localizationConstants.partnerOfferDiscountPercentLabel}
								inputProps={{ min: OFFER_DISCOUNT_MIN_PERCENT, max: OFFER_DISCOUNT_MAX_PERCENT, step: 1 }}
								translateError={(message) =>
									t(message, { min: OFFER_DISCOUNT_MIN_PERCENT, max: OFFER_DISCOUNT_MAX_PERCENT })
								}
							/>
							<FormInput
								control={form.control}
								name="startDate"
								type="date"
								label={localizationConstants.startDateLabel}
							/>
							<FormInput
								control={form.control}
								name="endDate"
								type="date"
								label={localizationConstants.endDateLabel}
							/>
						</div>

						<OfferChannelsField control={form.control} />
						<OfferImagePicker
							control={form.control}
							images={images}
							onGoToImageBank={() => {
								handleOpenChange(false);
								onGoToImageBank();
							}}
						/>

						<DialogFooter className="gap-2 sm:gap-2">
							<Button
								type="button"
								variant="outline"
								className="h-9 cursor-pointer"
								onClick={() => handleOpenChange(false)}
							>
								{t(localizationConstants.cancelLabel)}
							</Button>
							<Button type="submit" className="h-9 cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90">
								{t(localizationConstants.save)}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
