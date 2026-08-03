"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ItTicket } from "../constants/mockData";
import { ItTicketValues, itTicketSchema } from "../schemas/itTicket";

const EMPTY_VALUES: ItTicketValues = { subject: "", description: "" };

const MOCK_ATTACHMENTS = ["Document 1.pdf", "Document 2.pdf"];

const ItTicketForm = ({
	editingTicket,
	onBack,
	onSave,
	onSend,
}: {
	editingTicket: ItTicket | null;
	onBack: () => void;
	onSave: (values: ItTicketValues) => void;
	onSend: (values: ItTicketValues) => void;
}) => {
	const t = useTranslate();
	const form = useForm<ItTicketValues>({
		resolver: zodResolver(itTicketSchema),
		defaultValues: EMPTY_VALUES,
	});

	useEffect(() => {
		form.reset(
			editingTicket
				? {
						subject: editingTicket.name,
						description: editingTicket.description,
					}
				: EMPTY_VALUES,
		);
	}, [editingTicket, form]);

	const handleSave = form.handleSubmit((values) => {
		onSave(values);
		onBack();
	});

	const handleSend = form.handleSubmit((values) => {
		onSend(values);
		onBack();
	});

	return (
		<Form {...form}>
			<form onSubmit={handleSave} className="flex flex-col gap-6">
				<div className="flex items-start gap-3">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onBack}
						className="mt-0.5 h-8 w-8 rounded-md text-slate-700"
					>
						<ArrowLeft className="h-5 w-5" />
					</Button>
					<div>
						<h2 className="text-2xl font-bold text-slate-900">
							<Translate
								text={localizationConstants.itSupportNewTicket}
							/>
						</h2>
						<p className="mt-1 text-sm text-slate-500">
							<Translate
								text={localizationConstants.itSupportJustNow}
							/>
						</p>
					</div>
				</div>

				<div className="grid grid-cols-12 items-start gap-6">
					<div className="col-span-12 flex flex-col gap-4 rounded-md border border-slate-200 bg-white p-5 xl:col-span-8">
						<FormField
							control={form.control}
							name="subject"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.itSupportSubjectLabel
											}
										/>
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t(
												localizationConstants.itSupportSubjectPlaceholder,
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
							name="description"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.itSupportDescLabel
											}
										/>
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											rows={4}
											placeholder={t(
												localizationConstants.itSupportDescPlaceholder,
											)}
											className="border-slate-200 text-sm"
										/>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>

						<div className="flex flex-col gap-1.5">
							<Label className="text-sm font-medium text-slate-900">
								<Translate
									text={
										localizationConstants.companyMsgUploadLabel
									}
								/>
							</Label>
							<div className="flex items-center gap-3">
								<label className="flex h-11 flex-1 cursor-pointer items-center gap-3 rounded-md border border-slate-200 px-3 text-sm">
									<span className="font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.companyMsgUploadClick
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
											localizationConstants.companyMsgUploadAction
										}
									/>
								</Button>
							</div>
							<p className="text-sm text-blue-500">
								<Translate
									text={
										localizationConstants.companyMsgPdfHint
									}
								/>
							</p>
						</div>

						<div className="flex flex-wrap items-center gap-2 rounded-md border border-slate-200 px-3 py-2.5">
							{MOCK_ATTACHMENTS.map((file) => (
								<span
									key={file}
									className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700"
								>
									{file}
									<X className="h-3 w-3 text-slate-400" />
								</span>
							))}
						</div>
					</div>

					<div className="col-span-12 flex flex-col gap-3 rounded-md border border-slate-200 bg-white p-5 xl:col-span-3">
						<Button
							type="button"
							variant="secondary"
							onClick={onBack}
							className="h-11 rounded-md bg-slate-100 text-sm font-medium text-slate-900 hover:bg-slate-200"
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={handleSend}
							className="h-11 rounded-md border-slate-200 bg-white text-sm font-medium text-slate-900 hover:bg-slate-50"
						>
							<Translate
								text={localizationConstants.offerFormSubmit}
							/>
						</Button>
						<Button
							type="submit"
							className="h-11 gap-2 rounded-md bg-slate-900 text-sm font-medium text-white hover:bg-slate-900/90"
						>
							<Save className="h-4 w-4" />
							<Translate text={localizationConstants.save} />
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
};

export default ItTicketForm;
