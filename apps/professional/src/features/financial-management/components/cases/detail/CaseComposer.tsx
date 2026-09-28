"use client";

import { useRef, useState } from "react";
import { Paperclip, X } from "lucide-react";

import { fileRejection } from "@/features/project/shared/recordFiles";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { CASE_MESSAGE_FILE_ACCEPT, CASE_MESSAGE_FILE_RULES } from "../../../constants/cases.constants";

export interface CaseComposerProps {
	/** Sends the reply and the files picked for it. */
	onSend: (content: string, files: File[]) => void;
}

/**
 * The reply box: what to say, and what to send with it.
 *
 * A pick is checked against the rules as it is made, so a file the thread
 * would refuse never reaches Skicka. Enter sends; Shift+Enter starts a line.
 */
export function CaseComposer({ onSend }: CaseComposerProps) {
	const t = useTranslate();
	const picker = useRef<HTMLInputElement>(null);
	const [replyText, setReplyText] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const [error, setError] = useState<TranslationKeys | null>(null);

	const pick = (picked: FileList | null) => {
		/* Read the pick before clearing the input: `picked` is the input's own
		   live list, and clearing it would empty the list under us. */
		const chosen = picked ? Array.from(picked) : [];
		if (picker.current) picker.current.value = "";
		if (chosen.length === 0) return;

		const accepted: File[] = [];
		for (const file of chosen) {
			const reason = fileRejection(file, CASE_MESSAGE_FILE_RULES);
			if (reason) {
				setError(
					reason === "size"
						? localizationConstants.casesAttachmentSizeError
						: localizationConstants.casesAttachmentTypeError,
				);
				continue;
			}
			accepted.push(file);
		}

		if (accepted.length === 0) return;
		setFiles((prev) => [...prev, ...accepted].slice(0, CASE_MESSAGE_FILE_RULES.maxCount));
		setError(null);
	};

	const send = () => {
		if (!replyText.trim() && files.length === 0) return;
		onSend(replyText.trim(), files);
		setReplyText("");
		setFiles([]);
		setError(null);
	};

	const clear = () => {
		setReplyText("");
		setFiles([]);
		setError(null);
	};

	return (
		<div className="border border-slate-200 rounded-xl p-4 bg-white space-y-3 shadow-2xs">
			<textarea
				rows={3}
				value={replyText}
				onChange={(event) => setReplyText(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === "Enter" && !event.shiftKey) {
						event.preventDefault();
						send();
					}
				}}
				placeholder={t(localizationConstants.casesConversationReplyPlaceholder)}
				className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none leading-relaxed"
			/>

			{files.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{files.map((file) => (
						<span
							key={`${file.name}-${file.lastModified}`}
							className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-700"
						>
							<span className="max-w-[12rem] truncate font-mono">{file.name}</span>
							<button
								type="button"
								onClick={() => setFiles((prev) => prev.filter((held) => held !== file))}
								aria-label={t(localizationConstants.casesAttachmentRemove, { name: file.name })}
								className="cursor-pointer text-slate-400 hover:text-slate-900"
							>
								<X className="w-3 h-3" aria-hidden />
							</button>
						</span>
					))}
				</div>
			)}

			{error && (
				<p className="text-[11px] text-red-600">
					<Translate text={error} />
				</p>
			)}

			<input
				ref={picker}
				type="file"
				multiple
				accept={CASE_MESSAGE_FILE_ACCEPT}
				className="hidden"
				onChange={(event) => pick(event.target.files)}
			/>

			<div className="flex items-center justify-between pt-2 border-t border-slate-100">
				<button
					type="button"
					onClick={() => picker.current?.click()}
					className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
				>
					<Paperclip className="w-3.5 h-3.5" />
					<Translate text={localizationConstants.casesBtnAttach} />
				</button>

				<div className="flex items-center gap-2.5">
					<button
						type="button"
						onClick={clear}
						className="h-8 px-4 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer transition-colors"
					>
						<Translate text={localizationConstants.casesBtnCancel} />
					</button>

					<button
						type="button"
						onClick={send}
						disabled={!replyText.trim() && files.length === 0}
						className="h-8 px-5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg cursor-pointer transition-colors shadow-2xs"
					>
						<Translate text={localizationConstants.casesBtnSend} />
					</button>
				</div>
			</div>
		</div>
	);
}

export default CaseComposer;
