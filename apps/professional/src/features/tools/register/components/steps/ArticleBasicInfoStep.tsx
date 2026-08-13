"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useWatch, useFormContext } from "react-hook-form";
import type { Control } from "react-hook-form";
import { Trash2, Plus, ChevronDown, ChevronRight, Star, ArrowUpDown } from "lucide-react";
import type { CreateArticleFormData, PriceListRow } from "../../types";
import { FormInput, FormSelect } from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";
import {
	getSupplierNameOptionsAPIAction,
	getSupplierArticleNumberOptionsAPIAction,
} from "../../api/articleRegister";

interface ArticleBasicInfoStepProps {
	readonly control: Control<CreateArticleFormData>;
	readonly priceListRows: PriceListRow[];
	readonly onAddRow: (row: PriceListRow) => void;
	readonly onRemoveRow: (id: string) => void;
}

const ENHET_OPTIONS = [
	{ value: "st", label: "St" },
	{ value: "tim", label: "Tim" },
	{ value: "km", label: "km" },
	{ value: "m2", label: "m\u00B2" },
	{ value: "m", label: "m" },
	{ value: "lm", label: "lm" },
	{ value: "par", label: "Par" },
];

const TYP_ARTIKEL_OPTIONS = [
	{ value: "tjanst", label: "Tj\u00E4nst" },
	{ value: "produkt", label: "Produkt" },
	{ value: "material", label: "Material" },
];

const LAGER_VARA_OPTIONS = [
	{ value: "ja", label: "Ja" },
	{ value: "nej", label: "Nej" },
];

const TYP_HUSARBETE_OPTIONS = [
	{ value: "el", label: "El" },
	{ value: "ror", label: "R\u00F6r" },
	{ value: "ventilation", label: "Ventilation" },
];

