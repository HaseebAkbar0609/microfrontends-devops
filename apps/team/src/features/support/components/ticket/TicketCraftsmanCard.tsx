"use client";

import { User } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { NO_SELECTION } from "../../schemas/supportTicket.schema";
import type { Craftsman } from "../../types";
import { CraftsmanStatusBadge } from "../SupportBadges";

type TicketCraftsmanCardProps = {
	craftsmen: Craftsman[];
	craftsmanId: string | null;
	onChange: (craftsmanId: string | null) => void;
};

export function TicketCraftsmanCard({
	craftsmen,
	craftsmanId,
	onChange,
}: TicketCraftsmanCardProps) {
	const t = useTranslate();
	const linked = craftsmen.find((entry) => entry.id === craftsmanId) ?? null;

	return (
		<section className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.supportCraftsmanCardTitle} />
			</h2>
			<p className="mt-1 text-sm text-slate-500">
				<Translate text={localizationConstants.supportCraftsmanCardHint} />
			</p>

			<Select
				value={craftsmanId ?? NO_SELECTION}
				onValueChange={(value) => {
					onChange(value === NO_SELECTION ? null : value);
					showToast(
						"success",
						t(localizationConstants.supportCraftsmanUpdatedToast),
					);
				}}
			>
				<SelectTrigger className="mt-4 w-full">
					<SelectValue />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value={NO_SELECTION}>
						<Translate
							text={localizationConstants.supportSelectCraftsmanPlaceholder}
						/>
					</SelectItem>
					{craftsmen.map((craftsman) => (
						<SelectItem key={craftsman.id} value={craftsman.id}>
							{craftsman.name} · {craftsman.company}
						</SelectItem>
					))}
				</SelectContent>
			</Select>

			{linked ? (
				<div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
					<div className="flex items-start justify-between gap-3">
						<div className="flex min-w-0 items-center gap-2.5">
							<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500">
								<User className="h-4 w-4" />
							</span>
							<div className="min-w-0">
								<p className="truncate text-sm font-medium text-slate-900">
									{linked.name}
								</p>
								<p className="truncate text-xs text-slate-500">
									{linked.company}
								</p>
							</div>
						</div>
						<CraftsmanStatusBadge status={linked.status} />
					</div>

					<dl className="mt-4 grid gap-3 @xl:grid-cols-2">
						<div>
							<dt className="text-xs uppercase tracking-wide text-slate-500">
								<Translate text={localizationConstants.supportTradeLabel} />
							</dt>
							<dd className="text-sm text-slate-900">
								<Translate text={linked.tradeKey} />
							</dd>
						</div>
						<div>
							<dt className="text-xs uppercase tracking-wide text-slate-500">
								<Translate text={localizationConstants.supportCountryLabel} />
							</dt>
							<dd className="text-sm text-slate-900">{linked.country}</dd>
						</div>
						<div className="@xl:col-span-2">
							<dt className="text-xs uppercase tracking-wide text-slate-500">
								<Translate text={localizationConstants.supportPhoneLabel} />
							</dt>
							<dd className="text-sm text-slate-900">{linked.phone}</dd>
						</div>
					</dl>
				</div>
			) : (
				<p className="mt-4 text-sm text-slate-500">
					<Translate text={localizationConstants.supportNoCraftsmanLinked} />
				</p>
			)}
		</section>
	);
}
