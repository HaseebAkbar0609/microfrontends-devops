"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
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
import { PROTOCOL_CATEGORIES, ProtocolType } from "../constants/mockData";
import { MeetingValues, meetingSchema } from "../schemas/protocol.schema";
import ParticipantSelect from "./ParticipantSelect";

const EMPTY_VALUES: MeetingValues = {
	responsible: "",
	title: "",
	category: "",
	address: "",
	postalCode: "",
	city: "",
	participantIds: [],
	location: "",
	startDate: "",
	startTime: "",
	endDate: "",
	endTime: "",
	information: "",
};

const TYPE_SUBTITLE_KEY: Record<ProtocolType, string> = {
	standard: localizationConstants.protocolCreateStandard,
	action: localizationConstants.protocolCreateAction,
};

interface NewMeetingDialogProps {
	open: boolean;
	type: ProtocolType;
	onClose: () => void;
	onSend: (values: MeetingValues) => void;
}

const NewMeetingDialog = ({
	open,
	type,
	onClose,
	onSend,
}: NewMeetingDialogProps) => {
	const t = useTranslate();
	const form = useForm<MeetingValues>({
		resolver: zodResolver(meetingSchema),
		defaultValues: EMPTY_VALUES,
	});

	useEffect(() => {
		if (open) form.reset(EMPTY_VALUES);
	}, [open, form]);

	const handleSend = form.handleSubmit((values) => {
		onSend(values);
		onClose();
	});

	return (
		<Dialog open={open} onOpenChange={(value) => !value && onClose()}>
			<DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-lg bg-white p-7">
				<div>
					<DialogTitle className="text-xl font-bold text-slate-900">
						<Translate
							text={localizationConstants.protocolNewMeetingTitle}
						/>
					</DialogTitle>
					<p className="mt-1 text-sm text-slate-500">
						<Translate text={TYPE_SUBTITLE_KEY[type]} />
					</p>
				</div>

				<Form {...form}>
					<form onSubmit={handleSend} className="flex flex-col gap-4">
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="responsible"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.protocolFieldResponsible
												}
											/>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												className="h-10 border-slate-200 text-sm"
											/>
										</FormControl>
										<FormMessage translate={t} />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.protocolFieldTitle
												}
											/>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												className="h-10 border-slate-200 text-sm"
											/>
										</FormControl>
										<FormMessage translate={t} />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.protocolFieldCategory
												}
											/>
										</FormLabel>
										<Select
											value={field.value}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger className="h-10 w-full border-slate-200 text-sm">
													<SelectValue />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{PROTOCOL_CATEGORIES.map(
													(category) => (
														<SelectItem
															key={category}
															value={category}
														>
															{category}
														</SelectItem>
													),
												)}
											</SelectContent>
										</Select>
										<FormMessage translate={t} />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.protocolFieldAddress
												}
											/>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder={t(
													localizationConstants.protocolFieldAddress,
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
								name="postalCode"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.protocolFieldPostalCode
												}
											/>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												className="h-10 border-slate-200 text-sm"
											/>
										</FormControl>
										<FormMessage translate={t} />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="city"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.protocolFieldCity
												}
											/>
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												className="h-10 border-slate-200 text-sm"
											/>
										</FormControl>
										<FormMessage translate={t} />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="participantIds"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.protocolFieldAddParticipants
											}
										/>
									</FormLabel>
									<FormControl>
										<ParticipantSelect
											value={field.value}
											onChange={field.onChange}
										/>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.protocolFieldLocation
											}
										/>
									</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder={t(
												localizationConstants.protocolFieldLocation,
											)}
											className="h-10 border-slate-200 text-sm"
										/>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>

						<div className="flex flex-col gap-1.5">
							<span className="text-sm font-medium text-slate-900">
								<Translate
									text={
										localizationConstants.protocolFieldStartTime
									}
								/>
							</span>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="startDate"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1.5">
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
									name="startTime"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1.5">
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
						</div>

						<div className="flex flex-col gap-1.5">
							<span className="text-sm font-medium text-slate-900">
								<Translate
									text={
										localizationConstants.protocolFieldEndTime
									}
								/>
							</span>
							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="endDate"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1.5">
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
									name="endTime"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1.5">
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
						</div>

						<FormField
							control={form.control}
							name="information"
							render={({ field }) => (
								<FormItem className="flex flex-col gap-1.5">
									<FormLabel className="text-sm font-medium text-slate-900">
										<Translate
											text={
												localizationConstants.protocolFieldMeetingInfo
											}
										/>
									</FormLabel>
									<FormControl>
										<Textarea
											{...field}
											rows={4}
											className="border-slate-200 text-sm"
										/>
									</FormControl>
									<FormMessage translate={t} />
								</FormItem>
							)}
						/>

						<div className="flex justify-end gap-3 pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="h-10 rounded-md border-slate-200 bg-white px-5 text-sm font-medium text-slate-900 hover:bg-slate-50"
							>
								<Translate
									text={localizationConstants.protocolClose}
								/>
							</Button>
							<Button
								type="submit"
								className="h-10 gap-2 rounded-md bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-900/90"
							>
								<Send className="h-4 w-4" />
								<Translate
									text={localizationConstants.protocolSend}
								/>
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
};

export default NewMeetingDialog;
