"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, Plus, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	WhistleblowerValues,
	whistleblowerSchema,
} from "../schemas/company";

const EMPTY_VALUES: WhistleblowerValues = { email: "", message: "" };

const WhistleblowerTab = () => {
	const t = useTranslate();
	const form = useForm<WhistleblowerValues>({
		resolver: zodResolver(whistleblowerSchema),
		defaultValues: EMPTY_VALUES,
	});

	// Mock submit: reset + confirmation toast until the API exists.
	const handleSubmit = form.handleSubmit(() => {
		form.reset(EMPTY_VALUES);
		showToast("success", t(localizationConstants.myPagesEmpSuccess));
	});

	return (
		<div className="flex min-h-[60vh] flex-col gap-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="flex flex-wrap items-center gap-4">
					<div className="relative w-full max-w-xs">
						<Search className="pointer-events-none absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
						<Input
							placeholder={t(localizationConstants.search)}
							className="h-9 rounded-none border-0 border-b border-slate-200 bg-transparent pl-6 text-sm shadow-none focus-visible:border-slate-400 focus-visible:ring-0"
						/>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="h-9 gap-1.5 rounded-md border-slate-200 bg-white px-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
							>
								<Translate text={localizationConstants.filter} />
								<ChevronDown className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align="start"
							className="w-40 rounded-md border border-slate-200 bg-white p-1 shadow-md"
						>
							<DropdownMenuItem className="cursor-pointer rounded-md px-3 py-2 text-sm text-slate-700">
								<Translate
									text={localizationConstants.licensesModuleAll}
								/>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				<Button
					type="button"
					className="h-10 gap-2 rounded-md bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-900/90"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.companyWbCreateNew} />
				</Button>
			</div>

			<Form {...form}>
				<form
					onSubmit={handleSubmit}
					className="flex flex-1 flex-col gap-5"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-1">
								<FormLabel className="text-sm font-semibold text-slate-900">
									<Translate
										text={
											localizationConstants.companyWbAddresses
										}
									/>
								</FormLabel>
								<p className="text-sm text-slate-500">
									<Translate
										text={
											localizationConstants.companyWbAddressHint
										}
									/>
								</p>
								<FormControl>
									<Input
										{...field}
										placeholder={t(
											localizationConstants.companyWbAddressPlaceholder,
										)}
										className="h-10 border-slate-200 text-sm"
									/>
								</FormControl>
								<FormMessage translate={t} />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-1.5">
								<FormLabel className="text-sm font-semibold text-slate-900">
									<Translate
										text={
											localizationConstants.myPagesEmpMessageLabel
										}
									/>
								</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										rows={4}
										placeholder="Meddelande...."
										className="border-slate-200 text-sm"
									/>
								</FormControl>
								<FormMessage translate={t} />
							</FormItem>
						)}
					/>

					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-semibold text-slate-900">
							<Translate
								text={localizationConstants.companyWbUpload}
							/>
						</Label>
						<div className="flex items-center gap-3">
							<label className="flex h-11 flex-1 cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3 text-sm">
								<span className="text-slate-500">
									<Translate
										text={
											localizationConstants.companyWbUploadDrop
										}
									/>
								</span>
								<input type="file" className="hidden" />
								<span className="text-slate-500">
									No file chosen
								</span>
							</label>
							<Button
								type="button"
								className="h-11 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
							>
								<Translate
									text={
										localizationConstants.companyWbAddAction
									}
								/>
							</Button>
						</div>
						<p className="text-sm text-slate-500">
							<Translate
								text={
									localizationConstants.companyWbFileTypesHint
								}
							/>
						</p>
					</div>

					<p className="text-sm text-orange-500">
						<Translate
							text={localizationConstants.companyWbWarning}
						/>
					</p>

					<div className="mt-auto flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
						<Button
							type="button"
							variant="secondary"
							onClick={() => form.reset(EMPTY_VALUES)}
							className="h-11 rounded-md bg-slate-100 px-7 text-sm font-medium text-slate-900 hover:bg-slate-200"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="submit"
							className="h-11 gap-2 rounded-md bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-900/90"
						>
							<Send className="h-4 w-4" />
							<Translate
								text={localizationConstants.offerFormSubmit}
							/>
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
};

export default WhistleblowerTab;
