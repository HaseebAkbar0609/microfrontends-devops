"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, CircleUserRound, MonitorCog, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormInput, FormSelect } from "@/components/form";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useCreateAdminUser } from "../hooks/useAdminUsers";

const LANGUAGE_OPTIONS = [
	{ value: "sv", label: "Svenska" },
	{ value: "en", label: "English" },
];

const AUTO_LOGOUT_OPTIONS = [
	{ value: "30m", label: "30 minuter" },
	{ value: "1h", label: "1 timme" },
	{ value: "2h", label: "2 timmar" },
	{ value: "4h", label: "4 timmar" },
	{ value: "8h", label: "8 timmar" },
];

function ToggleField({
	label,
	checked,
	onToggle,
}: {
	label: string;
	checked: boolean;
	onToggle: () => void;
}) {
	const t = useTranslate();
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-sm font-medium text-slate-900">
				<Translate text={label} />
			</span>
			<span className="flex h-10 items-center gap-2">
				<button
					type="button"
					role="switch"
					aria-checked={checked}
					aria-label={t(label)}
					onClick={onToggle}
					className={cn(
						"relative h-6 w-11 cursor-pointer rounded-full transition-colors",
						checked ? "bg-green-500" : "bg-slate-200",
					)}
				>
					<span
						className={cn(
							"absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
							checked ? "left-[22px]" : "left-0.5",
						)}
					/>
				</button>
				<span className="text-sm text-slate-700">
					<Translate
						text={
							checked
								? localizationConstants.adminCreateYes
								: localizationConstants.adminCreateNo
						}
					/>
				</span>
			</span>
		</div>
	);
}

