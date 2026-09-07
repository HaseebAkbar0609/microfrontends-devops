"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { SupportTicket } from "../../types";
import { formatDateTime } from "../../utils/supportFormatters";
import {
	ChannelLabel,
	CustomerTypeBadge,
	SupportLineBadge,
	TicketPriorityBadge,
	TicketStatusBadge,
} from "../SupportBadges";

type TicketMetaCardProps = {
	ticket: SupportTicket;
};

function MetaField({
	labelKey,
	children,
}: {
	labelKey: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<dt className="text-xs uppercase tracking-wide text-slate-500">
				<Translate text={labelKey} />
			</dt>
			<dd className="mt-1 text-sm text-slate-900">{children}</dd>
		</div>
	);
}

export function TicketMetaCard({ ticket }: TicketMetaCardProps) {
	return (
		<section className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<div className="flex flex-wrap items-center gap-2">
				<TicketStatusBadge status={ticket.status} />
				<TicketPriorityBadge priority={ticket.priority} />
				<SupportLineBadge line={ticket.line} />
				<ChannelLabel channel={ticket.channel} />
			</div>

			<p className="mt-4 text-sm leading-relaxed text-slate-600">
				{ticket.description}
			</p>

			<div className="my-5 h-px bg-slate-200" />

			<dl className="grid gap-4 @2xl:grid-cols-3">
				<MetaField labelKey={localizationConstants.supportCustomerLabel}>
					<span className="block">{ticket.customer}</span>
					<span className="mt-1 block">
						<CustomerTypeBadge type={ticket.customerType} />
					</span>
				</MetaField>
				<MetaField labelKey={localizationConstants.supportCountryLabel}>
					{ticket.country}
				</MetaField>
				<MetaField labelKey={localizationConstants.supportRegisteredAt}>
					{formatDateTime(ticket.createdAt)}
				</MetaField>
			</dl>
		</section>
	);
}
