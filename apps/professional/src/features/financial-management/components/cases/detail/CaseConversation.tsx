"use client";

import React, { useState } from "react";
import { Paperclip, Send } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CaseMessage } from "../../../types/cases.types";

interface CaseConversationProps {
	messages: CaseMessage[];
	onSendMessage: (content: string) => void;
}

export function CaseConversation({
	messages,
	onSendMessage,
}: CaseConversationProps) {
	const [replyText, setReplyText] = useState("");

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
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col h-full space-y-5">
			<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.casesTabConversation} />
			</h2>

			{/* Conversation Stream */}
			<div className="flex-1 overflow-y-auto space-y-4 max-h-[500px] pr-1">
				{messages.length === 0 ? (
					<p className="text-xs text-slate-400 italic py-8 text-center">
						Inga meddelanden ännu.
					</p>
				) : (
					messages.map((msg, index) => {
						const isSupport =
							msg.author.toLowerCase().includes("support") ||
							msg.authorRole?.toLowerCase().includes("support");

						return (
							<div
								key={msg.id || index}
								className={`flex flex-col space-y-1 ${
									isSupport ? "items-end" : "items-start"
								}`}
							>
								{/* Header with author & role */}
								<div className="flex items-center gap-1.5 text-xs text-slate-700 font-semibold">
									<div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">
										{msg.author.charAt(0).toUpperCase()}
									</div>
									<span>{msg.author}</span>
									{msg.authorRole && (
										<span className="text-[10px] text-slate-400 font-normal">
											({msg.authorRole})
										</span>
									)}
								</div>

								{/* Message Box */}
								<div
									className={`p-3.5 rounded-xl text-xs max-w-xl border leading-relaxed ${
										isSupport
											? "bg-slate-100 border-slate-200 text-slate-900 rounded-tr-none"
											: "bg-white border-slate-200 text-slate-900 rounded-tl-none"
									}`}
								>
									{msg.content}
								</div>

								{/* Timestamp */}
								<p className="text-[10px] text-slate-400 px-1 font-mono">
									{msg.createdAt}
								</p>
							</div>
						);
					})
				)}
			</div>

			{/* Reply Editor Box matching Figma Image 1 */}
			<div className="border border-slate-200 rounded-xl p-3 bg-white space-y-3">
				<textarea
					rows={3}
					value={replyText}
					onChange={(e) => setReplyText(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Skriv ett meddelande..."
					className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none"
				/>

				<div className="flex items-center justify-between pt-2 border-t border-slate-100">
					<button
						type="button"
						onClick={() => alert("Bifoga fil")}
						className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
					>
						<Paperclip className="w-3.5 h-3.5" />
						<Translate text={localizationConstants.casesBtnAttach} />
					</button>

					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setReplyText("")}
							className="h-8 px-3 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
						>
							<Translate text={localizationConstants.casesBtnCancel} />
						</button>

						<button
							type="button"
							onClick={handleSend}
							disabled={!replyText.trim()}
							className="h-8 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
						>
							<Send className="w-3 h-3" />
							<Translate text={localizationConstants.casesBtnSend} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CaseConversation;
