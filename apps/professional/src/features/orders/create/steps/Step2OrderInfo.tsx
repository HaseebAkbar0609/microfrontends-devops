"use client";

import { useState } from "react";
import { format } from "date-fns";
import { parseDateValue } from "@/utils/date";
import { ShoppingBag, Info, CircleFadingPlus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { OrderInfoData } from "../types";
interface Step2OrderInfoProps {
	orderInfo: OrderInfoData;
	onOrderInfoChange: (data: Partial<OrderInfoData>) => void;
	onSaveOrder?: () => void;
	errors?: Record<string, string>;
}

const TYPE_OPTIONS = [
	{ value: "Löpande räkning", label: "Löpande räkning" },
	{ value: "Fast pris", label: "Fast pris" },
	{ value: "Budgetpris", label: "Budgetpris" },
];

const CATEGORY_OPTIONS = [
	{ value: "Renovering", label: "Renovering" },
	{ value: "Nybyggnation", label: "Nybyggnation" },
	{ value: "Ombyggnation", label: "Ombyggnation" },
	{ value: "Tillbyggnad", label: "Tillbyggnad" },
	{ value: "Underhåll", label: "Underhåll" },
];

const DEPARTMENT_OPTIONS = [
	{ value: "Bygg", label: "Bygg" },
	{ value: "El", label: "El" },
	{ value: "VVS", label: "VVS" },
	{ value: "Måleri", label: "Måleri" },
	{ value: "Mark", label: "Mark" },
	{ value: "Städ", label: "Städ" },
];

const OFFER_OPTIONS = [
	{ value: "OFF-2024-001", label: "OFF-2024-001 - Köksrenovering" },
	{ value: "OFF-2024-002", label: "OFF-2024-002 - Badrumsrenovering" },
	{ value: "OFF-2024-003", label: "OFF-2024-003 - Fasadmålning" },
	{ value: "OFF-2024-004", label: "OFF-2024-004 - Takbyte" },
];

export function Step2OrderInfo({
	orderInfo,
	onOrderInfoChange,
	onSaveOrder,
	errors = {},
}: Step2OrderInfoProps) {
	const t = useTranslate();
	const [startDateOpen, setStartDateOpen] = useState(false);
	const [endDateOpen, setEndDateOpen] = useState(false);

	return (
		<div className="flex flex-col gap-4">
			{/* Card 1: Order */}
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<CardHeader className="h-12 flex flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<ShoppingBag className="h-5 w-5 text-slate-700" />
						<span><Translate text={localizationConstants.orderSection} /></span>
					</CardTitle>
				</CardHeader>
				<CardContent className="px-4 py-0">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						{/* Order nr */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderOrderNrLabel} />
							</Label>
							<Input
								value={orderInfo.orderNo}
								onChange={(e) => onOrderInfoChange({ orderNo: e.target.value })}
								placeholder={t(localizationConstants.orderOrderNrLabel)}
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.orderNo && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.orderNo && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.orderNo}</p>
							)}
						</div>

						{/* Order Namn */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderOrderNameLabel} />
							</Label>
							<Input
								value={orderInfo.orderName}
								onChange={(e) => onOrderInfoChange({ orderName: e.target.value })}
								placeholder={t(localizationConstants.orderOrderNameLabel)}
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.orderName && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.orderName && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.orderName}</p>
							)}
						</div>

						{/* Kvarters namn */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderBlockNameLabel} />
							</Label>
							<Input
								value={orderInfo.blockName}
								onChange={(e) => onOrderInfoChange({ blockName: e.target.value })}
								placeholder={t(localizationConstants.orderBlockNameLabel)}
								className="h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none"
							/>
						</div>

						{/* Order adress */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderAddress} />
							</Label>
							<Input
								value={orderInfo.orderAddress}
								onChange={(e) =>
									onOrderInfoChange({ orderAddress: e.target.value })
								}
								placeholder={t(localizationConstants.placeholderAddress)}
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.orderAddress && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.orderAddress && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.orderAddress}</p>
							)}
						</div>

						{/* Post nr */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderPostNrLabel} />
							</Label>
							<Input
								value={orderInfo.postalCode}
								onChange={(e) =>
									onOrderInfoChange({
										postalCode: e.target.value.replace(/[^0-9 ]/g, ""),
									})
								}
								placeholder={t(localizationConstants.placeholderPostalCode)}
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.postalCode && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.postalCode && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.postalCode}</p>
							)}
						</div>

						{/* Ort */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderCityLabel} />
							</Label>
							<Input
								value={orderInfo.city}
								onChange={(e) => onOrderInfoChange({ city: e.target.value })}
								placeholder={t(localizationConstants.placeholderCity)}
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.city && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.city && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.city}</p>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Card 2: Order Information */}
			<Card className="rounded-lg border border-slate-200 bg-white shadow-none pb-4">
				<CardHeader className="h-12 flex flex-row items-center border-b border-slate-200 px-4 py-0 [.border-b]:pb-0">
					<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
						<Info className="h-5 w-5 text-slate-700" />
						<span><Translate text={localizationConstants.orderInfoSection} /></span>
					</CardTitle>
				</CardHeader>
				<CardContent className="px-4 py-0 space-y-4">
					<div className="grid grid-cols-1 gap-4 lg:grid-cols-2 items-start">
						{/* Type */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderTypLabel} />
							</Label>
							<Select
								value={orderInfo.type}
								onValueChange={(val) => onOrderInfoChange({ type: val })}
							>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-none focus:border-gray-300 focus:outline-none">
									<SelectValue placeholder={t(localizationConstants.orderTypLabel)} />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200">
									{TYPE_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Kategori */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderKategoriLabel} />
							</Label>
							<Select
								value={orderInfo.category}
								onValueChange={(val) => onOrderInfoChange({ category: val })}
							>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-none focus:border-gray-300 focus:outline-none">
									<SelectValue placeholder={t(localizationConstants.orderKategoriLabel)} />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200">
									{CATEGORY_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Avdelning */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderAvdelningLabel} />
							</Label>
							<Select
								value={orderInfo.department}
								onValueChange={(val) => onOrderInfoChange({ department: val })}
							>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-none focus:border-gray-300 focus:outline-none">
									<SelectValue placeholder={t(localizationConstants.placeholderDepartment)} />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200">
									{DEPARTMENT_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Kontraktsumma */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderKontraktsummaLabel} />
							</Label>
							<Input
								value={orderInfo.contractSum}
								onChange={(e) =>
									onOrderInfoChange({
										contractSum: e.target.value.replace(/[^0-9., ]/g, ""),
									})
								}
								placeholder={t(localizationConstants.orderKontraktsummaLabel)}
								className={cn(
									"h-10 border-slate-200 rounded-md shadow-none focus-visible:border-gray-300 focus-visible:outline-none",
									errors.contractSum && "border-red-500 focus-visible:border-red-500"
								)}
							/>
							{errors.contractSum && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.contractSum}</p>
							)}
						</div>

						{/* Offert nr */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderOffertNrLabel} />
							</Label>
							<Select
								value={orderInfo.offerNo}
								onValueChange={(val) => onOrderInfoChange({ offerNo: val })}
							>
								<SelectTrigger className="h-10 w-full border-slate-200 bg-white text-sm text-slate-900 shadow-none focus:border-gray-300 focus:outline-none">
									<SelectValue placeholder={t(localizationConstants.orderOffertNrLabel)} />
								</SelectTrigger>
								<SelectContent className="bg-white border-slate-200">
									{OFFER_OPTIONS.map((opt) => (
										<SelectItem key={opt.value} value={opt.value}>
											{opt.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Start datum DatePicker without icon */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderStartDatumLabel} />
							</Label>
							<Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
								<PopoverTrigger asChild>
									<button
										type="button"
										className={cn(
											"flex h-10 w-full items-center justify-start rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-none hover:bg-slate-50 focus:border-gray-300 focus:outline-none cursor-pointer",
											!orderInfo.startDate && "text-slate-400 font-normal",
											errors.startDate && "border-red-500"
										)}
									>
										<span className="truncate">
											{orderInfo.startDate || t(localizationConstants.placeholderEnterStartDate)}
										</span>
									</button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0 border border-slate-200 bg-white shadow-lg rounded-xl z-50" align="start">
									<Calendar
										mode="single"
										selected={parseDateValue(orderInfo.startDate)}
										onSelect={(date) => {
											if (date) {
												onOrderInfoChange({ startDate: format(date, "yyyy-MM-dd") });
											}
											setStartDateOpen(false);
										}}
									/>
								</PopoverContent>
							</Popover>
						</div>

						{/* Slut datum DatePicker without icon */}
						<div className="space-y-1">
							<Label className="text-sm font-medium text-slate-700">
								<Translate text={localizationConstants.orderSlutDatumLabel} />
							</Label>
							<Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
								<PopoverTrigger asChild>
									<button
										type="button"
										className={cn(
											"flex h-10 w-full items-center justify-start rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-none hover:bg-slate-50 focus:border-gray-300 focus:outline-none cursor-pointer",
											!orderInfo.endDate && "text-slate-400 font-normal",
											errors.endDate && "border-red-500"
										)}
									>
										<span className="truncate">
											{orderInfo.endDate || t(localizationConstants.placeholderEnterEndDate)}
										</span>
									</button>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0 border border-slate-200 bg-white shadow-lg rounded-xl z-50" align="start">
									<Calendar
										mode="single"
										selected={parseDateValue(orderInfo.endDate)}
										disabled={(date) => {
											const start = parseDateValue(orderInfo.startDate);
											return start ? date < start : false;
										}}
										onSelect={(date) => {
											if (date) {
												onOrderInfoChange({ endDate: format(date, "yyyy-MM-dd") });
											}
											setEndDateOpen(false);
										}}
									/>
								</PopoverContent>
							</Popover>
							{errors.endDate && (
								<p className="text-xs text-red-500 mt-1 font-normal">{errors.endDate}</p>
							)}
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Ändra button bottom right outside card */}
			<div className="flex justify-end pt-1">
				<Button
					type="button"
					onClick={onSaveOrder}
					className="h-10 gap-2 px-6 rounded-lg bg-[#111721] text-sm font-medium text-white hover:bg-slate-800 cursor-pointer shadow-none"
				>
					<CircleFadingPlus className="h-4 w-4" />
					<span><Translate text={localizationConstants.orderChangeButton} /></span>
				</Button>
			</div>
		</div>
	);
}
