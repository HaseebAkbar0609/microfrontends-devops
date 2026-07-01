"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Pencil, Save, Trash2, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Form, FormInput, FormFileUpload, FormCheckbox } from "@/components/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { createUserProfileSchema, UserProfileFormValues } from "../schemas/userProfile.schema";
import {
	DEFAULT_USER_PERMISSIONS,
	USER_PERMISSION_OPTIONS,
	USER_PROFILE_TAB_TRIGGER_CLASS,
	USER_PROFILE_TABS_LIST_CLASS,
} from "../constants";

import type { User } from "../types/types";
import { getUserProfileActions, maskPersonalNumber } from "../utils/userFormatters";

type Props = {
	mode: "create" | "edit";
	user: User | null;
	readOnly: boolean;
	isOwnProfile: boolean;
	onCancel: () => void;
	onSaved: () => void;
};

export function UserProfileForm({
	mode,
	user,
	readOnly,
	isOwnProfile,
	onCancel,
	onSaved,
}: Props) {
	const { t } = useTranslation();
	const isEdit = mode === "edit";
	const [isSaved, setIsSaved] = useState(false);
	const [activeTab, setActiveTab] = useState("profile");
	const [isEditingProfile, setIsEditingProfile] = useState(!isEdit);
	const userProfileSchema = useMemo(
		() =>
			createUserProfileSchema({
				firstNameRequired: t(localizationConstants.validationUserFirstNameRequired),
				lastNameRequired: t(localizationConstants.validationUserLastNameRequired),
				mobileNumberRequired: t(localizationConstants.validationUserMobileNumberRequired),
				mobileNumberInvalid: t(localizationConstants.validationUserMobileNumberInvalid),
				privateEmailInvalid: t(localizationConstants.validationUserPrivateEmailInvalid),
				addressRequired: t(localizationConstants.validationUserAddressRequired),
				cityRequired: t(localizationConstants.validationUserCityRequired),
				postalCodeRequired: t(localizationConstants.validationUserPostalCodeRequired),
				personalNumberFormat: t(localizationConstants.validationUserPersonalNumberFormat),
			}),
		[t],
	);

	const form = useForm<UserProfileFormValues>({
		resolver: zodResolver(userProfileSchema),
		defaultValues: {
			first_name: user?.first_name ?? "",
			last_name: user?.last_name ?? "",
			mobile_number: user?.mobile_number ?? "",
			private_email: user?.private_email ?? "",
			address: user?.address ?? "",
			city: user?.city ?? "",
			postal_code: user?.postal_code ?? "",
			personal_number: user?.personal_number ?? "",
			profile_photo: null,
			permissions: user?.permissions ?? DEFAULT_USER_PERMISSIONS,
		},
	});

	const onSubmit = async (values: UserProfileFormValues) => {
		const _payload = {
			...values,
			personal_number: isEdit && user ? user.personal_number : values.personal_number,
		};

		// API integration pending backend endpoint; save is mocked intentionally.
		setIsSaved(true);
		onSaved();
	};

	const personalNumberValue = form.watch("personal_number");
	const shouldMaskPersonalNumber = isEdit || isSaved;
	const compactFieldClassName = "gap-1.5";
	const compactInputProps = {
		labelClassName: "text-sm font-medium leading-none",
		inputClassName: "h-10 text-sm",
		messageClassName: "text-xs",
	} as const;
	const primaryButtonClassName =
		"bg-[#18181B] text-white hover:bg-[#18181B]/90 h-10 gap-2 rounded-md px-4 transition-colors";
	const outlineButtonClassName =
		"h-10 rounded-md border border-slate-200 bg-white px-4 text-slate-900 hover:bg-slate-50";
	const deleteButtonClassName =
		"h-10 gap-2 rounded-md bg-red-600 px-4 text-white hover:bg-red-700";
	const isEditOverview = isEdit && !isEditingProfile;
	const { canDeleteUser } = getUserProfileActions({ mode, isOwnProfile, readOnly });
	const profileSummaryFields = [
		{
			label: t(localizationConstants.userFormFirstNameLabel),
			value: user?.first_name ?? "",
		},
		{
			label: t(localizationConstants.userFormLastNameLabel),
			value: user?.last_name ?? "",
		},
		{
			label: t(localizationConstants.userFormMobileNumberLabel),
			value: user?.mobile_number ?? "",
		},
		{
			label: t(localizationConstants.userFormPrivateEmailLabel),
			value: user?.private_email ?? "",
		},
		{
			label: t(localizationConstants.userFormAddressLabel),
			value: user?.address ?? "",
		},
		{
			label: t(localizationConstants.userFormPersonalNumberLabel),
			value: user?.personal_number ? maskPersonalNumber(user.personal_number) : "",
		},
		{
			label: t(localizationConstants.userFormCityLabel),
			value: user?.city ?? "",
		},
		{
			label: t(localizationConstants.userFormPostalCodeLabel),
			value: user?.postal_code ?? "",
		},
	];

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<Tabs value={activeTab} onValueChange={setActiveTab} className="gap-0">
					<div className="px-5">
						<TabsList
							variant="line"
							className={USER_PROFILE_TABS_LIST_CLASS}
						>
							<TabsTrigger value="profile" className={USER_PROFILE_TAB_TRIGGER_CLASS}>
								{t(localizationConstants.userFormProfileTab)}
							</TabsTrigger>
							<TabsTrigger value="permissions" className={USER_PROFILE_TAB_TRIGGER_CLASS}>
								{t(localizationConstants.userFormPermissionsTab)}
							</TabsTrigger>
						</TabsList>
					</div>

					<TabsContent value="profile" className="mt-2 px-5">
						<div className="max-w-5xl rounded-md border border-slate-200 bg-white">
							<div className="flex items-center gap-2 border-b border-slate-200 px-4 py-2 text-sm font-medium text-slate-900">
								<UserRound className="h-4 w-4 text-slate-600" />
								<span className="flex-1">
									{t(
										isEditOverview
											? localizationConstants.userFormPermissionsTab
											: localizationConstants.userFormUserDetailsTitle,
									)}
								</span>
								{isEditOverview && !readOnly && (
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-8 gap-2 px-3 text-xs"
										onClick={() => setIsEditingProfile(true)}
									>
										<Pencil className="h-3.5 w-3.5" />
										{t(localizationConstants.edit)}
									</Button>
								)}
							</div>

							{isEditOverview ? (
								<div className="grid grid-cols-1 gap-x-12 gap-y-2 px-4 py-3 text-xs md:grid-cols-2">
									{profileSummaryFields.map((field) => (
										<div key={field.label} className="min-w-0">
											<div className="font-semibold text-slate-900">{field.label}</div>
											<div className="mt-1 truncate text-slate-500">{field.value}</div>
										</div>
									))}
								</div>
							) : (
								<div className="grid grid-cols-1 gap-x-3 gap-y-1.5 px-4 py-2 md:grid-cols-2">
									<FormInput control={form.control} name="first_name" label={t(localizationConstants.userFormFirstNameLabel)} placeholder={t(localizationConstants.userFormFirstNamePlaceholder)} disabled={readOnly} className={compactFieldClassName} {...compactInputProps} />
									<FormInput control={form.control} name="last_name" label={t(localizationConstants.userFormLastNameLabel)} placeholder={t(localizationConstants.userFormLastNamePlaceholder)} disabled={readOnly} className={compactFieldClassName} {...compactInputProps} />
									<FormInput control={form.control} name="mobile_number" label={t(localizationConstants.userFormMobileNumberLabel)} placeholder={t(localizationConstants.userFormMobileNumberPlaceholder)} disabled={readOnly} className={compactFieldClassName} {...compactInputProps} />
									<FormInput control={form.control} name="private_email" label={t(localizationConstants.userFormPrivateEmailLabel)} placeholder={t(localizationConstants.userFormPrivateEmailPlaceholder)} type="email" disabled={readOnly} className={compactFieldClassName} {...compactInputProps} />
									<FormInput control={form.control} name="address" label={t(localizationConstants.userFormAddressLabel)} placeholder={t(localizationConstants.userFormAddressPlaceholder)} disabled={readOnly} className={`md:col-span-2 ${compactFieldClassName}`} {...compactInputProps} />
									<FormInput control={form.control} name="city" label={t(localizationConstants.userFormCityLabel)} placeholder={t(localizationConstants.userFormCityPlaceholder)} disabled={readOnly} className={compactFieldClassName} {...compactInputProps} />
									<FormInput control={form.control} name="postal_code" label={t(localizationConstants.userFormPostalCodeLabel)} placeholder={t(localizationConstants.userFormPostalCodePlaceholder)} disabled={readOnly} className={compactFieldClassName} {...compactInputProps} />

									<FormInput
										control={form.control}
										name="personal_number"
										label={t(localizationConstants.userFormPersonalNumberLabel)}
										placeholder={t(localizationConstants.userFormPersonalNumberPlaceholder)}
										disabled={readOnly || shouldMaskPersonalNumber}
										className={compactFieldClassName}
										{...compactInputProps}
										inputProps={{
											value: shouldMaskPersonalNumber ? maskPersonalNumber(personalNumberValue) : personalNumberValue,
											onChange: shouldMaskPersonalNumber ? undefined : form.register("personal_number").onChange,
										}}
									/>

									{!readOnly && (
										<FormFileUpload
											control={form.control}
											name="profile_photo"
											label={t(localizationConstants.userFormUploadPhotoLabel)}
											buttonLabel={t(localizationConstants.upload)}
											placeholder={t(localizationConstants.noFileChosen)}
											allowedTypes={["image/png", "image/jpeg"]}
											showPreview
											className={`md:col-span-2 ${compactFieldClassName}`}
											labelClassName={compactInputProps.labelClassName}
											inputWrapperClassName="max-w-5xl"
											inputClassName="h-10 rounded-md px-4 py-2 text-sm"
											buttonClassName="h-10 px-4"
											messageClassName="text-xs"
										/>
									)}
								</div>
							)}
						</div>

						{isEditOverview && !readOnly && (
							<button
								type="button"
								className="mt-10 flex items-center gap-2 px-8 text-sm font-medium text-slate-900"
								onClick={() => setIsEditingProfile(true)}
							>
								<UserRound className="h-4 w-4 text-slate-600" />
								{t(localizationConstants.userFormUploadPhotoLabel)} +
							</button>
						)}
					</TabsContent>

					<TabsContent value="permissions" className="mt-2 px-5">
						<div className="grid max-w-4xl grid-cols-1 gap-4 rounded-md border border-slate-200 bg-white p-5 md:grid-cols-2">
							{USER_PERMISSION_OPTIONS.map((permission) => (
								<FormCheckbox
									key={permission.key}
									control={form.control}
									name={`permissions.${permission.key}`}
									label={<Translate text={permission.label} />}
									disabled={readOnly}
									variant="secondary"
								/>
							))}
						</div>
					</TabsContent>
				</Tabs>

				<div className="mt-3 flex items-center justify-between border-t border-slate-200 bg-white px-5 py-3">
					<div />

					<div className="flex items-center gap-3">
						{!isEditOverview && (
							<Button
								type="button"
								variant="outline"
								className={outlineButtonClassName}
								onClick={onCancel}
							>
								{t(localizationConstants.userFormCancelButton)}
							</Button>
						)}

						{canDeleteUser && (
							<Button
								type="button"
								variant="destructive"
								className={deleteButtonClassName}
								onClick={() => {
									// API integration pending backend endpoint; delete is mocked intentionally.
									onSaved();
								}}
							>
								<Trash2 className="h-4 w-4" />
								{t(localizationConstants.userFormDeleteButton)}
							</Button>
						)}

						{!readOnly && (
							<Button type="submit" className={primaryButtonClassName}>
								<Save className="h-4 w-4" />
								{t(localizationConstants.userFormSaveButton)}
							</Button>
						)}

						{!readOnly && !isEditOverview && activeTab === "profile" && (
							<Button
								type="button"
								className={primaryButtonClassName}
								onClick={() => setActiveTab("permissions")}
							>
								{t(localizationConstants.userFormNextButton)}
								<ArrowRight className="h-4 w-4" />
							</Button>
						)}
					</div>
				</div>
			</form>
		</Form>
	);
}
