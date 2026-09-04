"use client";

import { useCallback } from "react";
import { Printer, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useQuoteBuilderForm } from "../../hooks/useQuoteBuilderForm";
import { useSalesCompanies } from "../../hooks/useSalesCompanies";
import type { SalesCompany } from "../../types";
import { ModulePageHeader } from "@/components/layout/navigation";
import {
	SALES_MODULE_HREF,
	SALES_MODULE_TABS,
	SALES_MODULE_TITLE_KEY,
	getSalesRecordTabs,
} from "../../constants/salesNav";
import { SalesNotFound } from "../SalesNotFound";
import { QuoteCustomerForm } from "./QuoteCustomerForm";
import { QuoteModuleList } from "./QuoteModuleList";
import { QuotePreviewSheet } from "./QuotePreviewSheet";
import { QuoteTermsSection } from "./QuoteTermsSection";

type QuoteBuilderPageProps = {
	companyId: string;
};

function QuoteBuilder({ company }: { company: SalesCompany }) {
	const { updateCompany } = useSalesCompanies();

	const handleChange = useCallback(
		(patch: Partial<SalesCompany>) => updateCompany(company.id, patch),
		[company.id, updateCompany],
	);

	const {
		draft,
		totals,
		quoteNumber,
		update,
		setExtraDiscount,
		updateModule,
		addModule,
		removeModule,
		save,
	} = useQuoteBuilderForm(company, handleChange);

	return (
		<div className="@container flex min-h-0 flex-1 flex-col overflow-y-auto bg-white">
			<ModulePageHeader
				className="no-print"
				title={SALES_MODULE_TITLE_KEY}
				tabs={SALES_MODULE_TABS}
				secondaryTabs={getSalesRecordTabs(company)}
				record={{
					title: company.name || company.id,
					backHref: SALES_MODULE_HREF,
					actions: (
						<>
							<Button
								type="button"
								variant="outline"
								className="h-9 cursor-pointer gap-2"
								onClick={() => window.print()}
							>
								<Printer className="h-4 w-4" />
								<Translate text={localizationConstants.salesPrintButton} />
							</Button>
							<Button
								type="button"
								className="h-9 cursor-pointer gap-2 bg-[#18181B] text-white hover:bg-[#18181B]/90"
								onClick={save}
							>
								<Save className="h-4 w-4" />
								<Translate
									text={localizationConstants.salesQuoteSaveButton}
								/>
							</Button>
						</>
					),
				}}
			/>

			<div className="@container grid gap-6 px-5 py-5 @4xl:grid-cols-[minmax(0,1fr)_440px]">
				<div className="no-print flex flex-col gap-5">
					<QuoteCustomerForm draft={draft} onChange={update} />
					<QuoteModuleList
						modules={draft.modules}
						onUpdate={updateModule}
						onAdd={addModule}
						onRemove={removeModule}
					/>
					<QuoteTermsSection
						draft={draft}
						onChange={update}
						onExtraDiscountChange={setExtraDiscount}
					/>
				</div>

				<QuotePreviewSheet
					draft={draft}
					totals={totals}
					quoteNumber={quoteNumber}
				/>
			</div>
		</div>
	);
}

export default function QuoteBuilderPage({ companyId }: QuoteBuilderPageProps) {
	const { getCompany } = useSalesCompanies();
	const company = getCompany(companyId);

	if (!company) {
		return (
			<SalesNotFound
				titleKey={localizationConstants.salesCompanyNotFoundTitle}
			/>
		);
	}

	// Keyed so the draft is rebuilt when the seller switches company.
	return <QuoteBuilder key={company.id} company={company} />;
}
