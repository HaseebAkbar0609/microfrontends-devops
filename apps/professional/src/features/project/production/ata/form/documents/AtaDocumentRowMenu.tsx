"use client";

import { useRef } from "react";
import { PencilLine, Trash2 } from "lucide-react";

import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { AtaActionMenu, AtaMenuAction } from "../../list/AtaRowMenu";

export interface AtaDocumentRowMenuProps {
	fileName: string;
	lockReason: TranslationKeys | null;
	/** Redigera: the name field takes focus once the menu has closed. */
	onFocusName: () => void;
	onDelete: () => void;
}

/** An attached document's ⋮ on the project's own ÄTA: Redigera (focuses its name) and Radera. */
export function AtaDocumentRowMenu({ fileName, lockReason, onFocusName, onDelete }: AtaDocumentRowMenuProps) {
	const t = useTranslate();
	const focusNameOnClose = useRef(false);

	return (
		<AtaActionMenu
			ariaLabel={t(localizationConstants.projectAtaRowActions, { label: fileName })}
			onCloseAutoFocus={(event) => {
				/* Radix returns focus to ⋮ on close; Redigera wants it in the name field. */
				if (!focusNameOnClose.current) return;
				focusNameOnClose.current = false;
				event.preventDefault();
				onFocusName();
			}}
		>
			<AtaMenuAction
				icon={PencilLine}
				labelKey={localizationConstants.ataActionEdit}
				reasonKey={lockReason}
				onSelect={() => {
					focusNameOnClose.current = true;
				}}
			/>
			<AtaMenuAction
				icon={Trash2}
				labelKey={localizationConstants.ataActionDelete}
				reasonKey={lockReason}
				destructive
				onSelect={onDelete}
			/>
		</AtaActionMenu>
	);
}

export default AtaDocumentRowMenu;
