"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, Check, ChevronUp } from "lucide-react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { sickRequestSchema, SickRequestValues } from "../schemas/absence";

const EMPTY_VALUES: SickRequestValues = {
	startDate: "",
	expectedBack: "",
	type: "vab",
	message: "",
};

const TYPE_LABEL: Record<SickRequestValues["type"], string> = {
	sick: localizationConstants.myPagesEmpTypeSick,
	vab: localizationConstants.myPagesEmpTypeVab,
};

const SickRequestPanel = () => {
	const t = useTranslate();
	const [collapsed, setCollapsed] = useState(false);
	const [submitted, setSubmitted] = useState<SickRequestValues | null>(null);

	const form = useForm<SickRequestValues>({
		resolver: zodResolver(sickRequestSchema),
		defaultValues: EMPTY_VALUES,
	});

	const handleSubmit = form.handleSubmit((values) => {
		setSubmitted(values);
	});

	const handleReset = () => {
		form.reset(EMPTY_VALUES);
		setSubmitted(null);
	};

	if (submitted) {
		return (
			<div className="rounded-md border border-slate-200 bg-white p-6">
				<div className="flex flex-col items-center gap-2 text-center">
					<span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
						<span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-500">
							<Check className="h-4 w-4 text-green-600" />
						</span>
					</span>
					<p className="text-base font-semibold text-slate-900">
						<Translate
							text={localizationConstants.myPagesEmpSuccess}
						/>
					</p>
				</div>
				<div className="mt-4 space-y-3 rounded-md bg-slate-50 p-4 text-sm">
					<div>
						<p className="font-semibold text-slate-900">
							<Translate
								text={localizationConstants.myPagesEmpSickDate}
							/>
						</p>
						<p className="text-slate-600">{submitted.startDate}</p>
					</div>
					{submitted.expectedBack && (
						<div>
							<p className="font-semibold text-slate-900">
								<Translate
									text={
										localizationConstants.myPagesEmpSickReturnLabel
									}
								/>
							</p>
							<p className="text-slate-600">
								{submitted.expectedBack}
							</p>
						</div>
					)}
					<div>
						<p className="font-semibold text-slate-900">
							<Translate
								text={
									localizationConstants.myPagesEmpSickTypeLabel
								}
							/>
						</p>
						<p className="text-slate-600">
							<Translate text={TYPE_LABEL[submitted.type]} />
						</p>
					</div>
					{submitted.message && (
						<div>
							<p className="font-semibold text-slate-900">
								<Translate
									text={
										localizationConstants.myPagesEmpMessageLabel
									}
								/>
							</p>
							<p className="text-slate-600">
								{submitted.message}
							</p>
						</div>
					)}
				</div>
				<Button
					type="button"
					onClick={handleReset}
					className="mt-5 h-11 w-full rounded-md bg-slate-900 text-sm font-medium text-white hover:bg-slate-900/90"
				>
					<Translate
						text={localizationConstants.subscriptionOkAction}
					/>
				</Button>
			</div>
		);
	}

	return (
		<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
			<button
				type="button"
				onClick={() => setCollapsed((value) => !value)}
				className="flex w-full cursor-pointer items-center justify-between bg-slate-200/60 px-5 py-3.5"
			>
				<span className="text-base font-semibold text-slate-800">
					<Translate
						text={localizationConstants.myPagesEmpSickPanelTitle}
					/>
				</span>
				<ChevronUp
					className={cn(
						"h-4 w-4 text-slate-600 transition-transform",
						collapsed && "rotate-180",
					)}
				/>
			</button>

			{!collapsed && (
				<Form {...form}>
					<form
						onSubmit={handleSubmit}
						className="flex flex-col gap-4 px-5 py-4"
					>
						<FormField
							control={form.control}
							name="startDate"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.myPagesEmpSickDate
											}
										/>
									</FormLabel>
									<FormControl>
										<div className="relative">
											<CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
											<Input
												{...field}
												type="date"
												placeholder={t(
													localizationConstants.myPagesEmpStartDatePlaceholder,
												)}
												className="h-10 border-slate-200 pl-9 text-sm"
											/>
										</div>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="expectedBack"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.myPagesEmpSickReturnLabel
											}
										/>
									</FormLabel>
									<FormControl>
										<div className="relative">
											<CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
											<Input
												{...field}
												type="date"
												className="h-10 border-slate-200 pl-9 text-sm"
											/>
										</div>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="type"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.myPagesEmpSickTypeLabel
											}
										/>
									</FormLabel>
									<FormControl>
										<RadioGroup
											value={field.value}
											onValueChange={field.onChange}
											className="gap-2"
										>
											<Label className="flex items-center gap-2 text-sm font-normal text-slate-700">
												<RadioGroupItem value="sick" />
												<Translate
													text={
														localizationConstants.myPagesEmpTypeSick
													}
												/>
											</Label>
											<Label className="flex items-center gap-2 text-sm font-normal text-slate-700">
												<RadioGroupItem value="vab" />
												<Translate
													text={
														localizationConstants.myPagesEmpTypeVab
													}
												/>
											</Label>
										</RadioGroup>
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
											placeholder={t(
												localizationConstants.myPagesEmpMessagePlaceholder,
											)}
											className="border-slate-200 text-sm"
										/>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>

						<div className="mt-1 flex items-center justify-between gap-3">
							<Button
								type="button"
								variant="secondary"
								onClick={handleReset}
								className="h-10 rounded-md bg-slate-100 px-5 text-sm font-medium text-slate-900 hover:bg-slate-200"
							>
								<Translate
									text={localizationConstants.cancel}
								/>
							</Button>
							<Button
								type="submit"
								className="h-10 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
							>
								<Translate
									text={
										localizationConstants.myPagesEmpSubmit
									}
								/>
							</Button>
						</div>
					</form>
				</Form>
			)}
		</div>
	);
};

export default SickRequestPanel;
