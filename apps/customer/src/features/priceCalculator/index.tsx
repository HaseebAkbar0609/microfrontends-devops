"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Info, Minus, Plus, Printer, Trash2 } from "lucide-react";

import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import localizationConstants from "@/utils/translation/constants";

import { BREADCRUMBS, PRICE_CALCULATOR_TABS_LIST_CLASS, PRICE_CALCULATOR_TAB_TRIGGER_CLASS } from "./constants";
import { formatCurrency, formatNumber } from "./utils";
import { CalculatorField } from "./components/CalculatorField";
import { PriceDonutChart } from "./components/PriceDonutChart";
import { RotDeductionToggle } from "./components/RotDeductionToggle";
import { getCostCalculatorConfigAPIAction, calculateEstimateAPIAction, getCostCalculatorProductsAPIAction, getCostCalculatorHourlyRatesAPIAction, mapConfigToProjectTypes, type ApiConfig, type MappedProjectType, type MappedField } from "@/api-actions/cost-calculator";

function SectionCard({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}
		>
			{children}
		</div>
	);
}

type ApiProduct = { id: string; productKey: string; categoryKey: string; priceInterval: string; unitPrice: number };
type ApiHourlyRate = { id: string; workTypeKey: string; categoryKey: string; priceInterval: string };

