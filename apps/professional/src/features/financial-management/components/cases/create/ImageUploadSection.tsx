"use client";

import React from "react";
import { ImageIcon } from "lucide-react";

import localizationConstants from "@/utils/translation/constants";
import { CASE_IMAGE_FILE_ACCEPT, CASE_IMAGE_FILE_RULES } from "../../../constants/cases.constants";
import { useCaseAttachments } from "../../../hooks/useCaseAttachments";
import type { CaseDocument } from "../../../types/cases.types";
import { CaseImageGrid } from "../shared/CaseImageGrid";
import { CaseUploadCard } from "./CaseUploadCard";

interface ImageUploadSectionProps {
	images: CaseDocument[];
	onAddImage: (img: CaseDocument) => void;
	onRemoveImage: (id: string) => void;
}

/** "Bilder": the pictures this case comes with. */
export function ImageUploadSection({ images, onAddImage, onRemoveImage }: ImageUploadSectionProps) {
	const attachments = useCaseAttachments({
		documents: images,
		rules: CASE_IMAGE_FILE_RULES,
		category: "image",
		onAdd: onAddImage,
		onRemove: onRemoveImage,
	});

	return (
		<CaseUploadCard
			titleKey={localizationConstants.casesImagesSectionTitle}
			icon={<ImageIcon className="h-4 w-4 text-slate-500" aria-hidden />}
			headingKey={localizationConstants.casesUploadImages}
			hintKey={localizationConstants.casesImageFormats}
			accept={CASE_IMAGE_FILE_ACCEPT}
			maxCount={CASE_IMAGE_FILE_RULES.maxCount}
			pending={attachments.pending}
			placeholderKey={localizationConstants.casesSelectImages}
			onSelect={attachments.select}
			onRemovePending={attachments.removePending}
			onUpload={attachments.upload}
			rejection={attachments.rejection}
		>
			<CaseImageGrid images={images} onRemove={attachments.remove} />
		</CaseUploadCard>
	);
}

export default ImageUploadSection;
