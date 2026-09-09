"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { Input } from "@/components/ui/input";
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
import type { CreateProtocolFormData } from "../CreateProtocolModal";

export interface MeetingGeneralFieldsProps {
	form: UseFormReturn<CreateProtocolFormData>;
}

export function MeetingGeneralFields({ form }: MeetingGeneralFieldsProps) {
	const t = useTranslate();

	return (
		<div className="space-y-2.5">
			{/* Row 2: Ansvarig & Rubrik */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
				{/* Ansvarig */}
				<FormField
					control={form.control}
					name="responsible"
					render={({ field }) => (
						<FormItem className="space-y-1">
							<FormLabel className="text-xs font-semibold text-slate-900">
								<Translate text={localizationConstants.protocolResponsibleLabel} />
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder={PROTOCOL_CONSTANTS.DEFAULT_RESPONSIBLE}
									className="h-9 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				{/* Rubrik */}
				<FormField
					control={form.control}
					name="rubrik"
					render={({ field }) => (
						<FormItem className="space-y-1">
							<FormLabel className="text-xs font-semibold text-slate-900">
								<Translate text={localizationConstants.protocolSubjectLabel} />
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder={t(localizationConstants.protocolSubjectLabel)}
									className="h-9 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Row 3: Typ & Kategori */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
				{/* Typ */}
				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem className="space-y-1">
							<FormLabel className="text-xs font-semibold text-slate-900">
								<Translate text={localizationConstants.protocolTypeLabel} />
							</FormLabel>
							<Select value={field.value} onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger className="w-full h-9 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus:ring-slate-900 focus-visible:ring-slate-900 cursor-pointer">
										<SelectValue placeholder={t(localizationConstants.protocolTypeLabel)} />
									</SelectTrigger>
								</FormControl>
								<SelectContent className="bg-white border border-slate-200 shadow-md rounded-lg p-1 z-50">
									{PROTOCOL_CONSTANTS.UPLOAD_PROTOCOL_TYPES.map((tItem) => (
										<SelectItem
											key={tItem}
											value={tItem}
											className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
										>
											{tItem}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
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
								<Translate text={localizationConstants.protocolCategoryLabel} />
							</FormLabel>
							<Select value={field.value} onValueChange={field.onChange}>
								<FormControl>
									<SelectTrigger className="w-full h-9 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus:ring-slate-900 focus-visible:ring-slate-900 cursor-pointer">
										<SelectValue placeholder={t(localizationConstants.protocolCategoryLabel)} />
									</SelectTrigger>
								</FormControl>
								<SelectContent className="bg-white border border-slate-200 shadow-md rounded-lg p-1 z-50">
									{PROTOCOL_CONSTANTS.CATEGORIES.map((cat) => (
										<SelectItem
											key={cat}
											value={cat}
											className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
										>
											{cat}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Row 4: Adress (full width) */}
			<FormField
				control={form.control}
				name="address"
				render={({ field }) => (
					<FormItem className="space-y-1">
						<FormLabel className="text-xs font-semibold text-slate-900">
							<Translate text={localizationConstants.protocolAddressLabel} />
						</FormLabel>
						<FormControl>
							<Input
								{...field}
								placeholder={t(localizationConstants.protocolAddressLabel)}
								className="h-9 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* Row 5: Post nr & Ort */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
				<FormField
					control={form.control}
					name="postalCode"
					render={({ field }) => (
						<FormItem className="space-y-1">
							<FormLabel className="text-xs font-semibold text-slate-900">
								<Translate text={localizationConstants.protocolPostalCodeLabel} />
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder={PROTOCOL_CONSTANTS.DEFAULT_POSTAL_CODE}
									className="h-9 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="city"
					render={({ field }) => (
						<FormItem className="space-y-1">
							<FormLabel className="text-xs font-semibold text-slate-900">
								<Translate text={localizationConstants.protocolCityLabel} />
							</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder={PROTOCOL_CONSTANTS.DEFAULT_CITY}
									className="h-9 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}

export default MeetingGeneralFields;
