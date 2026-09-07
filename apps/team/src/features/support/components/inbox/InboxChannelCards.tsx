"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { SUPPORT_CHANNELS } from "../../constants/supportStatuses";
import type { SupportChannel } from "../../types";
import { ChannelLabel } from "../SupportBadges";

type InboxChannelCardsProps = {
	counts: Record<SupportChannel, number>;
	activeChannel: SupportChannel | "all";
	onSelect: (channel: SupportChannel | "all") => void;
};

/** One card per channel; clicking a card filters the list below. */
export function InboxChannelCards({
	counts,
	activeChannel,
	onSelect,
}: InboxChannelCardsProps) {
	return (
		<div className="grid grid-cols-1 gap-2.5 @2xl:grid-cols-3">
			{SUPPORT_CHANNELS.map((channel) => {
				const isActive = activeChannel === channel.id;
				return (
					<button
						key={channel.id}
						type="button"
						aria-pressed={isActive}
						onClick={() => onSelect(isActive ? "all" : channel.id)}
						className={`cursor-pointer rounded-xl border p-4 text-left transition-colors ${
							isActive
								? "border-slate-900 bg-slate-50"
								: "border-slate-200 bg-white hover:bg-slate-50"
						}`}
					>
						<ChannelLabel channel={channel.id} />
						<p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
							{counts[channel.id]}
						</p>
						<p className="text-xs text-slate-500">
							<Translate
								text={localizationConstants.supportOpenTicketsSuffix}
							/>
						</p>
					</button>
				);
			})}
		</div>
	);
}
