"use client";

import React, { useState } from "react";
import {
	Folder,
	CircleUserRound,
	UserRoundCog,
	ClipboardList,
	Folders,
	ChevronDown,
	ChevronUp,
	MoreVertical,
	Trash2,
	ArrowUpDown,
	LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type {
	KalkylDocItem,
	KalkylKontaktData,
	KalkylProjektData,
} from "../../types/kalkyl";
import { KalkylDocIcon } from "../KalkylDocIcon";

// ── Preview Field Component ────────────────────────────────────────────────

interface PreviewFieldProps {
	labelKey: string;
	value?: string;
}

function PreviewField({ labelKey, value }: PreviewFieldProps) {
	return (
		<div className="space-y-1 min-w-0 overflow-hidden">
			<Label className="text-sm font-medium text-slate-700">
				<Translate text={labelKey} />
			</Label>
			<p className="text-sm font-normal text-zinc-500 break-words">
				{value && value.trim() !== "" ? value : "—"}
			</p>
		</div>
	);
}

// ── Collapsible Preview Card Component ─────────────────────────────────────

interface CollapsiblePreviewCardProps {
	titleKey: string;
	icon: LucideIcon;
	defaultOpen?: boolean;
	children: React.ReactNode;
}

function CollapsiblePreviewCard({
	titleKey,
	icon: Icon,
	defaultOpen = true,
	children,
}: CollapsiblePreviewCardProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<Card className="gap-0 overflow-hidden rounded-lg border border-slate-200 bg-white py-0 pb-0 shadow-none">
			<CardHeader
				role="button"
				tabIndex={0}
				aria-expanded={isOpen}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault();
						setIsOpen((prev) => !prev);
					}
				}}
				className="flex h-14 cursor-pointer flex-row items-center justify-between border-b border-slate-200 px-4 sm:px-6 py-0 [.border-b]:pb-0 select-none hover:bg-slate-50/50 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-400"
				onClick={() => setIsOpen((prev) => !prev)}
			>
				<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900 min-w-0">
					<Icon className="h-5 w-5 shrink-0 text-slate-700" />
					<span className="truncate">
						<Translate text={titleKey} />
					</span>
				</CardTitle>
				<div className="flex h-7 w-7 shrink-0 items-center justify-center text-slate-500" aria-hidden="true">
					{isOpen ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</div>
			</CardHeader>
			{isOpen && <CardContent className="px-4 py-4 sm:px-6 sm:py-5">{children}</CardContent>}
		</Card>
	);
}

// ── Main Preview Step Component ────────────────────────────────────────────

interface KalkylPreviewStepProps {
	kontakt: KalkylKontaktData;
	projekt: KalkylProjektData;
	documents: KalkylDocItem[];
	onRemoveDocument?: (id: string) => void;
}