export default function CreateUser() {
	const t = useTranslate();
	const router = useRouter();

	const [active, setActive] = useState(true);
	const [generateEmail, setGenerateEmail] = useState(false);
	const [smsAuth, setSmsAuth] = useState(false);

	const { mutate: createUserMutation, isPending: isSaving } = useCreateAdminUser();

	const schema = z
		.object({
			username: z.string().min(1, {
				message: t(localizationConstants.adminCreateValidationRequired),
			}),
			name: z.string().min(1, {
				message: t(localizationConstants.adminCreateValidationRequired),
			}),
			personalNumber: z.string(),
			email: z
				.string()
				.min(1, {
					message: t(
						localizationConstants.adminCreateValidationRequired,
					),
				})
				.email({
					message: t(
						localizationConstants.validationRegisterEmailInvalid,
					),
				}),
			personRegister: z.string(),
			password: z.string().min(8, {
				message: t(
					localizationConstants.validationRegisterPasswordRequired,
				),
			}),
			confirmPassword: z.string().min(1, {
				message: t(localizationConstants.adminCreateValidationRequired),
			}),
			mobile: z.string(),
			language: z.string(),
			autoLogout: z.string(),
		})
		.refine((values) => values.password === values.confirmPassword, {
			message: t(
				localizationConstants.validationRegisterPasswordMismatch,
			),
			path: ["confirmPassword"],
		});

	type FormValues = z.infer<typeof schema>;

	const form = useForm<FormValues>({
		resolver: zodResolver(schema),
		defaultValues: {
			username: "",
			name: "",
			personalNumber: "",
			email: "",
			personRegister: "",
			password: "",
			confirmPassword: "",
			mobile: "",
			language: "sv",
			autoLogout: "2h",
		},
	});

	const onSubmit = (values: FormValues) => {
		const payload = {
			email: values.email,
			password: values.password,
			first_name: values.name.split(" ")[0] || values.name,
			last_name: values.name.split(" ").slice(1).join(" ") || " ",
			role: "manage",
			status: active ? "ACTIVE" : "INACTIVE",
			department: "None",
			position_id: null,
			permission_role_id: null,
			phone_number: values.mobile || null,
			personal_id: values.personalNumber || null,
			language: values.language,
			group_ids: [],
		};

		createUserMutation(payload, {
			onSuccess: () => {
				showToast("success", t(localizationConstants.adminCreateSuccess));
				router.push("/admin/user");
			},
			onError: (err: unknown) => {
				const error = err as { response?: { data?: { message?: string } } };
				const msg = error?.response?.data?.message || "Failed to create user";
				showToast("error", msg);
			}
		});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-1 flex-col relative"
			>
				<div className="flex flex-col gap-6 px-6 py-6 pb-10">
					{/* Header */}
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={() => router.push("/admin/user")}
							aria-label={t(
								localizationConstants.adminUsersTitle,
							)}
							className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-slate-700 transition-colors hover:bg-slate-100"
						>
							<ArrowLeft className="h-5 w-5" />
						</button>
						<h1 className="text-2xl font-semibold text-slate-900">
							<Translate
								text={localizationConstants.adminUsersAddUser}
							/>
						</h1>
					</div>

					{/* User details card */}
					<div className="rounded-md border border-slate-200 bg-white">
						<div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
							<CircleUserRound className="h-5 w-5 text-slate-700" />
							<span className="text-sm font-semibold text-slate-900">
								<Translate
									text={
										localizationConstants.adminCreateUserDetails
									}
								/>
							</span>
						</div>
						<div className="grid grid-cols-1 gap-x-8 gap-y-5 px-4 py-5 md:grid-cols-2">
							{/* Left column */}
							<div className="flex flex-col gap-5">
								<FormInput
									control={form.control}
									name="username"
									label={
										localizationConstants.adminCreateUsername
									}
									inputClassName="h-10 border-slate-200"
								/>
								<FormInput
									control={form.control}
									name="name"
									label={
										localizationConstants.adminCreateName
									}
									inputClassName="h-10 border-slate-200"
								/>
								<ToggleField
									label={
										localizationConstants.adminCreateActive
									}
									checked={active}
									onToggle={() => setActive((prev) => !prev)}
								/>
								<FormInput
									control={form.control}
									name="personalNumber"
									label={
										localizationConstants.adminCreatePersonalNumber
									}
									inputClassName="h-10 border-slate-200"
								/>
								<FormInput
									control={form.control}
									name="email"
									label={localizationConstants.email}
									inputClassName="h-10 border-slate-200"
								/>
								<FormInput
									control={form.control}
									name="personRegister"
									label={
										localizationConstants.adminCreatePersonRegister
									}
									placeholder={t(
										localizationConstants.adminCreatePersonRegisterPlaceholder,
									)}
									inputClassName="h-10 border-slate-200"
								/>
							</div>

							{/* Right column */}
							<div className="flex flex-col gap-5">
								<FormInput
									control={form.control}
									name="password"
									type="password"
									label={
										localizationConstants.adminCreatePassword
									}
									inputClassName="h-10 border-slate-200"
								/>
								<FormInput
									control={form.control}
									name="confirmPassword"
									type="password"
									label={
										localizationConstants.adminCreateConfirmPassword
									}
									inputClassName="h-10 border-slate-200"
								/>
								<ToggleField
									label={
										localizationConstants.adminCreateGenerateEmail
									}
									checked={generateEmail}
									onToggle={() =>
										setGenerateEmail((prev) => !prev)
									}
								/>
								<ToggleField
									label={
										localizationConstants.adminCreateSmsAuth
									}
									checked={smsAuth}
									onToggle={() => setSmsAuth((prev) => !prev)}
								/>
								<FormInput
									control={form.control}
									name="mobile"
									label={
										localizationConstants.adminCreateMobile
									}
									inputClassName="h-10 border-slate-200"
								/>
							</div>
						</div>
					</div>

					{/* System settings card */}
					<div className="rounded-md border border-slate-200 bg-white">
						<div className="flex items-center gap-2 border-b border-slate-200 px-4 py-4">
							<MonitorCog className="h-5 w-5 text-slate-700" />
							<span className="text-sm font-semibold text-slate-900">
								<Translate
									text={
										localizationConstants.adminCreateSystemSettings
									}
								/>
							</span>
						</div>
						<div className="grid grid-cols-1 gap-x-8 gap-y-5 px-4 py-5 md:grid-cols-2">
							<FormSelect
								control={form.control}
								name="language"
								label={
									localizationConstants.adminCreateLanguage
								}
								options={LANGUAGE_OPTIONS}
								triggerClassName="w-full h-10 border-slate-200"
							/>
							<FormSelect
								control={form.control}
								name="autoLogout"
								label={
									localizationConstants.adminCreateAutoLogout
								}
								options={AUTO_LOGOUT_OPTIONS}
								triggerClassName="w-full h-10 border-slate-200"
							/>
						</div>
					</div>
				</div>

				{/* Footer actions */}
				<div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4">
					<Button
						type="button"
						variant="secondary"
						onClick={() => router.push("/admin/user")}
						className="h-10 rounded-md bg-slate-100 px-6 text-sm font-medium text-slate-900 hover:bg-slate-200"
					>
						<Translate text={localizationConstants.cancel} />
					</Button>
					<Button
						type="submit"
						disabled={isSaving}
						className="h-10 gap-2 rounded-md bg-[#18181B] px-6 text-sm font-medium text-white hover:bg-[#18181B]/90"
					>
						<Save className="h-4 w-4" />
						<Translate text={localizationConstants.save} />
					</Button>
				</div>
			</form>
		</Form>
	);
}
