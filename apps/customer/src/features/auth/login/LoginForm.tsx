"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { loginAPIAction } from "@/api-actions";
import { useAuthStatus } from "@/context/AuthContext";
import { validateOTPAction } from "@/api-actions/auth/forgot-password";
import { OTP_TYPE } from "@/constants/constant";
import { Form, FormInput } from "@/components/form";
import { OtpScreen } from "@/features/auth/components/OTPScreen";
import { OtpFormValues } from "@/features/auth/types/otp";
import { ModalWrapper } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MODAL_CONSTANTS, type ModalType } from "@/constants/constant";
import { BankIDModal } from "@/features/auth/components";
import { LOGIN_DEFAULT_VALUES } from "@/features/auth/constants";
import useModal from "@/features/auth/hooks/useModal";
import { loginSchema } from "@/features/auth/schemas";
import type { LoginFormValues } from "@/features/auth/types";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
export function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const rawNext = searchParams.get("next");
	const redirectTo = rawNext?.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/home";
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isOtpVisible, setIsOtpVisible] = useState(false);
	const [email, setEmail] = useState("");
	const { isOpen, openModal, closeModal, type } = useModal<ModalType>();
	const { setAccessToken, setUser } = useAuthStatus();

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: LOGIN_DEFAULT_VALUES,
	});

	const onSubmit = async (data: LoginFormValues) => {
		setIsSubmitting(true);
		const result = await loginAPIAction(
			{
				email: data.email,
				password: data.password,
			},
			{ setAccessToken, setUser },
		);
		if (result.success) {
			router.push(redirectTo);
		} else if (result.data?.is_verified === false) {
			setEmail(result.data.email || data.email);
			setIsOtpVisible(true);
		}
		setIsSubmitting(false);
	};

	const onOtpSubmit = async (data: OtpFormValues) => {
		if (!email) return;

		setIsSubmitting(true);
		const result = await validateOTPAction(
			{
				email,
				otp_code: data.otp,
				otp_type: OTP_TYPE.VERIFY_EMAIL,
			},
			{ setAccessToken, setUser },
		);
		if (result.success) {
			router.push(redirectTo);
		}
		setIsSubmitting(false);
	};

	return (
		<div className="w-full bg-background rounded-[10px] shadow-sm overflow-hidden flex flex-col md:flex-row flex-1">
			<div className="relative w-full md:w-1/2 flex items-center justify-center  p-12 py-16 md:flex">
				<div className="relative w-full h-full min-h-[400px] overflow-hidden bg-white rounded-lg border border-border shadow-lg">
					<Image
						src="/login-img.png"
						alt="TimeFlow Setup"
						fill
						className="object-cover m-auto max-h-[550px]"
					/>
				</div>
			</div>

			<div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
				{!isOtpVisible ? (
					<div className="w-full max-w-full 2xl:max-w-[600px] mx-auto">
						<h1 className="text-2xl font-bold text-gray-700 mb-2 tracking-tight">
							<Translate
								text={localizationConstants.loginWelcomeTitle}
							/>
						</h1>
						<p className="text-[13px] text-gray-500 mb-8 tracking-wide">
							<Translate
								text={
									localizationConstants.loginWelcomeSubtitle
								}
							/>
						</p>

						<Tabs defaultValue="losenord" className="w-full">
							<TabsList className="justify-start w-fit  rounded-none bg-transparent h-auto p-0 mb-8 space-x-6">
								<TabsTrigger
									value="losenord"
									className="rounded-none   border-b-4 !border-transparent   data-[state=active]:border-primary data-[state=active]:text-black data-[state=active]:!shadow-none !shadow-none data-[state=active]:bg-transparent px-1 py-2 font-semibold text-[15px] !text-black hover:text-black"
								>
									<Translate
										text={
											localizationConstants.loginTabPassword
										}
									/>
								</TabsTrigger>
								{/* <TabsTrigger
								value="bankid"
								className="rounded-none border-b-4 border-transparent data-[state=active]:border-primary data-[state=active]:text-black data-[state=active]:shadow-none data-[state=active]:bg-transparent px-1 py-2 font-semibold text-[15px] !text-black hover:text-black"
							>
								<Translate
									text={localizationConstants.loginTabBankId}
								/>
							</TabsTrigger> */}
							</TabsList>

							<TabsContent
								value="losenord"
								className="min-h-[340px] space-y-5 animate-in fade-in-50"
							>
								<Form {...form}>
									<form
										onSubmit={form.handleSubmit(onSubmit)}
										className="bg-white rounded-lg p-6"
									>
										<div className="space-y-5">
											<FormInput
												control={form.control}
												name="email"
												label={
													localizationConstants.loginEmailOrUsernameLabel
												}
												placeholder={
													localizationConstants.loginEmailPlaceholder
												}
												type="email"
												className="mb-0"
											/>

											<FormInput
												control={form.control}
												name="password"
												label={
													localizationConstants.loginPasswordLabel
												}
												placeholder={
													localizationConstants.loginPasswordPlaceholder
												}
												type="password"
											/>
										</div>

										<div className="flex justify-center pt-2 pb-1 my-3">
											<Link
												href="/forgot-password"
												className="text-[13px] text-primary hover:underline font-medium"
											>
												<Translate
													text={
														localizationConstants.loginForgotPasswordLink
													}
												/>
											</Link>
										</div>

										<Button
											type="submit"
											variant="primary"
											className="w-full"
											disabled={isSubmitting}
										>
											<LogIn />
											<span className="flex items-center justify-center gap-2">
												<Translate
													text={
														isSubmitting
															? localizationConstants.loginSigningIn
															: localizationConstants.loginButtonText
													}
												/>
											</span>
										</Button>
										<div className="flex justify-center pt-4">
											<Link
												href={rawNext ? `/register?next=${encodeURIComponent(redirectTo)}` : "/register"}
												className="text-[13px] text-primary hover:underline font-medium"
											>
												<Translate
													text={
														localizationConstants.loginCreateAccountQuestion
													}
												/>
											</Link>
										</div>
									</form>
								</Form>
							</TabsContent>

							<TabsContent
								value="bankid"
								className="min-h-[340px] space-y-6 pt-4 animate-in fade-in-50"
							>
								<div className="flex flex-col items-center">
									<Image
										src="/bankid.png"
										alt="BankID"
										width={120}
										height={80}
										className="object-contain"
									/>
									<p className="2xl:text-base text-sm text-gray-700 mt-4">
										<Translate
											text={
												localizationConstants.loginBankIdOr
											}
										/>
									</p>
									<Button
										type="button"
										className="w-full mt-4 max-w-fit"
										onClick={() =>
											openModal(
												MODAL_CONSTANTS.LOGIN_BANKID,
											)
										}
									>
										<span className="flex items-center justify-center gap-2">
											<LogIn
												className="h-4 w-4"
												aria-hidden
											/>
											<Translate
												text={
													localizationConstants.loginBankIdSameDevice
												}
											/>
										</span>
									</Button>
								</div>
							</TabsContent>
						</Tabs>
					</div>
				) : (
					<OtpScreen
						type="otp"
						isSubmitting={isSubmitting}
						onSubmit={onOtpSubmit}
					/>
				)}
			</div>

			<ModalWrapper
				open={isOpen && type === MODAL_CONSTANTS.LOGIN_BANKID}
				onOpenChange={(open) => !open && closeModal()}
				showCloseButton={false}
				contentClassName="!min-w-[600px] sm:!max-w-[600px]"
				title={
					<Translate text={localizationConstants.bankIdModalTitle} />
				}
				description={
					<ol className="mx-auto list-decimal list-inside space-y-2 text-left text-sm text-gray-700">
						<li>
							<Translate
								text={localizationConstants.bankIdModalStep1}
							/>
						</li>
						<li>
							<Translate
								text={localizationConstants.bankIdModalStep2}
							/>
						</li>
						<li>
							<Translate
								text={localizationConstants.bankIdModalStep3}
							/>
						</li>
					</ol>
				}
				footer={
					<Button
						type="button"
						variant="primary"
						className="gap-2 cursor-pointer"
						onClick={closeModal}
					>
						<LogIn className="h-4 w-4" aria-hidden />
						<Translate
							text={localizationConstants.bankIdModalClose}
						/>
					</Button>
				}
			>
				<BankIDModal />
			</ModalWrapper>
		</div>
	);
}
