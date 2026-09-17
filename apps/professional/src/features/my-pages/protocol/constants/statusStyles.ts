import { ArrowUpRight, Check, CircleDashed, LucideIcon } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { PointStatus, ProtocolStatus, ProtocolType } from "./data";

export const PROTOCOL_STATUS_KEY: Record<ProtocolStatus, string> = {
	notSent: localizationConstants.protocolStatusNotSent,
	sent: localizationConstants.protocolStatusSent,
	received: localizationConstants.protocolStatusReceived,
};

export const PROTOCOL_STATUS_CLASS: Record<ProtocolStatus, string> = {
	notSent: "border border-slate-300 bg-slate-50 text-slate-600",
	sent: "bg-green-50 text-green-600",
	received: "bg-blue-50 text-blue-600",
};

export const PROTOCOL_STATUS_ICON: Record<ProtocolStatus, LucideIcon> = {
	notSent: CircleDashed,
	sent: ArrowUpRight,
	received: Check,
};

export const PROTOCOL_TYPE_KEY: Record<ProtocolType, string> = {
	standard: localizationConstants.protocolTypeStandard,
	action: localizationConstants.protocolTypeAction,
};

export const POINT_STATUS_ORDER: PointStatus[] = [
	"done",
	"ongoing",
	"notDone",
];

export const POINT_STATUS_KEY: Record<PointStatus, string> = {
	done: localizationConstants.protocolPointStatusDone,
	ongoing: localizationConstants.protocolPointStatusOngoing,
	notDone: localizationConstants.protocolPointStatusNotDone,
};

export const POINT_STATUS_ACTIVE_CLASS: Record<PointStatus, string> = {
	done: "border-green-600 bg-green-600 text-white",
	ongoing: "border-orange-500 bg-orange-500 text-white",
	notDone: "border-red-500 bg-red-500 text-white",
};

export const POINT_STATUS_INACTIVE_CLASS: Record<PointStatus, string> = {
	done: "border-green-300 bg-green-100 text-transparent",
	ongoing: "border-orange-300 bg-orange-100 text-transparent",
	notDone: "border-red-300 bg-red-100 text-transparent",
};

export const POINT_STATUS_LEGEND_DOT_CLASS: Record<PointStatus, string> = {
	done: "bg-green-600",
	ongoing: "bg-orange-500",
	notDone: "bg-red-500",
};
