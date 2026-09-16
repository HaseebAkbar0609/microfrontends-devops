"use client";

import { Archive, ArchiveRestore, Eye, Trash2 } from "lucide-react";

import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { RowActionMenu, RowMenuAction } from "../../components/RowActionMenu";

export interface DocumentRowMenuProps {
	/** The file's name, so a screen reader knows which row the ⋮ is for. */
	label: string;
	archived: boolean;
	/** Seeded files have no stored file behind them, so Visa says why it cannot open them. */
	hasFile: boolean;
	onOpen: () => void;
	onToggleArchive: () => void;
	onDelete: () => void;
}

/**
 * A row's ⋮. The frame draws Radera and Arkivera; Visa is added first so a file
 * can be opened or downloaded. Under Arkiv, Arkivera becomes Återställ, which is
 * how an archived file comes back — as Besiktning does.
 */
export function DocumentRowMenu({ label, archived, hasFile, onOpen, onToggleArchive, onDelete }: DocumentRowMenuProps) {
	const t = useTranslate();

	const open = (
		<RowMenuAction
			icon={Eye}
			labelKey={localizationConstants.projectDocumentsView}
			reasonKey={hasFile ? null : localizationConstants.projectDocumentsNoFile}
			onSelect={onOpen}
		/>
	);
	const remove = (
		<RowMenuAction icon={Trash2} labelKey={localizationConstants.projectListDeleteAction} reasonKey={null} destructive onSelect={onDelete} />
	);

	return (
		<RowActionMenu ariaLabel={t(localizationConstants.projectDocumentsRowActions, { label })}>
			{open}
			{archived ? (
				<>
					<RowMenuAction icon={ArchiveRestore} labelKey={localizationConstants.actionRestore} reasonKey={null} onSelect={onToggleArchive} />
					{remove}
				</>
			) : (
				<>
					{remove}
					<RowMenuAction icon={Archive} labelKey={localizationConstants.projectListArchiveAction} reasonKey={null} onSelect={onToggleArchive} />
				</>
			)}
		</RowActionMenu>
	);
}

export default DocumentRowMenu;
