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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/form/PhoneInput";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { CONTACT_ROLE_VALUES } from "../../constants/orderOpened.constants";
import type { ContactPerson } from "../../types/orderOpened.types";

export interface EditContactPersonModalProps {
	isOpen: boolean;
	onClose: () => void;
	contactPerson: ContactPerson;
	onSave: (updated: Partial<ContactPerson>) => void;
}

export function EditContactPersonModal({
	isOpen,
	onClose,
	contactPerson,
	onSave,
}: EditContactPersonModalProps) {
	const t = useTranslate();
	const form = useForm<ContactPerson>({
		defaultValues: contactPerson,
	});

	useEffect(() => {
		if (isOpen) {
			form.reset(contactPerson);
		}
	}, [isOpen, contactPerson, form]);

	const onSubmit = (values: ContactPerson) => {
		onSave(values);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent showCloseButton={false} className="w-full sm:max-w-[619px] min-h-[362px] bg-white border border-zinc-200 p-4 gap-4 rounded-lg shadow-lg">
				<DialogHeader className="flex flex-row items-center justify-between pb-0">
					<DialogTitle className="font-sans text-2xl font-semibold leading-[100%] tracking-[-0.6px] text-slate-900">
						{t(localizationConstants.editContactModalTitle)}
					</DialogTitle>
					<DialogDescription className="sr-only">
						{t(localizationConstants.editContactModalTitle)}
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
								name="firstName"
								rules={{
									required: t(localizationConstants.firstNameRequired),
								}}
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 justify-start">
										<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
											{t(localizationConstants.firstNameLabel)}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder={t(localizationConstants.firstNamePlaceholder)}
												className="h-10 bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900"
											/>
										</FormControl>
										<FormMessage className="text-xs text-red-500 font-normal" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="lastName"
								rules={{
									required: t(localizationConstants.lastNameRequired),
								}}
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 justify-start">
										<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
											{t(localizationConstants.lastNameLabel)}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder={t(localizationConstants.lastNamePlaceholder)}
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
								name="email"
								rules={{
									required: t(localizationConstants.emailRequired),
									validate: (val) => {
										if (!val || !val.trim()) return t(localizationConstants.emailRequired);
										const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
										return emailRegex.test(val.trim()) || t(localizationConstants.invalidEmailError);
									},
								}}
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 justify-start">
										<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
											{t(localizationConstants.mailLabel)}
										</FormLabel>
										<FormControl>
											<Input
												{...field}
												value={field.value || ""}
												placeholder={t(localizationConstants.mailPlaceholder)}
												type="email"
												className="h-10 bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900"
											/>
										</FormControl>
										<FormMessage className="text-xs text-red-500 font-normal" />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="mobile"
								rules={{
									required: t(localizationConstants.mobileRequired),
								}}
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 justify-start">
										<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
											{t(localizationConstants.mobileLabel)}
										</FormLabel>
										<FormControl>
											<PhoneInput
												value={field.value || ""}
												onChange={field.onChange}
												placeholder={t(localizationConstants.mobilePlaceholder)}
												className="h-10 border-zinc-200 focus-within:border-slate-900"
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
								name="role"
								render={({ field }) => (
									<FormItem className="flex flex-col gap-1.5 justify-start">
										<FormLabel className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
											{t(localizationConstants.roleLabel)}
										</FormLabel>
										<Select
											value={field.value || CONTACT_ROLE_VALUES.CLIENT}
											onValueChange={field.onChange}
										>
											<FormControl>
												<SelectTrigger className="h-10 w-full bg-white border-zinc-200 text-slate-900 text-sm focus:border-slate-900 [&_svg]:text-black [&_svg]:opacity-100">
													<SelectValue placeholder={t(localizationConstants.selectRolePlaceholder)} />
												</SelectTrigger>
											</FormControl>
											<SelectContent className="bg-white border-zinc-200 text-slate-900">
												<SelectItem value={CONTACT_ROLE_VALUES.CLIENT}>{t(localizationConstants.roleBestallare)}</SelectItem>
												<SelectItem value={CONTACT_ROLE_VALUES.PROJECT_MANAGER}>{t(localizationConstants.roleProjektledare)}</SelectItem>
												<SelectItem value={CONTACT_ROLE_VALUES.SUPERVISOR}>{t(localizationConstants.roleSupervisor)}</SelectItem>
											</SelectContent>
										</Select>
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
								className="w-[120px] h-10 min-w-[80px] px-3 py-2 rounded-md border-zinc-200 text-slate-700 bg-transparent hover:bg-transparent cursor-pointer font-medium text-sm shadow-none"
							>
								{t(localizationConstants.buttonClose)}
							</Button>
							<Button
								type="submit"
								className="w-[120px] h-10 min-w-[80px] px-3 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800 cursor-pointer font-medium text-sm flex items-center justify-center gap-2"
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
