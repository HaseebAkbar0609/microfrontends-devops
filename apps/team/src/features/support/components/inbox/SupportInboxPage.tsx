"use client";

import { Button } from "@/components/ui/button";
import { Search } from "@/components/search/Search";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useInboxFilters } from "../../hooks/useInboxFilters";
import { useChannelCounts } from "../../hooks/useSupportMetrics";
import { useSupportTickets } from "../../hooks/useSupportTickets";
import { SupportModuleShell } from "../SupportModuleShell";
import { InboxChannelCards } from "./InboxChannelCards";
import { InboxTicketList } from "./InboxTicketList";

export default function SupportInboxPage() {
	const { tickets } = useSupportTickets();
	const counts = useChannelCounts(tickets);
	const {
		channelFilter,
		query,
		openOnly,
		visibleTickets,
		setChannelFilter,
		setQuery,
		setOpenOnly,
	} = useInboxFilters(tickets);

	return (
		<SupportModuleShell>
			<InboxChannelCards
				counts={counts}
				activeChannel={channelFilter}
				onSelect={setChannelFilter}
			/>

			<section className="@container rounded-xl border border-slate-200 bg-white shadow-2xs">
				<div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
					<h2 className="text-base font-semibold text-slate-900">
						<Translate text={localizationConstants.supportInboxTitle} />
					</h2>
					<div className="flex flex-wrap items-center gap-2">
						<Search
							value={query}
							onChange={setQuery}
							placeholder={
								localizationConstants.supportInboxSearchPlaceholder
							}
							className="h-10 w-full max-w-70"
						/>
						<Button
							type="button"
							variant={openOnly ? "default" : "outline"}
							aria-pressed={openOnly}
							className={`h-10 cursor-pointer ${
								openOnly ? "bg-[#18181B] text-white hover:bg-[#18181B]/90" : ""
							}`}
							onClick={() => setOpenOnly(!openOnly)}
						>
							<Translate text={localizationConstants.supportOpenOnly} />
						</Button>
					</div>
				</div>

				<InboxTicketList tickets={visibleTickets} />
			</section>
		</SupportModuleShell>
	);
}
