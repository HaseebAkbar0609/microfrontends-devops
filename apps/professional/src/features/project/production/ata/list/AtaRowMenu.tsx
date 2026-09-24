"use client";

import { PencilLine, Send, Trash2 } from "lucide-react";

import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { RowActionMenu, RowMenuAction } from "../../components/RowActionMenu";

export interface AtaRowMenuProps {
	ariaLabel: string;
	editReason: TranslationKeys | null;
	deleteReason: TranslationKeys | null;
	sendReason: TranslationKeys | null;
	onEdit: () => void;
	onDelete: () => void;
	onSend: () => void;
}

/** A row's ⋮, as the frame draws it: Redigera, Radera, Skicka (the frame's "Send"). */
export function AtaRowMenu({ ariaLabel, editReason, deleteReason, sendReason, onEdit, onDelete, onSend }: AtaRowMenuProps) {
	return (
		<RowActionMenu ariaLabel={ariaLabel}>
			<RowMenuAction icon={PencilLine} labelKey={localizationConstants.ataActionEdit} reasonKey={editReason} onSelect={onEdit} />
			<RowMenuAction icon={Trash2} labelKey={localizationConstants.ataActionDelete} reasonKey={deleteReason} destructive onSelect={onDelete} />
			<RowMenuAction icon={Send} labelKey={localizationConstants.ataActionSend} reasonKey={sendReason} onSelect={onSend} />
		</RowActionMenu>
	);
}

export default AtaRowMenu;
