"use client";

import React, { useState } from "react";
import { ChevronUp, Info } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_CONSTANTS } from "../constants/protocol.constants";
import type { ProtocolMeetingInfo } from "../types/protocol.types";

/* -------------------------------------------------------------------------- */
/* Sub-component: InfoItem                                                     */
/* -------------------------------------------------------------------------- */
export function InfoItem({ label, value }: { label: string; value?: string | number }) {
	return (
		<div className="flex flex-col gap-1">
			<span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
				{label}
			</span>
			<span className="font-sans text-sm font-normal leading-5 tracking-normal text-zinc-500 wrap-break-word">
				{value !== undefined && value !== null && String(value).trim() !== "" ? String(value) : "—"}
			</span>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Sub-component: Meeting Accordion Card                                       */
/* -------------------------------------------------------------------------- */
export interface MeetingAccordionCardProps {
	titleKey: string;
	icon: React.ReactNode;
	info?: ProtocolMeetingInfo;
	defaultOpen?: boolean;
}

export function MeetingAccordionCard({
	titleKey,
	icon,
	info,
	defaultOpen = true,
}: MeetingAccordionCardProps) {
	const t = useTranslate();
	const [isOpen, setIsOpen] = useState(defaultOpen);

	const startDateTime =
		[info?.startTime, info?.startDate].filter(Boolean).join(" | ") || "";
	const endDateTime =
		[info?.endTime, info?.endDate].filter(Boolean).join(" | ") || "";
	const participantsStr = info?.participants?.join(", ") || "";

	return (
		<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs w-full flex flex-col gap-0 pb-0">
			<Button
				type="button"
				variant="ghost"
				onClick={() => setIsOpen((prev) => !prev)}
				className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between px-6 sm:px-8 py-0 text-left transition-colors hover:bg-slate-50 font-normal rounded-none shadow-none focus:outline-none"
				aria-expanded={isOpen}
			>
				<div className="flex items-center gap-3">
					<span className="flex items-center shrink-0 text-slate-800">{icon}</span>
					<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
						{t(titleKey)}
					</span>
				</div>
				<ChevronUp
					size={18}
					className={cn(
						"text-zinc-500 transition-transform duration-200 shrink-0",
						!isOpen && "rotate-180"
					)}
					aria-hidden={true}
				/>
			</Button>

			{isOpen && (
				<CardContent className="border-t border-slate-200 px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
					<div className="space-y-4">
						<InfoItem label={t(localizationConstants.protocolFieldHost)} value={info?.host || PROTOCOL_CONSTANTS.DEFAULT_RESPONSIBLE} />
						<InfoItem label={t(localizationConstants.protocolPointSubject)} value={info?.topic || "-"} />
						<InfoItem label={t(localizationConstants.protocolFieldTitle)} value={info?.rubrik || PROTOCOL_CONSTANTS.DEFAULT_POINT_SUBJECT} />
						<InfoItem label={t(localizationConstants.protocolFieldAddress)} value={info?.address || "-"} />
						<InfoItem label={t(localizationConstants.protocolFieldInformation)} value={info?.information || "-"} />
					</div>

					<div className="space-y-4">
						<InfoItem label={t(localizationConstants.protocolFieldStartTime)} value={startDateTime} />
						<InfoItem label={t(localizationConstants.protocolFieldNumber)} value={info?.protocolNumber || ""} />
						<InfoItem label={t(localizationConstants.protocolFieldCategory)} value={info?.category || PROTOCOL_CONSTANTS.DEFAULT_CATEGORY} />
						<InfoItem label={t(localizationConstants.protocolFieldPostalCode)} value={info?.postalCode || PROTOCOL_CONSTANTS.DEFAULT_POSTAL_CODE} />
						<InfoItem label={t(localizationConstants.protocolFieldComment)} value={info?.comment || "-"} />
					</div>

					<div className="space-y-4">
						<InfoItem label={t(localizationConstants.protocolFieldEndTime)} value={endDateTime} />
						<InfoItem label={t(localizationConstants.protocolFieldParticipants)} value={participantsStr} />
						<InfoItem label={t(localizationConstants.protocolFieldLocation)} value={info?.location || PROTOCOL_CONSTANTS.DEFAULT_LOCATION} />
						<InfoItem label={t(localizationConstants.protocolFieldCity)} value={info?.city || PROTOCOL_CONSTANTS.DEFAULT_CITY} />
					</div>
				</CardContent>
			)}
		</Card>
	);
}

/* -------------------------------------------------------------------------- */
/* Sub-component: Project Information Sidebar Card                             */
/* -------------------------------------------------------------------------- */
export function ProjectInfoCard({
	projectNumber = PROTOCOL_CONSTANTS.DEFAULT_PROJECT_NUMBER,
	projectName = PROTOCOL_CONSTANTS.DEFAULT_PROJECT_NAME,
}: {
	projectNumber?: string;
	projectName?: string;
}) {
	const t = useTranslate();
	return (
		<Card className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs p-5 sm:p-6 h-fit gap-4">
			<CardHeader className="p-0">
				<CardTitle className="font-sans text-base font-semibold leading-6 tracking-normal text-slate-900">
					<Translate text={localizationConstants.protocolProjectInfoTitle} />
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0 space-y-4">
				<InfoItem label={t(localizationConstants.protocolProjectNr)} value={projectNumber} />
				<InfoItem label={t(localizationConstants.protocolProjectName)} value={projectName} />
			</CardContent>
		</Card>
	);
}

/* -------------------------------------------------------------------------- */
/* Sub-component: Status Legend Popover                                        */
/* -------------------------------------------------------------------------- */
export const STATUS_OPTIONS = [
	{ key: "in_progress", color: "bg-orange-500", inactiveColor: "bg-orange-300", translationKey: "protocolPointStatusOngoing" as const },
	{ key: "completed", color: "bg-green-600", inactiveColor: "bg-green-300", translationKey: "protocolPointStatusDone" as const },
	{ key: "not_started", color: "bg-red-600", inactiveColor: "bg-red-300", translationKey: "protocolPointStatusNotDone" as const },
] as const;

const STATUS_COLOR_MAP: Record<string, string> = {
	"bg-orange-500": "#f97316",
	"bg-orange-300": "#fdba74",
	"bg-green-600": "#16a34a",
	"bg-green-300": "#86efac",
	"bg-red-600": "#dc2626",
	"bg-red-300": "#fca5a5",
};

export function StatusLegendPopover() {
	const [isOpen, setIsOpen] = useState(false);
	const t = useTranslate();

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					onMouseEnter={() => setIsOpen(true)}
					onMouseLeave={() => setIsOpen(false)}
					onFocus={() => setIsOpen(true)}
					onBlur={() => setIsOpen(false)}
					className="h-4 w-4 cursor-pointer shrink-0 p-0 hover:bg-slate-200"
					aria-label={t(localizationConstants.ariaLabelStatusLegend)}
				>
					<Info className="h-4 w-4 text-slate-500" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				sideOffset={4}
				onMouseEnter={() => setIsOpen(true)}
				onMouseLeave={() => setIsOpen(false)}
				className="w-36 p-0 rounded-lg shadow-lg border-0"
			>
				<div className="relative bg-slate-900 text-white rounded-lg py-2 px-3">
					<div className="absolute -top-[5px] left-3 h-0 w-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[5px] border-b-slate-900" />
					<p className="text-xs font-medium mb-2 font-sans leading-4 tracking-normal">
						<Translate text={localizationConstants.protocolPointStatusPick} />
					</p>
					<div className="flex flex-col gap-1.5">
						{STATUS_OPTIONS.map((opt) => (
							<div key={opt.key} className="flex items-center gap-2">
								<span className={cn("h-3.5 w-3.5 rounded-[3px] shrink-0", opt.color)} />
								<span className="text-xs font-medium font-sans leading-4 tracking-normal">
									<Translate text={localizationConstants[opt.translationKey]} />
								</span>
							</div>
						))}
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
}

/* -------------------------------------------------------------------------- */
/* Sub-component: Status Circles for a row                                     */
/* -------------------------------------------------------------------------- */
export function StatusCircles({
	status,
	onChangeStatus,
	pointId,
}: {
	status?: string;
	onChangeStatus: (pointId: string, status: string) => void;
	pointId: string;
}) {
	const t = useTranslate();
	return (
		<div className="flex items-center gap-5">
			{STATUS_OPTIONS.map((opt) => {
				const isActive = status === opt.key;
				const bgColor = isActive ? opt.color : opt.inactiveColor;
				return (
					<Button
						key={opt.key}
						type="button"
						variant="ghost"
						size="icon"
						onClick={() => onChangeStatus(pointId, opt.key)}
						style={{ backgroundColor: STATUS_COLOR_MAP[bgColor] || "transparent" }}
						className={cn(
							"h-3.5 w-3.5 rounded-[3px] flex items-center justify-center cursor-pointer shrink-0 p-0 border border-solid",
							"focus-visible:ring-0 focus-visible:ring-offset-0",
							isActive ? "border-slate-900" : "border-slate-400"
						)}
						aria-label={t(localizationConstants[opt.translationKey])}
					>
						{isActive && (
							<span className="flex items-center justify-center leading-none" style={{ width: "8px", height: "5.5px" }}>
								<svg
									viewBox="0 0 12 8"
									fill="none"
									stroke="white"
									strokeWidth="1.5"
									strokeLinecap="round"
									strokeLinejoin="round"
									style={{ width: "100%", height: "100%" }}
								>
									<polyline points="1 4 4.5 7 11 1" />
								</svg>
							</span>
						)}
					</Button>
				);
			})}
		</div>
	);
}
