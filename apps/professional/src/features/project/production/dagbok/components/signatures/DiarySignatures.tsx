"use client";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { DIARY_SIGNER_LABELS, DIARY_SIGNER_ROLES } from "../../projectDiary.config";
import type { DiarySignerRole, ProjectDiary } from "../../types";
import { DiarySignatureCard } from "./DiarySignatureCard";

export interface DiarySignaturesProps {
	diary: ProjectDiary;
	signers: Record<DiarySignerRole, string>;
	/** Unsaved changes: a signature has to cover what is stored, so Signera waits for Spara. */
	dirty: boolean;
	onSign: (role: DiarySignerRole) => void;
}

/** Bekräfta: Platschef and Beställare, each signing what is saved. */
export function DiarySignatures({ diary, signers, dirty, onSign }: DiarySignaturesProps) {
	return (
		<section aria-labelledby="diary-signatures-heading" className="flex flex-col gap-4">
			<h2 id="diary-signatures-heading" className="text-xl font-semibold text-slate-900">
				<Translate text={localizationConstants.projectDiarySectionSignatures} />
			</h2>
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{DIARY_SIGNER_ROLES.map((role) => (
					<DiarySignatureCard
						key={role}
						name={signers[role]}
						roleKey={DIARY_SIGNER_LABELS[role]}
						signature={diary.signatures[role]}
						blockedReason={dirty ? localizationConstants.projectDiarySignNeedsSave : null}
						onSign={() => onSign(role)}
					/>
				))}
			</div>
		</section>
	);
}

export default DiarySignatures;
