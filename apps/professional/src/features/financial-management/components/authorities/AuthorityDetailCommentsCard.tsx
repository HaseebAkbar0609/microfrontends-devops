"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, User } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { AuthorityComment } from "../../types/authorities.types";

interface AuthorityDetailCommentsCardProps {
	comments?: AuthorityComment[];
	onAddComment: (message: string) => void;
}

export function AuthorityDetailCommentsCard({
	comments,
	onAddComment,
}: AuthorityDetailCommentsCardProps) {
	const [newComment, setNewComment] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newComment.trim()) return;
		onAddComment(newComment.trim());
		setNewComment("");
	};

	const defaultComments: AuthorityComment[] = [
		{
			id: "c1",
			author: "Erik Eriksson",
			date: "2025-05-15 10:24",
			message: "Fakturan har skapats och underlag från tidrapporter har bifogats.",
		},
		{
			id: "c2",
			author: "Anna Andersson",
			date: "2025-05-15 14:32",
			message: "Mottagit och godkänt specifikationen för veckostädning.",
		},
	];

	const displayComments =
		comments && comments.length > 0 ? comments : defaultComments;

	return (
		<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col h-full">
			{/* Header */}
			<div className="p-4 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<MessageSquare className="h-4 w-4 text-slate-600" />
					<h3 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.commentsTitle} />
					</h3>
				</div>
				<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-200/80 text-slate-700">
					{displayComments.length}
				</span>
			</div>

			{/* Comments List */}
			<div className="p-4 flex-1 space-y-4 overflow-y-auto max-h-[480px]">
				{displayComments.map((comment) => (
					<div key={comment.id} className="flex items-start gap-3 text-xs">
						<div className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 font-bold text-[10px]">
							{comment.author ? comment.author.charAt(0).toUpperCase() : <User className="h-3.5 w-3.5" />}
						</div>
						<div className="flex-1 space-y-1">
							<div className="flex items-center justify-between">
								<span className="font-semibold text-slate-900">
									{comment.author}
								</span>
								<span className="text-[10px] text-slate-400">
									{comment.date}
								</span>
							</div>
							<div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 leading-relaxed">
								{comment.message}
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Input Box */}
			<form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-slate-50/40">
				<Textarea
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					placeholder="Skriv en kommentar eller anteckning..."
					rows={3}
					className="w-full text-xs bg-white border-slate-200 rounded-lg resize-none mb-2 focus:ring-slate-400"
				/>
				<div className="flex justify-end">
					<Button
						type="submit"
						size="sm"
						disabled={!newComment.trim()}
						className="h-8 px-3 text-xs bg-slate-900 text-white hover:bg-slate-800 gap-1.5"
					>
						<Send className="h-3 w-3" />
						<Translate text={localizationConstants.actionSend} />
					</Button>
				</div>
			</form>
		</div>
	);
}

export default AuthorityDetailCommentsCard;