export default function PriceCalculatorPage() {
	const { t } = useTranslation();
	const [selectedExampleId, setSelectedExampleId] = useState("");
	const [fieldValues, setFieldValues] = useState<Record<string, number | string>>({});
	const [rotEnabled, setRotEnabled] = useState(false);
	const [productSearch, setProductSearch] = useState("");
	const [hourlySearch, setHourlySearch] = useState("");
	const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
	const [productQuantities, setProductQuantities] = useState<
		Record<string, number>
	>({});
	const [projectTypes, setProjectTypes] = useState<MappedProjectType[]>([]);
	const [apiConfigId, setApiConfigId] = useState("");
	
	const [estimate, setEstimate] = useState({
		low: 0,
		high: 0,
		materialShare: 50,
		laborShare: 50,
		material: 0,
		labor: 0
	});

	const selectedType = useMemo(() => {
		return projectTypes.find((type) => type.id === selectedExampleId) ?? projectTypes[0];
	}, [selectedExampleId, projectTypes]);


	useEffect(() => {
		let isMounted = true;
		async function fetchAllConfigs() {
			const res = await getCostCalculatorConfigAPIAction();
			if (res.success && res.data && isMounted) {
				const mappedTypes = mapConfigToProjectTypes(res.data as ApiConfig);
				if (mappedTypes.length > 0) {
					setProjectTypes(mappedTypes);
					setSelectedExampleId((prev) => prev || mappedTypes[0].id);
				}
			}
		}
		fetchAllConfigs();
		return () => { isMounted = false; };
	}, []);


	useEffect(() => {
		if (!selectedExampleId) return;
		const typeInState = projectTypes.find(t => t.id === selectedExampleId);
		if (typeInState && ('apiId' in typeInState)) {
			setApiConfigId(typeInState.apiId);

			const initial: Record<string, number | string> = {};
			for (const field of typeInState.fields) {
				initial[field.id] = field.defaultValue;
			}
			setFieldValues(initial);
		}
	}, [selectedExampleId, projectTypes]);


	useEffect(() => {
		if (!apiConfigId || !selectedType) return;
		
		const answers = Object.entries(fieldValues).map(([qId, val]) => {
			const field = selectedType.fields.find((f: MappedField) => f.id === qId);
			if (!field) return null;
			if (field.type === 'select') {
				return { question_id: qId, option_id: val as string };
			}
			return { question_id: qId, value: Number(val) };
		}).filter(Boolean);

		const timer = setTimeout(async () => {
			const res = await calculateEstimateAPIAction({
				category_id: apiConfigId,
				answers: answers as { question_id: string; value?: number; option_id?: string }[],
				apply_rot: rotEnabled
			});
			if (res.success && res.data) {
				const resData = res.data as {
					estimate_min: number;
					estimate_max: number;
					breakdown: {
						material: { percentage: number; amount: number };
						labor: { percentage: number; amount: number };
					};
				};
				setEstimate({
					low: resData.estimate_min,
					high: resData.estimate_max,
					materialShare: resData.breakdown.material.percentage,
					laborShare: resData.breakdown.labor.percentage,
					material: resData.breakdown.material.amount,
					labor: resData.breakdown.labor.amount,
				});
			}
		}, 300);

		return () => clearTimeout(timer);
	}, [apiConfigId, fieldValues, rotEnabled, selectedType]);
	const [apiProducts, setApiProducts] = useState<ApiProduct[]>([]);
	const [apiHourlyRates, setApiHourlyRates] = useState<ApiHourlyRate[]>([]);

	useEffect(() => {
		let isMounted = true;
		async function fetchCatalog() {
			const [productsRes, hourlyRes] = await Promise.all([
				getCostCalculatorProductsAPIAction("", "", 1),
				getCostCalculatorHourlyRatesAPIAction()
			]);

			const productsData = productsRes.data as { results?: { id: string; name: string; category?: { name: string }; price_min: number; price_max: number }[] };
			if (productsRes.success && productsData?.results && isMounted) {
				setApiProducts(productsData.results.map((p) => ({
					id: p.id,
					productKey: p.name,
					categoryKey: p.category?.name || "",
					priceInterval: `${formatNumber(p.price_min)} - ${formatNumber(p.price_max)} kr`,
					unitPrice: p.price_min
				})));
			}
			const hourlyData = hourlyRes.data as { rates?: { id: string; profession: string; category?: string; rate_min: number; rate_max: number }[] };
			if (hourlyRes.success && hourlyData?.rates && isMounted) {
				setApiHourlyRates(hourlyData.rates.map((r) => ({
					id: r.id,
					workTypeKey: r.profession,
					categoryKey: r.category || "",
					priceInterval: `${formatNumber(r.rate_min)} - ${formatNumber(r.rate_max)} kr/timme`
				})));
			}
		}
		fetchCatalog();
		return () => { isMounted = false; };
	}, []);

	const filteredProducts = useMemo(() => {
		const search = productSearch.trim().toLowerCase();

		return apiProducts.filter((product) =>
			`${t(product.productKey)} ${t(product.categoryKey)}`
				.toLowerCase()
				.includes(search),
		);
	}, [productSearch, apiProducts, t]);

	const filteredHourlyPrices = useMemo(() => {
		const search = hourlySearch.trim().toLowerCase();

		return apiHourlyRates.filter((price) =>
			`${t(price.workTypeKey)} ${t(price.categoryKey)}`
				.toLowerCase()
				.includes(search),
		).sort((first, second) =>
			t(first.workTypeKey).localeCompare(t(second.workTypeKey), "sv"),
		);
	}, [hourlySearch, apiHourlyRates, t]);

	const selectedProducts = useMemo(() => {
		return apiProducts.filter((product) =>
			selectedProductIds.includes(product.id),
		);
	}, [selectedProductIds, apiProducts]);

	const toggleProduct = (productId: string) => {
		setSelectedProductIds((current) =>
			current.includes(productId)
				? current.filter((id) => id !== productId)
				: [...current, productId],
		);
		setProductQuantities((current) => ({
			...current,
			[productId]: current[productId] ?? 1,
		}));
	};

	const updateProductQuantity = (productId: string, change: number) => {
		setProductQuantities((current) => ({
			...current,
			[productId]: Math.max(1, (current[productId] ?? 1) + change),
		}));
	};

	const removeProduct = (productId: string) => {
		setSelectedProductIds((current) => current.filter((id) => id !== productId));
	};

	const clearProducts = () => {
		setSelectedProductIds([]);
	};

	const productTotal = useMemo(() => {
		return selectedProducts.reduce(
			(total, product) =>
				total + product.unitPrice * (productQuantities[product.id] ?? 1),
			0,
		);
	}, [selectedProducts, productQuantities]);

	const rotSaving = rotEnabled ? Math.round(estimate.labor * 0.3) : 0;
	const priceAfterRot = Math.max(0, estimate.low - rotSaving);

	return (
		<div className="flex flex-1 flex-col">
			<PageHeader
				title={localizationConstants.priceCalculator}
				breadcrumbs={BREADCRUMBS}
			/>
			<div className="px-5 py-3">
				<Tabs defaultValue="examples" className="w-full">
					<TabsList
						variant="line"
						className={PRICE_CALCULATOR_TABS_LIST_CLASS}
					>
						<TabsTrigger
							value="examples"
							className={PRICE_CALCULATOR_TAB_TRIGGER_CLASS}
						>
							{t(localizationConstants.priceCalculatorTabExamples)}
						</TabsTrigger>
						<TabsTrigger
							value="products"
							className={PRICE_CALCULATOR_TAB_TRIGGER_CLASS}
						>
							{t(localizationConstants.priceCalculatorTabProducts)}
						</TabsTrigger>
						<TabsTrigger
							value="hourly"
							className={PRICE_CALCULATOR_TAB_TRIGGER_CLASS}
						>
							{t(localizationConstants.priceCalculatorTabHourly)}
						</TabsTrigger>
					</TabsList>

					<TabsContent value="examples" className="mt-6">
						{!selectedType ? (
							<div className="flex items-center justify-center p-12">
								<span className="text-slate-500">Loading configurations...</span>
							</div>
						) : (
							<>
								<div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
							<Select value={selectedExampleId} onValueChange={setSelectedExampleId}>
								<SelectTrigger className="h-8 w-full sm:max-w-[320px] border-0 bg-slate-100">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{projectTypes.map((example) => (
										<SelectItem key={example.id} value={example.id}>
											{t(example.nameKey)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button
								type="button"
								variant="primary"
								className="h-8 w-full sm:w-auto gap-2 bg-slate-900 text-white hover:bg-slate-800"
								onClick={() => window.print()}
							>
								<Printer className="h-4 w-4" />
								Print
							</Button>
						</div>
						<div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
							<SectionCard className="p-6">
								<div className="mb-6">
									<h2 className="text-xl font-semibold text-slate-950">
										{t(selectedType.titleKey)}
									</h2>
									<p className="mt-1 text-sm text-slate-500">
										{t(selectedType.subtitleKey)}
									</p>
								</div>

								<div className="space-y-6">
									{selectedType.fields.map((field: MappedField) => (
										<CalculatorField
											key={field.id}
											field={field as unknown as React.ComponentProps<typeof CalculatorField>["field"]}
											value={fieldValues[field.id] ?? field.defaultValue}
											onChange={(val) => {
												setFieldValues((prev) => ({
													...prev,
													[field.id]: val,
												}));
											}}
										/>
									))}
								</div>
							</SectionCard>

							<SectionCard className="flex flex-col justify-center p-6">
								<PriceDonutChart
									materialShare={estimate.materialShare}
									laborShare={estimate.laborShare}
									materialAmount={estimate.material}
									laborAmount={estimate.labor}
								/>

								<div className="mt-4">
									<div className="text-[11px] text-slate-500">
										{t(localizationConstants.priceCalculatorEstimatedPrice)}
									</div>
									<div className="mt-1 text-xl font-semibold text-slate-950">
										{formatNumber(estimate.low)} – {formatCurrency(estimate.high)}
									</div>
								</div>

								<RotDeductionToggle
									enabled={rotEnabled}
									onToggle={() => setRotEnabled((current) => !current)}
									rotSaving={rotSaving}
									priceAfterRot={priceAfterRot}
								/>

								<p className="mt-6 text-xs leading-5 text-slate-500 text-center">
									{t(localizationConstants.priceCalculatorDisclaimer)}
								</p>
							</SectionCard>
						</div>
						</>
						)}
					</TabsContent>

					<TabsContent value="products" className="mt-6">
						<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
							<SectionCard className="overflow-hidden">
								<div className="border-b border-slate-200 p-4">
									<Input
										value={productSearch}
										onChange={(event) => setProductSearch(event.target.value)}
										placeholder={t(
											localizationConstants.priceCalculatorProductSearchPlaceholder,
										)}
									/>
								</div>
								<div className="max-h-[560px] overflow-y-auto">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>
													{t(localizationConstants.priceCalculatorProduct)}
												</TableHead>
												<TableHead>
													{t(localizationConstants.priceCalculatorCategory)}
												</TableHead>
												<TableHead>
													{t(localizationConstants.priceCalculatorPriceInterval)}
												</TableHead>
												<TableHead>
													{t(localizationConstants.priceCalculatorInstallation)}
												</TableHead>
												<TableHead className="text-right">
													{t(localizationConstants.priceCalculatorAction)}
												</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{filteredProducts.map((product) => {
												const isSelected = selectedProductIds.includes(
													product.id,
												);

												return (
													<TableRow key={product.id}>
														<TableCell className="font-medium text-slate-950">
															{t(product.productKey)}
														</TableCell>
														<TableCell>{t(product.categoryKey)}</TableCell>
														<TableCell>{product.priceInterval}</TableCell>
														<TableCell className="text-slate-505">
															{t(
																localizationConstants.priceCalculatorInstallationValue,
															)}
														</TableCell>
														<TableCell className="text-right">
															<Button
																type="button"
																size="sm"
																variant={isSelected ? "outlinePrimary" : "primary"}
																className={
																	isSelected
																		? "border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
																		: "bg-slate-900 hover:bg-slate-800"
																}
																onClick={() => toggleProduct(product.id)}
															>
																{isSelected
																	? t(localizationConstants.priceCalculatorRemove)
																	: t(localizationConstants.priceCalculatorAdd)}
															</Button>
														</TableCell>
													</TableRow>
												);
											})}
											{filteredProducts.length === 0 && (
												<TableRow>
													<TableCell
														colSpan={5}
														className="py-8 text-center text-slate-500"
													>
														{t(
															localizationConstants.priceCalculatorNoProductsFound,
														)}
													</TableCell>
												</TableRow>
											)}
										</TableBody>
									</Table>
								</div>
							</SectionCard>

							<SectionCard className="p-5">
								<div className="flex items-center justify-between gap-4">
									<h2 className="text-lg font-semibold text-slate-950">
										{t(localizationConstants.priceCalculatorMyList)}
									</h2>
									{selectedProducts.length > 0 && (
										<button
											type="button"
											onClick={clearProducts}
											className="text-sm font-medium text-red-500 hover:text-red-650"
										>
											{t(localizationConstants.priceCalculatorClear)}
										</button>
									)}
								</div>
								{selectedProducts.length > 0 ? (
									<>
										<div className="mt-4 space-y-3">
											{selectedProducts.map((product) => {
												const quantity = productQuantities[product.id] ?? 1;

												return (
													<div
														key={product.id}
														className="rounded-lg border border-slate-200 p-3"
													>
														<div className="flex items-start justify-between gap-3">
															<div className="font-medium text-slate-950">
																{t(product.productKey)}
															</div>
															<button
																type="button"
																onClick={() => removeProduct(product.id)}
																className="text-red-500 hover:text-red-650"
																aria-label={t(
																	localizationConstants.priceCalculatorRemove,
																)}
															>
																<Trash2 className="h-4 w-4" />
															</button>
														</div>
														<div className="mt-3 flex items-center justify-between gap-3 text-sm">
															<div className="flex h-8 items-center rounded-md border border-slate-200">
																<button
																	type="button"
																	onClick={() =>
																		updateProductQuantity(product.id, -1)
																	}
																	className="grid h-8 w-8 place-items-center text-slate-700 hover:bg-slate-50 transition-colors rounded-l-md"
																	aria-label="Decrease"
																>
																	<Minus className="h-3 w-3" />
																</button>
																<span className="min-w-8 text-center font-medium">
																	{quantity}
																</span>
																<button
																	type="button"
																	onClick={() =>
																		updateProductQuantity(product.id, 1)
																	}
																	className="grid h-8 w-8 place-items-center text-slate-700 hover:bg-slate-50 transition-colors rounded-r-md"
																	aria-label="Increase"
																>
																	<Plus className="h-3 w-3" />
																</button>
															</div>
															<div className="text-right text-slate-600 font-sans">
																{product.priceInterval}
															</div>
														</div>
														<div className="mt-2 text-xs text-slate-500 font-medium">
															{t(
																localizationConstants.priceCalculatorIncludedInstallation,
															)}
														</div>
													</div>
												);
											})}
										</div>
										<div className="mt-5 border-t border-slate-200 pt-4">
											<div className="flex items-center justify-between text-sm text-slate-650">
												<span>
													{t(localizationConstants.priceCalculatorGoods)}
												</span>
												<span>{formatCurrency(productTotal)}</span>
											</div>
											<div className="mt-3 flex items-center justify-between font-semibold text-slate-950">
												<span>
													{t(localizationConstants.priceCalculatorTotalPrice)}
												</span>
												<span>{formatCurrency(productTotal)}</span>
											</div>
										</div>
									</>
								) : (
									<div className="mt-10 flex min-h-24 items-center justify-center text-center text-sm text-slate-500 font-medium">
										{t(localizationConstants.priceCalculatorMyListEmpty)}
									</div>
								)}
							</SectionCard>
						</div>
					</TabsContent>

					<TabsContent value="hourly" className="mt-6">
						<SectionCard className="overflow-hidden">
							<div className="border-b border-slate-200 p-4">
								<Input
									value={hourlySearch}
									onChange={(event) => setHourlySearch(event.target.value)}
									placeholder={t(
										localizationConstants.priceCalculatorHourlySearchPlaceholder,
									)}
								/>
							</div>
							<div className="max-h-[560px] overflow-y-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>
												{t(localizationConstants.priceCalculatorProfession)}
											</TableHead>
											<TableHead>
												{t(localizationConstants.priceCalculatorCategory)}
											</TableHead>
											<TableHead>
												{t(localizationConstants.priceCalculatorPriceInterval)}
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredHourlyPrices.map((price) => (
											<TableRow key={price.id}>
												<TableCell className="font-medium text-slate-950">
													{t(price.workTypeKey)}
												</TableCell>
												<TableCell>{t(price.categoryKey)}</TableCell>
												<TableCell>{price.priceInterval}</TableCell>
											</TableRow>
										))}
										{filteredHourlyPrices.length === 0 && (
											<TableRow>
												<TableCell
													colSpan={3}
													className="py-8 text-center text-slate-500"
												>
													{t(
														localizationConstants.priceCalculatorNoHourlyFound,
													)}
												</TableCell>
											</TableRow>
										)}
									</TableBody>
								</Table>
							</div>
						</SectionCard>
						<div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-slate-750">
							<div className="mb-3 flex items-center gap-2 font-semibold text-slate-950">
								<Info className="h-4 w-4 text-blue-600" />
								{t(localizationConstants.priceCalculatorHourlyInfoTitle)}
							</div>
							<ul className="space-y-2">
								<li>
									<span className="font-semibold text-blue-700">• </span>
									{t(localizationConstants.priceCalculatorHourlyInfoMunicipality)}
								</li>
								<li>
									<span className="font-semibold text-blue-700">• </span>
									{t(localizationConstants.priceCalculatorHourlyInfoComplexity)}
								</li>
								<li>
									<span className="font-semibold text-blue-700">• </span>
									{t(localizationConstants.priceCalculatorHourlyInfoAvailability)}
								</li>
								<li>
									<span className="font-semibold text-blue-700">• </span>
									{t(localizationConstants.priceCalculatorHourlyInfoJour)}
								</li>
							</ul>
							<p className="mt-3 text-slate-650">
								{t(localizationConstants.priceCalculatorHourlyInfoNote)}
							</p>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
