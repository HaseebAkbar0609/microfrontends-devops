"use client";

import React, { useState } from "react";
import { FileText, Edit2, Check } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ExpenseDetailCommentCardProps {
	comment?: string;
	onSaveComment?: (comment: string) => void;
}

export function ExpenseDetailCommentCard({
	comment,
	onSaveComment,
}: ExpenseDetailCommentCardProps) {
	const defaultText =
		"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries";

	const [isEditing, setIsEditing] = useState(false);
	const [text, setText] = useState(comment || defaultText);

	const handleSave = () => {
		setIsEditing(false);
		if (onSaveComment) {
			onSaveComment(text);
		}
	};

	return (
		<div className="bg-white rounded-lg border border-slate-200 shadow-2xs p-5 mb-6">
			{/* Card Header */}
			<div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
				<div className="flex items-center gap-2">
					<FileText className="h-4 w-4 text-slate-600" />
					<h3 className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.expenseDetailCardComment} />
					</h3>
				</div>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => {
						if (isEditing) {
							handleSave();
						} else {
							setIsEditing(true);
						}
					}}
					className="h-7 px-2.5 text-xs text-slate-600 hover:text-slate-900 gap-1.5 cursor-pointer"
				>
					{isEditing ? (
						<>
							<Check className="h-3 w-3 text-emerald-600" />
							<span>Spara</span>
						</>
					) : (
						<>
							<Edit2 className="h-3 w-3 text-slate-500" />
							<span>
								<Translate text={localizationConstants.expenseDetailBtnEdit} />
							</span>
						</>
					)}
				</Button>
			</div>

			{/* Subtitle */}
			<h4 className="text-xs font-semibold text-slate-800 mb-2">
				<Translate text={localizationConstants.expenseDetailCommentSubtitle} />
			</h4>

			{/* Comment Content Box */}
			{isEditing ? (
				<div className="space-y-2">
					<Textarea
						value={text}
						onChange={(e) => setText(e.target.value)}
						rows={3}
						className="w-full text-xs text-slate-700 border-slate-200 rounded-md p-3 focus-visible:ring-1 focus-visible:ring-blue-500"
					/>
				</div>
			) : (
				<div className="p-3.5 rounded-md border border-slate-200 bg-white text-xs text-slate-600 leading-relaxed">
					{text}
				</div>
			)}
		</div>
	);
}

export default ExpenseDetailCommentCard;
