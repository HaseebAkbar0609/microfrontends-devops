"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	ArrowUpDown,
	CalendarDays,
	CheckCheck,
	Clock3,
	XCircle,
} from "lucide-react";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { mockDate } from "@/features/widgetdashboard/utils/mockDates";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import {
	LEAVE_REQUESTS,
	LEAVE_SCHEDULE_EVENTS,
	LEAVE_STATUS_KEY,
	LeaveRequest,
	LeaveStatus,
} from "../constants/mockData";
import { LEAVE_STATUS_CLASS } from "../constants/statusStyles";
import { leaveRequestSchema, LeaveRequestValues } from "../schemas/absence";
import ScheduleCard from "./ScheduleCard";

const STATUS_ICON: Record<
	LeaveStatus,
	React.ComponentType<{ className?: string }>
> = {
	review: Clock3,
	approved: CheckCheck,
	rejected: XCircle,
};

const EMPTY_VALUES: LeaveRequestValues = {
	fromDate: "",
	toDate: "",
	message: "",
};

const LeaveTab = () => {
	const t = useTranslate();
	const [requests, setRequests] = useState<LeaveRequest[]>(LEAVE_REQUESTS);
	const form = useForm<LeaveRequestValues>({
		resolver: zodResolver(leaveRequestSchema),
		defaultValues: EMPTY_VALUES,
	});

	const handleSubmit = form.handleSubmit((values) => {
		setRequests((current) => [
			{
				id: `lr-${crypto.randomUUID()}`,
				listDate: mockDate(0).replace(/-/g, "/"),
				requestedPeriod: `${values.fromDate.replace(/-/g, "/")} - ${values.toDate.replace(/-/g, "/")}`,
				status: "review",
				comment: values.message.trim() || "-",
			},
			...current,
		]);
		form.reset(EMPTY_VALUES);
	});

	return (
		<div className="grid grid-cols-12 items-start gap-6">
			<div className="col-span-12 flex flex-col gap-6 xl:col-span-8">
				<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
					<div className="flex items-center gap-2.5 bg-slate-200/60 px-5 py-3.5">
						<h2 className="text-base font-semibold text-slate-800">
							<Translate
								text={
									localizationConstants.myPagesEmpLeaveListTitle
								}
							/>
						</h2>
						<span className="rounded-md bg-white px-2 py-0.5 text-xs font-semibold text-slate-700">
							{requests.length}
						</span>
					</div>
					<div className="overflow-x-auto">
						<Table className="w-full min-w-[40rem]">
							<TableHeader>
								<TableRow className="border-b border-slate-200 hover:bg-transparent">
									{[
										localizationConstants.myPagesEmpLeaveColList,
										localizationConstants.myPagesEmpLeaveColRequested,
										localizationConstants.myPagesEmpLeaveColStatus,
										localizationConstants.myPagesEmpLeaveColComment,
									].map((labelKey, index) => (
										<TableHead
											key={labelKey}
											className="px-5 py-3 text-sm font-medium text-slate-500"
										>
											<span className="flex items-center gap-1">
												<Translate text={labelKey} />
												{index < 3 && (
													<ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
												)}
											</span>
										</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{requests.map((request) => {
									const Icon = STATUS_ICON[request.status];
									return (
										<TableRow
											key={request.id}
											className="border-b border-slate-100 hover:bg-slate-50/60"
										>
											<TableCell className="px-5 py-3.5 text-sm text-slate-700">
												{request.listDate}
											</TableCell>
											<TableCell className="px-5 py-3.5 text-sm text-slate-700">
												{request.requestedPeriod}
											</TableCell>
											<TableCell className="px-5 py-3.5">
												<span
													className={cn(
														"inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-medium",
														LEAVE_STATUS_CLASS[request.status],
													)}
												>
													<Icon className="h-3.5 w-3.5" />
													<Translate
														text={
															LEAVE_STATUS_KEY[
																request.status
															]
														}
													/>
												</span>
											</TableCell>
											<TableCell className="px-5 py-3.5 text-sm text-slate-700">
												{request.comment}
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
				</div>

				<ScheduleCard events={LEAVE_SCHEDULE_EVENTS} />
			</div>

			<div className="col-span-12 xl:col-span-4">
				<div className="overflow-hidden rounded-md border border-slate-200 bg-white">
					<div className="bg-slate-200/60 px-5 py-3.5">
						<h2 className="text-base font-semibold text-slate-800">
							<Translate
								text={
									localizationConstants.myPagesEmpApplyLeaveTitle
								}
							/>
						</h2>
					</div>
					<Form {...form}>
						<form
							onSubmit={handleSubmit}
							className="flex flex-col gap-4 px-5 py-4"
						>
							<FormField
								control={form.control}
								name="fromDate"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.myPagesEmpFromDate
												}
											/>{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<div className="relative">
												<CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
												<Input
													{...field}
													type="date"
													placeholder={t(
														localizationConstants.myPagesEmpSelectDatePlaceholder,
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
								name="toDate"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.myPagesEmpToDate
												}
											/>{" "}
											<span className="text-red-500">
												*
											</span>
										</FormLabel>
										<FormControl>
											<div className="relative">
												<CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
												<Input
													{...field}
													type="date"
													placeholder={t(
														localizationConstants.myPagesEmpSelectDatePlaceholder,
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
									onClick={() => form.reset(EMPTY_VALUES)}
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
											localizationConstants.myPagesEmpApplyLeaveTitle
										}
									/>
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
};

export default LeaveTab;
