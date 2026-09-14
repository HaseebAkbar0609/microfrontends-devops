"use client";

import { useTranslate } from "@/utils/translation/translate";
import {
	initialsOf,
	type QAThreadLabels,
	type QAThreadMessage,
} from "./qaThread";

export interface QAThreadAnswerProps {
	message: QAThreadMessage;
	labels: QAThreadLabels;
	currentUserName: string;
}

/**
 * The reply under an answered question. As the Figma component draws it, the
 * answer runs the full width of the card under the author row rather than
 * being indented beside the avatar.
 */
export function QAThreadAnswer({
	message,
	labels,
	currentUserName,
}: QAThreadAnswerProps) {
	const t = useTranslate();
	const author = message.answerUser ?? currentUserName;

	return (
		<div className="flex w-full flex-col gap-2">
			<div className="flex items-center gap-2">
				<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-500">
					{initialsOf(author)}
				</span>
				<div className="flex min-w-0 flex-col gap-0.5">
					<div className="flex flex-wrap items-center gap-2">
						<span className="text-sm leading-5 font-semibold text-zinc-950">
							{author}
						</span>
						<span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs leading-4 font-medium text-zinc-950 shadow-2xs">
							{message.answerBadge ?? t(labels.answerBadge)}
						</span>
					</div>
					<span className="text-xs leading-4 text-slate-500">
						{t(labels.answerSubLabel)}
					</span>
				</div>
			</div>

			<div className="flex w-full items-start gap-2">
				<p className="min-w-0 flex-1 text-sm leading-5 break-words text-slate-950">
					{message.answerText}
				</p>
				<span className="w-20 shrink-0 text-right text-xs leading-4 text-slate-500">
					{message.answerDate ?? message.date}
				</span>
			</div>
		</div>
	);
}

export default QAThreadAnswer;
