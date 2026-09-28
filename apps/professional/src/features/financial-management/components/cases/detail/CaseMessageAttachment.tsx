"use client";

import { RecordFileIcon } from "@/features/project/production/components/RecordFileIcon";
import { openSafeUrl } from "@/lib/safeUrl";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import { CASE_MESSAGE_FILE_RULES } from "../../../constants/cases.constants";
import type { CaseMessageAttachment as Attachment } from "../../../types/cases.types";

export interface CaseMessageAttachmentProps {
	attachment: Attachment;
}

/**
 * A file sent with a reply.
 *
 * It opens while the tab still holds it. After a reload the message is still
 * here but its file is not, so the chip says so rather than offering a link
 * that would go nowhere.
 */
export function CaseMessageAttachment({ attachment }: CaseMessageAttachmentProps) {
	const t = useTranslate();
	const held = Boolean(attachment.url);
	const reason = held ? undefined : t(localizationConstants.casesAttachmentNotHeld);

	return (
		<button
			type="button"
			disabled={!held}
			title={reason}
			onClick={() => openSafeUrl(attachment.url)}
			className="flex max-w-xs items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-left text-[11px] text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400 disabled:hover:bg-white"
		>
			<RecordFileIcon fileName={attachment.name} types={CASE_MESSAGE_FILE_RULES.types} />
			<span className="truncate font-mono">{attachment.name}</span>
			{reason && <span className="sr-only">{reason}</span>}
		</button>
	);
}

export default CaseMessageAttachment;
