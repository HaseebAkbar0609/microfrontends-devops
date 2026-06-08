"use client";

import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Info, Minus, Plus, Trash2 } from "lucide-react";

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
import { BreadcrumbItem } from "@/types/user";
import localizationConstants from "@/utils/translation/constants";
import { TranslationKeys } from "@/utils/translation/constants";

const BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/home" },
	{ label: localizationConstants.priceCalculator },
];

const PRICE_CALCULATOR_TABS_LIST_CLASS =
	"flex h-auto w-full flex-wrap justify-start gap-x-8 gap-y-1 rounded-none border-0 border-b border-slate-200 bg-transparent p-0 md:gap-x-10";

const PRICE_CALCULATOR_TAB_TRIGGER_CLASS =
	"relative flex-none rounded-none border-0 bg-transparent px-0 py-2.5 text-sm shadow-none " +
	"font-normal text-slate-500 transition-colors hover:text-slate-700 " +
	"focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 " +
	"border-b-2 border-transparent -mb-px after:hidden " +
	"data-[state=active]:z-[1] data-[state=active]:bg-transparent data-[state=active]:font-semibold " +
	"data-[state=active]:text-slate-900 data-[state=active]:shadow-none " +
	"data-[state=active]:!border-b-2 data-[state=active]:!border-slate-900";

type PriceExample = {
	id: string;
	nameKey: TranslationKeys;
	basePrice: number;
	pricePerSquareMeter: number;
	pricePerRoom: number;
	materialShare: number;
};

type ProductPrice = {
	id: string;
	productKey: TranslationKeys;
	categoryKey: TranslationKeys;
	priceInterval: string;
	unitPrice: number;
};

type HourlyPrice = {
	id: string;
	workTypeKey: TranslationKeys;
	categoryKey: TranslationKeys;
	priceInterval: string;
};

const PRICE_EXAMPLES: PriceExample[] = [
	{
		id: "new-villa",
		nameKey: localizationConstants.priceCalculatorNewVilla,
		basePrice: 900000,
		pricePerSquareMeter: 9500,
		pricePerRoom: 25000,
		materialShare: 55,
	},
	{
		id: "bathroom",
		nameKey: localizationConstants.priceCalculatorNewBathroom,
		basePrice: 90000,
		pricePerSquareMeter: 22000,
		pricePerRoom: 12000,
		materialShare: 48,
	},
	{
		id: "kitchen",
		nameKey: localizationConstants.priceCalculatorNewKitchen,
		basePrice: 120000,
		pricePerSquareMeter: 13000,
		pricePerRoom: 18000,
		materialShare: 58,
	},
	{
		id: "terrace",
		nameKey: localizationConstants.priceCalculatorNewTerrace,
		basePrice: 35000,
		pricePerSquareMeter: 2400,
		pricePerRoom: 0,
		materialShare: 62,
	},
];

const PRODUCT_PRICES: ProductPrice[] = [
	{
		id: "wc",
		productKey: localizationConstants.priceCalculatorProductToilet,
		categoryKey: localizationConstants.priceCalculatorCategoryBathroom,
		priceInterval: "1 500 - 6 000 kr",
		unitPrice: 1500,
	},
	{
		id: "shower-wall",
		productKey: localizationConstants.priceCalculatorProductShowerWall,
		categoryKey: localizationConstants.priceCalculatorCategoryBathroom,
		priceInterval: "2 000 - 12 000 kr",
		unitPrice: 2000,
	},
	{
		id: "window",
		productKey: localizationConstants.priceCalculatorProductWindow,
		categoryKey: localizationConstants.priceCalculatorCategoryBuild,
		priceInterval: "3 000 - 9 000 kr",
		unitPrice: 3000,
	},
	{
		id: "inner-door",
		productKey: localizationConstants.priceCalculatorProductInnerDoor,
		categoryKey: localizationConstants.priceCalculatorCategoryBuild,
		priceInterval: "1 200 - 4 000 kr",
		unitPrice: 1200,
	},
	{
		id: "fan",
		productKey: localizationConstants.priceCalculatorProductKitchenFan,
		categoryKey: localizationConstants.priceCalculatorCategoryKitchen,
		priceInterval: "1 500 - 10 000 kr",
		unitPrice: 1500,
	},
	{
		id: "tiles",
		productKey: localizationConstants.priceCalculatorProductTiles,
		categoryKey: localizationConstants.priceCalculatorCategoryBathroom,
		priceInterval: "300 - 1 500 kr/m2",
		unitPrice: 300,
	},
	{
		id: "countertop",
		productKey: localizationConstants.priceCalculatorProductCountertop,
		categoryKey: localizationConstants.priceCalculatorCategoryKitchen,
		priceInterval: "3 000 - 15 000 kr",
		unitPrice: 3000,
	},
	{
		id: "tap",
		productKey: localizationConstants.priceCalculatorProductTap,
		categoryKey: localizationConstants.priceCalculatorCategoryBathroom,
		priceInterval: "800 - 4 000 kr",
		unitPrice: 800,
	},
];

