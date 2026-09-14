"use client";

import Image from "next/image";

import { useTranslate } from "@/utils/translation/translate";
import {
	QA_BADGE_FALLBACK_STYLE,
	QA_BADGE_STYLES,
	type QAThreadLabels,
	type QAThreadMessage,
} from "./qaThread";
import { QAThreadAnswer } from "./QAThreadAnswer";
import { QAThreadCardMenu } from "./QAThreadCardMenu";
import { QAThreadCompose } from "./QAThreadCompose";

/* Existing importers reach these through the card, so it keeps exporting them. */
export {
	initialsOf,
	type QAThreadLabels,
	type QAThreadMessage,
} from "./qaThread";

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
			className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs leading-4 font-medium shadow-2xs ${
				QA_BADGE_STYLES[badge] ?? QA_BADGE_FALLBACK_STYLE
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
 * A Fråga/Svar message with its reply, built to the Figma "Q&A" component:
 * 16px padding and gaps, a 12px role chip, a 36px ⋮, and a divider between the
 * question and the answer or the reply box.
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
	return (
		<article className="flex w-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4">
			<div className="flex w-full flex-col gap-2">
				<div className="flex items-center justify-between gap-2">
					<div className="flex min-w-0 items-center gap-2">
						<div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-slate-100">
							<Image
								src="/assets/images/Avatar.svg"
								alt=""
								width={32}
								height={32}
								className="h-full w-full object-cover"
							/>
						</div>
						<div className="flex min-w-0 flex-col gap-0.5">
							<div className="flex flex-wrap items-center gap-2">
								<span className="text-sm leading-5 font-semibold text-zinc-950">
									{message.sender}
								</span>
								{message.badge && (
									<RoleBadge badge={message.badge} labels={labels} />
								)}
							</div>
							<span className="truncate text-xs leading-4 text-slate-500">
								{message.company || message.role}
							</span>
						</div>
					</div>

					<QAThreadCardMenu
						id={message.id}
						sender={message.sender}
						labels={labels}
						onMarkAsRead={onMarkAsRead}
						onArchive={onArchive}
						onDelete={onDelete}
					/>
				</div>

				<div className="flex w-full items-start gap-2">
					<p className="min-w-0 flex-1 text-sm leading-5 break-words text-slate-950">
						{message.message}
					</p>
					<span className="w-20 shrink-0 text-right text-xs leading-4 text-slate-500">
						{message.date}
					</span>
				</div>
			</div>

			<hr className="w-full border-slate-200" />

			{message.answered ? (
				<QAThreadAnswer
					message={message}
					labels={labels}
					currentUserName={currentUserName}
				/>
			) : (
				<QAThreadCompose
					id={message.id}
					labels={labels}
					currentUserName={currentUserName}
					initialText={message.replyText}
					onSendReply={onSendReply}
				/>
			)}
		</article>
	);
}

export default QAThreadCard;
