"use client";

import React, { useState, useRef } from "react";
import { Paperclip } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";
import { showToast } from "@/lib/toast";
import type { CaseMessage } from "../../../types/cases.types";

interface CaseConversationProps {
	messages: CaseMessage[];
	onSendMessage: (content: string) => void;
}

export function CaseConversation({
	messages,
	onSendMessage,
}: CaseConversationProps) {
	const { t } = useTranslation();
	const [replyText, setReplyText] = useState("");
	const attachInputRef = useRef<HTMLInputElement>(null);

	const handleAttach = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		const fileNames = Array.from(files).map((f) => f.name).join(", ");
		setReplyText((prev) => (prev ? `${prev} [${fileNames}]` : `[${fileNames}]`));
		showToast("success", t(localizationConstants.casesToastFileUploaded));
		if (attachInputRef.current) {
			attachInputRef.current.value = "";
		}
	};

	const handleSend = () => {
		if (replyText.trim()) {
			onSendMessage(replyText.trim());
			setReplyText("");
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col h-full space-y-6">
			{/* Card Header matching Figma Image 2 */}
			<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.casesTabConversation} />
			</h2>

			{/* Conversation Stream */}
			<div className="flex-1 overflow-y-auto space-y-6 max-h-[520px] pr-1">
				{messages.length === 0 ? (
					<p className="text-xs text-slate-400 italic py-8 text-center">
						<Translate text={localizationConstants.casesNoMessagesYet} />
					</p>
				) : (
					messages.map((msg, index) => {
						const isSupport =
							msg.author.toLowerCase().includes("support") ||
							msg.authorRole?.toLowerCase().includes("it");

						return (
							<div
								key={msg.id || index}
								className={`flex flex-col space-y-2 ${
									isSupport ? "items-end" : "items-start"
								}`}
							>
								{/* Header with avatar / badge */}
								<div className="flex items-center gap-2">
									{!isSupport ? (
										<>
											<div className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px]">
												{msg.authorRole || "SE"}
											</div>
											<span className="text-xs font-bold text-slate-900">
												{msg.author}
											</span>
										</>
									) : (
										<>
											<span className="text-xs font-bold text-slate-900">
												{msg.author}
											</span>
											<span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600">
												IT
											</span>
										</>
									)}
								</div>

								{/* Message Box */}
								<div
									className={`p-4 rounded-xl text-xs max-w-xl border leading-relaxed ${
										isSupport
											? "bg-slate-100/70 border-slate-200 text-slate-900"
											: "bg-white border-slate-200 text-slate-900"
									}`}
								>
									{msg.content}
								</div>

								{/* Timestamp */}
								<p className="text-[11px] text-slate-400 px-1 font-normal">
									{msg.createdAt}
								</p>
							</div>
						);
					})
				)}
			</div>

			{/* Reply Composer Box matching Figma Image 2 */}
			<div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 shadow-2xs">
				<textarea
					rows={3}
					value={replyText}
					onChange={(e) => setReplyText(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={t(localizationConstants.casesConversationReplyPlaceholder)}
					className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
				/>

				<input
					ref={attachInputRef}
					type="file"
					multiple
					className="hidden"
					onChange={handleAttach}
				/>

				<div className="flex items-center justify-between pt-2 border-t border-slate-100">
					<button
						type="button"
						onClick={() => attachInputRef.current?.click()}
						className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
					>
						<Paperclip className="w-3.5 h-3.5" />
						<Translate text={localizationConstants.casesBtnAttach} />
					</button>

					<div className="flex items-center gap-2.5">
						<button
							type="button"
							onClick={() => setReplyText("")}
							className="h-8 px-4 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
						>
							<Translate text={localizationConstants.casesBtnCancel} />
						</button>

						<button
							type="button"
							onClick={handleSend}
							disabled={!replyText.trim()}
							className="h-8 px-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-2xs"
						>
							<Translate text={localizationConstants.casesBtnSend} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CaseConversation;
