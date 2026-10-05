import { Mail, MessageSquare, Phone, type LucideIcon } from "lucide-react";
import type { TranslationKeys } from "@/utils/translation/constants";
import localizationConstants from "@/utils/translation/constants";
import type {
	SupportChannel,
	SupportCustomerType,
	SupportLine,
	TicketPriority,
	TicketStatus,
} from "../types";

/** Shared shape for every pill in the module. */
export type BadgeMeta<TId extends string> = {
	id: TId;
	labelKey: TranslationKeys;
	/** Pill classes, following the config-map badge convention used in admin. */
	className: string;
};

/** Pipeline order: the inbox and the status picker both render this sequence. */
export const TICKET_STATUSES: BadgeMeta<TicketStatus>[] = [
	{
		id: "new",
		labelKey: localizationConstants.supportStatusNew,
		className: "bg-sky-50 text-sky-700",
	},
	{
		id: "inProgress",
		labelKey: localizationConstants.supportStatusInProgress,
		className: "bg-brand-orange/10 text-brand-orange",
	},
	{
		id: "waiting",
		labelKey: localizationConstants.supportStatusWaiting,
		className: "bg-slate-100 text-slate-600",
	},
	{
		id: "escalated",
		labelKey: localizationConstants.supportStatusEscalated,
		className: "bg-red-50 text-red-600",
	},
	{
		id: "resolved",
		labelKey: localizationConstants.supportStatusResolved,
		className: "bg-emerald-50 text-emerald-700",
	},
];

/** Ascending urgency; the create form and the filters both rely on the order. */
export const TICKET_PRIORITIES: BadgeMeta<TicketPriority>[] = [
	{
		id: "low",
		labelKey: localizationConstants.supportPriorityLow,
		className: "bg-slate-100 text-slate-600",
	},
	{
		id: "medium",
		labelKey: localizationConstants.supportPriorityMedium,
		className: "bg-sky-50 text-sky-700",
	},
	{
		id: "high",
		labelKey: localizationConstants.supportPriorityHigh,
		className: "bg-amber-50 text-amber-700",
	},
	{
		id: "critical",
		labelKey: localizationConstants.supportPriorityCritical,
		className: "bg-red-50 text-red-600",
	},
];

export const SUPPORT_LINES: BadgeMeta<SupportLine>[] = [
	{
		id: "first",
		labelKey: localizationConstants.supportLineFirst,
		className: "bg-slate-100 text-slate-700",
	},
	{
		id: "second",
		labelKey: localizationConstants.supportLineSecond,
		className: "bg-indigo-50 text-indigo-700",
	},
];

export const SUPPORT_CUSTOMER_TYPES: BadgeMeta<SupportCustomerType>[] = [
	{
		id: "private",
		labelKey: localizationConstants.supportCustomerPrivate,
		className: "bg-slate-100 text-slate-600",
	},
	{
		id: "professional",
		labelKey: localizationConstants.supportCustomerProfessional,
		className: "bg-emerald-50 text-emerald-700",
	},
];

/** Channels render as an icon plus a label rather than a filled pill. */
export type ChannelMeta = {
	id: SupportChannel;
	labelKey: TranslationKeys;
	icon: LucideIcon;
	/** Series colour used by the volume chart. */
	chartColor: string;
};

export const SUPPORT_CHANNELS: ChannelMeta[] = [
	{
		id: "phone",
		labelKey: localizationConstants.supportChannelPhone,
		icon: Phone,
		chartColor: "#ff8100",
	},
	{
		id: "email",
		labelKey: localizationConstants.supportChannelEmail,
		icon: Mail,
		chartColor: "#0284c7",
	},
	{
		id: "chat",
		labelKey: localizationConstants.supportChannelChat,
		icon: MessageSquare,
		chartColor: "#059669",
	},
];

function toLookup<TId extends string, TMeta extends { id: TId }>(
	entries: TMeta[],
): (id: TId) => TMeta {
	const map = new Map(entries.map((entry) => [entry.id, entry]));
	return (id) => {
		const meta = map.get(id);
		if (!meta) throw new Error(`Unknown support id: ${id}`);
		return meta;
	};
}

export const getTicketStatusMeta = toLookup(TICKET_STATUSES);
export const getTicketPriorityMeta = toLookup(TICKET_PRIORITIES);
export const getSupportLineMeta = toLookup(SUPPORT_LINES);
export const getSupportCustomerTypeMeta = toLookup(SUPPORT_CUSTOMER_TYPES);
export const getSupportChannelMeta = toLookup(SUPPORT_CHANNELS);

export const TICKET_STATUS_IDS = TICKET_STATUSES.map((entry) => entry.id);
export const TICKET_PRIORITY_IDS = TICKET_PRIORITIES.map((entry) => entry.id);
export const SUPPORT_CHANNEL_IDS = SUPPORT_CHANNELS.map((entry) => entry.id);
