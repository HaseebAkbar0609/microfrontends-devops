"use client";

import { ClipboardList, MailPlus } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { LeadRequestDetails } from "@/features/leads/types";
import { SortLabel } from "@/features/leads/management/components/LeadDetailShared";
import { isSafeUrl } from "@/utils/urlValidator";
import FilePreviewIcon from "@/features/leads/management/components/FilePreviewIcon";

type LeadRequestTabProps = {
	requestDetails: LeadRequestDetails | null | undefined;
};

type InfoItemProps = {
	label: string;
	value: string;
};

export default function LeadRequestTab({ requestDetails }: LeadRequestTabProps) {
	const t = useTranslate();
	const expressText = t(
		requestDetails?.isExpress
			? localizationConstants.yesLabel
			: localizationConstants.noLabel
	);

	return (
		<div className="space-y-6 mb-10">
			<div className="grid gap-6 xl:grid-cols-2">
				<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
					<div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
						<ClipboardList className="size-7 text-slate-700" />
						<div className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.projectInformation} />
						</div>
					</div>
					<div className="space-y-6 px-5 py-5">
						<div className="space-y-3">
							<div className="text-sm font-semibold text-slate-900">
								<Translate text={localizationConstants.projectDescription} />
							</div>
							<p className="text-sm leading-relaxed text-slate-600">
								{requestDetails?.description ?? ""}
							</p>
						</div>

						<div className="space-y-3">
							<div className="text-sm font-semibold text-slate-900">
								<Translate text={localizationConstants.projectDocuments} />
							</div>
							<div className="max-w-129 [&>div]:scrollbar-thin [&>div::-webkit-scrollbar]:h-0.75 [&>div::-webkit-scrollbar-track]:bg-transparent [&>div::-webkit-scrollbar-thumb]:rounded-full [&>div::-webkit-scrollbar-thumb]:bg-slate-100">
								<Table>
									<TableHeader>
										<TableRow className="h-12">
											<TableHead className="w-29 px-4 text-sm font-medium text-slate-500">
												<SortLabel label={t(localizationConstants.dateLabel)} />
											</TableHead>
											<TableHead className="w-55.25 px-4 text-sm font-medium text-slate-500">
												<SortLabel label={t(localizationConstants.documentNameLabel)} />
											</TableHead>
											<TableHead className="w-18 px-4 text-sm font-medium text-slate-500">
												<SortLabel label={t(localizationConstants.fileTypeLabel)} />
											</TableHead>
											<TableHead className="w-27 border-l border-slate-200 px-4">
												<span className="sr-only">
													<Translate text={localizationConstants.requestAction} />
												</span>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{(requestDetails?.documents ?? []).map((document) => (
											<TableRow key={document.id} className="h-14">
												<TableCell className="px-4 text-sm text-[#020617]">
													{document.date}
												</TableCell>
												<TableCell className="px-4">
													<div className="flex items-center gap-3">
														<FilePreviewIcon fileType={document.fileType} className="h-10 w-10 shrink-0" />
														<span className="truncate text-sm text-[#020617]">
															{document.name}
														</span>
													</div>
												</TableCell>
												<TableCell className="px-4 text-sm text-[#020617]">
													{document.fileType}
												</TableCell>
												<TableCell className="border-l border-slate-200 px-4">
													<Button
														type="button"
														variant="outline"
														className="h-9 w-16 min-w-16 rounded-md border-slate-200 bg-white px-2 text-sm font-medium text-[#0F172A] hover:bg-slate-50"
														disabled={!document.url || !isSafeUrl(document.url)}
														onClick={() => {
															if (!document.url || !isSafeUrl(document.url)) return;
															window.open(document.url, "_blank", "noopener,noreferrer");
														}}
													>
														<Translate text={localizationConstants.seeFileLabel} />
													</Button>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>
					</div>
				</div>

				<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
					<div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
						<ClipboardList className="size-7 text-slate-700" />
						<div className="text-sm font-semibold text-slate-900">
							<Translate text={localizationConstants.projectInformation} />
						</div>
					</div>
					<div className="space-y-5 px-5 py-5">
						<div className="grid gap-4 sm:grid-cols-2">
							<InfoItem
								label={t(localizationConstants.projectNameLabel)}
								value={requestDetails?.projectName ?? ""}
							/>
							<InfoItem
								label={t(localizationConstants.expressJobLabel)}
								value={expressText}
							/>
							<InfoItem
								label={t(localizationConstants.orderNumberLabel)}
								value={requestDetails?.orderNumber ?? ""}
							/>
							<InfoItem
								label={t(localizationConstants.categoryLabel)}
								value={requestDetails?.category ?? ""}
							/>
							<InfoItem
								label={t(localizationConstants.typeLabel)}
								value={requestDetails?.projectType ?? ""}
							/>
						</div>

						<div className="space-y-4 border-t border-slate-200 pt-4">
							<InfoItem
								label={t(localizationConstants.projectAddressLabel)}
								value={requestDetails?.address ?? ""}
							/>
							<div className="grid gap-4 sm:grid-cols-2">
								<InfoItem
									label={t(localizationConstants.cityLabel)}
									value={requestDetails?.city ?? ""}
								/>
								<InfoItem
									label={t(localizationConstants.postalCodeLabel)}
									value={requestDetails?.postalCode ?? ""}
								/>
							</div>
							<InfoItem
								label={t(localizationConstants.directionsLabel)}
								value={requestDetails?.directions ?? ""}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
				<div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
					<MailPlus className="size-7 text-slate-700" />
					<div className="text-sm font-semibold text-slate-900">
						<Translate text={localizationConstants.inviteSuppliers} />
					</div>
				</div>
				<div className="px-5 py-5">
					<div className="overflow-hidden rounded-lg border border-slate-200 max-w-2xl">
						<Table className="text-sm">
							<TableHeader>
								<TableRow className="bg-slate-50">
									<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
										<Translate text={localizationConstants.companyNameLabel} />
									</TableHead>
									<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
										<Translate text={localizationConstants.orgNumberLabel} />
									</TableHead>
									<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
										<Translate text={localizationConstants.contactPersonLabel} />
									</TableHead>
									<TableHead className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
										<Translate text={localizationConstants.emailLabel} />
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{(requestDetails?.suppliers ?? []).map((supplier) => (
									<TableRow key={supplier.id}>
										<TableCell className="px-4 py-4 font-medium text-slate-700">
											{supplier.companyName}
										</TableCell>
										<TableCell className="px-4 py-4 text-slate-600">
											{supplier.orgNumber}
										</TableCell>
										<TableCell className="px-4 py-4 text-slate-600">
											{supplier.contactName}
										</TableCell>
										<TableCell className="px-4 py-4 text-slate-600">
											{supplier.email}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</div>
		</div>
	);
}

function InfoItem({ label, value }: InfoItemProps) {
	return (
		<div>
			<div className="text-sm font-semibold text-slate-900">{label}</div>
			<div className="mt-1 text-sm text-slate-600">{value}</div>
		</div>
	);
}
