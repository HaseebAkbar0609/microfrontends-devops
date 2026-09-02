"use client";

import { useState } from "react";
import Image from "next/image";
import { Archive, CircleCheckBig, MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";

/**
 * One message in a Fråga/Svar thread, in the shape both callers need.
 *
 * Deliberately domain-neutral: the b2b project market and the purchase module's
 * complaint record draw the same card, so the type describes the card rather
 * than either feature.
 */
export interface QAThreadMessage {
	id: string;
	/** Who asked. */
	sender: string;
	/** Sub-label under the name — a company, or the sender's role. */
	company?: string;
	role?: string;
	/** Role chip beside the name, e.g. "UE". */
	badge?: string;
	message: string;
	date: string;
	/** `"answered"` shows the reply instead of the compose box. */
	answered?: boolean;
	answerUser?: string;
	answerBadge?: string;
	answerText?: string;
	answerDate?: string;
	/** Prefills the compose box when a draft reply exists. */
	replyText?: string;
}

/**
 * Labels, as translation keys.
 *
 * Passed in rather than fixed, because the two callers already ship different
 * wording for the same actions — b2b's `b2bPMQAMarkAsRead` reads "Mark as read"
 * even in Swedish. Hard-coding one set here would silently rewrite a merged
 * screen's copy.
 */
export interface QAThreadLabels {
	/** Row-menu wording. Only read when the matching handler is supplied. */
	markAsRead?: TranslationKeys;
	archive?: TranslationKeys;
	delete?: TranslationKeys;
	leaveComment: TranslationKeys;
	send: TranslationKeys;
	cancel: TranslationKeys;
	/** Chip beside the answering user's name. */
	answerBadge: TranslationKeys;
	/** Sub-label under the answering user, e.g. "You". */
	answerSubLabel: TranslationKeys;
	/** Role-chip wording, keyed by the badge value carried on a message. */
	badges?: Record<string, TranslationKeys>;
}

/** Chip colours by role. Anything unmapped falls back to neutral slate. */
const BADGE_STYLES: Record<string, string> = {
	UE: "bg-blue-600 text-white",
	Beställare: "bg-teal-600 text-white",
	Fråga: "bg-amber-500 text-white",
};

/**
 * "Anna Svensson" → "AS". Re-implemented in four features before this; one copy
 * now lives beside the component that needs it most.
 */
export function initialsOf(name: string): string {
	return name
		.trim()
		.split(/\s+/)
		.map((part) => part[0] ?? "")
		.join("")
		.slice(0, 2)
		.toUpperCase();
}

function RoleBadge({
	badge,
	labels,
}: {
	badge: string;
	labels: QAThreadLabels;
}) {
	const t = useTranslate();
	const labelKey = labels.badges?.[badge];

	return (
		<span
			className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium leading-none ${
				BADGE_STYLES[badge] ?? "bg-slate-600 text-white"
			}`}
		>
			{labelKey ? t(labelKey) : badge}
		</span>
	);
}

export interface QAThreadCardProps {
	message: QAThreadMessage;
	labels: QAThreadLabels;
	/** The signed-in user, shown against the compose box and any reply. */
	currentUserName: string;
	onSendReply: (id: string, text: string) => void;
	onMarkAsRead?: (id: string) => void;
	onArchive?: (id: string) => void;
	onDelete?: (id: string) => void;
}

/**
 * A Fråga/Svar message with its reply.
 *
 * Extracted from `ProjectMarketQATab`, which had it module-private while three
 * other features re-implemented the same card. The row menu only renders the
 * actions a caller actually handles.
 */
export function QAThreadCard({
	message,
	labels,
	currentUserName,
	onSendReply,
	onMarkAsRead,
	onArchive,
	onDelete,
}: QAThreadCardProps) {
	const t = useTranslate();
	const [comment, setComment] = useState(message.replyText ?? "");

	const currentInitials = initialsOf(currentUserName);
	const hasMenu = Boolean(onMarkAsRead || onArchive || onDelete);

	return (
		<div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs sm:p-4">
			<div className="flex items-start justify-between gap-2">
				<div className="flex items-start gap-2.5">
					<div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
						<Image
							src="/assets/images/Avatar.svg"
							alt=""
							width={32}
							height={32}
							className="h-full w-full object-cover"
						/>
					</div>
					<div className="flex flex-col">
						<div className="flex items-center gap-1.5">
							<span className="font-sans text-sm leading-5 font-semibold tracking-normal text-slate-900">
								{message.sender}
							</span>
							{message.badge && (
								<RoleBadge
									badge={message.badge}
									labels={labels}
								/>
							)}
						</div>
						<span className="text-[11px] text-slate-500">
							{message.company || message.role}
						</span>
					</div>
				</div>

				{hasMenu && (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md p-0 text-slate-800 transition-colors hover:bg-slate-100 data-[state=open]:bg-slate-200"
								aria-label={`${t(localizationConstants.actions)} ${message.sender}`}
							>
								<MoreVertical
									size={16}
									className="text-slate-800"
									aria-hidden
								/>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="end"
							className="w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
						>
							{onMarkAsRead && labels.markAsRead && (
								<DropdownMenuItem
									onClick={() => onMarkAsRead(message.id)}
									className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 transition-colors hover:bg-slate-50"
								>
									<CircleCheckBig
										size={16}
										className="shrink-0 text-slate-700"
										aria-hidden
									/>
									<span>{t(labels.markAsRead)}</span>
								</DropdownMenuItem>
							)}
							{onArchive && labels.archive && (
								<DropdownMenuItem
									onClick={() => onArchive(message.id)}
									className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 transition-colors hover:bg-slate-50"
								>
									<Archive
										size={16}
										className="shrink-0 text-slate-700"
										aria-hidden
									/>
									<span>{t(labels.archive)}</span>
								</DropdownMenuItem>
							)}
							{onDelete && labels.delete && (
								<DropdownMenuItem
									onClick={() => onDelete(message.id)}
									className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-800 transition-colors hover:bg-slate-50"
								>
									<Trash2
										size={16}
										className="shrink-0 text-slate-700"
										aria-hidden
									/>
									<span>{t(labels.delete)}</span>
								</DropdownMenuItem>
							)}
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>

			<div className="mt-2 flex items-baseline justify-between gap-3">
				<p className="font-sans text-sm leading-5 font-normal tracking-normal text-slate-950">
					{message.message}
				</p>
				<span className="shrink-0 text-right font-sans text-xs leading-4 font-normal tracking-normal text-slate-500">
					{message.date}
				</span>
			</div>

			{message.answered ? (
				<div className="mt-3.5 border-t border-slate-100 pt-3">
					<div className="flex items-start gap-2.5">
						<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
							{initialsOf(message.answerUser ?? currentUserName)}
						</div>
						<div className="flex flex-1 flex-col">
							<div className="flex items-center gap-1.5">
								<span className="font-sans text-sm leading-5 font-semibold tracking-normal text-slate-900">
									{message.answerUser ?? currentUserName}
								</span>
								<span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700">
									{message.answerBadge ??
										t(labels.answerBadge)}
								</span>
							</div>
							<span className="text-[11px] font-normal text-slate-400">
								{t(labels.answerSubLabel)}
							</span>
							<div className="mt-1 flex items-baseline justify-between gap-3">
								<p className="font-sans text-sm leading-5 font-normal tracking-normal text-slate-950">
									{message.answerText}
								</p>
								<span className="shrink-0 text-right font-sans text-xs leading-4 font-normal tracking-normal text-slate-500">
									{message.answerDate ?? message.date}
								</span>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div className="mt-3.5 flex flex-col gap-2 border-t border-slate-100 pt-3">
					<div className="flex items-center gap-2">
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-medium text-slate-500">
							{currentInitials}
						</div>
						<span className="font-sans text-sm leading-5 font-semibold tracking-normal text-slate-900">
							{currentUserName}
						</span>
					</div>

					<Textarea
						value={comment}
						onChange={(event) => setComment(event.target.value)}
						placeholder={t(labels.leaveComment)}
						aria-label={t(labels.leaveComment)}
						rows={3}
						className="min-h-[70px] w-full resize-y rounded-lg border border-slate-200 bg-white p-2.5 font-sans text-sm leading-5 font-normal tracking-normal text-slate-950 shadow-none placeholder:text-slate-500 focus:border-slate-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-slate-300"
					/>

					<span className="font-sans text-sm leading-5 font-normal tracking-normal text-slate-500">
						{t(labels.leaveComment)}
					</span>

					<div className="flex w-full items-center justify-end gap-2 pt-1">
						<Button
							type="button"
							variant="secondary"
							onClick={() => setComment("")}
							className={`flex h-[36px] w-[120px] items-center justify-center rounded-md px-4 py-2 font-sans text-[14px] leading-[20px] font-medium tracking-normal shadow-none transition-colors ${
								comment.trim()
									? "cursor-pointer bg-slate-100 text-slate-900 hover:bg-slate-200"
									: "cursor-default bg-slate-100 text-slate-400"
							}`}
						>
							{t(labels.cancel)}
						</Button>
						<Button
							type="button"
							disabled={!comment.trim()}
							onClick={() => {
								const text = comment.trim();
								if (!text) return;
								onSendReply(message.id, text);
								setComment("");
							}}
							className={`flex h-[36px] w-[120px] items-center justify-center rounded-md px-4 py-2 font-sans text-[14px] leading-[20px] font-medium tracking-normal transition-colors ${
								comment.trim()
									? "cursor-pointer bg-slate-900 text-white shadow-2xs hover:bg-slate-800"
									: "cursor-not-allowed bg-slate-100 text-slate-400"
							}`}
						>
							{t(labels.send)}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

export default QAThreadCard;
