"use client";

import localizationConstants from "@/utils/translation/constants";
import type { AccessHolder, AccessItem } from "../../types/accessItems.types";
import { AccessConfirmDialog, type AccessConfirmText } from "../AccessConfirmDialog";

/** What is waiting for confirmation: one item, or everything a person holds. */
export type AccessDeleteTarget =
	| { kind: "item"; holder: AccessHolder; item: AccessItem }
	| { kind: "holder"; holder: AccessHolder };

interface AccessItemDeleteDialogProps {
	/** Null keeps the dialog closed. */
	target: AccessDeleteTarget | null;
	onConfirm: (target: AccessDeleteTarget) => void;
	onCancel: () => void;
}

function describe(target: AccessDeleteTarget): AccessConfirmText {
	if (target.kind === "item") {
		return {
			title: localizationConstants.accessItemDeleteTitle,
			description: localizationConstants.accessItemDeleteDescription,
			values: { id: target.item.nycId, name: target.holder.name },
		};
	}
	return {
		title: localizationConstants.accessHolderDeleteTitle,
		description: localizationConstants.accessHolderDeleteDescription,
		values: { name: target.holder.name, count: target.holder.items.length },
	};
}

/** Deleting cannot be undone, so it always asks first. */
export function AccessItemDeleteDialog({ target, onConfirm, onCancel }: AccessItemDeleteDialogProps) {
	return <AccessConfirmDialog target={target} describe={describe} onConfirm={onConfirm} onCancel={onCancel} />;
}
