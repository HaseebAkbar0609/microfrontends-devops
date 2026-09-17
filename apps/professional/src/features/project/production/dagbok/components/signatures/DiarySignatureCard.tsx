"use client";

import { PenLine, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { DiarySignature } from "../../types";

export interface DiarySignatureCardProps {
	/** Who is asked to sign. */
	name: string;
	roleKey: TranslationKeys;
	signature: DiarySignature | null;
	/** Why Signera cannot run now (unsaved changes), or `null`. */
	blockedReason: TranslationKeys | null;
	onSign: () => void;
}

/**
 * One of Bekräfta's cards, as drawn: the signer's name as its title, the
 * Underskrift line, Roll and Förtydligande. Signing stamps the name and the
 * day on the line; until then the line offers Signera.
 */
export function DiarySignatureCard({ name, roleKey, signature, blockedReason, onSign }: DiarySignatureCardProps) {
	const t = useTranslate();
	const reasonId = `diary-sign-${roleKey}-reason`;

	return (
		<CollapsibleSection
			title={name}
			icon={<UserRound className="h-5 w-5 text-slate-700" aria-hidden />}
			className="rounded-lg border border-slate-200 bg-white"
			headerClassName="mb-0 h-14 rounded-none rounded-t-lg px-4 pb-0 sm:px-6"
			titleClassName="text-base font-medium text-slate-900"
			contentClassName="flex flex-col gap-4 p-4 sm:p-6"
		>
			<div className="flex flex-wrap items-end gap-x-6 gap-y-2">
				<span className="text-sm font-medium text-slate-900">
					<Translate text={localizationConstants.projectDiarySignature} />
				</span>
				<div className="min-w-48 flex-1 border-b border-slate-200 pb-1">
					{signature ? (
						<p className="flex flex-wrap items-baseline justify-between gap-2">
							<span className="font-serif text-lg text-slate-900 italic">{signature.name}</span>
							<span className="text-xs text-slate-500">
								{t(localizationConstants.projectDiarySignedOn, { date: signature.signedDate })}
							</span>
						</p>
					) : (
						<div className="flex flex-wrap items-center justify-between gap-2">
							<span className="text-sm text-slate-400">
								<Translate text={localizationConstants.projectDiaryNotSigned} />
							</span>
							<Button
								type="button"
								variant="outline"
								onClick={blockedReason ? undefined : onSign}
								aria-disabled={Boolean(blockedReason) || undefined}
								aria-describedby={blockedReason ? reasonId : undefined}
								aria-label={t(localizationConstants.projectDiarySignAs, { name })}
								className="h-9 cursor-pointer gap-2 border-slate-200 aria-disabled:cursor-not-allowed aria-disabled:opacity-60"
							>
								<PenLine className="h-4 w-4" aria-hidden />
								<Translate text={localizationConstants.projectDiarySign} />
							</Button>
						</div>
					)}
				</div>
			</div>
			{!signature && blockedReason && (
				<p id={reasonId} className="text-xs text-slate-500">
					<Translate text={blockedReason} />
				</p>
			)}
			<dl className="grid grid-cols-2 gap-4 text-sm">
				<div>
					<dt className="font-medium text-slate-900"><Translate text={localizationConstants.projectDiaryRole} /></dt>
					<dd className="text-slate-500"><Translate text={roleKey} /></dd>
				</div>
				<div>
					<dt className="font-medium text-slate-900"><Translate text={localizationConstants.projectDiaryClarification} /></dt>
					<dd className="text-slate-500">{name}</dd>
				</div>
			</dl>
		</CollapsibleSection>
	);
}

export default DiarySignatureCard;
