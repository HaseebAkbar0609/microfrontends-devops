"use client";

import { Archive, ArchiveRestore, Eye, Printer, Trash2 } from "lucide-react";

import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { RowActionMenu, RowMenuAction } from "../../components/RowActionMenu";

export interface ProtocolRowMenuProps {
	/** The protocol's Benämning, so a screen reader knows which row the ⋮ is for. */
	label: string;
	archived: boolean;
	/** Öppna opens a stored file or a Standard meeting; a seeded file or an Action protocol has neither. */
	canOpen: boolean;
	/** Skriv ut prints a stored file only. */
	canPrint: boolean;
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
export function ProtocolRowMenu({ label, archived, canOpen, canPrint, onOpen, onToggleArchive, onPrint, onDelete }: ProtocolRowMenuProps) {
	const t = useTranslate();
	const noFile = localizationConstants.projectProtocolNoFile;

	return (
		<RowActionMenu ariaLabel={t(localizationConstants.projectProtocolRowActions, { label })}>
			<RowMenuAction icon={Eye} labelKey={localizationConstants.projectListOpen} reasonKey={canOpen ? null : noFile} onSelect={onOpen} />
			<RowMenuAction
				icon={archived ? ArchiveRestore : Archive}
				labelKey={archived ? localizationConstants.actionRestore : localizationConstants.projectListArchiveAction}
				reasonKey={null}
				onSelect={onToggleArchive}
			/>
			<RowMenuAction icon={Printer} labelKey={localizationConstants.projectListPrint} reasonKey={canPrint ? null : noFile} onSelect={onPrint} />
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
