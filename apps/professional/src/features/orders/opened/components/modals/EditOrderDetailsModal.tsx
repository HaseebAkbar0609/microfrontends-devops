"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Save, X } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
	DialogClose,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { DEFAULT_ORDER_NR_PLACEHOLDER } from "../../constants/orderOpened.constants";
import type { OrderDetails } from "../../types/orderOpened.types";

export interface EditOrderDetailsModalProps {
	isOpen: boolean;
	onClose: () => void;
	orderDetails: OrderDetails;
	onSave: (updated: Partial<OrderDetails>) => void;
}

export function EditOrderDetailsModal({
	isOpen,
	onClose,
	orderDetails,
	onSave,
}: EditOrderDetailsModalProps) {
	const t = useTranslate();
	const form = useForm<OrderDetails>({
		defaultValues: orderDetails,
	});

	useEffect(() => {
		if (isOpen) {
			form.reset(orderDetails);
		}
	}, [isOpen, orderDetails, form]);

	const onSubmit = (values: OrderDetails) => {
		onSave(values);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent showCloseButton={false} className="w-full sm:max-w-[619px] min-h-[362px] bg-white border border-zinc-200 p-4 gap-4 rounded-lg shadow-lg">
				<DialogHeader className="flex flex-row items-center justify-between pb-0">
					<DialogTitle className="font-sans text-2xl font-semibold leading-[100%] tracking-[-0.6px] text-slate-900">
						{t(localizationConstants.editOrderModalTitle)}
					</DialogTitle>
					<DialogDescription className="sr-only">
						{t(localizationConstants.editOrderModalTitle)}
					</DialogDescription>
					<DialogClose asChild>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="h-8 w-8 rounded-md text-slate-900 hover:bg-zinc-100 cursor-pointer"
						>
							<X className="h-5 w-5 text-slate-900" />
						</Button>
					</DialogClose>
				</DialogHeader>

				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
							<FormField
								control={form.control}
								name="serialNo"
								rules={{
									required: t(localizationConstants.orderNrRequired),
								}}
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 justify-start">
										<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
											{t(localizationConstants.orderNrLabel)}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder={t(localizationConstants.orderNrPlaceholder) || DEFAULT_ORDER_NR_PLACEHOLDER}
												className="h-10 bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900"
											/>
										</FormControl>
										<FormMessage className="text-xs text-red-500 font-normal" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="orderName"
								rules={{
									required: t(localizationConstants.orderNameRequired),
								}}
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 justify-start">
										<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
											{t(localizationConstants.orderNameLabel)}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder={t(localizationConstants.orderNamePlaceholder)}
												className="h-10 bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900"
											/>
										</FormControl>
										<FormMessage className="text-xs text-red-500 font-normal" />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
							<FormField
								control={form.control}
								name="quarterName"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 justify-start">
										<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
											{t(localizationConstants.quarterNameLabel)}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder={t(localizationConstants.quarterNamePlaceholder)}
												className="h-10 bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900"
											/>
										</FormControl>
										<FormMessage className="text-xs text-red-500 font-normal" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="orderAddress"
								rules={{
									required: t(localizationConstants.addressRequired),
								}}
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 justify-start">
										<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
											{t(localizationConstants.addressLabel)}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder={t(localizationConstants.addressPlaceholder)}
												className="h-10 bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900"
											/>
										</FormControl>
										<FormMessage className="text-xs text-red-500 font-normal" />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
							<FormField
								control={form.control}
								name="postCode"
								rules={{
									required: t(localizationConstants.postCodeRequired),
								}}
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 justify-start">
										<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
											{t(localizationConstants.postNrLabel)}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder={t(localizationConstants.postNrPlaceholder)}
												className="h-10 bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900"
											/>
										</FormControl>
										<FormMessage className="text-xs text-red-500 font-normal" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="city"
								rules={{
									required: t(localizationConstants.cityRequired),
								}}
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 justify-start">
										<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
											{t(localizationConstants.cityLabel)}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder={t(localizationConstants.ortPlaceholder)}
												className="h-10 bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900"
											/>
										</FormControl>
										<FormMessage className="text-xs text-red-500 font-normal" />
									</FormItem>
								)}
							/>
						</div>

						<DialogFooter className="flex gap-4 sm:justify-end pt-2">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="w-[120px] h-10 min-w-20 px-3 py-2 rounded-md border-zinc-200 text-slate-700 bg-transparent hover:bg-transparent cursor-pointer font-medium text-sm shadow-none"
							>
								{t(localizationConstants.buttonClose)}
							</Button>
							<Button
								type="submit"
								className="w-[120px] h-10 min-w-20 px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 cursor-pointer font-medium text-sm flex items-center justify-center gap-2"
							>
								<Save className="h-4 w-4" />
								<span>{t(localizationConstants.buttonSave)}</span>
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
