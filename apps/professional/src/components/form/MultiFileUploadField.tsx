"use client";

import { useRef } from "react";
import { ChevronDown, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";

export interface PendingUploadFile {
	name: string;
	file: File;
}

export interface MultiFileUploadFieldProps {
	/** Files chosen but not yet committed, shown as removable chips. */
	pendingFiles: PendingUploadFile[];
	onSelectFiles: (files: File[]) => void;
	onRemovePending: (name: string) => void;
	/** Fires when the action button is pressed with files already chosen. */
	onUpload?: () => void;
	accept?: string;
	isUploading?: boolean;
	buttonLabel?: TranslationKeys;
	placeholder?: TranslationKeys;
	className?: string;
}

/**
 * Multi-file picker rendering each chosen file as a removable chip.
 *
 * Distinct from `FormFileUpload`, which is single-file, bound to react-hook-form
 * and oriented around image previews. This one is unbound: the caller owns the
 * pending list and decides what "upload" means.
 */
export function MultiFileUploadField({
	pendingFiles,
	onSelectFiles,
	onRemovePending,
	onUpload,
	accept = ".png,.jpg,.jpeg,.pdf",
	isUploading = false,
	buttonLabel = localizationConstants.agreementUpload,
	placeholder = localizationConstants.agreementNoFile,
	className,
}: MultiFileUploadFieldProps) {
	const t = useTranslate();
	const inputRef = useRef<HTMLInputElement>(null);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (files && files.length > 0) {
			onSelectFiles(Array.from(files));
		}
		// Reset so re-picking the same file still fires a change event.
		if (inputRef.current) inputRef.current.value = "";
	};

	const handleAction = () => {
		if (pendingFiles.length > 0 && onUpload) {
			onUpload();
			return;
		}
		inputRef.current?.click();
	};

	return (
		<div className={cn("flex min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:items-center", className)}>
			<button
				type="button"
				onClick={() => inputRef.current?.click()}
				disabled={isUploading}
				className="flex min-w-0 flex-1 cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-left focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:outline-none"
			>
				<span className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
					{pendingFiles.length === 0 ? (
						<span className="text-sm text-slate-400">
							<Translate text={placeholder} />
						</span>
					) : (
						pendingFiles.map((pending) => (
							<span
								key={pending.name}
								className="inline-flex min-w-0 max-w-full items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm text-slate-700"
							>
								<span className="min-w-0 break-all">{pending.name}</span>
								<span
									role="button"
									tabIndex={0}
									aria-label={`${t(localizationConstants.actionDelete)} ${pending.name}`}
									onClick={(event) => {
										event.stopPropagation();
										onRemovePending(pending.name);
									}}
									onKeyDown={(event) => {
										if (
											event.key === "Enter" ||
											event.key === " "
										) {
											event.preventDefault();
											event.stopPropagation();
											onRemovePending(pending.name);
										}
									}}
									className="ml-1 cursor-pointer text-slate-400 hover:text-slate-600"
								>
									<X className="h-3 w-3" />
								</span>
							</span>
						))
					)}
				</span>
				<ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
			</button>

			<input
				ref={inputRef}
				type="file"
				multiple
				accept={accept}
				className="hidden"
				onChange={handleChange}
			/>

			<Button
				type="button"
				disabled={isUploading}
				onClick={handleAction}
				className="h-9 min-w-25 cursor-pointer bg-[#111721] text-white hover:bg-slate-800 disabled:opacity-50"
			>
				<Translate text={buttonLabel} />
			</Button>
		</div>
	);
}

export default MultiFileUploadField;
