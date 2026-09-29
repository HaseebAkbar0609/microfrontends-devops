"use client";

import { useRef, useState, type DragEvent } from "react";
import { useTranslation } from "react-i18next";
import { ImagePlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import {
	PARTNER_IMAGE_MAX_BYTES,
	PARTNER_IMAGE_MAX_MB,
	PARTNER_IMAGE_TYPES,
	type PartnerImage,
} from "../constants/imageBank";

type Rejection = { id: string; name: string; messageKey: TranslationKeys };

const ALLOWED_TYPES: readonly string[] = PARTNER_IMAGE_TYPES;

function rejectionKey(file: File): TranslationKeys | null {
	if (!ALLOWED_TYPES.includes(file.type)) return localizationConstants.imageBankInvalidType;
	if (file.size > PARTNER_IMAGE_MAX_BYTES) return localizationConstants.imageBankFileTooLarge;
	return null;
}

type ImageBankDropzoneProps = {
	onAdd: (images: PartnerImage[]) => void;
};

/** Picks or receives dropped files, adds the valid images and lists why the others were rejected. */
export function ImageBankDropzone({ onAdd }: ImageBankDropzoneProps) {
	const { t } = useTranslation();
	const inputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [rejections, setRejections] = useState<Rejection[]>([]);

	const handleFiles = (files: FileList | null) => {
		if (!files?.length) return;
		const accepted: PartnerImage[] = [];
		const rejected: Rejection[] = [];
		for (const file of Array.from(files)) {
			const messageKey = rejectionKey(file);
			if (messageKey) {
				rejected.push({ id: crypto.randomUUID(), name: file.name, messageKey });
			} else {
				accepted.push({ id: crypto.randomUUID(), name: file.name, file });
			}
		}
		setRejections(rejected);
		if (accepted.length) onAdd(accepted);
	};

	const handleDrop = (event: DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		setIsDragging(false);
		handleFiles(event.dataTransfer.files);
	};

	return (
		<div className="flex flex-col gap-2">
			<div
				className={cn(
					"flex flex-col items-center gap-3 rounded-md border-2 border-dashed px-5 py-8 text-center",
					isDragging ? "border-slate-900 bg-slate-50" : "border-slate-200",
				)}
				onDragOver={(event) => {
					event.preventDefault();
					setIsDragging(true);
				}}
				onDragLeave={(event) => {
					// Moving onto a child also fires dragleave; only reset when the pointer leaves the zone.
					if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setIsDragging(false);
				}}
				onDrop={handleDrop}
			>
				<ImagePlus className="h-8 w-8 text-slate-400" />
				<p className="text-sm font-medium text-slate-900">{t(localizationConstants.imageBankDropPrompt)}</p>
				<p className="text-xs text-slate-500">
					{t(localizationConstants.imageBankFileRules, { max: PARTNER_IMAGE_MAX_MB })}
				</p>
				<input
					ref={inputRef}
					type="file"
					multiple
					accept={PARTNER_IMAGE_TYPES.join(",")}
					className="sr-only"
					aria-label={t(localizationConstants.imageBankChooseImages)}
					onChange={(event) => {
						handleFiles(event.target.files);
						// Cleared so picking the same file again still fires a change.
						event.target.value = "";
					}}
				/>
				<Button
					type="button"
					className="h-9 cursor-pointer bg-[#18181B] text-white hover:bg-[#18181B]/90"
					onClick={() => inputRef.current?.click()}
				>
					{t(localizationConstants.imageBankChooseImages)}
				</Button>
			</div>

			{rejections.length > 0 && (
				<ul className="flex flex-col gap-1" role="alert">
					{rejections.map((rejection) => (
						<li key={rejection.id} className="text-xs text-red-600">
							{t(rejection.messageKey, { name: rejection.name, max: PARTNER_IMAGE_MAX_MB })}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
