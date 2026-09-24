"use client";

import React, { useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { Info, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { PROTOCOL_CONSTANTS } from "../../constants/protocol.constants";
import type { EditProtocolFormData } from "../../validation/protocol.validation";

export interface EditProtocolOtherInfoSectionProps {
	form: UseFormReturn<EditProtocolFormData>;
	defaultOpen?: boolean;
}

export function EditProtocolOtherInfoSection({
	form,
	defaultOpen = true,
}: EditProtocolOtherInfoSectionProps) {
	const t = useTranslate();
	const [isOpen, setIsOpen] = useState(defaultOpen);

	return (
		<div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-2xs w-full flex flex-col">
			{/* Accordion Header */}
			<Button
				type="button"
				variant="ghost"
				onClick={() => setIsOpen((prev) => !prev)}
				className="flex h-14 min-h-14 w-full cursor-pointer items-center justify-between px-6 sm:px-8 py-0 text-left transition-colors hover:bg-slate-50 font-normal rounded-none shadow-none focus:outline-none"
				aria-expanded={isOpen}
			>
				<div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
					<Info className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} aria-hidden="true" />
					<span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900 truncate">
						<Translate text={localizationConstants.protocolSectionOtherInfo} />
					</span>
				</div>
				<ChevronUp
					size={18}
					className={cn(
						"text-zinc-500 transition-transform duration-200 shrink-0",
						!isOpen && "rotate-180"
					)}
					aria-hidden={true}
				/>
			</Button>

			{/* Accordion Body */}
			{isOpen && (
				<div className="border-t border-zinc-200 p-4 sm:p-6 space-y-4">
					{/* Row 1: Protokoll nr & Ämne */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
						{/* Protokoll nr */}
						<FormField
							control={form.control}
							name="protocolNumber"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldNumber} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={PROTOCOL_CONSTANTS.DEFAULT_PROTOCOL_NR}
											className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
										/>
									</FormControl>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>

						{/* Ämne */}
						<FormField
							control={form.control}
							name="topic"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolPointSubject} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t(localizationConstants.protocolPointSubject)}
											className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
										/>
									</FormControl>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>
					</div>

					{/* Row 2: Rubrik & Kategori */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
						{/* Rubrik */}
						<FormField
							control={form.control}
							name="rubrik"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldTitle} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t(localizationConstants.protocolFieldTitle)}
											className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
										/>
									</FormControl>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>

						{/* Kategori */}
						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldCategory} />
									</FormLabel>
									<Select onValueChange={field.onChange} value={field.value || PROTOCOL_CONSTANTS.CATEGORIES[0]}>
										<FormControl>
											<SelectTrigger className="w-full h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900">
												<SelectValue placeholder={t(localizationConstants.protocolFieldCategory)} />
											</SelectTrigger>
										</FormControl>
										<SelectContent className="w-[var(--radix-select-trigger-width)] bg-white border border-slate-200 shadow-md rounded-lg">
											{PROTOCOL_CONSTANTS.CATEGORIES.map((cat) => (
												<SelectItem key={cat} value={cat} className="text-sm cursor-pointer">
													{cat}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>
					</div>

					{/* Row 3: Plats & Adress */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
						{/* Plats */}
						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldLocation} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={PROTOCOL_CONSTANTS.DEFAULT_LOCATION}
											className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
										/>
									</FormControl>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>

						{/* Adress */}
						<FormField
							control={form.control}
							name="address"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldAddress} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t(localizationConstants.protocolFieldAddress)}
											className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
										/>
									</FormControl>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>
					</div>

					{/* Row 4: Post nr & Ort */}
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
						{/* Post nr */}
						<FormField
							control={form.control}
							name="postalCode"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldPostalCode} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={PROTOCOL_CONSTANTS.DEFAULT_POSTAL_CODE}
											className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
										/>
									</FormControl>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>

						{/* Ort */}
						<FormField
							control={form.control}
							name="city"
							render={({ field }) => (
								<FormItem className="space-y-1">
									<FormLabel className="text-xs font-semibold text-slate-900">
										<Translate text={localizationConstants.protocolFieldCity} />
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={PROTOCOL_CONSTANTS.DEFAULT_CITY}
											className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
										/>
									</FormControl>
									<FormMessage className="text-xs font-medium text-red-500 mt-1" />
								</FormItem>
							)}
						/>
					</div>

					{/* Row 5: Information */}
					<FormField
						control={form.control}
						name="information"
						render={({ field }) => (
							<FormItem className="space-y-1">
								<FormLabel className="text-xs font-semibold text-slate-900">
									<Translate text={localizationConstants.protocolFieldInformation} />
								</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										placeholder={t(localizationConstants.protocolFieldInformation)}
										className="min-h-[72px] rounded-lg border-slate-200 bg-white text-slate-900 text-sm p-3 shadow-none focus-visible:ring-slate-900 resize-y"
									/>
								</FormControl>
								<FormMessage className="text-xs font-medium text-red-500 mt-1" />
							</FormItem>
						)}
					/>

					{/* Row 6: Kommentar */}
					<FormField
						control={form.control}
						name="comment"
						render={({ field }) => (
							<FormItem className="space-y-1">
								<FormLabel className="text-xs font-semibold text-slate-900">
									<Translate text={localizationConstants.protocolFieldComment} />
								</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										placeholder={t(localizationConstants.protocolFieldComment)}
										className="min-h-[72px] rounded-lg border-slate-200 bg-white text-slate-900 text-sm p-3 shadow-none focus-visible:ring-slate-900 resize-y"
									/>
								</FormControl>
								<FormMessage className="text-xs font-medium text-red-500 mt-1" />
							</FormItem>
						)}
					/>
				</div>
			)}
		</div>
	);
}

export default EditProtocolOtherInfoSection;
