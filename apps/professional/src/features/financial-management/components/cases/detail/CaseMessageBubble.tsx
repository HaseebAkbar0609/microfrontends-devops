"use client";

import { initialsOf } from "@/components/common/qaThread";
import type { CaseMessage } from "../../../types/cases.types";
import { CaseMessageAttachment } from "./CaseMessageAttachment";

export interface CaseMessageBubbleProps {
	message: CaseMessage;
}

/**
 * One message in the thread: who wrote it, what they wrote, anything they sent
 * with it, and when.
 *
 * Support's replies sit on the right, as the frame draws them. Which side a
 * message takes is still read off the author's name — a field on the record
 * would be steadier, and that is noted on the ticket rather than patched here.
 */
export function CaseMessageBubble({ message }: CaseMessageBubbleProps) {
	const isSupport =
		message.author.toLowerCase().includes("support") || message.authorRole?.toLowerCase().includes("it");

	return (
		<div className={`flex flex-col space-y-2 ${isSupport ? "items-end" : "items-start"}`}>
			<div className="flex items-center gap-2">
				{!isSupport ? (
					<>
						<div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px]">
							{initialsOf(message.author)}
						</div>
						<span className="text-xs font-bold text-slate-900">{message.author}</span>
					</>
				) : (
					<>
						<span className="text-xs font-bold text-slate-900">{message.author}</span>
						{/* The role the record carries — "IT" on a support reply — which the
						    frame draws as a chip. It used to be a literal in the markup. */}
						<span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600">
							{message.authorRole || initialsOf(message.author)}
						</span>
					</>
				)}
			</div>

			<div
				className={`p-4 rounded-xl text-xs max-w-xl border leading-relaxed ${
					isSupport ? "bg-slate-100/70 border-slate-200 text-slate-900" : "bg-white border-slate-200 text-slate-900"
				}`}
			>
				{message.content}
			</div>

			{message.attachments && message.attachments.length > 0 && (
				<div className={`flex flex-wrap gap-2 ${isSupport ? "justify-end" : "justify-start"}`}>
					{message.attachments.map((attachment) => (
						<CaseMessageAttachment key={attachment.id} attachment={attachment} />
					))}
				</div>
			)}

			<p className="text-[11px] text-slate-400 px-1 font-normal">{message.createdAt}</p>
		</div>
	);
}

export default CaseMessageBubble;
