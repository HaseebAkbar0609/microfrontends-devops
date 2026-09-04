"use client";

import { Suspense } from "react";
import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import { PermissionGate } from "@/components/common/PermissionGate";
import { ModulePageHeader, SectionTabs } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { TabsContent } from "@/components/ui/tabs";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { PurchaseGoodsReceptionListTab } from "../components/PurchaseGoodsReceptionListTab";
import {
	PURCHASE_MODULE_TABS,
	PURCHASE_MODULE_TITLE,
} from "../data/purchaseNav.config";
import { GoodsInfoCards } from "./components/GoodsInfoCards";
import { GoodsOrderQrCard } from "./components/GoodsOrderQrCard";
import { GoodsUploadCard } from "./components/GoodsUploadCard";
import { useCreateGoodsReceptionForm } from "./useCreateGoodsReceptionForm";

/**
 * Goods reception create screen, from the two Figma frames: "Ladda upp
 * dokument" and "Lista godsmottagning", with the record header and the
 * Avbryt / Spara action bar.
 *
 * The general info and pricing cards come from the ticket description, which
 * makes item name, category and unit price mandatory — the frames have no
 * fields for them.
 */
export function CreateGoodsReceptionPage() {
	const { t } = useTranslation();
	const {
		draft,
		errors,
		patch,
		selectOrder,
		orderOptions,
		supplierOptions,
		gdprAccepted,
		setGdprAccepted,
		documents,
		listHref,
		cancel,
		submit,
	} = useCreateGoodsReceptionForm();

	const handleUpload = () => {
		const added = documents.commitPendingFiles();
		if (added.length > 0) {
			showToast(
				"success",
				t(localizationConstants.purchaseAgreementUploadedToast),
			);
		}
	};

	return (
		<div className="flex h-full flex-col bg-slate-50/50">
			<ModulePageHeader
				title={PURCHASE_MODULE_TITLE}
				tabs={PURCHASE_MODULE_TABS}
				record={{
					title: t(
						localizationConstants.purchaseTabGoodsReception,
					),
					backHref: listHref,
				}}
			/>

			<div className="flex-1 overflow-y-auto px-6 pt-4 pb-8">
				{/* `SectionTabs` reads the active section from the query string,
				    so it needs a Suspense boundary to prerender. */}
				<Suspense fallback={null}>
					<SectionTabs
						items={[
							{
								id: "upload",
								labelKey:
									localizationConstants.purchaseGoodsReceptionTabUpload,
							},
							{
								id: "list",
								labelKey:
									localizationConstants.purchaseGoodsReceptionTabList,
							},
						]}
						ariaLabel={t(
							localizationConstants.purchaseTabGoodsReception,
						)}
					>
						<TabsContent
							value="upload"
							className="mt-4 space-y-4"
						>
							<GoodsOrderQrCard
								orderOptions={orderOptions}
								selectedOrder={draft.purchaseNo}
								onSelectOrder={selectOrder}
								error={errors.purchaseNo}
							/>

							<GoodsInfoCards
								draft={draft}
								errors={errors}
								onPatch={patch}
								supplierOptions={supplierOptions}
							/>

							<GoodsUploadCard
								pendingFiles={documents.pendingFiles}
								onSelectFiles={documents.selectFiles}
								onRemovePending={documents.removePending}
								onUpload={handleUpload}
								gdprAccepted={gdprAccepted}
								onGdprChange={setGdprAccepted}
							/>

							<div className="sticky bottom-0 z-20 -mx-6 border-t border-slate-200 bg-white py-3 shadow-sm">
								<div className="flex flex-wrap items-center justify-end gap-3 px-6">
									<Button
										type="button"
										variant="outline"
										onClick={cancel}
										className="h-10 min-w-25 cursor-pointer border-slate-300 bg-white text-sm text-slate-700 shadow-none hover:bg-slate-100"
									>
										<Translate
											text={
												localizationConstants.cancelButton
											}
										/>
									</Button>

									<PermissionGate permission="CREATE_PURCHASE">
										<Button
											type="button"
											onClick={submit}
											className="h-10 min-w-25 cursor-pointer gap-2 bg-[#111721] text-sm text-white shadow-none hover:bg-slate-800"
										>
											<Save
												className="h-4 w-4"
												aria-hidden
											/>
											<Translate
												text={
													localizationConstants.confirmSave
												}
											/>
										</Button>
									</PermissionGate>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="list" className="mt-4">
							<PurchaseGoodsReceptionListTab
								documents={documents.documents}
								sortBy={documents.sortBy}
								sortOrder={documents.sortOrder}
								onSort={documents.handleSort}
								onRemove={documents.removeDocument}
							/>
						</TabsContent>
					</SectionTabs>
				</Suspense>
			</div>
		</div>
	);
}

export default CreateGoodsReceptionPage;
