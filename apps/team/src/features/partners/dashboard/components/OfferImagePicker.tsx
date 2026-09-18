"use client";

import type { Control } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { FormField, FormItem, FormMessage } from "@/components/ui/form";
import localizationConstants from "@/utils/translation/constants";
import type { PartnerImage } from "../constants/imageBank";
import type { NewOfferValues } from "../schemas/newOffer.schema";
import { PartnerImageThumbnail } from "./PartnerImageThumbnail";

type OfferImagePickerProps = {
	control: Control<NewOfferValues>;
	images: PartnerImage[];
	onGoToImageBank: () => void;
};

/** Lets the partner pick one image bank picture for an offer. */
export function OfferImagePicker({ control, images, onGoToImageBank }: OfferImagePickerProps) {
	const { t } = useTranslation();

	return (
		<FormField
			control={control}
			name="imageId"
			render={({ field }) => (
				<FormItem className="grid gap-2">
					<p className="text-sm font-medium leading-none">{t(localizationConstants.partnerOfferImageLabel)}</p>
					{images.length === 0 ? (
						<div className="flex flex-col items-start gap-2 rounded-md border border-dashed border-slate-200 p-4 text-sm text-slate-500">
							<p>{t(localizationConstants.partnerOfferImageBankEmpty)}</p>
							<Button type="button" variant="outline" className="h-8 cursor-pointer" onClick={onGoToImageBank}>
								{t(localizationConstants.partnerOfferGoToImageBank)}
							</Button>
						</div>
					) : (
						<div
							role="radiogroup"
							aria-label={t(localizationConstants.partnerOfferImageLabel)}
							className="grid max-h-56 grid-cols-4 gap-2 overflow-y-auto p-1"
						>
							{images.map((image) => (
								<label key={image.id} className="cursor-pointer" title={image.name}>
									<input
										type="radio"
										name={field.name}
										value={image.id}
										checked={field.value === image.id}
										onChange={() => field.onChange(image.id)}
										onBlur={field.onBlur}
										aria-label={image.name}
										className="peer sr-only"
									/>
									<PartnerImageThumbnail
										image={image}
										className="ring-offset-2 peer-checked:ring-2 peer-checked:ring-slate-900 peer-focus-visible:ring-2 peer-focus-visible:ring-slate-400"
									/>
									<p className="mt-1 truncate text-xs text-slate-600">{image.name}</p>
								</label>
							))}
						</div>
					)}
					<FormMessage translate={t} />
				</FormItem>
			)}
		/>
	);
}
