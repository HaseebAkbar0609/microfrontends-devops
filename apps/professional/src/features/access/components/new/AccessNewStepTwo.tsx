"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useAccessNewDraft } from "../../context/AccessNewDraftContext";
import { useAccessRows } from "../../context/AccessRowsContext";
import { ACCESS_MODULE_BASE_URL, ACCESS_NEW_BASE_URL } from "../../data/accessNav.config";
import { useAccessNewKeyForm } from "../../hooks/useAccessNewKeyForm";
import { useComingSoonToast } from "../../hooks/useComingSoonToast";
import { buildAccessPoint, formatLocalIso, validateInfo } from "../../utils/accessNew";
import { AccessConfirmDialog } from "../AccessConfirmDialog";
import { AccessDocumentsCard } from "../item-details/AccessDocumentsCard";
import { AccessImagesCard } from "../item-details/AccessImagesCard";
import { AccessUploadRow } from "../item-details/AccessUploadRow";
import { describeNewConfirm, type AccessNewConfirmTarget } from "./accessNewDialog";
import { AccessNewAssignCard } from "./AccessNewAssignCard";
import { AccessNewKeyCard } from "./AccessNewKeyCard";
import { AccessSavedKeysCard } from "./AccessSavedKeysCard";
import { AccessStepProgress } from "./AccessStepProgress";
import { AccessWizardFooter } from "./AccessWizardFooter";

/**
 * Step 2 of the new-access wizard (TFS-1105): one key at a time (object, who gets it,
 * documents, images), "Save and add more" into the saved keys, and Save to create the
 * access, which then appears at the top of the list. Preview, Send for signature, the
 * uploads and the keys' eye icon have no designed meaning yet and show the coming-soon toast.
 */
export function AccessNewStepTwo() {
	const router = useRouter();
	const t = useTranslate();
	const { info, keys, removeKey, reset, setShowInfoErrors } = useAccessNewDraft();
	const { nextIds, add } = useAccessRows();
	const showComingSoon = useComingSoonToast();
	const keyForm = useAccessNewKeyForm();
	const [confirm, setConfirm] = useState<AccessNewConfirmTarget | null>(null);
	const [showKeysError, setShowKeysError] = useState(false);

	const saveKey = () => {
		const key = keyForm.save();
		if (!key) return;
		setShowKeysError(false);
		showToast("success", t(localizationConstants.accessNewKeySavedToast, { id: key.keyId }));
	};

	const createAccess = () => {
		if (Object.keys(validateInfo(info)).length > 0) {
			setShowInfoErrors(true);
			showToast("error", t(localizationConstants.accessNewStepOneInvalidToast));
			router.push(ACCESS_NEW_BASE_URL);
			return;
		}
		if (keys.length === 0) {
			setShowKeysError(true);
			return;
		}
		const point = buildAccessPoint(info, keys, nextIds, formatLocalIso(new Date()));
		add(point);
		showToast("success", t(localizationConstants.accessNewCreatedToast, { id: point.idNumber }));
		reset();
		router.push(ACCESS_MODULE_BASE_URL);
	};

	const confirmed = (target: AccessNewConfirmTarget) => {
		if (target.kind === "discard") {
			reset();
			router.push(ACCESS_MODULE_BASE_URL);
		} else if (target.kind === "key") {
			removeKey(target.key.id);
		}
		setConfirm(null);
	};

	return (
		<>
			<div className="grid flex-1 content-start gap-5 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_333px]">
				<div className="flex flex-col gap-4">
					<AccessNewKeyCard keyForm={keyForm} />
					<AccessNewAssignCard keyForm={keyForm} />
					<AccessDocumentsCard
						documents={[]}
						onView={showComingSoon}
						uploadSlot={
							<AccessUploadRow
								label={localizationConstants.accessNewUploadFilesLabel}
								hint={localizationConstants.accessNewUploadFilesHint}
								placeholder={localizationConstants.accessNewSelectFilesPlaceholder}
							/>
						}
					/>
					<AccessImagesCard images={[]} onRemove={showComingSoon} />
					<Button type="button" className="h-10 cursor-pointer gap-2 self-end bg-zinc-900 text-white hover:bg-zinc-800" onClick={saveKey}>
						<Translate text={localizationConstants.accessNewSaveAndAddMore} />
						<Plus className="h-4 w-4" aria-hidden />
					</Button>
					<AccessSavedKeysCard
						keys={keys}
						showEmptyError={showKeysError}
						onView={showComingSoon}
						onRemove={(key) => setConfirm({ kind: "key", key })}
					/>
				</div>
				<aside className="flex flex-col gap-3">
					<AccessStepProgress step={2} />
					<Button type="button" className="h-10 cursor-pointer bg-green-500 text-white hover:bg-green-600" onClick={showComingSoon}>
						<Translate text={localizationConstants.accessNewSendForSignature} />
					</Button>
				</aside>
			</div>
			<AccessWizardFooter
				onCancel={() => setConfirm({ kind: "discard" })}
				onSave={createAccess}
				onNext={showComingSoon}
				nextLabel={localizationConstants.accessNewPreview}
			/>
			<AccessConfirmDialog target={confirm} describe={describeNewConfirm} onConfirm={confirmed} onCancel={() => setConfirm(null)} />
		</>
	);
}