export function KalkylPreviewStep({
	kontakt,
	projekt,
	documents,
	onRemoveDocument,
}: KalkylPreviewStepProps) {
	const t = useTranslate();
	const isExtend = kontakt.mode === "extend";

	return (
		<div className="flex flex-col gap-8 max-w-full overflow-hidden">
			{/* 1. Beställare & Entreprenör Section */}
			<div className="flex flex-col gap-4">
				<h2 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.calcNewBestallare} />
				</h2>

				{/* Beställare Kunduppgifter (Only in Extend/Extern mode) */}
				{isExtend && (
					<>
						<CollapsiblePreviewCard
							titleKey={localizationConstants.calcNewKunduppgifter}
							icon={Folder}
						>
							<div className="grid grid-cols-1 gap-y-4 gap-x-8 lg:grid-cols-2">
								<PreviewField
									labelKey={localizationConstants.calcNewForetagLabel}
									value={kontakt.bestellareForetag}
								/>
								<PreviewField
									labelKey={localizationConstants.calcNewAddressLabel}
									value={kontakt.bestellareAddress}
								/>
								<PreviewField
									labelKey={localizationConstants.calcNewPostNr}
									value={kontakt.bestellarePostNr}
								/>
								<PreviewField
									labelKey={localizationConstants.calcNewOrt}
									value={kontakt.bestellareOrt}
								/>
								<PreviewField
									labelKey={localizationConstants.agreementDetailMail}
									value={kontakt.bestellareMail}
								/>
								<PreviewField
									labelKey={localizationConstants.calcNewTelefon}
									value={kontakt.bestellareTelefon}
								/>
								<div className="lg:col-span-2">
									<PreviewField
										labelKey={localizationConstants.calcNewOrgPersonNr}
										value={kontakt.bestellareOrgNr}
									/>
								</div>
							</div>
						</CollapsiblePreviewCard>

						{/* Beställare Kontaktperson */}
						<CollapsiblePreviewCard
							titleKey={localizationConstants.calcNewKontaktperson}
							icon={CircleUserRound}
						>
							<div className="grid grid-cols-1 gap-y-4 gap-x-8 lg:grid-cols-2">
								<PreviewField
									labelKey={localizationConstants.agreementDetailFornamn}
									value={kontakt.bestellareFornamn}
								/>
								<PreviewField
									labelKey={localizationConstants.agreementDetailEfternamn}
									value={kontakt.bestellareEfternamn}
								/>
								<PreviewField
									labelKey={localizationConstants.calcNewAddressLabel}
									value={kontakt.bestellareKontaktAddress}
								/>
								<PreviewField
									labelKey={localizationConstants.calcNewPostNr}
									value={kontakt.bestellareKontaktPostnummer}
								/>
								<PreviewField
									labelKey={localizationConstants.agreementDetailMail}
									value={kontakt.bestellareKontaktMail}
								/>
								<PreviewField
									labelKey={localizationConstants.calcNewTelefon}
									value={kontakt.bestellareTelefonDirect}
								/>
								<PreviewField
									labelKey={localizationConstants.calcNewOrt}
									value={kontakt.bestellareKontaktOrt}
								/>
								<PreviewField
									labelKey={localizationConstants.agreementDetailRoll}
									value={kontakt.bestellareRoll}
								/>
							</div>
						</CollapsiblePreviewCard>
					</>
				)}

				{/* Entreprenör Kunduppgifter */}
				<CollapsiblePreviewCard
					titleKey={localizationConstants.calcNewKunduppgifter}
					icon={Folder}
				>
					<div className="grid grid-cols-1 gap-y-4 gap-x-8 lg:grid-cols-2">
						<PreviewField
							labelKey={localizationConstants.calcNewForetagLabel}
							value={kontakt.foretag}
						/>
						<PreviewField
							labelKey={localizationConstants.calcNewAddressLabel}
							value={kontakt.address}
						/>
						<PreviewField
							labelKey={localizationConstants.calcNewPostNr}
							value={kontakt.postNr}
						/>
						<PreviewField
							labelKey={localizationConstants.calcNewOrt}
							value={kontakt.ort}
						/>
						<PreviewField
							labelKey={localizationConstants.agreementDetailMail}
							value={kontakt.mail}
						/>
						<PreviewField
							labelKey={localizationConstants.calcNewTelefon}
							value={kontakt.telefon}
						/>
						<div className="lg:col-span-2">
							<PreviewField
								labelKey={localizationConstants.calcNewOrgPersonNr}
								value={kontakt.orgNr}
							/>
						</div>
					</div>
				</CollapsiblePreviewCard>

				{/* Entreprenör Kalkylansvarig */}
				<CollapsiblePreviewCard
					titleKey={localizationConstants.calcNewKalkylAnsvarig}
					icon={UserRoundCog}
				>
					<div className="grid grid-cols-1 gap-y-4 gap-x-8 lg:grid-cols-2">
						<PreviewField
							labelKey={localizationConstants.agreementDetailFornamn}
							value={kontakt.fornamn}
						/>
						<PreviewField
							labelKey={localizationConstants.agreementDetailEfternamn}
							value={kontakt.efternamn}
						/>
						<PreviewField
							labelKey={localizationConstants.agreementDetailMail}
							value={kontakt.kontaktMail}
						/>
						<PreviewField
							labelKey={localizationConstants.agreementDetailMobil}
							value={kontakt.mobil}
						/>
						<div className="lg:col-span-2">
							<PreviewField
								labelKey={localizationConstants.agreementDetailRoll}
								value={kontakt.roll}
							/>
						</div>
					</div>
				</CollapsiblePreviewCard>
			</div>

			{/* 2. Projektinformation Section */}
			<div className="flex flex-col gap-4">
				<h2 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.calcNewProjektInfo} />
				</h2>

				{/* Projekt Card */}
				<CollapsiblePreviewCard
					titleKey={localizationConstants.calcNewProjekt}
					icon={Folder}
				>
					<div className="grid grid-cols-1 gap-y-4 gap-x-8 lg:grid-cols-2">
						<PreviewField
							labelKey={localizationConstants.calcNewProjektNr}
							value={projekt.projektNr}
						/>
						<PreviewField
							labelKey={localizationConstants.projectName}
							value={projekt.projektNamn}
						/>
						<PreviewField
							labelKey={localizationConstants.calcNewKvartersNamn}
							value={projekt.kvartersNamn}
						/>
						<PreviewField
							labelKey={localizationConstants.calcNewProjektAdress}
							value={projekt.projektAdress}
						/>
						<PreviewField
							labelKey={localizationConstants.calcNewPostNr}
							value={projekt.postNr}
						/>
						<PreviewField
							labelKey={localizationConstants.calcNewOrt}
							value={projekt.ort}
						/>
					</div>
				</CollapsiblePreviewCard>

				{/* Projekt Information Card */}
				<CollapsiblePreviewCard
					titleKey={localizationConstants.calcNewProjektInfo}
					icon={ClipboardList}
				>
					<div className="grid grid-cols-1 gap-y-4 gap-x-8 lg:grid-cols-2">
						<PreviewField
							labelKey={localizationConstants.calcProType}
							value={projekt.type}
						/>
						<PreviewField
							labelKey={localizationConstants.category}
							value={projekt.kategori}
						/>
						<PreviewField
							labelKey={localizationConstants.calcNewAvdelning}
							value={projekt.avdelning}
						/>
						<PreviewField
							labelKey={localizationConstants.calcNewKontraktsumma}
							value={projekt.kontraktsumma}
						/>
						<PreviewField
							labelKey={localizationConstants.calcNewOffertNr}
							value={projekt.offertNr}
						/>
						<PreviewField
							labelKey={localizationConstants.calcStatStartDate}
							value={projekt.startDatum}
						/>
						<PreviewField
							labelKey={localizationConstants.calcStatEndDate}
							value={projekt.slutDatum}
						/>
						<PreviewField
							labelKey={localizationConstants.calcNewSenasteOffertDatum}
							value={projekt.senasteDatum}
						/>
					</div>
				</CollapsiblePreviewCard>
			</div>

			{/* 3. Dokuments Section */}
			<div className="flex flex-col gap-4">
				<h2 className="text-base font-semibold text-slate-900">
					<Translate text={localizationConstants.calcNewDocumentsHeader} />
				</h2>

				<CollapsiblePreviewCard
					titleKey={localizationConstants.calcNewDocumentsHeader}
					icon={Folders}
				>
					<div className="overflow-x-auto rounded-lg border border-slate-200">
						<Table className="w-full min-w-[640px] table-fixed">
							<TableHeader>
								<TableRow className="h-11 border-b border-slate-200">
									<TableHead className="w-32 px-4 text-left font-medium text-slate-500">
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.agreementDetailDatum} />
											<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
										</div>
									</TableHead>
									<TableHead className="px-4 text-left font-medium text-slate-500">
										<div className="flex items-center gap-1">
											<Translate
												text={localizationConstants.agreementDetailDokumentetsNamn}
											/>
											<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
										</div>
									</TableHead>
									<TableHead className="w-28 px-4 text-left font-medium text-slate-500">
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.calcProType} />
											<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
										</div>
									</TableHead>
									<TableHead className="w-24 px-4 text-left font-medium text-slate-500">
										<div className="flex items-center gap-1">
											<Translate text={localizationConstants.agreementDetailFil} />
											<ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
										</div>
									</TableHead>
									<TableHead className="w-36 border-l border-slate-200 px-4" />
								</TableRow>
							</TableHeader>
							<TableBody>
								{documents.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={5}
											className="h-24 text-center text-sm text-slate-400"
										>
											<Translate text={localizationConstants.agreementNoDocuments} />
										</TableCell>
									</TableRow>
								) : (
									documents.map((doc) => {
										const fileExt =
											doc.fileType === "doc"
												? "DOC"
												: doc.fileType === "img"
													? "IMG"
													: "PDF";
										return (
											<TableRow
												key={doc.id}
												className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/50 transition-colors"
											>
												<TableCell className="px-4 py-3 text-sm text-slate-900 font-normal">
													{doc.datum}
												</TableCell>
												<TableCell className="px-4 py-3">
													<div className="flex min-w-0 items-center gap-3 overflow-hidden text-sm font-normal text-slate-900">
														<KalkylDocIcon
															fileType={doc.fileType}
															fileName={doc.namn}
															className="h-10 w-8 shrink-0"
														/>
														<span className="truncate">{doc.namn}</span>
													</div>
												</TableCell>
												<TableCell className="px-4 py-3 text-sm text-slate-900 font-normal">
													{doc.typ}
												</TableCell>
												<TableCell className="px-4 py-3 text-sm text-slate-900 font-normal uppercase">
													{fileExt}
												</TableCell>
												<TableCell className="border-l border-slate-200 px-4 py-3 text-right">
													<div className="flex items-center justify-end gap-2 sm:gap-3">
														<Button
															type="button"
															variant="outline"
															size="sm"
															className="h-8 rounded-md border-slate-200 bg-white px-2.5 sm:px-3 text-xs font-normal text-slate-900 hover:bg-slate-50 shadow-none cursor-pointer"
														>
															<Translate text={localizationConstants.agreementCreateSeFil} />
														</Button>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	type="button"
																	variant="ghost"
																	size="icon"
																	aria-label={t(localizationConstants.actions)}
																	className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-900 hover:bg-slate-100"
																>
																	<MoreVertical className="h-4 w-4 text-slate-900" />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent align="end" className="w-36">
																{onRemoveDocument && (
																	<DropdownMenuItem
																		className="cursor-pointer gap-2 text-sm text-slate-900 focus:text-slate-900 hover:text-slate-900"
																		onClick={() => onRemoveDocument(doc.id)}
																	>
																		<Trash2 className="h-4 w-4 text-slate-900" />
																		<Translate text={localizationConstants.calcArchiveDelete} />
																	</DropdownMenuItem>
																)}
															</DropdownMenuContent>
														</DropdownMenu>
													</div>
												</TableCell>
											</TableRow>
										);
									})
								)}
							</TableBody>
						</Table>
					</div>
				</CollapsiblePreviewCard>
			</div>
		</div>
	);
}
