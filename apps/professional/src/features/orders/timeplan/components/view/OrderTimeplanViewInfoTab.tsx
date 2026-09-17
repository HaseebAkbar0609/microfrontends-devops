"use client";

import React from "react";
import { Timer, Info, Calendar as CalendarIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { TIMEPLAN_CONSTANTS } from "../../constants/timeplan.constants";
import type { OrderTimeplan, OrderTimeplanFormData } from "../../types/timeplan.types";

interface OrderTimeplanViewInfoTabProps {
	plan: OrderTimeplan | null;
	formData: OrderTimeplanFormData;
	onChange?: (field: keyof OrderTimeplanFormData, value: string) => void;
	readOnly?: boolean;
}

export function OrderTimeplanViewInfoTab({
	plan,
	formData,
	onChange,
	readOnly = false,
}: OrderTimeplanViewInfoTabProps) {
	const t = useTranslate();

	const selectedAuthorName = formData.createdBy || plan?.createdBy || TIMEPLAN_CONSTANTS.AUTHORS[0].name;
	const selectedAuthor =
		TIMEPLAN_CONSTANTS.AUTHORS.find((a) => a.name === selectedAuthorName) ||
		TIMEPLAN_CONSTANTS.AUTHORS[0];

	return (
		<div className="space-y-4 sm:space-y-6 w-full max-w-4xl pb-10 pl-0 sm:pl-7">
			{/* Card 1: Tidsplan */}
			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm w-full flex flex-col">
				{/* Card Header with Timer Icon */}
				<div className="flex h-14 min-h-14 w-full items-center px-5 sm:px-6 py-0 border-b border-slate-200 bg-white">
					<div className="flex items-center gap-2.5 min-w-0 pr-2">
						<Timer className="size-6 text-slate-700 shrink-0" strokeWidth={1.75} aria-hidden="true" />
						<span className="font-sans text-base font-medium text-slate-900 truncate">
							<Translate text={localizationConstants.orderTimeplanCardDetailsTitle} />
						</span>
					</div>
				</div>

				{/* Card Body */}
				<div className="p-5 sm:p-6 space-y-4">
					{/* Row 1: Tidsplan & Typ */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start w-full">
						{/* Tidsplan */}
						<div className="flex flex-col gap-1.5 w-full">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderTimeplanFieldPlanName} />
							</Label>
							<Select
								value={formData.planName || TIMEPLAN_CONSTANTS.KINDS.MAIN}
								onValueChange={(val) => onChange?.("planName", val)}
								disabled={readOnly}
							>
								<SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 font-medium text-sm shadow-none focus-visible:ring-1 focus-visible:ring-slate-900 disabled:opacity-100 disabled:text-slate-900 disabled:cursor-default">
									<SelectValue placeholder={t(localizationConstants.orderTimeplanFieldPlanNamePlaceholder)} />
								</SelectTrigger>
								<SelectContent className="bg-white">
									<SelectItem value={TIMEPLAN_CONSTANTS.KINDS.MAIN}>
										<Translate text={localizationConstants.orderTimeplanKindMain} />
									</SelectItem>
									<SelectItem value={TIMEPLAN_CONSTANTS.KINDS.PARTIAL}>
										<Translate text={localizationConstants.orderTimeplanKindPartial} />
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Typ */}
						<div className="flex flex-col gap-1.5 w-full">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderTimeplanFieldType} />
							</Label>
							<Select
								value={formData.type || TIMEPLAN_CONSTANTS.DEFAULT_TYPE}
								onValueChange={(val) => onChange?.("type", val)}
								disabled={readOnly}
							>
								<SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 font-medium text-sm shadow-none focus-visible:ring-1 focus-visible:ring-slate-900 disabled:opacity-100 disabled:text-slate-900 disabled:cursor-default">
									<SelectValue placeholder={t(localizationConstants.orderTimeplanFieldTypePlaceholder)} />
								</SelectTrigger>
								<SelectContent className="bg-white">
									{TIMEPLAN_CONSTANTS.TYPES.map((typeOption) => (
										<SelectItem key={typeOption.value} value={typeOption.value}>
											<Translate text={localizationConstants[typeOption.labelKey as keyof typeof localizationConstants]} />
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Row 2: Start datum & Slut datum */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start w-full">
						{/* Start datum */}
						<div className="flex flex-col gap-1.5 w-full">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderTimeplanFieldStartDate} />
							</Label>
							<Button
								type="button"
								variant="outline"
								disabled={readOnly}
								className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-medium px-3 flex items-center justify-start gap-2 shadow-none hover:bg-slate-50 disabled:opacity-100 disabled:cursor-default"
							>
								<CalendarIcon className="h-4 w-4 text-slate-900 shrink-0" />
								<span className="text-slate-900 font-medium">
									{formData.startDate || t(localizationConstants.orderTimeplanFieldStartDate)}
								</span>
							</Button>
						</div>

						{/* Slut datum */}
						<div className="flex flex-col gap-1.5 w-full">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderTimeplanFieldEndDate} />
							</Label>
							<Button
								type="button"
								variant="outline"
								disabled={readOnly}
								className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-medium px-3 flex items-center justify-start gap-2 shadow-none hover:bg-slate-50 disabled:opacity-100 disabled:cursor-default"
							>
								<CalendarIcon className="h-4 w-4 text-slate-900 shrink-0" />
								<span className="text-slate-900 font-medium">
									{formData.endDate || t(localizationConstants.orderTimeplanFieldEndDate)}
								</span>
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Card 2: Other information / Övrig information */}
			<div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm w-full flex flex-col">
				{/* Card Header with Info Icon */}
				<div className="flex h-14 min-h-14 w-full items-center px-5 sm:px-6 py-0 border-b border-slate-200 bg-white">
					<div className="flex items-center gap-2.5 min-w-0 pr-2">
						<Info className="size-6 text-slate-700 shrink-0" strokeWidth={1.75} aria-hidden="true" />
						<span className="font-sans text-base font-medium text-slate-900 truncate">
							<Translate text={localizationConstants.orderTimeplanCardOtherInfoTitle} />
						</span>
					</div>
				</div>

				{/* Card Body */}
				<div className="p-5 sm:p-6 space-y-4">
					{/* Row 1: Order nr & Customer */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start w-full">
						{/* Order nr */}
						<div className="flex flex-col gap-1.5 w-full">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderTimeplanFieldOrderNr} />
							</Label>
							<Input
								value={formData.orderNr}
								disabled
								className="h-10 w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm shadow-none cursor-default disabled:opacity-100 disabled:text-slate-900"
							/>
						</div>

						{/* Customer */}
						<div className="flex flex-col gap-1.5 w-full">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderTimeplanFieldCustomer} />
							</Label>
							<Input
								value={formData.customer}
								disabled
								className="h-10 w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 font-medium text-sm shadow-none cursor-default disabled:opacity-100 disabled:text-slate-900"
							/>
						</div>
					</div>

					{/* Row 2: Skapat av */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start w-full">
						<div className="flex flex-col gap-1.5 w-full">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderTimeplanFieldCreatedBy} />
							</Label>
							<Select
								value={formData.createdBy || selectedAuthor.name}
								onValueChange={(val) => onChange?.("createdBy", val)}
								disabled={readOnly}
							>
								<SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 font-medium text-sm shadow-none focus-visible:ring-1 focus-visible:ring-slate-900 disabled:opacity-100 disabled:text-slate-900 disabled:cursor-default">
									<div className="flex items-center gap-2 truncate">
										<div className="h-5 w-5 rounded-full bg-amber-700 text-white text-[10px] font-medium flex items-center justify-center shrink-0">
											{selectedAuthor.avatar}
										</div>
										<span className="font-medium text-slate-900 text-xs truncate">
											{selectedAuthor.name}
										</span>
										<span className="text-slate-500 font-normal text-xs">
											{selectedAuthor.handle}
										</span>
									</div>
								</SelectTrigger>
								<SelectContent className="bg-white">
									{TIMEPLAN_CONSTANTS.AUTHORS.map((author) => (
										<SelectItem key={author.id} value={author.name}>
											<div className="flex items-center gap-2">
												<div className="h-5 w-5 rounded-full bg-amber-700 text-white text-[10px] font-medium flex items-center justify-center shrink-0">
													{author.avatar}
												</div>
												<span className="font-medium text-slate-900 text-xs">
													{author.name}
												</span>
												<span className="text-slate-500 text-xs">
													{author.handle}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					</div>

					{/* Row 3: Datum & Reviderat datum */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 items-start w-full">
						{/* Datum */}
						<div className="flex flex-col gap-1.5 w-full">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderTimeplanFieldDate} />
							</Label>
							<Button
								type="button"
								variant="outline"
								disabled={readOnly}
								className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-medium px-3 flex items-center justify-start gap-2 shadow-none hover:bg-slate-50 disabled:opacity-100 disabled:cursor-default"
							>
								<CalendarIcon className="h-4 w-4 text-slate-900 shrink-0" />
								<span className="text-slate-900 font-medium">
									{formData.date || t(localizationConstants.orderTimeplanFieldDate)}
								</span>
							</Button>
						</div>

						{/* Reviderat datum */}
						<div className="flex flex-col gap-1.5 w-full">
							<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
								<Translate text={localizationConstants.orderTimeplanFieldRevisedDate} />
							</Label>
							<Button
								type="button"
								variant="outline"
								disabled={readOnly}
								className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-medium px-3 flex items-center justify-start gap-2 shadow-none hover:bg-slate-50 disabled:opacity-100 disabled:cursor-default"
							>
								<CalendarIcon className="h-4 w-4 text-slate-900 shrink-0" />
								<span className="text-slate-900 font-medium">
									{formData.revisedDate || t(localizationConstants.orderTimeplanFieldRevisedDate)}
								</span>
							</Button>
						</div>
					</div>

					{/* Row 4: Beskrivning (Full width textarea) */}
					<div className="flex flex-col gap-1.5 w-full">
						<Label className="font-sans font-medium text-sm leading-5 tracking-normal text-slate-900">
							<Translate text={localizationConstants.orderTimeplanFieldDescription} />
						</Label>
						<Textarea
							value={formData.description}
							onChange={(e) => onChange?.("description", e.target.value)}
							readOnly={readOnly}
							placeholder={t(localizationConstants.orderTimeplanFieldDescriptionPlaceholder)}
							rows={4}
							className="w-full rounded-lg border-slate-200 text-sm shadow-none focus-visible:ring-1 focus-visible:ring-slate-900 resize-y min-h-[90px] p-3 text-slate-900 font-medium disabled:opacity-100 disabled:text-slate-900 disabled:bg-slate-50 read-only:text-slate-900 read-only:bg-slate-50"
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default OrderTimeplanViewInfoTab;
