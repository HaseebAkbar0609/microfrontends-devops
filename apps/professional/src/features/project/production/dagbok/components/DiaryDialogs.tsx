"use client";

import { ConfirmActionDialog } from "@/components/dialog/ConfirmActionDialog";
import localizationConstants from "@/utils/translation/constants";
import type { DiaryEditorState } from "../form/useDiaryEditor";

/** The editor's three confirms: publish, discard changes, and save that removes the signatures. */
export function DiaryDialogs({ editor }: { editor: DiaryEditorState }) {
	const close = (open: boolean) => !open && editor.closeConfirm();

	return (
		<>
			<ConfirmActionDialog
				open={editor.confirm === "publish"}
				onOpenChange={close}
				title={localizationConstants.projectDiaryPublishTitle}
				description={editor.dirty ? localizationConstants.projectDiaryPublishSaveBody : localizationConstants.projectDiaryPublishBody}
				confirmLabel={localizationConstants.projectDiaryPublish}
				onConfirm={() => void editor.confirmPublish()}
			/>
			<ConfirmActionDialog
				open={editor.confirm === "discard"}
				onOpenChange={close}
				title={localizationConstants.projectDiaryDiscardTitle}
				description={localizationConstants.projectDiaryDiscardBody}
				confirmLabel={localizationConstants.projectDiaryDiscard}
				destructive
				onConfirm={editor.confirmDiscard}
			/>
			<ConfirmActionDialog
				open={editor.confirm === "clearSignatures"}
				onOpenChange={close}
				title={localizationConstants.projectDiarySignaturesClearedTitle}
				description={localizationConstants.projectDiarySignaturesClearedBody}
				confirmLabel={localizationConstants.projectDiarySaveDraft}
				onConfirm={() => void editor.confirmSave()}
			/>
		</>
	);
}

export default DiaryDialogs;