const HOURLY_PRICES: HourlyPrice[] = [
	{
		id: "electrician",
		workTypeKey: localizationConstants.priceCalculatorWorkElectrician,
		categoryKey: localizationConstants.priceCalculatorCategoryElectrical,
		priceInterval: "700 - 900 kr/timme",
	},
	{
		id: "plumber",
		workTypeKey: localizationConstants.priceCalculatorWorkPlumber,
		categoryKey: localizationConstants.priceCalculatorCategoryPlumbing,
		priceInterval: "750 - 1 050 kr/timme",
	},
	{
		id: "carpenter",
		workTypeKey: localizationConstants.priceCalculatorWorkCarpenter,
		categoryKey: localizationConstants.priceCalculatorCategoryBuild,
		priceInterval: "600 - 850 kr/timme",
	},
	{
		id: "painter",
		workTypeKey: localizationConstants.priceCalculatorWorkPainter,
		categoryKey: localizationConstants.priceCalculatorCategoryPainting,
		priceInterval: "550 - 800 kr/timme",
	},
	{
		id: "tiler",
		workTypeKey: localizationConstants.priceCalculatorWorkTiler,
		categoryKey: localizationConstants.priceCalculatorCategoryBathroom,
		priceInterval: "650 - 950 kr/timme",
	},
	{
		id: "roofer",
		workTypeKey: localizationConstants.priceCalculatorWorkRoofer,
		categoryKey: localizationConstants.priceCalculatorCategoryRoof,
		priceInterval: "650 - 900 kr/timme",
	},
];

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("sv-SE", {
		maximumFractionDigits: 0,
		style: "currency",
		currency: "SEK",
	}).format(value);

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

