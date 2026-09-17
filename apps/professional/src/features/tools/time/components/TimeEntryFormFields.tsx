"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useTimeReferences } from "../services/timeService";
import { MyPagesQueryState } from "@/features/my-pages/shared/feedback";
import { TimeRowValues } from "../schemas/time.schema";
import { diffMinutes, formatDuration } from "../utils/time";

const TimeEntryFormFields = ({
	form,
}: {
	form: UseFormReturn<TimeRowValues>;
}) => {
	const t = useTranslate();
	const references = useTimeReferences();
	const type = form.watch("type");
	const refNr = form.watch("refNr");
	const selectedProject = references.data?.find((project) => (type === "order" ? project.order : project.code) === refNr);
	const ORDER_OPTIONS = [...new Set(references.data?.map((project) => project.order).filter(Boolean) ?? [])];
	const PROJECT_OPTIONS = references.data?.map((project) => project.code) ?? [];
	const ATA_OPTIONS = selectedProject?.ata ?? [];
	const ata = form.watch("ata");
	const start = form.watch("start");
	const end = form.watch("end");
	const total =
		start && end ? formatDuration(diffMinutes(start, end)) : null;

	return (
		<div className="flex flex-col gap-4">
			<MyPagesQueryState query={references} />
			<div className="flex flex-wrap items-end gap-4">
				<div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-3">
					<FormField
						control={form.control}
						name="date"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-1.5">
								<FormLabel className="text-sm font-medium text-slate-900">
									<Translate
										text={
											localizationConstants.diaryFieldDate
										}
									/>
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="date"
										className="h-10 border-slate-200 text-sm"
									/>
								</FormControl>
								<FormMessage translate={t} />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="start"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-1.5">
								<FormLabel className="text-sm font-medium text-slate-900">
									<Translate
										text={
											localizationConstants.protocolFieldStartTime
										}
									/>
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="time"
										className="h-10 border-slate-200 text-sm"
									/>
								</FormControl>
								<FormMessage translate={t} />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="end"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-1.5">
								<FormLabel className="text-sm font-medium text-slate-900">
									<Translate
										text={
											localizationConstants.protocolFieldEndTime
										}
									/>
								</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="time"
										className="h-10 border-slate-200 text-sm"
									/>
								</FormControl>
								<FormMessage translate={t} />
							</FormItem>
						)}
					/>
				</div>
				{total && (
					<p className="pb-2.5 text-sm text-slate-700">
						<Translate text={localizationConstants.timeTotal} />
						{": "}
						<span className="font-semibold">{total}</span>
					</p>
				)}
			</div>

			<div className="flex flex-col gap-1.5">
				<span className="text-sm font-medium text-slate-900">
					<Translate text={localizationConstants.protocolColType} />
				</span>
				<Controller
					control={form.control}
					name="type"
					render={({ field }) => (
						<RadioGroup
							value={field.value}
							onValueChange={(value) => { field.onChange(value); form.setValue("refNr", ""); form.setValue("ata", false); form.setValue("ataNr", ""); }}
							className="grid grid-cols-1 gap-4 sm:grid-cols-3 [--primary:var(--color-primary-black)]"
						>
							<div className="flex flex-col gap-2">
								<label className="flex items-center gap-2 text-sm text-slate-800">
									<RadioGroupItem
										value="order"
										className="border-black"
									/>
									<Translate
										text={
											localizationConstants.timeTypeOrder
										}
									/>
								</label>
								<FormField
									control={form.control}
									name="refNr"
									render={({ field: refField }) => (
										<FormItem className="flex flex-col gap-1.5">
											<Select
												value={
													field.value === "order"
														? refField.value
														: ""
												}
												onValueChange={
													refField.onChange
												}
												disabled={
													field.value !== "order"
												}
											>
												<FormControl>
													<SelectTrigger className="h-10 w-full border-slate-200 text-sm disabled:bg-slate-100">
														<SelectValue
															placeholder={t(
																localizationConstants.timeTypeOrder,
															)}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{ORDER_OPTIONS.map(
														(option) => (
															<SelectItem
																key={option}
																value={option}
															>
																{option}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
											{field.value === "order" && (
												<FormMessage translate={t} />
											)}
										</FormItem>
									)}
								/>
							</div>
							<div className="flex flex-col gap-2">
								<label className="flex items-center gap-2 text-sm text-slate-800">
									<RadioGroupItem
										value="project"
										className="border-black"
									/>
									<Translate
										text={
											localizationConstants.timeTypeProject
										}
									/>
								</label>
								<FormField
									control={form.control}
									name="refNr"
									render={({ field: refField }) => (
										<FormItem className="flex flex-col gap-1.5">
											<Select
												value={
													field.value === "project"
														? refField.value
														: ""
												}
												onValueChange={
													refField.onChange
												}
												disabled={
													field.value !== "project"
												}
											>
												<FormControl>
													<SelectTrigger className="h-10 w-full border-slate-200 text-sm disabled:bg-slate-100">
														<SelectValue
															placeholder={t(
																localizationConstants.timeTypeProject,
															)}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{PROJECT_OPTIONS.map(
														(option) => (
															<SelectItem
																key={option}
																value={option}
															>
																{option}
															</SelectItem>
														),
													)}
												</SelectContent>
											</Select>
											{field.value === "project" && (
												<FormMessage translate={t} />
											)}
										</FormItem>
									)}
								/>
							</div>
							<label className="flex items-start gap-2 pt-1 text-sm text-slate-800">
								<RadioGroupItem
									value="overhead"
									className="border-black"
								/>
								<Translate
									text={
										localizationConstants.timeTypeOverhead
									}
								/>
							</label>
						</RadioGroup>
					)}
				/>
			</div>

			<div className="flex max-w-xs flex-col gap-2">
				<Controller
					control={form.control}
					name="ata"
					render={({ field }) => (
						<label className="flex items-center gap-2 text-sm font-medium text-slate-900">
							<Checkbox
								checked={field.value}
                disabled={type === "overhead"}
								onCheckedChange={field.onChange}
							/>
							<Translate
								text={localizationConstants.timeTypeAta}
							/>
						</label>
					)}
				/>
				{ata && (
					<FormField
						control={form.control}
						name="ataNr"
						render={({ field }) => (
							<FormItem className="flex flex-col gap-1.5">
								<Select
									value={field.value}
									onValueChange={field.onChange}
								>
									<FormControl>
										<SelectTrigger className="h-10 w-full border-slate-200 text-sm">
											<SelectValue
												placeholder={t(
													localizationConstants.timeAtaNrPlaceholder,
												)}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{ATA_OPTIONS.map((option) => (
											<SelectItem
												key={option}
												value={option}
											>
												{option}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage translate={t} />
							</FormItem>
						)}
					/>
				)}
			</div>

			<div className="flex flex-wrap items-center gap-6">
				<div className="flex flex-col gap-1.5">
					<span className="text-sm font-medium text-slate-900">
						<Translate
							text={localizationConstants.timeFieldTravel}
						/>
					</span>
					<div className="flex h-10 w-64 items-center rounded-md border border-slate-200">
						<Controller
							control={form.control}
							name="travelUnit"
							render={({ field }) => (
								<Select
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger className="h-full w-24 rounded-none border-0 border-r border-slate-200 text-sm shadow-none focus:ring-0">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="time">
											<Translate
												text={
													localizationConstants.timeUnitTime
												}
											/>
										</SelectItem>
										<SelectItem value="km">
											<Translate
												text={
													localizationConstants.timeUnitKm
												}
											/>
										</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
						<FormField
							control={form.control}
							name="travelValue"
							render={({ field }) => (
								<FormControl>
									<Input
                    aria-label={t(localizationConstants.timeFieldTravel)}
                    type="number" min="0" max="100000" step="any"
										{...field}
										className="h-full flex-1 rounded-none border-0 text-sm shadow-none focus-visible:ring-0"
									/>
								</FormControl>
							)}
						/>
					</div>
          {form.formState.errors.travelValue && <p role="alert" className="text-sm text-red-600"><Translate text={localizationConstants.myPagesInvalid} /></p>}
				</div>
				<Controller
					control={form.control}
					name="allowance"
					render={({ field }) => (
						<label className="flex items-center gap-2 pt-5 text-sm text-slate-800">
							<Checkbox
								checked={field.value}
								onCheckedChange={field.onChange}
							/>
							<Translate
								text={localizationConstants.timeFieldAllowance}
							/>
						</label>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name="title"
				render={({ field }) => (
					<FormItem className="flex flex-col gap-1.5">
						<FormLabel className="text-sm font-medium text-slate-900">
							<Translate
								text={localizationConstants.timeFieldTitle}
							/>
						</FormLabel>
						<FormControl>
							<Input
								{...field}
								placeholder={t(
									localizationConstants.timeFieldTitlePlaceholder,
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
								text={localizationConstants.itSupportDescLabel}
							/>
						</FormLabel>
						<FormControl>
							<Textarea
								{...field}
								rows={3}
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
		</div>
	);
};

export default TimeEntryFormFields;
