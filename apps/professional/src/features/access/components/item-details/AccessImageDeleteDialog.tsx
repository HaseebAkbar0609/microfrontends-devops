"use client";

import localizationConstants from "@/utils/translation/constants";
import type { AccessImage } from "../../types/accessItemDetails.types";
import { AccessConfirmDialog, type AccessConfirmText } from "../AccessConfirmDialog";

interface AccessImageDeleteDialogProps {
	/** The picture waiting for confirmation; null keeps the dialog closed. */
	target: AccessImage | null;
	onConfirm: (image: AccessImage) => void;
	onCancel: () => void;
}

const describe = (image: AccessImage): AccessConfirmText => ({
	title: localizationConstants.accessImageDeleteTitle,
	description: localizationConstants.accessImageDeleteDescription,
	values: { name: image.caption },
});

/** Removing a picture cannot be undone, so it asks first. */
export function AccessImageDeleteDialog({ target, onConfirm, onCancel }: AccessImageDeleteDialogProps) {
	return <AccessConfirmDialog target={target} describe={describe} onConfirm={onConfirm} onCancel={onCancel} />;
}
