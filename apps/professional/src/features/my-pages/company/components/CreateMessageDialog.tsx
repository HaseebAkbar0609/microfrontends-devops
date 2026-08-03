"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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
import { CompanyMessageValues, companyMessageSchema } from "../schemas/company";

const EMPTY_VALUES: CompanyMessageValues = { recipient: "", message: "" };

const MOCK_ATTACHMENTS = ["Document 1.pdf", "Document 2.pdf"];

const CreateMessageDialog = ({
	open,
	onClose,
	onSend,
}: {
	open: boolean;
	onClose: () => void;
	onSend: (values: CompanyMessageValues) => void;
}) => {
	const t = useTranslate();
	const form = useForm<CompanyMessageValues>({
		resolver: zodResolver(companyMessageSchema),
		defaultValues: EMPTY_VALUES,
	});

	useEffect(() => {
		if (open) form.reset(EMPTY_VALUES);
	}, [open, form]);

	const handleSubmit = form.handleSubmit((values) => {
		onSend(values);
		onClose();
	});

	return (
		<Dialog open={open} onOpenChange={(value) => !value && onClose()}>
			<DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-lg bg-white p-7">
				<Form {...form}>
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4"
					>
						<DialogTitle className="text-2xl font-bold text-slate-900">
							<Translate
								text={localizationConstants.companyMsgCreate}
							/>
						</DialogTitle>

						<FormField
							control={form.control}
							name="recipient"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.companyMsgRecipient
											}
										/>
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t(
												localizationConstants.companyMsgRecipientPlaceholder,
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
									<FormLabel className="text-sm font-medium text-slate-900">
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
											placeholder="Text"
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

						<div className="flex items-center justify-end gap-3">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="h-11 rounded-md border-slate-200 bg-white px-7 text-sm font-medium text-slate-900 hover:bg-slate-50"
							>
								<Translate
									text={localizationConstants.cancel}
								/>
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
			</DialogContent>
		</Dialog>
	);
};

export default CreateMessageDialog;
