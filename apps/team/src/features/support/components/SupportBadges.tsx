"use client";

import { cn } from "@/lib/utils";
import { Translate } from "@/utils/translation/translate";
import {
	getCraftsmanStatusMeta,
	getSupportChannelMeta,
	getSupportCustomerTypeMeta,
	getSupportLineMeta,
	getTicketPriorityMeta,
	getTicketStatusMeta,
	type BadgeMeta,
} from "../constants/supportStatuses";
import type {
	CraftsmanStatus,
	SupportChannel,
	SupportCustomerType,
	SupportLine,
	TicketPriority,
	TicketStatus,
} from "../types";

/** Shared pill, following the config-map badge convention used across the app. */
const PILL_CLASS =
	"inline-flex items-center rounded-[6px] px-2.5 py-1 text-xs font-semibold";

function SupportBadge({
	meta,
	className,
}: {
	meta: BadgeMeta<string>;
	className?: string;
}) {
	return (
		<span className={cn(PILL_CLASS, meta.className, className)}>
			<Translate text={meta.labelKey} />
		</span>
	);
}

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
	return <SupportBadge meta={getTicketStatusMeta(status)} />;
}

export function TicketPriorityBadge({
	priority,
}: {
	priority: TicketPriority;
}) {
	return <SupportBadge meta={getTicketPriorityMeta(priority)} />;
}

export function SupportLineBadge({ line }: { line: SupportLine }) {
	return <SupportBadge meta={getSupportLineMeta(line)} />;
}

export function CustomerTypeBadge({ type }: { type: SupportCustomerType }) {
	return <SupportBadge meta={getSupportCustomerTypeMeta(type)} />;
}

export function CraftsmanStatusBadge({ status }: { status: CraftsmanStatus }) {
	return <SupportBadge meta={getCraftsmanStatusMeta(status)} />;
}

/** Channels read as an icon plus a label rather than a filled pill. */
export function ChannelLabel({ channel }: { channel: SupportChannel }) {
	const meta = getSupportChannelMeta(channel);
	const Icon = meta.icon;
	return (
		<span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
			<Icon className="h-3.5 w-3.5 shrink-0" />
			<Translate text={meta.labelKey} />
		</span>
	);
}
