"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, CircleAlert, CreditCard } from "lucide-react";
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
import { MOCK_REFERENCE_DATE } from "@/features/widgetdashboard/utils/mockDates";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { PaymentCard } from "../constants/mockData";
import { PaymentCardDraft } from "../hooks/usePaymentCards";
import {
	PaymentCardFormValues,
	paymentCardSchema,
} from "../schemas/paymentCard";

const MONTHS = Array.from({ length: 12 }, (_, index) =>
	String(index + 1).padStart(2, "0"),
);

const BASE_YEAR = Number(MOCK_REFERENCE_DATE.slice(0, 4));
const YEARS = Array.from({ length: 10 }, (_, index) =>
	String(BASE_YEAR + index),
);

const EMPTY_VALUES: PaymentCardFormValues = {
	cardName: "",
	firstName: "",
	lastName: "",
	cardNumber: "",
	expiryMonth: "",
	expiryYear: "",
	cvc: "",
};

const formatCardNumber = (value: string) =>
	value
		.replace(/\D/g, "")
		.slice(0, 16)
		.replace(/(\d{4})(?=\d)/g, "$1 ");

const NewCardDialog = ({
	open,
	editingCard,
	onClose,
	onSave,
}: {
	open: boolean;
	editingCard: PaymentCard | null;
	onClose: () => void;
	onSave: (draft: PaymentCardDraft) => void;
}) => {
	const t = useTranslate();
	const [showSuccess, setShowSuccess] = useState(false);
	const form = useForm<PaymentCardFormValues>({
		resolver: zodResolver(paymentCardSchema),
		defaultValues: EMPTY_VALUES,
	});

	useEffect(() => {
		if (!open) return;
		setShowSuccess(false);
		form.reset(
			editingCard
				? {
						...EMPTY_VALUES,
						cardName: editingCard.cardName,
						firstName: editingCard.firstName,
						lastName: editingCard.lastName,
						expiryMonth: editingCard.expiryMonth,
						expiryYear: editingCard.expiryYear,
					}
				: EMPTY_VALUES,
		);
	}, [open, editingCard, form]);

	const handleConfirm = form.handleSubmit(() => setShowSuccess(true));

	const handleDone = () => {
		const values = form.getValues();
		onSave({
			cardName: values.cardName,
			firstName: values.firstName,
			lastName: values.lastName,
			cardNumber: values.cardNumber,
			expiryMonth: values.expiryMonth,
			expiryYear: values.expiryYear,
		});
		onClose();
	};

	const watched = form.watch();
	const previewNumber = watched.cardNumber
		? formatCardNumber(watched.cardNumber).padEnd(19, "0")
		: "0000  0000  0000  0000";
	const previewName =
		[watched.firstName, watched.lastName].filter(Boolean).join(" ") ||
		t(localizationConstants.subscriptionCardPreviewName);
	const previewExpiry =
		watched.expiryMonth && watched.expiryYear
			? `${watched.expiryMonth} / ${watched.expiryYear}`
			: "MM / YYYY";

	return (
		<Dialog open={open} onOpenChange={(value) => !value && onClose()}>
			<DialogContent
				className={
					showSuccess
						? "max-w-md rounded-lg bg-white p-8"
						: "max-h-[90vh] max-w-2xl overflow-y-auto rounded-lg bg-white p-8"
				}
			>
				{showSuccess ? (
					<div className="flex flex-col items-center gap-4 text-center">
						<span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
							<span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-green-500">
								<Check className="h-5 w-5 text-green-600" />
							</span>
						</span>
						<DialogTitle className="text-2xl font-bold text-slate-900">
							<Translate
								text={
									localizationConstants.subscriptionPaymentHeading
								}
							/>
						</DialogTitle>
						<p className="text-sm text-slate-600">
							<Translate
								text={
									localizationConstants.subscriptionSuccessText
								}
							/>
						</p>
						<Button
							type="button"
							onClick={handleDone}
							className="h-11 w-full rounded-md bg-slate-900 text-sm font-medium text-white hover:bg-slate-900/90"
						>
							<Translate
								text={
									localizationConstants.subscriptionOkAction
								}
							/>
						</Button>
					</div>
				) : (
					<Form {...form}>
						<form
							onSubmit={handleConfirm}
							className="flex flex-col gap-6"
						>
							<DialogTitle className="text-2xl font-bold text-slate-900">
								<Translate
									text={
										localizationConstants.subscriptionNewCardTitle
									}
								/>
							</DialogTitle>

							<div className="mx-auto w-full max-w-md rounded-xl bg-slate-100 px-8 py-7">
								<div className="flex items-start justify-between">
									<span className="flex items-center gap-2 text-xl font-semibold text-slate-900">
										<span className="inline-block h-6 w-9 rounded-[2px] bg-red-600 [clip-path:polygon(25%_0,75%_0,100%_50%,75%_100%,25%_100%,0_50%)]" />
										{watched.cardName || "HSBC"}
									</span>
									<CreditCard
										className="h-9 w-9 text-slate-400"
										aria-hidden
									/>
								</div>
								<p className="mt-6 font-mono text-2xl tracking-widest text-slate-700">
									{previewNumber}
								</p>
								<div className="mt-4 flex items-end justify-between">
									<div className="text-sm text-slate-700">
										<p className="font-medium">
											{previewName}
										</p>
										<p>{previewExpiry}</p>
									</div>
									<span className="flex rounded-lg bg-white px-2 py-1.5">
										<span className="h-5 w-5 rounded-full bg-red-500" />
										<span className="-ml-2 h-5 w-5 rounded-full bg-amber-400/90" />
									</span>
								</div>
							</div>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
								<FormField
									control={form.control}
									name="cardName"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1.5">
											<FormLabel className="text-sm font-medium text-slate-900">
												<Translate
													text={
														localizationConstants.subscriptionCardNameLabel
													}
												/>
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder={t(
														localizationConstants.subscriptionCardNamePlaceholder,
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
									name="firstName"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1.5">
											<FormLabel className="text-sm font-medium text-slate-900">
												<Translate
													text={
														localizationConstants.subscriptionFirstNameLabel
													}
												/>
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder={t(
														localizationConstants.subscriptionFirstNamePlaceholder,
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
									name="lastName"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1.5">
											<FormLabel className="text-sm font-medium text-slate-900">
												<Translate
													text={
														localizationConstants.subscriptionLastNameLabel
													}
												/>
											</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder={t(
														localizationConstants.subscriptionLastNamePlaceholder,
													)}
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
								name="cardNumber"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5">
										<FormLabel className="text-sm font-medium text-slate-900">
											<Translate
												text={
													localizationConstants.subscriptionCardNumberLabel
												}
											/>
										</FormLabel>
										<FormControl>
											<div className="relative">
												<CreditCard className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
												<Input
													value={formatCardNumber(
														field.value,
													)}
													onChange={(event) =>
														field.onChange(
															event.target.value,
														)
													}
													onBlur={field.onBlur}
													name={field.name}
													ref={field.ref}
													placeholder="•••• •••• •••• ••••"
													inputMode="numeric"
													className="h-10 border-slate-200 pl-9 text-sm"
												/>
											</div>
										</FormControl>
										<FormMessage translate={t} />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
								<FormField
									control={form.control}
									name="expiryMonth"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1.5">
											<FormLabel className="text-sm font-medium text-slate-900">
												<Translate
													text={
														localizationConstants.subscriptionMonthLabel
													}
												/>
											</FormLabel>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<FormControl>
													<SelectTrigger className="h-10 w-full border-slate-200 text-sm">
														<SelectValue
															placeholder={t(
																localizationConstants.subscriptionSelectPlaceholder,
															)}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{MONTHS.map((month) => (
														<SelectItem
															key={month}
															value={month}
														>
															{month}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage translate={t} />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="expiryYear"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1.5">
											<FormLabel className="text-sm font-medium text-slate-900">
												<Translate
													text={
														localizationConstants.subscriptionYearLabel
													}
												/>
											</FormLabel>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<FormControl>
													<SelectTrigger className="h-10 w-full border-slate-200 text-sm">
														<SelectValue
															placeholder={t(
																localizationConstants.subscriptionSelectPlaceholder,
															)}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{YEARS.map((year) => (
														<SelectItem
															key={year}
															value={year}
														>
															{year}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage translate={t} />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="cvc"
									render={({ field }) => (
										<FormItem className="flex flex-col gap-1.5">
											<FormLabel className="text-sm font-medium text-slate-900">
												<Translate
													text={
														localizationConstants.subscriptionCvcLabel
													}
												/>
											</FormLabel>
											<FormControl>
												<div className="relative">
													<CircleAlert className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
													<Input
														{...field}
														placeholder="•••"
														inputMode="numeric"
														maxLength={4}
														className="h-10 border-slate-200 pl-9 text-sm"
													/>
												</div>
											</FormControl>
											<FormMessage translate={t} />
										</FormItem>
									)}
								/>
							</div>

							<div className="flex justify-end gap-3">
								<Button
									type="button"
									variant="outline"
									onClick={onClose}
									className="h-11 rounded-md border-slate-200 bg-white px-8 text-sm font-medium text-slate-900 hover:bg-slate-50"
								>
									<Translate
										text={localizationConstants.cancel}
									/>
								</Button>
								<Button
									type="submit"
									className="h-11 gap-2 rounded-md bg-slate-900 px-6 text-sm font-medium text-white hover:bg-slate-900/90"
								>
									<Check className="h-4 w-4" />
									<Translate
										text={
											localizationConstants.subscriptionConfirmAction
										}
									/>
								</Button>
							</div>
						</form>
					</Form>
				)}
			</DialogContent>
		</Dialog>
	);
};

export default NewCardDialog;
