import AgreementDetailView from "@/features/agreement/components/AgreementDetailView";
import { DUMMY_AGREEMENT_DETAIL } from "@/features/agreement/constants/agreementDetail";

export default function AgreementDetailPage() {
	return (
		<div className="flex flex-1 flex-col bg-slate-50">
			<AgreementDetailView data={DUMMY_AGREEMENT_DETAIL} />
		</div>
	);
}
