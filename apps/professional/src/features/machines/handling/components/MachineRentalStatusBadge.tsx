"use client";

import { Translate } from "@/utils/translation/translate";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import type { MachineRentalStatus } from "../types/machineHandling.types";

/**
 * Booking status pill. The design uses solid colours across the rental
 * lifecycle: booked -> delivered -> active -> returned, with overtime as the
 * exception state when a machine is kept past its return date.
 */
const STATUS_STYLES: Record<
	MachineRentalStatus,
	{ background: string; labelKey: TranslationKeys }
> = {
	active: {
		background: "#14AE5C",
		labelKey: localizationConstants.machineStatusActive,
	},
	booked: {
		background: "#06B6D4",
		labelKey: localizationConstants.machineRentalBooked,
	},
	delivered: {
		background: "#FF9500",
		labelKey: localizationConstants.machineRentalDelivered,
	},
	returned: {
		background: "#A855F7",
		labelKey: localizationConstants.machineRentalReturned,
	},
	overtime: {
		background: "#FF3B30",
		labelKey: localizationConstants.machineRentalOvertime,
	},
};

export function MachineRentalStatusBadge({
	status,
}: {
	status: MachineRentalStatus;
}) {
	const { background, labelKey } = STATUS_STYLES[status];

	return (
		<span
			className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium text-white drop-shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
			style={{ backgroundColor: background }}
		>
			<Translate text={labelKey} />
		</span>
	);
}
