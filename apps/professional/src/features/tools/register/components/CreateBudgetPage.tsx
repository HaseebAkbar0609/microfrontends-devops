"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, Loader2, Plus, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { showToast } from "@/lib/toast";
import { FormDatePicker } from "@/components/form/FormDatePicker";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { createBudgetSchema, type CreateBudgetFormData } from "../types";
import { useCreateBudgetMutation } from "../hooks/useBudgetRegister";

// ─── Stable constants ────────────────────────────────────────────────────────
const CURRENCY_OPTIONS = ["SEK", "EUR", "USD", "GBP", "NOK", "DKK"] as const;

const CATEGORY_OPTIONS = [
	{ value: "labor", labelKey: localizationConstants.budgetCategoryPlaceholder },
	{ value: "arbete", label: "Arbete" },
	{ value: "material", label: "Material" },
	{ value: "overhead", label: "Overhead" },
	{ value: "rot_rut", label: "ROT/RUT" },
	{ value: "contingency", label: "Contingency" },
] as const;

const DISTRIBUTION_OPTIONS = [
	{ value: "K4", label: "K4" },
	{ value: "K12", label: "K12" },
	{ value: "lika", label: "Lika fördelning" },
	{ value: "manual", label: "Manuell" },
] as const;

const MONTH_KEYS = [
	localizationConstants.monthJan,
	localizationConstants.monthFeb,
	localizationConstants.monthMar,
	localizationConstants.monthApr,
	localizationConstants.monthMay,
	localizationConstants.monthJun,
	localizationConstants.monthJul,
	localizationConstants.monthAug,
	localizationConstants.monthSep,
	localizationConstants.monthOct,
	localizationConstants.monthNov,
	localizationConstants.monthDec,
] as const;

interface BudgetRow {
	id: string;
	konto: string;
	kostnadsStalle: string;
	arsbelopp: string;
	fordelning: string;
	percent: string;
	months: string[]; // 12 values
}

function generateRowId() {
	return Math.random().toString(36).slice(2, 10);
}

function createEmptyRow(): BudgetRow {
	return {
		id: generateRowId(),
		konto: "",
		kostnadsStalle: "",
		arsbelopp: "",
		fordelning: "",
		percent: "",
		months: Array(12).fill("0"),
	};
}