export default function PriceCalculatorPage() {
	const { t } = useTranslation();
	const [selectedExampleId, setSelectedExampleId] = useState(
		PRICE_EXAMPLES[0].id,
	);
	const [squareMeters, setSquareMeters] = useState(200);
	const [rooms, setRooms] = useState(6);
	const [rotEnabled, setRotEnabled] = useState(false);
	const [productSearch, setProductSearch] = useState("");
	const [hourlySearch, setHourlySearch] = useState("");
	const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
	const [productQuantities, setProductQuantities] = useState<
		Record<string, number>
	>({});

	const selectedExample =
		PRICE_EXAMPLES.find((example) => example.id === selectedExampleId) ??
		PRICE_EXAMPLES[0];

	const estimate = useMemo(() => {
		const midpoint =
			selectedExample.basePrice +
			squareMeters * selectedExample.pricePerSquareMeter +
			rooms * selectedExample.pricePerRoom;
		const low = Math.round(midpoint * 0.9);
		const high = Math.round(midpoint * 1.1);
		const material = Math.round(midpoint * (selectedExample.materialShare / 100));
		const labor = midpoint - material;

		return {
			high,
			labor,
			low,
			material,
			materialShare: selectedExample.materialShare,
			laborShare: 100 - selectedExample.materialShare,
		};
	}, [rooms, selectedExample, squareMeters]);

	const filteredProducts = useMemo(() => {
		const search = productSearch.trim().toLowerCase();

		return PRODUCT_PRICES.filter((product) =>
			`${t(product.productKey)} ${t(product.categoryKey)}`
				.toLowerCase()
				.includes(search),
		);
	}, [productSearch, t]);

	const filteredHourlyPrices = useMemo(() => {
		const search = hourlySearch.trim().toLowerCase();

		return HOURLY_PRICES.filter((price) =>
			`${t(price.workTypeKey)} ${t(price.categoryKey)}`
				.toLowerCase()
				.includes(search),
		).sort((first, second) =>
			t(first.workTypeKey).localeCompare(t(second.workTypeKey), "sv"),
		);
	}, [hourlySearch, t]);

	const selectedProducts = PRODUCT_PRICES.filter((product) =>
		selectedProductIds.includes(product.id),
	);

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

	const productTotal = selectedProducts.reduce(
		(total, product) =>
			total + product.unitPrice * (productQuantities[product.id] ?? 1),
		0,
	);

	const rotRutSaving = rotEnabled ? Math.round(estimate.labor * 0.3) : 0;
	const rotRutPrice = Math.max(0, estimate.low - rotRutSaving);

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
						<div className="mb-4 flex items-center justify-between gap-4">
							<select
								id="price-example"
								value={selectedExampleId}
								onChange={(event) => setSelectedExampleId(event.target.value)}
								className="h-9 w-full max-w-sm rounded-md border border-slate-200 bg-slate-100 px-3 text-sm font-medium text-slate-900 shadow-xs outline-none focus:border-black"
								aria-label={t(localizationConstants.priceCalculatorExampleLabel)}
							>
								{PRICE_EXAMPLES.map((example) => (
									<option key={example.id} value={example.id}>
										{t(example.nameKey)}
									</option>
								))}
							</select>
						</div>
						<div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
							<SectionCard className="p-6">
								<div className="mb-6">
									<h2 className="text-xl font-semibold text-slate-950">
										{t(selectedExample.nameKey)}
									</h2>
									<p className="mt-1 text-sm text-slate-500">
										{t(localizationConstants.priceCalculatorAdjustValues)}
									</p>
								</div>

								<div className="space-y-6">
									<div>
										<div className="mb-2 flex items-center justify-between gap-4">
											<label
												htmlFor="square-meters"
												className="text-sm font-medium text-slate-700"
											>
												{t(localizationConstants.priceCalculatorSquareMeters)}
											</label>
											<div className="flex w-36 items-center gap-2">
												<Input
													type="number"
													min={10}
													max={500}
													value={squareMeters}
													onChange={(event) =>
														setSquareMeters(Number(event.target.value))
													}
												/>
												<span className="text-sm text-slate-500">m2</span>
											</div>
										</div>
										<input
											id="square-meters"
											type="range"
											min={10}
											max={500}
											value={squareMeters}
											onChange={(event) =>
												setSquareMeters(Number(event.target.value))
											}
											className="w-full accent-slate-900"
										/>
									</div>

									<div>
										<div className="mb-2 flex items-center justify-between gap-4">
											<label
												htmlFor="rooms"
												className="text-sm font-medium text-slate-700"
											>
												{t(localizationConstants.priceCalculatorRooms)}
											</label>
											<div className="flex w-36 items-center gap-2">
												<Input
													type="number"
													min={1}
													max={20}
													value={rooms}
													onChange={(event) =>
														setRooms(Number(event.target.value))
													}
												/>
												<span className="text-sm text-slate-500">rum</span>
											</div>
										</div>
										<input
											id="rooms"
											type="range"
											min={1}
											max={20}
											value={rooms}
											onChange={(event) =>
												setRooms(Number(event.target.value))
											}
											className="w-full accent-slate-900"
										/>
									</div>
								</div>
							</SectionCard>

							<SectionCard className="p-6">
								<div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
									<div className="flex flex-col items-center gap-6 sm:flex-row">
										<div
											className="grid size-36 place-items-center rounded-full"
											style={{
												background: `conic-gradient(#f97316 0 ${estimate.materialShare}%, #0ea5e9 ${estimate.materialShare}% 100%)`,
											}}
										>
											<div className="grid size-24 place-items-center rounded-full bg-slate-50 text-center">
												<div>
													<div className="text-xs text-slate-500">
														{t(localizationConstants.priceCalculatorTotal)}
													</div>
													<div className="text-2xl font-semibold text-slate-950">
														{estimate.materialShare}%
													</div>
												</div>
											</div>
										</div>
										<div className="space-y-4 text-sm">
											<div>
												<div className="flex items-center gap-2 font-medium text-slate-950">
													<span className="size-3 rounded-full bg-orange-500" />
													{t(localizationConstants.priceCalculatorMaterial)}
												</div>
												<div className="ml-5 text-slate-600">
													{formatCurrency(estimate.material)} (
													{estimate.materialShare}%)
												</div>
											</div>
											<div>
												<div className="flex items-center gap-2 font-medium text-slate-950">
													<span className="size-3 rounded-full bg-sky-500" />
													{t(localizationConstants.priceCalculatorLabor)}
												</div>
												<div className="ml-5 text-slate-600">
													{formatCurrency(estimate.labor)} (
													{estimate.laborShare}%)
												</div>
											</div>
										</div>
									</div>
								</div>

								<div className="mt-6">
									<div className="text-sm text-slate-500">
										{t(localizationConstants.priceCalculatorEstimatedPrice)}
									</div>
									<div className="mt-1 text-3xl font-semibold text-slate-950">
										{formatCurrency(estimate.low)} -{" "}
										{formatCurrency(estimate.high)}
									</div>
								</div>

								<div className="mt-5 flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700">
									<span>
										{t(localizationConstants.priceCalculatorRotRutDeduction)}
									</span>
									<button
										type="button"
										role="switch"
										aria-checked={rotEnabled}
										onClick={() => setRotEnabled((current) => !current)}
										className={`relative h-6 w-11 rounded-full transition-colors ${
											rotEnabled ? "bg-emerald-500" : "bg-slate-200"
										}`}
									>
										<span
											className={`absolute top-1 size-4 rounded-full bg-white shadow transition-transform ${
												rotEnabled ? "translate-x-5" : "translate-x-1"
											}`}
										/>
									</button>
								</div>
								{rotEnabled && (
									<div className="mt-3 rounded-lg bg-emerald-50 px-4 py-3">
										<div className="text-sm text-emerald-700">
											{t(localizationConstants.priceCalculatorAfterRotRut)}
										</div>
										<div className="mt-1 text-2xl font-semibold text-emerald-700">
											{formatCurrency(rotRutPrice)}
										</div>
										<div className="mt-1 text-sm text-emerald-700">
											{t(localizationConstants.priceCalculatorSaving)}:{" "}
											{formatCurrency(rotRutSaving)}
										</div>
									</div>
								)}
								<p className="mt-6 text-center text-xs leading-5 text-slate-500">
									{t(localizationConstants.priceCalculatorDisclaimer)}
								</p>
							</SectionCard>
						</div>
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
														<TableCell className="font-medium">
															{t(product.productKey)}
														</TableCell>
														<TableCell>{t(product.categoryKey)}</TableCell>
														<TableCell>{product.priceInterval}</TableCell>
														<TableCell className="text-slate-500">
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
											className="text-sm font-medium text-red-500 hover:text-red-600"
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
																className="text-red-500 hover:text-red-600"
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
																	className="grid h-8 w-8 place-items-center text-slate-700"
																	aria-label="Decrease"
																>
																	<Minus className="h-3 w-3" />
																</button>
																<span className="min-w-8 text-center">
																	{quantity}
																</span>
																<button
																	type="button"
																	onClick={() =>
																		updateProductQuantity(product.id, 1)
																	}
																	className="grid h-8 w-8 place-items-center text-slate-700"
																	aria-label="Increase"
																>
																	<Plus className="h-3 w-3" />
																</button>
															</div>
															<div className="text-right text-slate-500">
																{product.priceInterval}
															</div>
														</div>
														<div className="mt-2 text-xs text-slate-500">
															{t(
																localizationConstants.priceCalculatorIncludedInstallation,
															)}
														</div>
													</div>
												);
											})}
										</div>
										<div className="mt-5 border-t border-slate-200 pt-4">
											<div className="flex items-center justify-between text-sm text-slate-600">
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
									<div className="mt-10 flex min-h-24 items-center justify-center text-center text-sm text-slate-500">
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
												<TableCell className="font-medium">
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
						<div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-slate-700">
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
							<p className="mt-3 text-slate-600">
								{t(localizationConstants.priceCalculatorHourlyInfoNote)}
							</p>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}
