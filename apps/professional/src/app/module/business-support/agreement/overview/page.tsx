import { PageHeader } from "@/components/layout/PageHeader";
import AgreementOverview from "@/features/agreement/components/AgreementOverview";
import { AGREEMENT_LIST_BREADCRUMBS } from "@/features/agreement/constants/agreementList";
import localizationConstants from "@/utils/translation/constants";

export default function AgreementOverviewPage() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={localizationConstants.agreementOverviewTitle}
				breadcrumbs={AGREEMENT_LIST_BREADCRUMBS}
			/>
			<div className="pt-2 pb-3 px-3 sm:px-5 flex-1">
				<AgreementOverview />
			</div>
		</div>
	);
}
