"use client";

import { Archive, ArchiveRestore, Eye, Printer, Trash2 } from "lucide-react";

import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { RowActionMenu, RowMenuAction } from "../../components/RowActionMenu";

export interface ProtocolRowMenuProps {
	/** The protocol's Benämning, so a screen reader knows which row the ⋮ is for. */
	label: string;
	archived: boolean;
	/** A seeded or template-made protocol has no stored PDF, so Öppna and Skriv ut say why they can't. */
	hasFile: boolean;
	onOpen: () => void;
	onToggleArchive: () => void;
	onPrint: () => void;
	onDelete: () => void;
}

/**
 * A row's ⋮, as the frame draws it: Öppna, Arkivera, Skriv ut and Radera —
 * the frame's "Print" and "Delate" in the record's Swedish. Under Arkiverade,
 * Arkivera becomes Återställ, which is how an archived protocol comes back.
 */
export function ProtocolRowMenu({ label, archived, hasFile, onOpen, onToggleArchive, onPrint, onDelete }: ProtocolRowMenuProps) {
	const t = useTranslate();
	const noFile = hasFile ? null : localizationConstants.projectProtocolNoFile;

	return (
		<RowActionMenu ariaLabel={t(localizationConstants.projectProtocolRowActions, { label })}>
			<RowMenuAction icon={Eye} labelKey={localizationConstants.projectListOpen} reasonKey={noFile} onSelect={onOpen} />
			<RowMenuAction
				icon={archived ? ArchiveRestore : Archive}
				labelKey={archived ? localizationConstants.actionRestore : localizationConstants.projectListArchiveAction}
				reasonKey={null}
				onSelect={onToggleArchive}
			/>
			<RowMenuAction icon={Printer} labelKey={localizationConstants.projectListPrint} reasonKey={noFile} onSelect={onPrint} />
			<RowMenuAction
				icon={Trash2}
				labelKey={localizationConstants.projectListDeleteAction}
				reasonKey={null}
				destructive
				onSelect={onDelete}
			/>
		</RowActionMenu>
	);
}

export default ProtocolRowMenu;