// ─── Component ────────────────────────────────────────────────────────────────
export function CreateBudgetPage() {
	const t = useTranslate();
	const router = useRouter();
	const createMutation = useCreateBudgetMutation();
	const isPending = createMutation.isPending;

	// Budget section rows state
	const [budgetRows, setBudgetRows] = useState<BudgetRow[]>([
		{ ...createEmptyRow(), konto: "20 I", kostnadsStalle: "10 - Stockholm", arsbelopp: "500 000", fordelning: "0", percent: "0", months: ["100 000", "100 000", "0", "0", "48", "0", "0", "0", "0", "0", "0", "0"] },
		{ ...createEmptyRow(), konto: "40 C", kostnadsStalle: "10 - Stockholm", arsbelopp: "300 000", fordelning: "12", percent: "0", months: ["-50 000", "-50 000", "0", "0", "30", "0", "0", "0", "0", "0", "0", "0"] },
	]);
	const [distribution, setDistribution] = useState("K4");

	// Add Row Modal State
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [newRowData, setNewRowData] = useState<BudgetRow>(createEmptyRow());

	const form = useForm({
		resolver: zodResolver(createBudgetSchema),
		defaultValues: {
			budgetNr: "105",
			budgetName: "",
			totalAmount: "",
			currency: "SEK",
			category: "",
			startDate: "",
			endDate: "",
			description: "",
			avvikBudget: false,
			overheadBudget: false,
		},
	});

	const onSubmit = async (data: CreateBudgetFormData): Promise<void> => {
		try {
			const res = await createMutation.mutateAsync(data);
			if (res.success) {
				showToast("success", t(localizationConstants.budgetCreatedSuccess));
				router.push("/tools/register?tab=budget");
			} else {
				showToast("error", t(localizationConstants.budgetCreateError));
			}
		} catch {
			showToast("error", t(localizationConstants.budgetCreateError));
		}
	};

	const handleCancel = () => {
		if (isPending) return;
		router.push("/tools/register?tab=budget");
	};

	// Computed totals
	const totals = useMemo(() => {
		let income = 0;
		let cost = 0;
		for (const row of budgetRows) {
			const amount = parseFloat(row.arsbelopp.replace(/\s/g, "").replace(",", ".")) || 0;
			if (row.konto.startsWith("2")) income += amount;
			else cost += amount;
		}
		return { income, cost, tb: income - cost };
	}, [budgetRows]);

	const handleOpenAddModal = () => {
		setNewRowData(createEmptyRow());
		setIsAddModalOpen(true);
	};

	const handleSaveNewRow = () => {
		setBudgetRows((prev) => [...prev, newRowData]);
		setIsAddModalOpen(false);
	};

	const removeRow = (id: string) => setBudgetRows((prev) => prev.filter((r) => r.id !== id));

	// Column totals per month
	const monthTotals = useMemo(
		() =>
			MONTH_KEYS.map((_, mi) =>
				budgetRows.reduce((sum, row) => {
					const v = parseFloat(row.months[mi].replace(/\s/g, "").replace(",", ".")) || 0;
					return sum + v;
				}, 0),
			),
		[budgetRows],
	);

	return (
		<div className="flex h-full flex-col overflow-y-auto bg-slate-50">
			{/* ── Main Content ── */}
			<div className="flex-1 gap-2 p-4 pb-0">
				{/* Top Header */}
				<div className="mb-4 flex items-center gap-2">
					<button
						type="button"
						onClick={handleCancel}
						disabled={isPending}
						className="rounded-md p-1 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
						aria-label={t(localizationConstants.goBackToCostCenterListLabel)}
					>
						<ArrowLeft className="h-5 w-5 text-slate-700" />
					</button>
					<h1 className="text-lg font-semibold text-slate-900 sm:text-xl">
						<Translate text={localizationConstants.createBudgetHeaderTitle} />
					</h1>
				</div>

				{/* Section Tab */}
				<div className="flex gap-4 ml-8 overflow-x-auto border-b border-slate-200 sm:mb-6 sm:gap-6">
					<button
						type="button"
						className="whitespace-nowrap pb-3 text-sm font-medium transition-colors border-b-2 border-slate-900 text-slate-900 cursor-pointer"
					>
						<Translate text={localizationConstants.budgetOption} />
					</button>
				</div>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="pl-6 flex flex-col gap-4 pb-4">
						{/* ── Budget Information Card ── */}
						<Card className="w-full xl:w-[75%] border border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden">
							<div className="h-14 border-b border-slate-100 bg-white px-6 flex items-center">
								<h2 className="text-[16px] font-medium leading-6 tracking-normal text-zinc-950">
									<Translate text={localizationConstants.budgetInformationSection} />
								</h2>
							</div>
							<CardContent className="flex flex-col gap-5 p-6 bg-white">
								{/* Budget Nr */}
								<FormField
									control={form.control}
									name="budgetNr"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1.5">
											<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
												<Translate text={localizationConstants.budgetNrLabel} />
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder={t(localizationConstants.budgetNrPlaceholder)}
													className="h-10 w-full md:w-1/2 border-slate-200 bg-white text-sm text-slate-900 transition-colors"
												/>
											</FormControl>
											<FormMessage translate={t} className="text-xs text-red-500" />
										</FormItem>
									)}
								/>

								{/* Budget Name + Description side by side */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<FormField
										control={form.control}
										name="budgetName"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5">
												<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
													<Translate text={localizationConstants.budgetNameLabel} />
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder={t(localizationConstants.budgetNamePlaceholder)}
														className="h-10 border-slate-200 bg-white text-sm text-slate-900 transition-colors"
													/>
												</FormControl>
												<FormMessage translate={t} className="text-xs text-red-500" />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="description"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5">
												<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
													<Translate text={localizationConstants.budgetDescriptionLabel} />
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder={t(localizationConstants.budgetDescriptionPlaceholder)}
														className="h-10 border-slate-200 bg-white text-sm text-slate-900 transition-colors"
													/>
												</FormControl>
												<FormMessage translate={t} className="text-xs text-red-500" />
											</FormItem>
										)}
									/>
								</div>

								{/* Kommentar */}
								<div className="flex flex-col gap-1.5">
									<label className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
										<Translate text={localizationConstants.budgetKommentarLabel} />
									</label>
									<Input
										placeholder={t(localizationConstants.budgetKommentarPlaceholder)}
										className="h-10 border-slate-200 bg-white text-sm text-slate-900 transition-colors"
									/>
								</div>

								{/* Taggar */}
								<div className="flex flex-col gap-1.5">
									<label className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
										<Translate text={localizationConstants.budgetTaggarLabel} />
									</label>
									<Input
										placeholder={t(localizationConstants.budgetTaggarPlaceholder)}
										className="h-10 border-slate-200 bg-white text-sm text-slate-900 transition-colors"
									/>
								</div>

								{/* Checkboxes: Avvik budget + Overhead budget */}
								<div className="flex items-center gap-6">
									<FormField
										control={form.control}
										name="avvikBudget"
										render={({ field }) => (
											<FormItem className="flex items-center gap-2 space-y-0">
												<FormControl>
													<Checkbox
														id="avvik-budget"
														checked={field.value}
														onCheckedChange={field.onChange}
														className="data-[state=checked]:bg-[#111721] data-[state=checked]:border-[#111721]"
													/>
												</FormControl>
												<FormLabel
													htmlFor="avvik-budget"
													className="text-sm font-medium text-slate-700 cursor-pointer"
												>
													<Translate text={localizationConstants.budgetAvvikLabel} />
												</FormLabel>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="overheadBudget"
										render={({ field }) => (
											<FormItem className="flex items-center gap-2 space-y-0">
												<FormControl>
													<Checkbox
														id="overhead-budget"
														checked={field.value}
														onCheckedChange={field.onChange}
														className="data-[state=checked]:bg-[#111721] data-[state=checked]:border-[#111721]"
													/>
												</FormControl>
												<FormLabel
													htmlFor="overhead-budget"
													className="text-sm font-medium text-slate-700 cursor-pointer"
												>
													<Translate text={localizationConstants.budgetOverheadLabel} />
												</FormLabel>
											</FormItem>
										)}
									/>
								</div>
							</CardContent>
						</Card>

						{/* ── Budget Section Card ── */}
						<Card className="w-full xl:w-[75%] border border-slate-200 bg-white shadow-2xs rounded-xl overflow-hidden">
							<div className="h-14 border-b border-slate-100 bg-white px-6 flex items-center justify-between">
								<h2 className="text-[16px] font-medium leading-6 tracking-normal text-zinc-950">
									<Translate text={localizationConstants.budgetSection} />
								</h2>
								<button type="button" className="p-1 hover:bg-slate-100 rounded-md cursor-pointer">
									<ChevronDown className="h-4 w-4 text-slate-500" />
								</button>
							</div>
							<CardContent className="flex flex-col gap-5 p-6 bg-white">
								{/* Distribution + Date range + Currency + Category */}
								<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
									{/* Fördelning */}
									<div className="flex flex-col gap-1.5">
										<label className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
											<Translate text={localizationConstants.budgetFordelningLabel} />
										</label>
										<Select value={distribution} onValueChange={setDistribution}>
											<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900">
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{DISTRIBUTION_OPTIONS.map((opt) => (
													<SelectItem key={opt.value} value={opt.value}>
														{opt.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>

									{/* Currency */}
									<FormField
										control={form.control}
										name="currency"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5">
												<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
													<Translate text={localizationConstants.budgetCurrencyLabel} />
												</FormLabel>
												<Select value={field.value} onValueChange={field.onChange}>
													<FormControl>
														<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900">
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{CURRENCY_OPTIONS.map((c) => (
															<SelectItem key={c} value={c}>
																{c}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage translate={t} className="text-xs text-red-500" />
											</FormItem>
										)}
									/>

									{/* Start Date */}
									<FormDatePicker
										control={form.control}
										name="startDate"
										label={localizationConstants.budgetStartDateLabel}
										placeholder={localizationConstants.budgetStartDatePlaceholder}
										className="flex flex-col gap-1.5"
										labelClassName="text-[14px] font-medium leading-5 tracking-normal text-slate-700"
										inputClassName="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 transition-colors"
										translateError={t}
									/>

									{/* End Date */}
									<FormDatePicker
										control={form.control}
										name="endDate"
										label={localizationConstants.budgetEndDateLabel}
										placeholder={localizationConstants.budgetEndDatePlaceholder}
										className="flex flex-col gap-1.5"
										labelClassName="text-[14px] font-medium leading-5 tracking-normal text-slate-700"
										inputClassName="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 transition-colors"
										translateError={t}
									/>
								</div>

								{/* Category + Total Amount */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="category"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5">
												<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
													<Translate text={localizationConstants.budgetCategoryLabel} />
												</FormLabel>
												<Select value={field.value} onValueChange={field.onChange}>
													<FormControl>
														<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900">
															<SelectValue placeholder={t(localizationConstants.budgetCategoryPlaceholder)} />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{CATEGORY_OPTIONS.filter((c) => "label" in c).map((c) => (
															<SelectItem key={c.value} value={c.value}>
																{"label" in c ? c.label : ""}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage translate={t} className="text-xs text-red-500" />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="totalAmount"
										render={({ field }) => (
											<FormItem className="flex flex-col gap-1.5">
												<FormLabel className="text-[14px] font-medium leading-5 tracking-normal text-slate-700">
													<Translate text={localizationConstants.budgetTotalAmountLabel} />
												</FormLabel>
												<FormControl>
													<Input
														{...field}
														inputMode="decimal"
														placeholder={t(localizationConstants.budgetTotalAmountPlaceholder)}
														className="h-10 border-slate-200 bg-white text-sm text-slate-900 transition-colors"
													/>
												</FormControl>
												<FormMessage translate={t} className="text-xs text-red-500" />
											</FormItem>
										)}
									/>
								</div>

								{/* ── Budget Row Table ── */}
								{/* Only show bottom border for rows (except last row). Clean background. Translated headers. */}
								<div className="overflow-x-auto">
									<table className="min-w-[1400px] w-full text-xs text-slate-700 border-collapse">
										<thead>
											<tr className="border-b border-slate-200 text-slate-500">
												<th className="px-3 py-3 text-left font-medium whitespace-nowrap min-w-[80px]">
													<Translate text={localizationConstants.budgetAccountHeader} />
												</th>
												<th className="px-3 py-3 text-left font-medium whitespace-nowrap min-w-[120px]">
													<Translate text={localizationConstants.budgetCostCenterHeader} />
												</th>
												<th className="px-3 py-3 text-left font-medium whitespace-nowrap min-w-[100px]">
													<Translate text={localizationConstants.budgetAnnualAmountHeader} />
												</th>
												<th className="px-3 py-3 text-left font-medium whitespace-nowrap min-w-[80px]">
													<Translate text={localizationConstants.budgetDistributionHeader} />
												</th>
												<th className="px-3 py-3 text-left font-medium whitespace-nowrap min-w-[40px]">
													<Translate text={localizationConstants.budgetPercentHeader} />
												</th>
												{MONTH_KEYS.map((key) => (
													<th key={key} className="px-2 py-3 text-left font-medium whitespace-nowrap min-w-[76px]">
														<Translate text={key} />
													</th>
												))}
												<th className="px-2 py-3 w-8" />
											</tr>
										</thead>
										<tbody>
											{budgetRows.map((row, rowIndex) => {
												const isLastRow = rowIndex === budgetRows.length - 1;
												return (
													<tr
														key={row.id}
														className={!isLastRow ? "border-b border-slate-200" : ""}
													>
														<td className="px-3 py-3 font-medium text-slate-900 whitespace-nowrap">{row.konto}</td>
														<td className="px-3 py-3 text-slate-700 whitespace-nowrap">{row.kostnadsStalle}</td>
														<td className="px-3 py-3 text-slate-900 font-medium whitespace-nowrap">{row.arsbelopp}</td>
														<td className="px-3 py-3 text-slate-700 whitespace-nowrap">{row.fordelning}</td>
														<td className="px-3 py-3 text-slate-700 whitespace-nowrap">{row.percent}</td>
														{row.months.map((val, mi) => (
															<td key={mi} className="px-2 py-3 text-slate-900 whitespace-nowrap">
																{val}
															</td>
														))}
														<td className="px-2 py-3 text-right">
															<button
																type="button"
																onClick={() => removeRow(row.id)}
																aria-label="Remove row"
																className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
															>
																<Trash2 className="h-4 w-4" />
															</button>
														</td>
													</tr>
												);
											})}

											{/* Month totals row with border-t */}
											<tr className="border-t border-slate-200 font-semibold text-slate-900">
												<td colSpan={5} className="px-3 py-3 text-xs text-slate-500 font-normal">
													<Translate text={localizationConstants.budgetTotalLabel} />
												</td>
												{monthTotals.map((total, mi) => (
													<td key={mi} className="px-2 py-3 text-xs text-slate-900 whitespace-nowrap">
														{total.toLocaleString("sv-SE")}
													</td>
												))}
												<td />
											</tr>
										</tbody>
									</table>
								</div>

								{/* Add row button (opens Modal) - single icon */}
								<div>
									<button
										type="button"
										onClick={handleOpenAddModal}
										className="flex items-center gap-1.5 text-sm font-medium text-slate-900 hover:bg-slate-100 rounded-md px-3.5 py-2 transition-colors cursor-pointer border border-slate-300 shadow-2xs"
									>
										<Plus className="h-4 w-4" />
										<Translate text={localizationConstants.budgetAddRowButton} />
									</button>
								</div>

								{/* ── Totals summary ── */}
								{/* Income, Costs, and Total TB Contribution formatted in a single right-aligned summary block */}
								{/* Left aligned labels, right aligned amounts with dark black divider lines */}
								<div className="flex flex-col items-end border-t border-slate-200 pt-4 text-sm">
									<div className="w-full max-w-xs flex flex-col gap-2">
										{/* Income */}
										<div className="flex items-center justify-between text-slate-700 py-1">
											<span>
												<Translate text={localizationConstants.budgetIncomeLabel} />
											</span>
											<span className="font-medium text-slate-900 tabular-nums">
												{totals.income.toLocaleString("sv-SE")}
											</span>
										</div>

										{/* Dark black line between Income and Costs */}
										<div className="border-b border-slate-900 w-full" />

										{/* Costs */}
										<div className="flex items-center justify-between text-slate-700 py-1">
											<span>
												<Translate text={localizationConstants.budgetCostLabel} />
											</span>
											<span className="font-medium text-slate-900 tabular-nums">
												-{totals.cost.toLocaleString("sv-SE")}
											</span>
										</div>

										{/* Dark black line between Costs and Total TB Contribution */}
										<div className="border-b-2 border-slate-900 w-full" />

										{/* Total TB Contribution */}
										<div className="flex items-center justify-between font-bold text-slate-900 text-base py-1">
											<span>
												<Translate text={localizationConstants.budgetTotalTbLabel} />
											</span>
											<span className="tabular-nums">
												{totals.tb.toLocaleString("sv-SE")}
											</span>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</form>
				</Form>
			</div>

			{/* ── Add Budget Row Modal ── */}
			<Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
				<DialogContent className="max-w-2xl bg-white p-6 rounded-xl max-h-[85vh] flex flex-col overflow-hidden">
					<DialogHeader>
						<DialogTitle className="text-lg font-semibold text-slate-900">
							<Translate text={localizationConstants.budgetModalTitle} />
						</DialogTitle>
					</DialogHeader>

					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 overflow-y-auto max-h-[calc(85vh-140px)] pr-2">
						{/* Konto */}
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.budgetAccountHeader} />
							</label>
							<Input
								value={newRowData.konto}
								onChange={(e) => setNewRowData({ ...newRowData, konto: e.target.value })}
								placeholder="e.g. 20 I"
								className="h-10 border-slate-200 bg-white text-sm"
							/>
						</div>

						{/* Kostnadsställe */}
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.budgetCostCenterHeader} />
							</label>
							<Input
								value={newRowData.kostnadsStalle}
								onChange={(e) => setNewRowData({ ...newRowData, kostnadsStalle: e.target.value })}
								placeholder="e.g. 10 - Stockholm"
								className="h-10 border-slate-200 bg-white text-sm"
							/>
						</div>

						{/* Årsbelopp */}
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.budgetAnnualAmountHeader} />
							</label>
							<Input
								value={newRowData.arsbelopp}
								onChange={(e) => setNewRowData({ ...newRowData, arsbelopp: e.target.value })}
								placeholder="e.g. 500 000"
								inputMode="decimal"
								className="h-10 border-slate-200 bg-white text-sm"
							/>
						</div>

						{/* Fördelning */}
						<div className="flex flex-col gap-1.5">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.budgetDistributionHeader} />
							</label>
							<Input
								value={newRowData.fordelning}
								onChange={(e) => setNewRowData({ ...newRowData, fordelning: e.target.value })}
								placeholder="0"
								className="h-10 border-slate-200 bg-white text-sm"
							/>
						</div>

						{/* % */}
						<div className="flex flex-col gap-1.5 sm:col-span-2">
							<label className="text-xs font-semibold text-slate-700">
								<Translate text={localizationConstants.budgetPercentHeader} />
							</label>
							<Input
								value={newRowData.percent}
								onChange={(e) => setNewRowData({ ...newRowData, percent: e.target.value })}
								placeholder="0"
								inputMode="decimal"
								className="h-10 border-slate-200 bg-white text-sm"
							/>
						</div>

						{/* Monthly inputs */}
						{MONTH_KEYS.map((monthKey, idx) => (
							<div key={monthKey} className="flex flex-col gap-1.5">
								<label className="text-xs font-medium text-slate-600">
									<Translate text={monthKey} />
								</label>
								<Input
									value={newRowData.months[idx] ?? "0"}
									onChange={(e) => {
										const months = [...newRowData.months];
										months[idx] = e.target.value;
										setNewRowData({ ...newRowData, months });
									}}
									placeholder="0"
									inputMode="decimal"
									className="h-9 border-slate-200 bg-white text-xs"
								/>
							</div>
						))}
					</div>

					<DialogFooter className="flex justify-end gap-2">
						<Button
							type="button"
							variant="ghost"
							onClick={() => setIsAddModalOpen(false)}
							className="border border-slate-300 text-slate-700"
						>
							<Translate text={localizationConstants.cancelButton} />
						</Button>
						<Button
							type="button"
							onClick={handleSaveNewRow}
							className="bg-[#111721] text-white hover:bg-slate-800"
						>
							<Translate text={localizationConstants.saveButton} />
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* ── Sticky Bottom Action Bar ── */}
			<div className="sticky bottom-0 border-t border-slate-200 bg-white pt-2 sm:pt-3 z-10">
				<div className="flex flex-wrap justify-end gap-2 px-3 pb-2 sm:flex-nowrap sm:items-center sm:justify-end sm:gap-3 sm:px-4 sm:pb-3">
					<Button
						type="button"
						variant="ghost"
						size="default"
						disabled={isPending}
						onClick={handleCancel}
						className="h-9 min-w-30 rounded bg-transparent border border-slate-300 px-5 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-none cursor-pointer disabled:opacity-50"
					>
						<Translate text={localizationConstants.cancelButton} />
					</Button>

					<Button
						type="button"
						variant="default"
						size="default"
						disabled={isPending}
						onClick={form.handleSubmit(onSubmit)}
						className="h-9 min-w-30 rounded gap-2 bg-[#111721] text-white hover:bg-slate-800 cursor-pointer shadow-2xs flex items-center justify-center disabled:opacity-70"
					>
						{isPending ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<Save className="h-4 w-4" />
						)}
						<Translate text={localizationConstants.saveButton} />
					</Button>
				</div>
			</div>
		</div>
	);
}
