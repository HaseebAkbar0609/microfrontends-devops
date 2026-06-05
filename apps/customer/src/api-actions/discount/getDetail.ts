import type { ActionResult } from "@/types/api";
import type { DiscountPartnerDetail } from "@/features/discount/types/types";
import {
	DUMMY_DISCOUNT_PARTNER,
	DUMMY_DISCOUNT_OFFERS,
} from "@/features/discount/constants";

export async function getDiscountDetailAPIAction(
	_partnerId: string,
): Promise<ActionResult<DiscountPartnerDetail>> {
	try {
		// TODO: replace with axiosInstance.get(API_PATH.DISCOUNT.detail(_partnerId))
		return {
			success: true,
			data: {
				partner: DUMMY_DISCOUNT_PARTNER,
				offers: DUMMY_DISCOUNT_OFFERS,
			},
			error: null,
		};
	} catch (error) {
		return {
			success: false,
			data: null,
			error: "Failed to load discount details",
		};
	}
}
