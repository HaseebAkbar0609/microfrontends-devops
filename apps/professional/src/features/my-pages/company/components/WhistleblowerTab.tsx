"use client";

import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, Plus, Search, Send, X } from "lucide-react";
import { useForm } from "react-hook-form";
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
import { Textarea } from "@/components/ui/textarea";
import { useAuthStatus } from "@/context/AuthContext";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	WhistleblowerValues,
	whistleblowerSchema,
} from "../schemas/company";
import {
	createCompanyContent,
	listCompanyContent,
	uploadCompanyAttachment,
} from "../services/companyService";
import type { CompanyContentItem } from "../types";

const EMPTY_VALUES: WhistleblowerValues = { email: "", message: "" };

const WhistleblowerTab = () => {
	const t = useTranslate();
	const { company } = useAuthStatus();
	const [files, setFiles] = useState<File[]>([]);
	const [reports, setReports] = useState<CompanyContentItem[]>([]);
	const [search, setSearch] = useState("");
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const formRef = useRef<HTMLFormElement>(null);
	const form = useForm<WhistleblowerValues>({
		resolver: zodResolver(whistleblowerSchema),
		defaultValues: EMPTY_VALUES,
	});

	useEffect(() => {
		let cancelled = false;
		if (!company?.id) {
			setLoading(false);
			return;
		}
		setLoading(true);
		const timer = window.setTimeout(() => {
			listCompanyContent(company.id, "whistleblower", search.trim())
				.then((items) => !cancelled && setReports(items))
				.catch(() => {
					if (!cancelled) showToast("error", "Reports could not be loaded");
				})
				.finally(() => !cancelled && setLoading(false));
		}, 250);
		return () => {
			cancelled = true;
			window.clearTimeout(timer);
		};
	}, [company?.id, search]);

	const resetForm = () => {
		form.reset(EMPTY_VALUES);
		setFiles([]);
		formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
	};

	const handleSubmit = form.handleSubmit(async (values) => {
		if (!company?.id) return;
		setSubmitting(true);
		try {
			const attachments = await Promise.all(
				files.map(uploadCompanyAttachment),
			);
			const item = await createCompanyContent(company.id, {
				kind: "whistleblower",
				title: "Whistleblower report",
				body: values.message,
				recipient: values.email,
				attachments,
			});
			setReports((current) => [item, ...current]);
			resetForm();
			showToast("success", t(localizationConstants.myPagesEmpSuccess));
		} catch {
			showToast("error", "The report could not be submitted");
		} finally {
			setSubmitting(false);
		}
	});

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-4">
				<div className="relative w-full max-w-md">
					<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
					<Input
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder={t(localizationConstants.search)}
						className="h-10 rounded-lg border-slate-200 pl-9"
					/>
				</div>
				<Button
					type="button"
					onClick={resetForm}
					className="h-10 gap-2 rounded-lg bg-slate-900 px-4 text-white hover:bg-slate-800"
				>
					<Plus className="h-4 w-4" />
					<Translate text={localizationConstants.companyWbCreateNew} />
				</Button>
			</div>

			<Form {...form}>
				<form
					ref={formRef}
					onSubmit={handleSubmit}
					className="grid gap-5 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<Translate text={localizationConstants.companyWbAddresses} /> *
								</FormLabel>
								<FormControl>
									<Input {...field} disabled={submitting} type="email" />
								</FormControl>
								<FormMessage translate={t} />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="message"
						render={({ field }) => (
							<FormItem>
								<FormLabel>
									<Translate text={localizationConstants.myPagesEmpMessageLabel} /> *
								</FormLabel>
								<FormControl>
									<Textarea {...field} disabled={submitting} rows={5} />
								</FormControl>
								<FormMessage translate={t} />
							</FormItem>
						)}
					/>
					<div className="space-y-2">
						<label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50">
							<FileText className="h-4 w-4" />
							<Translate text={localizationConstants.companyWbUpload} />
							<input
								type="file"
								multiple
								className="hidden"
								disabled={submitting}
								onChange={(event) =>
									setFiles(Array.from(event.target.files ?? []))
								}
							/>
						</label>
						{files.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{files.map((file) => (
									<span
										key={file.name + file.size}
										className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs"
									>
										{file.name}
										<button
											type="button"
											onClick={() =>
												setFiles((current) =>
													current.filter((item) => item !== file),
												)
											}
											aria-label={"Remove " + file.name}
										>
											<X className="h-3 w-3" />
										</button>
									</span>
								))}
							</div>
						)}
					</div>
					<p className="text-sm text-orange-600">
						<Translate text={localizationConstants.companyWbWarning} />
					</p>
					<div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
						<Button type="button" variant="outline" disabled={submitting} onClick={resetForm}>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button type="submit" disabled={submitting} className="gap-2 bg-slate-900 text-white hover:bg-slate-800">
							<Send className="h-4 w-4" />
							{submitting ? "Submitting…" : <Translate text={localizationConstants.offerFormSubmit} />}
						</Button>
					</div>
				</form>
			</Form>

			<section className="space-y-3">
				<h2 className="text-base font-semibold text-slate-900">Submitted reports</h2>
				{loading && <div className="h-24 animate-pulse rounded-xl bg-slate-100" />}
				{!loading && reports.length === 0 && (
					<div className="rounded-xl border border-dashed border-slate-200 p-10 text-center text-slate-500">
						No reports found.
					</div>
				)}
				{reports.map((report) => (
					<article key={report.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
						<div className="flex items-center justify-between gap-3">
							<p className="font-medium text-slate-900">{report.title}</p>
							<time className="text-xs text-slate-500">
								{new Date(report.created_at).toLocaleString()}
							</time>
						</div>
						<p className="mt-2 line-clamp-2 text-sm text-slate-600">{report.body}</p>
					</article>
				))}
			</section>
		</div>
	);
};

export default WhistleblowerTab;
