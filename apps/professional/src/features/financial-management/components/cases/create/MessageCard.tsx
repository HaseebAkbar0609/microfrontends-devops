"use client";

import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface MessageCardProps {
	message: string;
	onChange: (value: string) => void;
}

export function MessageCard({ message, onChange }: MessageCardProps) {
	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
			<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.casesCardMessages} />
			</h2>

			<div className="space-y-1.5 text-xs">
				<label className="block font-medium text-slate-700">
					<Translate text={localizationConstants.casesFieldYourMessage} />
				</label>
				<textarea
					rows={4}
					value={message}
					onChange={(e) => onChange(e.target.value)}
					placeholder="ditt meddelande"
					className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none"
				/>
			</div>
		</div>
	);
}

export default MessageCard;
