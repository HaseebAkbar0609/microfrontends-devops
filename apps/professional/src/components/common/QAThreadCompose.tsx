"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useTranslate } from "@/utils/translation/translate";
import { initialsOf, type QAThreadLabels } from "./qaThread";

/** Long enough for any real reply; stops a paste from growing without bound. */
export const QA_REPLY_MAX_LENGTH = 2000;

export interface QAThreadComposeProps {
	id: string;
	labels: QAThreadLabels;
	currentUserName: string;
	/** A draft to start from. */
	initialText?: string;
	onSendReply: (id: string, text: string) => void;
}

/**
 * The reply box under an unanswered question: who is replying, the field with
 * its helper line, and Avbryt / Skicka. Skicka stays disabled until there is
 * something other than whitespace to send.
 */
export function QAThreadCompose({
	id,
	labels,
	currentUserName,
	initialText = "",
	onSendReply,
}: QAThreadComposeProps) {
	const t = useTranslate();
	const [comment, setComment] = useState(initialText);
	const text = comment.trim();

	return (
		<>
			<div className="flex w-full flex-col gap-2">
				<div className="flex items-center gap-2">
					<span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-medium text-zinc-500">
						{initialsOf(currentUserName)}
					</span>
					<span className="text-sm leading-5 font-semibold text-zinc-950">
						{currentUserName}
					</span>
				</div>

				{/* The frame draws the helper under the field and no placeholder
				    inside it, so the field is named by `aria-label` instead. */}
				<Textarea
					value={comment}
					onChange={(event) => setComment(event.target.value)}
					aria-label={t(labels.leaveComment)}
					maxLength={QA_REPLY_MAX_LENGTH}
					className="h-20 min-h-20 w-full resize-y rounded-md border-slate-200 bg-white px-3 py-2.5 text-sm leading-5 text-slate-950 shadow-none focus-visible:ring-1 focus-visible:ring-slate-300"
				/>
				<span className="text-sm leading-5 text-slate-500">
					{t(labels.leaveComment)}
				</span>
			</div>

			<div className="flex w-full items-center justify-end gap-3">
				<Button
					type="button"
					variant="secondary"
					onClick={() => setComment("")}
					className="h-9 w-[120px] cursor-pointer rounded-md bg-zinc-100 px-4 text-sm font-medium text-zinc-950 shadow-2xs hover:bg-zinc-200"
				>
					{t(labels.cancel)}
				</Button>
				<Button
					type="button"
					disabled={!text}
					onClick={() => {
						if (!text) return;
						onSendReply(id, text);
						setComment("");
					}}
					className={cn(
						"h-9 w-[120px] rounded-md px-4 text-sm font-medium",
						text
							? "cursor-pointer bg-zinc-900 text-white shadow-2xs hover:bg-zinc-800"
							: "cursor-not-allowed bg-zinc-100 text-zinc-400 disabled:opacity-100",
					)}
				>
					{t(labels.send)}
				</Button>
			</div>
		</>
	);
}

export default QAThreadCompose;
