"use client";

import { useState } from "react";
import { Clock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { SUPPORT_CURRENT_USER_ID } from "../../constants/support.constants";
import type { SupportAgent, SupportTicket } from "../../types";
import { findAgent, formatDateTime } from "../../utils/supportFormatters";
import { TicketActionMessage } from "./TicketActionMessage";

type TicketActionLogProps = {
	ticket: SupportTicket;
	agents: SupportAgent[];
	onAddComment: (text: string) => void;
};

export function TicketActionLog({
	ticket,
	agents,
	onAddComment,
}: TicketActionLogProps) {
	const [comment, setComment] = useState("");
	const [error, setError] = useState<string | null>(null);
	const t = useTranslate();

	const submit = () => {
		if (!comment.trim()) {
			setError(localizationConstants.supportValidationCommentRequired);
			return;
		}
		onAddComment(comment.trim());
		setComment("");
		setError(null);
		showToast("success", t(localizationConstants.supportCommentAddedToast));
	};

	return (
		<section className="@container rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
			<h2 className="text-base font-semibold text-slate-900">
				<Translate text={localizationConstants.supportActionLogTitle} />
			</h2>

			<ol className="mt-4 space-y-4">
				{ticket.actions.map((action) => {
					const author = findAgent(agents, action.authorId);
					const authorLabel = author?.name ?? null;
					return (
						<li key={action.id} className="flex items-start gap-3">
							<span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500">
								<Clock className="h-3.5 w-3.5" />
							</span>
							<div className="min-w-0 flex-1">
								<p className="text-sm text-slate-900">
									<TicketActionMessage action={action} />
								</p>
								<p className="mt-0.5 text-xs text-slate-500">
									{authorLabel ?? (
										<Translate
											text={
												action.authorId === SUPPORT_CURRENT_USER_ID
													? localizationConstants.supportYouAuthor
													: localizationConstants.supportSystemAuthor
											}
										/>
									)}{" "}
									· {formatDateTime(action.at)}
								</p>
							</div>
						</li>
					);
				})}
			</ol>

			<div className="my-5 h-px bg-slate-200" />

			<div className="space-y-1.5">
				<Label htmlFor="ticket-comment">
					<Translate text={localizationConstants.supportNewActionLabel} />
				</Label>
				<Textarea
					id="ticket-comment"
					value={comment}
					rows={3}
					placeholder={t(localizationConstants.supportCommentPlaceholder)}
					aria-invalid={error ? true : undefined}
					onChange={(event) => {
						setComment(event.target.value);
						setError(null);
					}}
					className="min-h-20"
				/>
				{error ? (
					<p className="text-xs text-red-600">
						<Translate text={error} />
					</p>
				) : null}
			</div>

			<Button
				type="button"
				size="sm"
				className="mt-3 cursor-pointer gap-2 bg-[#18181B] text-white hover:bg-[#18181B]/90"
				onClick={submit}
			>
				<Send className="h-4 w-4" />
				<Translate text={localizationConstants.supportSaveActionButton} />
			</Button>
		</section>
	);
}
