"use client";

import Link from "next/link";
import { ExternalLink, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { getRequesterHref } from "../../constants/supportNav";
import type { SupportTicket } from "../../types";
import { CustomerTypeBadge } from "../SupportBadges";

type TicketRequesterCardProps = {
	ticket: SupportTicket;
};

/** Who raised the ticket, with a way into their record under Customers. */
export function TicketRequesterCard({ ticket }: TicketRequesterCardProps) {
	const href = getRequesterHref(ticket);

	return (
		<section className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.supportCustomerLabel} />
			</h2>

			<div className="mt-4 flex items-start justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2.5">
					<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
						<User className="h-4 w-4" />
					</span>
					<div className="min-w-0">
						<p className="truncate text-sm font-medium text-slate-900">
							{ticket.customer}
						</p>
						<p className="truncate text-xs text-slate-500">{ticket.country}</p>
					</div>
				</div>
				<CustomerTypeBadge type={ticket.customerType} />
			</div>

			{href ? (
				<Button asChild variant="outline" className="mt-4 w-full cursor-pointer">
					<Link href={href}>
						<ExternalLink className="h-4 w-4" />
						<Translate text={localizationConstants.supportRequesterOpenLink} />
					</Link>
				</Button>
			) : (
				<p className="mt-4 text-sm text-slate-500">
					<Translate text={localizationConstants.supportRequesterUnlinked} />
				</p>
			)}
		</section>
	);
}
