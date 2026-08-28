"use client";

import Image from "next/image";
import { ArrowUpDown, Folders, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { MultiFileUploadField } from "@/components/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { usePurchaseAgreementDocuments } from "../../hooks/usePurchaseAgreementDocuments";

const TH_CLASS =
	"h-11 px-4 text-left text-sm font-medium text-slate-500 select-none whitespace-nowrap";

export interface ComplaintDocumentsCardProps {
	gdprAccepted: boolean;
	onGdprChange: (accepted: boolean) => void;
}

/**
 * Step 2's Dokument card: upload control, GDPR consent, and the attached
 * documents table.
 *
 * Reuses `usePurchaseAgreementDocuments` for the pending/attached state — the
 * same shape the supplier agreements tab needs — and starts empty, since a new
 * complaint has no attachments yet.
 */
export function ComplaintDocumentsCard({
	gdprAccepted,
	onGdprChange,
}: ComplaintDocumentsCardProps) {
	const { t } = useTranslation();
	const {
		documents,
		pendingFiles,
		selectFiles,
		removePending,
		commitPendingFiles,
		removeDocument,
	} = usePurchaseAgreementDocuments([]);

	const handleUpload = () => {
		const added = commitPendingFiles();
		if (added > 0) {
			showToast(
				"success",
				t(localizationConstants.purchaseAgreementUploadedToast),
			);
		}
	};

	const handleSeeFile = (fileUrl?: string, name?: string) => {
		if (fileUrl) {
			window.open(fileUrl, "_blank", "noopener,noreferrer");
			return;
		}
		showToast("info", name ?? t(localizationConstants.agreementDetailFil));
	};

	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
			<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium">
					<Folders className="h-5 w-5 text-slate-700" />
					<Translate
						text={localizationConstants.agreementDocuments}
					/>
				</CardTitle>
			</CardHeader>

			<CardContent className="p-6">
				<div className="mb-4">
					<p className="mb-1 text-sm font-medium text-slate-900">
						<Translate
							text={localizationConstants.agreementUploadFiles}
						/>
					</p>
					<p className="mb-3 text-sm text-slate-500">
						<Translate
							text={localizationConstants.agreementFileTypes}
						/>
					</p>

					<MultiFileUploadField
						pendingFiles={pendingFiles}
						onSelectFiles={selectFiles}
						onRemovePending={removePending}
						onUpload={handleUpload}
						accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
					/>

					<label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
						<Checkbox
							checked={gdprAccepted}
							onCheckedChange={(next) => onGdprChange(!!next)}
							className="mt-0.5 border-slate-400 data-[state=checked]:border-black data-[state=checked]:bg-black"
						/>
						<span>
							<Translate
								text={localizationConstants.complaintGdprText}
							/>{" "}
							<span className="cursor-pointer text-orange-500 underline">
								<Translate
									text={
										localizationConstants.complaintGdprLink
									}
								/>
							</span>{" "}
							<Translate
								text={localizationConstants.complaintGdprHere}
							/>
						</span>
					</label>
				</div>

				<div className="border-t border-slate-100 pt-4">
					<p className="mb-3 text-sm font-medium text-slate-900">
						<Translate
							text={
								localizationConstants.agreementCreateBifogadeDokument
							}
						/>
					</p>

					<div className="rounded border border-slate-200">
						<Table className="w-full border-collapse">
							<TableHeader>
								<TableRow className="h-11 border-b border-slate-200 hover:bg-transparent">
									{[
										localizationConstants.agreementDetailDatum,
										localizationConstants.agreementDetailDokumentetsNamn,
										localizationConstants.purchaseColType,
										localizationConstants.agreementDetailFil,
									].map((label) => (
										<TableHead
											key={label}
											className={TH_CLASS}
										>
											<div className="flex items-center gap-1">
												<Translate text={label} />
												<ArrowUpDown className="h-4 w-4 text-slate-400" />
											</div>
										</TableHead>
									))}
									<TableHead className="h-11 px-4" />
									<TableHead className="h-11 w-12 px-2" />
								</TableRow>
							</TableHeader>

							<TableBody>
								{documents.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="py-8 text-center text-sm text-slate-400"
										>
											<Translate
												text={
													localizationConstants.agreementNoDocuments
												}
											/>
										</TableCell>
									</TableRow>
								) : (
									documents.map((doc) => (
										<TableRow
											key={doc.id}
											className="border-b border-slate-100 transition-colors last:border-b-0 hover:bg-slate-50/60"
										>
											<TableCell className="px-4 py-3 text-sm whitespace-nowrap text-slate-700">
												{doc.date}
											</TableCell>
											<TableCell className="px-4 py-3 whitespace-nowrap">
												<span className="flex items-center gap-2">
													<Image
														src={
															doc.fileType ===
															"pdf"
																? "/file-type-pdf.png"
																: "/file-type-doc.png"
														}
														alt=""
														width={28}
														height={32}
														className="h-8 w-7 shrink-0 object-contain"
													/>
													<span className="text-sm text-slate-700">
														{doc.documentName}
													</span>
												</span>
											</TableCell>
											<TableCell className="px-4 py-3 text-sm whitespace-nowrap text-slate-700">
												{doc.reference}
											</TableCell>
											<TableCell className="px-4 py-3 text-sm whitespace-nowrap text-slate-700 uppercase">
												{doc.fileType}
											</TableCell>
											<TableCell className="px-4 py-3 text-right whitespace-nowrap">
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={() =>
														handleSeeFile(
															doc.fileUrl,
															doc.documentName,
														)
													}
													className="h-8 cursor-pointer rounded-md border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100"
												>
													<Translate
														text={
															localizationConstants.purchaseAgreementSeeFile
														}
													/>
												</Button>
											</TableCell>
											<TableCell className="w-12 px-2 py-3 text-center">
												<Button
													type="button"
													variant="ghost"
													size="icon"
													onClick={() =>
														removeDocument(doc.id)
													}
													aria-label={`${t(localizationConstants.actionDelete)} ${doc.documentName}`}
													className="h-8 w-8 cursor-pointer rounded-md text-slate-500 hover:text-red-600"
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

export default ComplaintDocumentsCard;
