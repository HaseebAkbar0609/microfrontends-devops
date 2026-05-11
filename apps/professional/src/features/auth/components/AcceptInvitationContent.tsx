"use client";

import { useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowRight } from "lucide-react";

import { acceptInvitationAPIAction } from "@/api-actions/companies/invitation";
import { setPasswordAPIAction } from "@/api-actions/auth/set-password";
import { Form, FormInput } from "@/components/form";
import { Button } from "@/components/ui/button";
import localizationConstants, { TranslationKeys } from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { Company, useAuthStatus, User } from "@/context/AuthContext";
import { authStorage } from "@/lib/authStorage";
import {
	extractRequiresSubscriptionFlag,
	setRequiresSubscriptionCookie,
} from "@/lib/requiresSubscriptionCookie";

const invitationSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(8, "Password must be at least 8 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type InvitationFormValues = z.infer<typeof invitationSchema>;

interface AuthResponse {
	data?: AuthResponse;
	accessToken?: string;
	access_token?: string;
	token?: string;
	refreshToken?: string;
	refresh_token?: string;
	user_profile?: Partial<User>;
	user?: Partial<User>;
	email?: string;
	first_name?: string;
	last_name?: string;
	last_visited_company?: Company;
}

export function AcceptInvitationContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const token = searchParams.get("token");
	const { setAccessToken, setUser, setCompany } = useAuthStatus();

	const [isLoadingToken, setIsLoadingToken] = useState(true);
	const [tokenError, setTokenError] = useState<string | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<InvitationFormValues>({
		resolver: zodResolver(invitationSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	useEffect(() => {
		async function verifyToken() {
			if (!token) {
				setTokenError(
					localizationConstants.acceptInvitationErrorNoToken,
				);
				setIsLoadingToken(false);
				return;
			}

			setIsLoadingToken(true);
			const result = await acceptInvitationAPIAction({ token });

			if (result.success && result.data?.data) {
				// Assume email is in data.data.email
				const email = result.data.data?.email || "";
				form.setValue("email", email);
			} else {
				setTokenError(
					result.error ||
						localizationConstants.acceptInvitationErrorInvalidToken,
				);
			}
			setIsLoadingToken(false);
		}

		verifyToken();
	}, [token, form]);

	const onSubmit = async (data: InvitationFormValues) => {
		if (!token) return;

		setIsSubmitting(true);
		const result = await setPasswordAPIAction({
			token,
			password: data.password,
		});
		setIsSubmitting(false);

		if (result.success) {
			const resData = result.data as AuthResponse;
			const responseData = resData?.data || resData || {};
			const accessToken =
				responseData.accessToken ||
				responseData.access_token ||
				responseData.token;
			const refreshToken =
				responseData.refreshToken || responseData.refresh_token;

			const user =
				responseData.user_profile ?? responseData.user ?? responseData;
			const userData = {
				...user,
				email: responseData.email,
				first_name: responseData.first_name,
				last_name: responseData.last_name,
			};
			const company = responseData.last_visited_company;

			if (accessToken) authStorage.setAuthData(accessToken);
			if (refreshToken) authStorage.setRefreshToken(refreshToken);
			if (userData) authStorage.setUserData(userData);
			if (company) authStorage.setCompanyData(company);

			const requiresSubscription = extractRequiresSubscriptionFlag(
				result.data,
			);
			setRequiresSubscriptionCookie(requiresSubscription);

			flushSync(() => {
				setUser(authStorage.getUserData() as User);
				setAccessToken(authStorage.getAccessToken());
				setCompany(authStorage.getCompanyData() as Company);
			});

			router.replace(
				requiresSubscription ? "/manage-plans" : "/dashboard",
			);
			router.refresh();
		}
	};

	if (isLoadingToken) {
		return (
			<div className="flex flex-1 items-center justify-center p-8">
				<Loader2 className="w-8 h-8 animate-spin text-primary" />
			</div>
		);
	}

	if (tokenError) {
		return (
			<div className="flex flex-1 items-center justify-center p-8">
				<div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-md text-center">
					<p className="text-gray-700">
						{tokenError ===
							localizationConstants.acceptInvitationErrorNoToken ||
						tokenError ===
							localizationConstants.acceptInvitationErrorInvalidToken ? (
							<Translate text={tokenError as TranslationKeys} />
						) : (
							tokenError
						)}
					</p>
					<Button
						variant="primary"
						className="mt-6 w-full"
						onClick={() => router.push("/register")}
					>
						<Translate
							text={
								localizationConstants.acceptInvitationGoToRegister
							}
						/>
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col flex-1 bg-background py-12 px-4 sm:px-6 lg:px-8">
			<div className="sm:mx-auto sm:w-full sm:max-w-md">
				<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
					<Translate
						text={localizationConstants.acceptInvitationTitle}
					/>
				</h2>
				<p className="mt-2 text-center text-sm text-gray-600">
					<Translate
						text={localizationConstants.acceptInvitationSubtitle}
					/>
				</p>
			</div>

			<div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="bg-white rounded-lg p-6 space-y-5 "
					>
						<FormInput
							control={form.control}
							name="email"
							label={
								localizationConstants.acceptInvitationEmailLabel
							}
							placeholder={
								localizationConstants.acceptInvitationEmailPlaceholder
							}
							disabled={true}
							inputClassName="h-10"
						/>

						<FormInput
							control={form.control}
							name="password"
							label={
								localizationConstants.acceptInvitationPasswordLabel
							}
							placeholder={
								localizationConstants.acceptInvitationPasswordPlaceholder
							}
							type="password"
							inputClassName="h-10"
						/>

						<FormInput
							control={form.control}
							name="confirmPassword"
							label={
								localizationConstants.acceptInvitationConfirmPasswordLabel
							}
							placeholder={
								localizationConstants.acceptInvitationConfirmPasswordPlaceholder
							}
							type="password"
							inputClassName="h-10"
						/>

						<Button
							type="submit"
							variant="primary"
							className="w-full mt-8"
							disabled={isSubmitting}
						>
							<span className="flex items-center justify-center gap-2">
								<span>
									<Translate
										text={
											localizationConstants.acceptInvitationActivateAccount
										}
									/>
								</span>
								<ArrowRight className="h-4 w-4" aria-hidden />
							</span>
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
