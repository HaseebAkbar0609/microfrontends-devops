"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Paperclip, Send, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { CompanyMessageValues, companyMessageSchema } from "../schemas/company";

const EMPTY_VALUES: CompanyMessageValues = { recipient: "", message: "" };

const CreateMessageDialog = ({ open, onClose, onSend }: { open: boolean; onClose: () => void; onSend: (values: CompanyMessageValues, files: File[]) => Promise<void> }) => {
	const t = useTranslate();
	const [files, setFiles] = useState<File[]>([]);
	const [submitting, setSubmitting] = useState(false);
	const form = useForm<CompanyMessageValues>({ resolver: zodResolver(companyMessageSchema), defaultValues: EMPTY_VALUES });

	useEffect(() => {
		if (open) {
			form.reset(EMPTY_VALUES);
			setFiles([]);
		}
	}, [open, form]);

	const handleSubmit = form.handleSubmit(async (values) => {
		setSubmitting(true);
		try {
			await onSend(values, files);
			onClose();
		} catch {
			showToast("error", "Message could not be sent");
		} finally {
			setSubmitting(false);
		}
	});

	return (
		<Dialog open={open} onOpenChange={(value) => !value && !submitting && onClose()}>
			<DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-xl bg-white p-7">
				<Form {...form}><form onSubmit={handleSubmit} className="flex flex-col gap-5">
					<DialogTitle className="text-2xl font-bold text-slate-900"><Translate text={localizationConstants.companyMsgCreate} /></DialogTitle>
					<FormField control={form.control} name="recipient" render={({ field }) => <FormItem><FormLabel><Translate text={localizationConstants.companyMsgRecipient} /> *</FormLabel><FormControl><Input {...field} disabled={submitting} placeholder={t(localizationConstants.companyMsgRecipientPlaceholder)} /></FormControl><FormMessage translate={t} /></FormItem>} />
					<FormField control={form.control} name="message" render={({ field }) => <FormItem><FormLabel><Translate text={localizationConstants.myPagesEmpMessageLabel} /> *</FormLabel><FormControl><Textarea {...field} disabled={submitting} rows={5} /></FormControl><FormMessage translate={t} /></FormItem>} />
					<div className="space-y-2">
						<label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 hover:bg-slate-50"><Paperclip className="h-4 w-4" /><Translate text={localizationConstants.companyMsgUploadClick} /><input type="file" multiple className="sr-only" disabled={submitting} onChange={(event) => setFiles(Array.from(event.target.files ?? []).slice(0, 10))} /></label>
						{files.length > 0 && <div className="flex flex-wrap gap-2">{files.map((file, index) => <span key={`${file.name}-${index}`} className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700">{file.name}<button type="button" onClick={() => setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${file.name}`}><X className="h-3 w-3" /></button></span>)}</div>}
					</div>
					<div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={onClose} disabled={submitting}><Translate text={localizationConstants.cancel} /></Button><Button type="submit" disabled={submitting} className="gap-2 bg-slate-900 text-white hover:bg-slate-800"><Send className="h-4 w-4" />{submitting ? "Sending…" : <Translate text={localizationConstants.offerFormSubmit} />}</Button></div>
				</form></Form>
			</DialogContent>
		</Dialog>
	);
};

export default CreateMessageDialog;