export function ArticleBasicInfoStep({
	control,
	priceListRows,
	onAddRow,
	onRemoveRow,
}: ArticleBasicInfoStepProps) {
	const t = useTranslate();
	const [prislistaOpen, setPrislistaOpen] = useState(true);
	const [bokoringOpen, setBokoringOpen] = useState(true);

	// Modal State for New Price List Row
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [newRowForm, setNewRowForm] = useState({
		priceList: "",
		benamning: "",
		prisUt: "",
		prisKalkyl: "",
		tgProcent: "",
		tbSek: "",
		kostnad: "",
		andringsDatum: new Date().toISOString().split("T")[0],
	});

	const [leverantorOptions, setLeverantorOptions] = useState<
		{ value: string; label: string }[]
	>([]);
	const [supplierArticleNoOptions, setSupplierArticleNoOptions] = useState<
		{ value: string; label: string }[]
	>([]);
	const { setValue } = useFormContext<CreateArticleFormData>();

	const selectedLeverantor = useWatch({ control, name: "leverantor" }) as
		| string
		| undefined;

	useEffect(() => {
		let cancelled = false;
		getSupplierNameOptionsAPIAction()
			.then((options) => {
				if (!cancelled) setLeverantorOptions(options);
			})
			.catch(() => {
				if (!cancelled) {
					setLeverantorOptions([]);
					showToast("error", t(localizationConstants.genericError));
				}
			});
		return () => {
			cancelled = true;
		};
	}, []);

	const prevSupplierRef = useRef(selectedLeverantor);
	useEffect(() => {
		if (prevSupplierRef.current !== selectedLeverantor) {
			prevSupplierRef.current = selectedLeverantor;
			setValue("supplierArticleNo", "");
		}
		if (!selectedLeverantor) {
			setSupplierArticleNoOptions([]);
			return;
		}
		let cancelled = false;
		getSupplierArticleNumberOptionsAPIAction(selectedLeverantor)
			.then((options) => {
				if (!cancelled) setSupplierArticleNoOptions(options);
			})
			.catch(() => {
				if (!cancelled) {
					setSupplierArticleNoOptions([]);
					showToast("error", t(localizationConstants.genericError));
				}
			});
		return () => {
			cancelled = true;
		};
	}, [selectedLeverantor, setValue]);

	const leverantorOptionsMerged = useMemo(() => {
		if (!selectedLeverantor) return leverantorOptions;
		if (leverantorOptions.some((o) => o.value === selectedLeverantor)) {
			return leverantorOptions;
		}
		return [{ value: selectedLeverantor, label: selectedLeverantor }, ...leverantorOptions];
	}, [leverantorOptions, selectedLeverantor]);

	const selectedSupplierArticleNo = useWatch({ control, name: "supplierArticleNo" }) as
		| string
		| undefined;

	const supplierArticleNoOptionsMerged = useMemo(() => {
		if (!selectedSupplierArticleNo) return supplierArticleNoOptions;
		if (supplierArticleNoOptions.some((o) => o.value === selectedSupplierArticleNo)) {
			return supplierArticleNoOptions;
		}
		return [{ value: selectedSupplierArticleNo, label: selectedSupplierArticleNo }, ...supplierArticleNoOptions];
	}, [supplierArticleNoOptions, selectedSupplierArticleNo]);

	const LABEL_CLASS = "text-[14px] font-medium leading-5 text-[#09090B]";

	const handleOpenModal = () => {
		setNewRowForm({
			priceList: "",
			benamning: "",
			prisUt: "",
			prisKalkyl: "",
			tgProcent: "",
			tbSek: "",
			kostnad: "",
			andringsDatum: new Date().toISOString().split("T")[0],
		});
		setIsModalOpen(true);
	};

	const handleSaveNewRow = () => {
		const newRow: PriceListRow = {
			id: String(Date.now()),
			priceList: newRowForm.priceList || "Prislista A",
			benamning: newRowForm.benamning || "-",
			prisUt: newRowForm.prisUt || "0",
			prisKalkyl: newRowForm.prisKalkyl || "0",
			tgProcent: newRowForm.tgProcent || "0",
			tbSek: newRowForm.tbSek || "0",
			kostnad: newRowForm.kostnad || "0",
			andringsDatum: newRowForm.andringsDatum || new Date().toISOString().split("T")[0],
		};

		onAddRow(newRow);
		setIsModalOpen(false);
	};

	return (
		<div className="flex flex-col gap-3 sm:gap-4">
			{/* Grund information Section */}
			<Card className="w-full max-w-[737px] gap-0 p-0">
				<CardHeader className="h-12 flex flex-row items-center border-b border-slate-200 px-4 py-0 sm:h-14 sm:px-6 [.border-b]:pb-0">
					<CardTitle className="text-sm font-medium sm:text-base">
						<Translate text={localizationConstants.createArticleGrundInfoSection} />
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0 px-4 sm:px-6 pt-4 pb-4">
					<div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 items-start">
						<FormInput
							control={control}
							name="articleNr"
							label={localizationConstants.articleNrLabel}
							placeholder={t(localizationConstants.placeholderArticleNr)}
							labelClassName={LABEL_CLASS}
						/>
						<FormInput
							control={control}
							name="benamning"
							label={localizationConstants.articleBenamningLabel}
							placeholder={t(localizationConstants.placeholderArticleBenamning)}
							labelClassName={LABEL_CLASS}
						/>
						<FormInput
							control={control}
							name="ean"
							label={localizationConstants.articleEanLabel}
							placeholder={t(localizationConstants.placeholderArticleEan)}
							labelClassName={LABEL_CLASS}
						/>
						<FormSelect
							control={control}
							name="leverantor"
							label={localizationConstants.articleLeverantorLabel}
							placeholder={t(localizationConstants.placeholderSelectLeverantor)}
							options={leverantorOptionsMerged}
							labelClassName={LABEL_CLASS}
						/>
						<FormField
							control={control}
							name="husarbete"
							render={({ field }) => (
								<FormItem className="grid gap-1">
									<FormLabel className={LABEL_CLASS}>
										<Translate text={localizationConstants.articleHusarbeteLabel} />
									</FormLabel>
									<FormControl>
										<RadioGroup
											value={field.value}
											onValueChange={field.onChange}
											className="flex flex-row gap-4"
										>
											<FormItem className="flex items-center gap-2 space-y-0">
												<FormControl>
													<RadioGroupItem
														value="ja"
														className="text-slate-900 border-slate-400 [&_svg]:fill-slate-900"
													/>
												</FormControl>
												<FormLabel className="font-normal cursor-pointer text-[14px] leading-5 text-[#09090B]">
													<Translate text={localizationConstants.articleHusarbeteYes} />
												</FormLabel>
											</FormItem>
											<FormItem className="flex items-center gap-2 space-y-0">
												<FormControl>
													<RadioGroupItem
														value="nej"
														className="text-slate-900 border-slate-400 [&_svg]:fill-slate-900"
													/>
												</FormControl>
												<FormLabel className="font-normal cursor-pointer text-[14px] leading-5 text-[#09090B]">
													<Translate text={localizationConstants.articleHusarbeteNo} />
												</FormLabel>
											</FormItem>
										</RadioGroup>
									</FormControl>
								</FormItem>
							)}
						/>
						<FormSelect
							control={control}
							name="supplierArticleNo"
							label={localizationConstants.articleSupplierArticleNoLabel}
							placeholder={t(localizationConstants.placeholderSelectSupplierArticleNo)}
							options={supplierArticleNoOptionsMerged}
							labelClassName={LABEL_CLASS}
						/>
						<FormSelect
							control={control}
							name="typHusarbete"
							label={localizationConstants.articleTypHusarbeteLabel}
							placeholder={t(localizationConstants.placeholderSelectTypHusarbete)}
							options={TYP_HUSARBETE_OPTIONS}
							labelClassName={LABEL_CLASS}
						/>
						<FormSelect
							control={control}
							name="enhet"
							label={localizationConstants.articleEnhetLabel}
							placeholder={t(localizationConstants.placeholderSelectEnhet)}
							options={ENHET_OPTIONS}
							labelClassName={LABEL_CLASS}
						/>
						<FormSelect
							control={control}
							name="typAvArtikel"
							label={localizationConstants.articleTypAvArtikelLabel}
							placeholder={t(localizationConstants.placeholderSelectTypAvArtikel)}
							options={TYP_ARTIKEL_OPTIONS}
							labelClassName={LABEL_CLASS}
						/>
						<FormSelect
							control={control}
							name="lagerVara"
							label={localizationConstants.articleLagerVaraLabel}
							placeholder={t(localizationConstants.placeholderSelectLagerVara)}
							options={LAGER_VARA_OPTIONS}
							labelClassName={LABEL_CLASS}
						/>
					</div>

					{/* Prislista Section (Collapsible) */}
					<div className="border-slate-200 pt-4">
						<button
							type="button"
							onClick={() => setPrislistaOpen(!prislistaOpen)}
							className="flex w-full items-center gap-2 bg-slate-100 px-4 py-1.5 border-b text-left"
						>
							<h3 className="flex items-center gap-2 text-sm font-medium text-slate-900 sm:text-base">
								<Translate text={localizationConstants.articlePrislistaLabel} />
							</h3>
							{prislistaOpen ? (
								<ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
							) : (
								<ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
							)}
						</button>
						{prislistaOpen && (
							<>
								<div className="-mx-4 mt-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
									<table className="w-full min-w-[900px] text-sm">
										<thead>
											<tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500">
												<th className="py-3 pr-2 w-10" />
												<th className="py-3 px-5 whitespace-nowrap">
													<span className="inline-flex items-center gap-2">
														<Translate text={localizationConstants.articlePrislistaHeader} />
														<ArrowUpDown className="h-3 w-3 text-slate-400" />
													</span>
												</th>
												<th className="py-3 px-5 whitespace-nowrap">
													<span className="inline-flex items-center gap-2">
														<Translate text={localizationConstants.articleBenamningHeader} />
														<ArrowUpDown className="h-3 w-3 text-slate-400" />
													</span>
												</th>
												<th className="py-3 px-5 whitespace-nowrap">
													<Translate text={localizationConstants.articlePrisUtHeader} />
												</th>
												<th className="py-3 px-5 whitespace-nowrap">
													<Translate text={localizationConstants.articlePrisKalkylHeader} />
												</th>
												<th className="py-3 px-5 whitespace-nowrap">
													<Translate text={localizationConstants.articleTgProcentHeader} />
												</th>
												<th className="py-3 px-5 whitespace-nowrap">
													<Translate text={localizationConstants.articleTbSekHeader} />
												</th>
												<th className="py-3 px-5 whitespace-nowrap">
													<Translate text={localizationConstants.articleKostnadHeader} />
												</th>
												<th className="py-3 px-5 whitespace-nowrap">
													<Translate text={localizationConstants.articleAndringsDatumHeader} />
												</th>
												<th className="py-3 px-5 whitespace-nowrap">
													<Translate text={localizationConstants.articleStatistikHeader} />
												</th>
												<th className="py-3 w-12" />
											</tr>
										</thead>
										<tbody>
											{priceListRows.map((row) => (
												<tr key={row.id} className="border-b border-[#E2E8F0] rounded-md">
													<td className="py-3 pl-2 pr-2 rounded-l-md">
														<button
															type="button"
															className="p-1 rounded hover:bg-slate-100 transition-colors"
														>
															<Star className="h-4 w-4 fill-[#111721] text-[#111721]" />
														</button>
													</td>
													<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
														{row.priceList}
													</td>
													<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700">
														{row.benamning}
													</td>
													<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
														{row.prisUt}
													</td>
													<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
														{row.prisKalkyl}
													</td>
													<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
														{row.tgProcent}
													</td>
													<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
														{row.tbSek}
													</td>
													<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
														{row.kostnad}
													</td>
													<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700 whitespace-nowrap">
														{row.andringsDatum}
													</td>
													<td className="py-3 px-6 font-sans font-normal text-sm leading-5 text-slate-700">
														-
													</td>
													<td className="py-3 pr-2 rounded-r-md">
														<button
															type="button"
															onClick={() => onRemoveRow(row.id)}
															className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
														>
															<Trash2 className="h-4 w-4" />
														</button>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								<div className="mt-4">
									<Button
										type="button"
										variant="ghost"
										onClick={handleOpenModal}
										className="w-full h-8 gap-2 border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 hover:text-slate-900"
									>
										<Plus className="h-5 w-5" />
										<Translate text={localizationConstants.articleNewRowButton} />
									</Button>
								</div>
							</>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Bokörings uppgifter Section (Collapsible) */}
			<Card className="w-full max-w-[737px] gap-0 p-0">
				<button
					type="button"
					onClick={() => setBokoringOpen(!bokoringOpen)}
					className="flex w-full items-center justify-between border-b border-slate-200 px-4 py-3 text-left sm:px-6 sm:py-4"
				>
					<h3 className="text-sm font-medium text-slate-900 sm:text-base">
						<Translate text={localizationConstants.createArticleBokoringsUppgifterSection} />
					</h3>
					{bokoringOpen ? (
						<ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />
					) : (
						<ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
					)}
				</button>
				{bokoringOpen && (
					<CardContent className="p-0 px-4 sm:px-6 pt-4 pb-4">
						<div className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 items-start">
							<FormInput
								control={control}
								name="forsaljning"
								label={localizationConstants.articleForsaljningLabel}
								placeholder={t(localizationConstants.placeholderArticleForsaljning)}
								labelClassName={LABEL_CLASS}
							/>
							<FormSelect
								control={control}
								name="moms"
								label={localizationConstants.articleMomsLabel}
								placeholder={t(localizationConstants.placeholderSelectMoms)}
								options={[
									{ value: "25", label: "25%" },
									{ value: "12", label: "12%" },
									{ value: "6", label: "6%" },
									{ value: "0", label: "0%" },
								]}
								labelClassName={LABEL_CLASS}
							/>
							<FormInput
								control={control}
								name="forsaljningSE"
								label={localizationConstants.articleForsaljningSELabel}
								placeholder={t(localizationConstants.placeholderArticleForsaljningSE)}
								labelClassName={LABEL_CLASS}
							/>
							<FormInput
								control={control}
								name="forsaljningEU"
								label={localizationConstants.articleForsaljningEULabel}
								placeholder={t(localizationConstants.placeholderArticleForsaljningEU)}
								labelClassName={LABEL_CLASS}
							/>
							<FormInput
								control={control}
								name="lagerkonto"
								label={localizationConstants.articleLagerkontoLabel}
								placeholder={t(localizationConstants.placeholderArticleLagerkonto)}
								labelClassName={LABEL_CLASS}
							/>
							<FormInput
								control={control}
								name="forsaljningEUMoms"
								label={localizationConstants.articleForsaljningEUMomsLabel}
								placeholder={t(localizationConstants.placeholderArticleForsaljningEUMoms)}
								labelClassName={LABEL_CLASS}
							/>
							<FormInput
								control={control}
								name="forsaljningExport"
								label={localizationConstants.articleForsaljningExportLabel}
								placeholder={t(localizationConstants.placeholderArticleForsaljningExport)}
								labelClassName={LABEL_CLASS}
							/>
							<FormInput
								control={control}
								name="inkop"
								label={localizationConstants.articleInkopLabel}
								placeholder={t(localizationConstants.placeholderArticleInkop)}
								labelClassName={LABEL_CLASS}
							/>
						</div>
					</CardContent>
				)}
			</Card>

			{/* Modal for Adding New Price List Row */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="sm:max-w-[485px] bg-white">
					<DialogHeader>
						<DialogTitle>
							<Translate text={localizationConstants.articleNewRowButton} />
						</DialogTitle>
					</DialogHeader>
					<div className="grid grid-cols-2 gap-3 py-2">
						<div className="space-y-1">
							<Label className={LABEL_CLASS}>
								<Translate text={localizationConstants.articlePrislistaHeader} />
							</Label>
							<Input
								value={newRowForm.priceList}
								onChange={(e) =>
									setNewRowForm((prev) => ({ ...prev, priceList: e.target.value }))
								}
								placeholder="Prislista A"
							/>
						</div>
						<div className="space-y-1">
							<Label className={LABEL_CLASS}>
								<Translate text={localizationConstants.articleBenamningHeader} />
							</Label>
							<Input
								value={newRowForm.benamning}
								onChange={(e) =>
									setNewRowForm((prev) => ({ ...prev, benamning: e.target.value }))
								}
								placeholder="Artikel benämning"
							/>
						</div>
						<div className="space-y-1">
							<Label className={LABEL_CLASS}>
								<Translate text={localizationConstants.articlePrisUtHeader} />
							</Label>
							<Input
								value={newRowForm.prisUt}
								onChange={(e) =>
									setNewRowForm((prev) => ({ ...prev, prisUt: e.target.value }))
								}
								placeholder="1 250"
							/>
						</div>
						<div className="space-y-1">
							<Label className={LABEL_CLASS}>
								<Translate text={localizationConstants.articlePrisKalkylHeader} />
							</Label>
							<Input
								value={newRowForm.prisKalkyl}
								onChange={(e) =>
									setNewRowForm((prev) => ({ ...prev, prisKalkyl: e.target.value }))
								}
								placeholder="890"
							/>
						</div>
						<div className="space-y-1">
							<Label className={LABEL_CLASS}>
								<Translate text={localizationConstants.articleTgProcentHeader} />
							</Label>
							<Input
								value={newRowForm.tgProcent}
								onChange={(e) =>
									setNewRowForm((prev) => ({ ...prev, tgProcent: e.target.value }))
								}
								placeholder="28,8"
							/>
						</div>
						<div className="space-y-1">
							<Label className={LABEL_CLASS}>
								<Translate text={localizationConstants.articleTbSekHeader} />
							</Label>
							<Input
								value={newRowForm.tbSek}
								onChange={(e) =>
									setNewRowForm((prev) => ({ ...prev, tbSek: e.target.value }))
								}
								placeholder="360"
							/>
						</div>
						<div className="space-y-1">
							<Label className={LABEL_CLASS}>
								<Translate text={localizationConstants.articleKostnadHeader} />
							</Label>
							<Input
								value={newRowForm.kostnad}
								onChange={(e) =>
									setNewRowForm((prev) => ({ ...prev, kostnad: e.target.value }))
								}
								placeholder="890"
							/>
						</div>
						<div className="space-y-1">
							<Label className={LABEL_CLASS}>
								<Translate text={localizationConstants.articleAndringsDatumHeader} />
							</Label>
							<Input
								type="date"
								value={newRowForm.andringsDatum}
								onChange={(e) =>
									setNewRowForm((prev) => ({ ...prev, andringsDatum: e.target.value }))
								}
							/>
						</div>
					</div>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							type="button"
							variant="outline"
							onClick={() => setIsModalOpen(false)}
						>
							<Translate text={localizationConstants.cancelButton} />
						</Button>
						<Button
							type="button"
							onClick={handleSaveNewRow}
							className="bg-[#111721] text-white hover:bg-slate-800"
						>
							<Translate text={localizationConstants.articleNewRowButton} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
