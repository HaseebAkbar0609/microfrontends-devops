import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";
import {
	OFFER_CHANNELS,
	OFFER_DISCOUNT_MAX_PERCENT,
	OFFER_DISCOUNT_MIN_PERCENT,
} from "../constants/offers";

const WHOLE_NUMBER = /^\d+$/;

/** A new partner offer. Dates are YYYY-MM-DD, so string order is date order. Messages are translation keys. */
export const newOfferSchema = z
	.object({
		offerName: z.string().trim().min(1, localizationConstants.partnerOfferNameRequired),
		startDate: z.string().min(1, localizationConstants.partnerOfferStartDateRequired),
		endDate: z.string().min(1, localizationConstants.partnerOfferEndDateRequired),
		discount: z
			.string()
			.trim()
			.refine(
				(value) =>
					WHOLE_NUMBER.test(value) &&
					Number(value) >= OFFER_DISCOUNT_MIN_PERCENT &&
					Number(value) <= OFFER_DISCOUNT_MAX_PERCENT,
				localizationConstants.partnerOfferDiscountInvalid,
			),
		channels: z.array(z.enum(OFFER_CHANNELS)).min(1, localizationConstants.partnerOfferChannelRequired),
		imageId: z.string().min(1, localizationConstants.partnerOfferImageRequired),
	})
	.refine((offer) => !offer.startDate || !offer.endDate || offer.endDate >= offer.startDate, {
		path: ["endDate"],
		message: localizationConstants.partnerOfferEndBeforeStart,
	});

export type NewOfferValues = z.infer<typeof newOfferSchema>;

export const EMPTY_NEW_OFFER: NewOfferValues = {
	offerName: "",
	startDate: "",
	endDate: "",
	discount: "",
	channels: [],
	imageId: "",
};
