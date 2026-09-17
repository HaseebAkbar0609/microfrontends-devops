"use client";

import { FilePlus } from "lucide-react";
import { notFound } from "next/navigation";
import { useWatch } from "react-hook-form";

import { ModulePageHeader } from "@/components/layout/navigation";
import { Form } from "@/components/ui/form";
import localizationConstants, { type TranslationKeys } from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { PROJECT_MODULE_TABS, PROJECT_MODULE_TITLE } from "../../../../data/projectNav.config";
import { projectProductionTabs } from "../../../projectProductionNav.config";
import { padAtaNumber } from "../../ataMath";
import { AtaDocumentsTable } from "../../form/documents/AtaDocumentsTable";
import { AtaCollapsibleCard } from "../../form/step2/AtaCollapsibleCard";
import { AtaInfoCards } from "../../form/step2/AtaInfoCards";
import { AtaLineItemSections } from "../../form/step2/AtaLineItemSections";
import { ATA_FILE_RULES, ATA_LINE_LIMITS } from "../../projectAta.config";
import { SupplierAtaFooter } from "./SupplierAtaFooter";
import { SupplierAtaRail } from "./SupplierAtaRail";
import { SupplierAtaViewDialogs } from "./SupplierAtaViewDialogs";
import { useSupplierAtaView } from "./useSupplierAtaView";
import { useSupplierAtaViewActions } from "./useSupplierAtaViewActions";

export interface SupplierAtaViewPageProps {
	projectId: string;
	ataId: string;
}

/**
 * Visa ÄTA — a subcontractor's or supplier's ÄTA, as the project reviews it.
 * Beställare and ÄTA-information are the sender's and read only; the project
 * may adjust the rows, name the documents and link the ÄTA to one of its own,
 * then Godkänna. Once approved or invoiced it reads only, with the reason.
 */
export function SupplierAtaViewPage({ projectId, ataId }: SupplierAtaViewPageProps) {
	const t = useTranslate();
	const view = useSupplierAtaView(projectId, ataId);
	const actions = useSupplierAtaViewActions(projectId, view);
	const [lineItems, documents] = useWatch({ control: view.form.control, name: ["lineItems", "documents"] });

	/* An unknown project, or an ÄTA that is not this project's supplier ÄTA, is a 404. After the hooks. */
	if (view.missing || !view.project || !view.ata || !view.supplier) notFound();

	const { ata, supplier } = view;
	const urls = new Map(ata.documents.flatMap((doc) => (doc.url ? [[doc.id, doc.url] as const] : [])));
	const translateError = (message: string) =>
		t(message as TranslationKeys, { max: message === localizationConstants.projectAtaTooManyRows ? ATA_LINE_LIMITS.rows : ATA_FILE_RULES.maxCount });

	return (
		<div className="flex flex-1 flex-col bg-blue-gray-50">
			<ModulePageHeader
				title={PROJECT_MODULE_TITLE}
				tabs={PROJECT_MODULE_TABS}
				record={{ title: <Translate text={localizationConstants.viewAtaTitle} />, backHref: view.listUrl }}
				secondaryTabs={projectProductionTabs(projectId)}
			/>

			<Form {...view.form}>
				<form noValidate onSubmit={(event) => event.preventDefault()} className="flex flex-1 flex-col">
					<div className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-8 sm:px-6 xl:flex-row xl:items-start">
						<div className="flex min-w-0 flex-1 flex-col gap-4">
							{view.lockReason && (
								<p role="status" className="rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
									<Translate text={view.lockReason} />
								</p>
							)}
							<AtaInfoCards
								client={ata.client}
								info={ata.info}
								meta={{ createdBy: ata.createdBy, createdDate: ata.createdDate, revisedDate: ata.revisedDate }}
								infoTitleKey={localizationConstants.projectAtaSupplierInfoTitle}
								supplierName={supplier.name}
							/>
							<AtaLineItemSections lineItems={lineItems} editReason={view.lockReason} onEditSection={actions.openLineItems}>
								<AtaCollapsibleCard titleKey={localizationConstants.createAtaDocuments} icon={FilePlus}>
									<AtaDocumentsTable
										control={view.form.control}
										documents={documents}
										urls={urls}
										lockReason={view.lockReason}
										translateError={translateError}
										actions={{ mode: "review" }}
									/>
								</AtaCollapsibleCard>
							</AtaLineItemSections>
						</div>

						<SupplierAtaRail
							control={view.form.control}
							numberLabel={padAtaNumber(ata.number)}
							projectNo={view.project.projectNr.replace(/^#/, "")}
							projectCity={view.recordInfo?.details.city ?? ""}
							clientCity={ata.client.city}
							customerAtas={view.customerAtas}
							locked={view.locked}
							approveReason={actions.approveReason}
							onApprove={actions.requestApprove}
						/>
					</div>

					<SupplierAtaFooter saveReason={view.lockReason} onBack={actions.cancel} onCancel={actions.cancel} onSave={actions.save} />
				</form>
			</Form>

			<SupplierAtaViewDialogs form={view.form} actions={actions} subject={`${supplier.name} ${padAtaNumber(ata.number)}`} />
		</div>
	);
}

export default SupplierAtaViewPage;
