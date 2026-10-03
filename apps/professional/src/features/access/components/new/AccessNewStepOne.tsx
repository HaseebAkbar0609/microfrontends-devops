"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import localizationConstants from "@/utils/translation/constants";
import { ACCESS_MODULE_BASE_URL, ACCESS_NEW_BASE_URL } from "../../data/accessNav.config";
import { useAccessNewDraft } from "../../context/AccessNewDraftContext";
import { useComingSoonToast } from "../../hooks/useComingSoonToast";
import { validateInfo } from "../../utils/accessNew";
import { AccessConfirmDialog } from "../AccessConfirmDialog";
import { describeNewConfirm, type AccessNewConfirmTarget } from "./accessNewDialog";
import { AccessNewContactCard } from "./AccessNewContactCard";
import { AccessNewInfoCard } from "./AccessNewInfoCard";
import { AccessNewObjectCard } from "./AccessNewObjectCard";
import { AccessStepProgress } from "./AccessStepProgress";
import { AccessWizardFooter } from "./AccessWizardFooter";

/**
 * Step 1 of the new-access wizard (TFS-1105): object link, access information and
 * contact persons. Next checks the information first; Cancel asks before throwing
 * away what was typed; the footer Save has no designed meaning yet, so it shows the coming-soon toast.
 */
export function AccessNewStepOne() {
	const router = useRouter();
	const { info, setShowInfoErrors, removeContact, reset } = useAccessNewDraft();
	const showComingSoon = useComingSoonToast();
	const [confirm, setConfirm] = useState<AccessNewConfirmTarget | null>(null);

	const goNext = () => {
		if (Object.keys(validateInfo(info)).length > 0) {
			setShowInfoErrors(true);
			return;
		}
		router.push(`${ACCESS_NEW_BASE_URL}/access`);
	};

	const confirmed = (target: AccessNewConfirmTarget) => {
		if (target.kind === "discard") {
			reset();
			router.push(ACCESS_MODULE_BASE_URL);
		} else if (target.kind === "contact") {
			removeContact(target.contact.id);
		}
		setConfirm(null);
	};

	return (
		<>
			<div className="grid flex-1 content-start gap-5 px-5 py-5 lg:grid-cols-[minmax(0,1fr)_333px]">
				<div className="flex flex-col gap-4">
					<AccessNewObjectCard />
					<AccessNewInfoCard />
					<AccessNewContactCard onRemove={(contact) => setConfirm({ kind: "contact", contact })} />
				</div>
				<aside>
					<AccessStepProgress step={1} />
				</aside>
			</div>
			<AccessWizardFooter
				onCancel={() => setConfirm({ kind: "discard" })}
				onSave={showComingSoon}
				onNext={goNext}
				nextLabel={localizationConstants.accessNewNext}
			/>
			<AccessConfirmDialog target={confirm} describe={describeNewConfirm} onConfirm={confirmed} onCancel={() => setConfirm(null)} />
		</>
	);
}
