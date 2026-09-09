"use client";

import React from "react";
import type { UseFormReturn } from "react-hook-form";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from "@/components/ui/form";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
		<div className="space-y-4">
			{/* Row 2: Ansvarig & Rubrik */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
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
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											type="button"
											variant="outline"
											className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex justify-between items-center shadow-none hover:bg-slate-50 cursor-pointer"
										>
											<span className="truncate">{field.value || PROTOCOL_CONSTANTS.DEFAULT_RESPONSIBLE}</span>
											<ChevronDown className="h-4 w-4 text-zinc-500 shrink-0 ml-1" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="w-56 bg-white border border-slate-200 shadow-md rounded-lg p-1 z-50">
										{PROTOCOL_CONSTANTS.AVAILABLE_RESPONSIBLE.map((resp) => (
											<DropdownMenuItem
												key={resp}
												onClick={() => field.onChange(resp)}
												className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
											>
												{resp}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
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
									className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* Row 3: Typ & Kategori */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
				{/* Typ */}
				<FormField
					control={form.control}
					name="type"
					render={({ field }) => (
						<FormItem className="space-y-1">
							<FormLabel className="text-xs font-semibold text-slate-900">
								<Translate text={localizationConstants.protocolTypeLabel} />
							</FormLabel>
							<FormControl>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											type="button"
											variant="outline"
											className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex justify-between items-center shadow-none hover:bg-slate-50 cursor-pointer"
										>
											<span>{field.value || PROTOCOL_CONSTANTS.UPLOAD_PROTOCOL_TYPES[0]}</span>
											<ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="w-56 bg-white border border-slate-200 shadow-md rounded-lg p-1 z-50">
										{PROTOCOL_CONSTANTS.UPLOAD_PROTOCOL_TYPES.map((tItem) => (
											<DropdownMenuItem
												key={tItem}
												onClick={() => field.onChange(tItem)}
												className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
											>
												{tItem}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</FormControl>
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
							<FormControl>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											type="button"
											variant="outline"
											className="h-10 w-full rounded-lg border-slate-200 bg-white text-slate-900 text-sm font-normal px-3 flex justify-between items-center shadow-none hover:bg-slate-50 cursor-pointer"
										>
											<span>{field.value || PROTOCOL_CONSTANTS.CATEGORIES[0]}</span>
											<ChevronDown className="h-4 w-4 text-zinc-500 shrink-0" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="start" className="w-56 bg-white border border-slate-200 shadow-md rounded-lg p-1 z-50">
										{PROTOCOL_CONSTANTS.CATEGORIES.map((cat) => (
											<DropdownMenuItem
												key={cat}
												onClick={() => field.onChange(cat)}
												className="cursor-pointer text-xs text-slate-700 focus:bg-slate-100 focus:text-slate-900"
											>
												{cat}
											</DropdownMenuItem>
										))}
									</DropdownMenuContent>
								</DropdownMenu>
							</FormControl>
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
								className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			{/* Row 5: Post nr & Ort */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
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
									className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
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
									className="h-10 rounded-lg border-slate-200 bg-white text-slate-900 text-sm shadow-none focus-visible:ring-slate-900"
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
