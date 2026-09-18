import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { PartnerApprovalStatus } from "../constants/partners";

const APPROVAL_STATUS_STYLES: Record<PartnerApprovalStatus, { className: string; labelKey: string }> = {
	approved: { className: "bg-green-500", labelKey: localizationConstants.approvalStatusApproved },
	declined: { className: "bg-red-500", labelKey: localizationConstants.approvalStatusDeclined },
	pending: { className: "bg-orange-500", labelKey: localizationConstants.approvalStatusPending },
	archived: { className: "bg-slate-400", labelKey: localizationConstants.approvalStatusArchived },
};

export function ApprovalStatusBadge({ approvalStatus }: { approvalStatus: PartnerApprovalStatus }) {
	const statusStyle = APPROVAL_STATUS_STYLES[approvalStatus];

	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold text-white ${statusStyle.className}`}
		>
			<Translate text={statusStyle.labelKey} />
		</span>
	);
}
