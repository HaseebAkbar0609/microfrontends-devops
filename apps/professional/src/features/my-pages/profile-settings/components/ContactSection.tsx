"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEffect, useRef } from "react";
import {
	BriefcaseBusiness,
	MapPin,
	Settings2,
	Contact,
	Save,
	UserPlus,
	Users,
} from "lucide-react";
import { contactSchema, ContactFormValues } from "../schemas/profile.schema";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import {
	Form,
	FormInput,
	FormCheckbox,
	FormSelect,
	FormFileUpload,
} from "@/components/form";
import { showToast } from "@/lib/toast";
import { CollapsibleSection } from "@/components/common/CollapsibleSection";
import {
	useProfileSettings,
	useUpdateProfileSettings,
} from "../hooks/useProfileSettings";

const DEFAULT_CONTACT_VALUES: ContactFormValues = {
	nextOfKin: [{ name: "", relation: "", phone: "", email: "" }],
	notifications: {
		email: false,
		sms: false,
		webPush: false,
	},
	firstName: "",
	lastName: "",
	email: ""
};

export default function ContactSection() {
	const inputClassName = "";
	const lastSavedRef = useRef<ContactFormValues | null>(null);

	const form = useForm<ContactFormValues>({
		resolver: zodResolver(contactSchema),
		defaultValues: DEFAULT_CONTACT_VALUES,
	});
	const {
		handleSubmit,
		control,
		watch,
	} = form;

	const profileSettingsQuery = useProfileSettings();
	const updateProfileSettings = useUpdateProfileSettings();

	const { fields, append } = useFieldArray({
		control,
		name: "nextOfKin",
	});

	const onSubmit = async (data: ContactFormValues) => {
		try {
			await updateProfileSettings.mutateAsync(data);
			lastSavedRef.current = data;
			showToast("success", localizationConstants.profileUpdated);
		} catch (_error) {
			showToast("error", localizationConstants.profileUpdateFailed);
		}
	};

	useEffect(() => {
		lastSavedRef.current = form.getValues();
	}, [form]);

	useEffect(() => {
		if (!profileSettingsQuery.data) {
			return;
		}

		const incoming = profileSettingsQuery.data as Partial<ContactFormValues>;
		const merged: ContactFormValues = {
			...DEFAULT_CONTACT_VALUES,
			...incoming,
			notifications: {
				...DEFAULT_CONTACT_VALUES.notifications,
				...incoming.notifications,
			},
			nextOfKin:
				incoming.nextOfKin && incoming.nextOfKin.length > 0
					? incoming.nextOfKin
					: DEFAULT_CONTACT_VALUES.nextOfKin,
		};

		form.reset(merged);
		lastSavedRef.current = merged;
	}, [form, profileSettingsQuery.data]);

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className=" min-h-[calc(100vh-180px)] flex flex-col gap-6"
			>
				<div className="flex max-w-5xl flex-col gap-6">
					<CollapsibleSection
						className="rounded-md border border-slate-200 bg-white py-4 "
						contentClassName="px-5"
						icon={<Contact size={24} className="text-slate-700" />}
						title={<Translate text={localizationConstants.contactDetails} />}
						defaultOpen
					>
						<div>
							<div className="grid grid-cols-3 gap-4">
								<FormInput
									control={control}
									name="firstName"
									label={localizationConstants.firstName}
									placeholder={localizationConstants.firstName}
									
									messageClassName="text-xs text-red-600 mt-1"
								/>
								<FormInput
									control={control}
									name="lastName"
									label={localizationConstants.lastName}
									placeholder={localizationConstants.lastName}
									
									messageClassName="text-xs text-red-600 mt-1"
								/>
								<FormInput
									control={control}
									name="personalId"
									label={localizationConstants.personalId}
									placeholder="YYMMDD-XXXX"
									
								/>
							</div>
						</div>
					</CollapsibleSection>

					<CollapsibleSection
						className="rounded-md border border-slate-200 bg-white py-4 "
						contentClassName="px-5"
						icon={<MapPin size={24} className="text-slate-700" />}
						title={<Translate text={localizationConstants.address} />}
						defaultOpen
					>
						<div>
							<div className="grid grid-cols-3 gap-4">
								<FormInput
									control={control}
									name="email"
									label={localizationConstants.email}
									placeholder={localizationConstants.email}
									
									messageClassName="text-xs text-red-600 mt-1"
								/>
								<FormInput
									control={control}
									name="phone"
									label={localizationConstants.phone}
									placeholder={localizationConstants.phone}
								
								/>
								<FormInput
									control={control}
									name="streetAddress"
									label={localizationConstants.streetAddress}
									placeholder={localizationConstants.streetAddress}
									
								/>
							</div>
							<div className="grid grid-cols-3 gap-4 mt-4">
								<FormInput
									control={control}
									name="postalCode"
									label={localizationConstants.postalCode}
									placeholder={localizationConstants.postalCode}
									
								/>
								<FormInput
									control={control}
									name="city"
									label={localizationConstants.city}
									placeholder={localizationConstants.city}
									
								/>
							</div>
						</div>
					</CollapsibleSection>

					<CollapsibleSection
						className="rounded-md border border-slate-200 bg-white py-4 "
						contentClassName="px-5"
						icon={<Users size={24} className="text-slate-700" />}
						title={<Translate text={localizationConstants.nextOfKin} />}
						defaultOpen
					>
						<div>
							{fields.map((field, idx) => (
								<div key={field.id} className="grid grid-cols-3 gap-4 mb-4">
									<FormInput
										control={control}
										name={`nextOfKin.${idx}.name` as const}
										label={localizationConstants.nextOfKinName}
										placeholder={localizationConstants.nextOfKinName}
										
									/>
									<FormSelect
										control={control}
										name={`nextOfKin.${idx}.relation` as const}
										label={<Translate text={localizationConstants.relation} />}
										placeholder={localizationConstants.relation}
										
										triggerClassName={`w-full ${inputClassName}`}
										options={[
											{
												value: "parent",
												label: <Translate text={localizationConstants.parent} />,
											},
											{
												value: "spouse",
												label: <Translate text={localizationConstants.spouse} />,
											},
											{
												value: "child",
												label: <Translate text={localizationConstants.child} />,
											},
											{
												value: "other",
												label: <Translate text={localizationConstants.other} />,
											},
										]}
									/>
									<FormInput
										control={control}
										name={`nextOfKin.${idx}.phone` as const}
										label={localizationConstants.nextOfKinPhone}
										placeholder={localizationConstants.nextOfKinPhone}
										
									/>
									<FormInput
										control={control}
										name={`nextOfKin.${idx}.email` as const}
										label={localizationConstants.nextOfKinEmail}
										placeholder={localizationConstants.nextOfKinEmail}
										
									/>
									<div className="flex items-end">
							<Button
								type="button"
								variant="outline"
								className="border-0 w-[184px] h-10 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)]"
								onClick={() => append({ name: "", relation: "", phone: "", email: "" })}
							>
								<UserPlus size={16} />
								<Translate text={localizationConstants.addRelatives} />
							</Button></div>
								</div>
							))}
						</div>
					</CollapsibleSection>

					<CollapsibleSection
						className="rounded-md border border-slate-200 bg-white py-4 "
						contentClassName="px-5"
						icon={<BriefcaseBusiness size={24} className="text-slate-700" />}
						title={<Translate text={localizationConstants.workDetails} />}
						defaultOpen
					>
						<div>
							<div className="grid grid-cols-3 gap-4">
								<FormInput
									control={control}
									name="employmentNumber"
									label={localizationConstants.employmentNumber}
									placeholder={localizationConstants.employmentNumber}
									inputProps={{ readOnly: true }}
								/>
								<FormInput
									control={control}
									name="position"
									label={localizationConstants.position}
									placeholder={localizationConstants.position}
									inputClassName={`!bg-[#f4f4f5] ${inputClassName}`}
									inputProps={{ readOnly: true }}
								/>
								<FormInput
									control={control}
									name="department"
									label={localizationConstants.department}
									placeholder={localizationConstants.department}
									inputClassName={`!bg-[#f4f4f5] ${inputClassName}`}
									inputProps={{ readOnly: true }}
								/>
							</div>
						</div>
					</CollapsibleSection>

					<CollapsibleSection
						className="rounded-md border border-slate-200 bg-white py-4 "
						contentClassName="space-y-6 px-5"
						icon={<Settings2 size={24} className="text-slate-700" />}
						title={<Translate text={localizationConstants.settings} />}
						defaultOpen
					>
						<div className="space-y-6">
							<FormFileUpload
								control={control}
								name="profilePicture"
								label={<Translate text={localizationConstants.profilePicture} />}
								accept="image/png, image/jpeg, image/jpg"
								allowedTypes={["image/png", "image/jpeg", "image/jpg"]}
								buttonLabel={<Translate text={localizationConstants.upload} />}
								placeholder={<Translate text={localizationConstants.noFileChosen} />}
								helperText={<Translate text={localizationConstants.fileTypesAllowed} />}
								invalidTypeMessage={
									<Translate text={localizationConstants.unsupportedFileType} />
								}
								buttonClassName="bg-slate-900 px-6 !text-white hover:bg-slate-900/90"
								
								showPreview
								
							/>

							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-800">
									<Translate text={localizationConstants.languagePreference} />
								</label>
								<Controller
									control={control}
									name="languagePreference"
									render={({ field }) => (
										<RadioGroup
											value={field.value}
											onValueChange={field.onChange}
											className="grid grid-cols-3 gap-6 [--primary:var(--color-primary-black)]"
										>
											<label className="flex items-center gap-2 text-sm text-slate-800">
												<RadioGroupItem value="svenska" className="border-black" />
												<Translate text={localizationConstants.swedish} />
											</label>
											<label className="flex items-center gap-2 text-sm text-slate-800">
												<RadioGroupItem value="engelska" className="border-black" />
												<Translate text={localizationConstants.english} />
											</label>
											<div>
												<label className="flex items-center gap-2 text-sm text-slate-800">
													<RadioGroupItem value="other" className="border-black" />
													<Translate text={localizationConstants.other} />
												</label>
												{watch("languagePreference") === "other" && (
													<div className="mt-3 max-w-xs">
														<FormSelect
															control={control}
															name="languageOther"
															placeholder={localizationConstants.languagePreference} 
															triggerClassName={`w-full ${inputClassName}`}
															options={[
																{
																	value: "french",
																	label: <Translate text={localizationConstants.french} />,
																},
																{
																	value: "german",
																	label: <Translate text={localizationConstants.german} />,
																},
																{
																	value: "spanish",
																	label: <Translate text={localizationConstants.spanish} />,
																},
															]}
														/>
													</div>
												)}
											</div>
										</RadioGroup>
									)}
								/>
							</div>

							<div>
								<label className="mb-2 block text-sm font-semibold text-slate-800">
									<Translate text={localizationConstants.notifications} />
								</label>
								<div className="grid grid-cols-3 gap-6">
									<FormCheckbox
										control={control}
										name="notifications.email"
										label={<Translate text={localizationConstants.email} />}
										className="space-y-0"
										labelClassName="text-sm text-slate-800"
										variant="secondary"
									/>
									<FormCheckbox
										control={control}
										name="notifications.sms"
										label={<Translate text={localizationConstants.sms} />}
										className="space-y-0"
										labelClassName="text-sm text-slate-800"
										variant="secondary"
									/>
									<FormCheckbox
										control={control}
										name="notifications.webPush"
										label={<Translate text={localizationConstants.webPush} />}
										className="space-y-0"
										labelClassName="text-sm text-slate-800"
										variant="secondary"
									/>
								</div>
							</div>
						</div>
					</CollapsibleSection>
				</div>
				<div className="sticky bottom-0 -mx-6 mt-4 border-t border-slate-200 bg-slate-50 px-6 py-4">
					<div className="flex justify-end gap-4">
						<Button
							variant="outline"
							type="button"
							className="border border-slate-200 w-[204px] bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)]"
							onClick={() => {
								const lastSaved = lastSavedRef.current;
								if (lastSaved) {
									form.reset(lastSaved);
								}
							}}
						>
							<Translate text={localizationConstants.cancel} />
						</Button>
						<Button
							type="submit"
							className="w-[204px] bg-[var(--color-primary-black)] text-white hover:bg-[var(--color-primary-black)]"
						>
							<Save size={16} />
							<Translate text={localizationConstants.save} />
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
