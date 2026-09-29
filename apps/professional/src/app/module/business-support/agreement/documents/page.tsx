import { PageHeader } from "@/components/layout/PageHeader";
import { AgreementDocumentCenter } from "@/features/agreement/components/documents/AgreementDocumentCenter";
import { AGREEMENT_DOCUMENTS_BREADCRUMBS } from "@/features/agreement/constants/agreementDocuments";
import localizationConstants from "@/utils/translation/constants";

export const dynamic = "force-dynamic";

export default function DocumentsPage() {
	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<PageHeader
				title={localizationConstants.documentCenterItem}
				breadcrumbs={AGREEMENT_DOCUMENTS_BREADCRUMBS}
			/>
			<div className="p-3 sm:p-5 flex-1">
				<AgreementDocumentCenter />
			</div>
		</div>
	);
}
