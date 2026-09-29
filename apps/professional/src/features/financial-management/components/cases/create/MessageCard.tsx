"use client";

import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Translate } from "@/utils/translation/translate";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { useTranslation } from "react-i18next";

interface MessageCardProps {
	message: string;
	error?: TranslationKeys;
	onChange: (value: string) => void;
}

export function MessageCard({ message, error, onChange }: MessageCardProps) {
	const { t } = useTranslation();

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
			<h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
				<Translate text={localizationConstants.casesCardMessages} />
			</h2>

			<div className="space-y-1.5 text-xs">
				<label className="block font-medium text-slate-700">
					<Translate text={localizationConstants.casesFieldYourMessage} />
					<span className="text-rose-500 ml-0.5">*</span>
				</label>
				<Textarea
					rows={4}
					value={message}
					onChange={(e) => onChange(e.target.value)}
					placeholder={t(localizationConstants.casesPlaceholderWriteHere)}
					className={`resize-none bg-white text-xs text-slate-800 ${
						error ? "border-rose-400 bg-rose-50/20" : "border-slate-200"
					}`}
				/>
				{error && (
					<p className="text-[11px] text-rose-600">
						<Translate text={error} />
					</p>
				)}
			</div>
		</div>
	);
}

export default MessageCard;
