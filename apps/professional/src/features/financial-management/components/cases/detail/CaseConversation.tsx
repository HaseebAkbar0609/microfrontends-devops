"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CaseMessage } from "../../../types/cases.types";
import { CaseComposer } from "./CaseComposer";
import { CaseMessageBubble } from "./CaseMessageBubble";

interface CaseConversationProps {
	messages: CaseMessage[];
	/** Sends a reply, with whatever files were picked for it. */
	onSendMessage: (content: string, files: File[]) => void;
}

/** The case's thread and the box for adding to it. */
export function CaseConversation({ messages, onSendMessage }: CaseConversationProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs flex flex-col h-full space-y-6">
			{/* Card Header matching Figma Image 2 */}
			<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.casesTabConversation} />
			</h2>

			<div className="flex-1 overflow-y-auto space-y-6 max-h-[520px] pr-1">
				{messages.length === 0 ? (
					<p className="text-xs text-slate-400 italic py-8 text-center">
						<Translate text={localizationConstants.casesNoMessagesYet} />
					</p>
				) : (
					messages.map((message, index) => (
						<CaseMessageBubble key={message.id || index} message={message} />
					))
				)}
			</div>

			<CaseComposer onSend={onSendMessage} />
		</div>
	);
}

export default CaseConversation;
