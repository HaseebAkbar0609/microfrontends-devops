"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LogIn } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { getCountriesAPIAction, registerAPIAction } from "@/api-actions";
import { useAuthStatus } from "@/context/AuthContext";
import { Form, FormCitySelect, FormInput, FormSelect } from "@/components/form";
import { OtpScreen } from "@/features/auth/components/OTPScreen";
import { OtpFormValues } from "@/features/auth/types/otp";
import { Button } from "@/components/ui/button";
import { REGISTER_DEFAULT_VALUES } from "@/features/auth/constants/register";
import { registerSchema } from "@/features/auth/schemas";
import type { RegisterFormValues } from "@/features/auth/types";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { verifyEmailAction } from "@/api-actions/auth/register";
import { Country } from "@/types/location";

export default function RegisterForm() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isOtpVisible, setIsOtpVisible] = useState(false);
	const [email, setEmail] = useState("");
	const [countries, setCountries] = useState<Country[]>([]);
	const { setAccessToken, setUser } = useAuthStatus();

	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: REGISTER_DEFAULT_VALUES,
	});

	const searchParams = useSearchParams();
	const prefillEmail = searchParams.get("email") || "";
	const prefillPhone = searchParams.get("phone") || "";

	const onSubmit = async (data: RegisterFormValues) => {
		setIsSubmitting(true);
		const result = await registerAPIAction(
			{
				email: data.email,
				password: data.password,
				first_name: data.first_name,
				last_name: data.last_name,
				phone_number: data.phone,
				postal_code: data.postalCode,
				country: data.country,
				city: data.city,
				address: data.address,
			},
			{ setAccessToken, setUser },
		);
		if (result.success) {
			setEmail(data.email);
			setIsOtpVisible(true);
		}
		setIsSubmitting(false);
	};

	const onOtpSubmit = async (data: OtpFormValues) => {
		if (!email) return;

		setIsSubmitting(true);
		const verifyResult = await verifyEmailAction(
			{
				email: email,
				otp_code: data.otp,
			},
			{ setAccessToken, setUser },
		);

		if (!verifyResult.success) {
			setIsSubmitting(false);
			return;
		}
		setIsSubmitting(false);
		router.push("/home");
	};

	useEffect(() => {
		if (prefillEmail) {
			form.setValue("email", decodeURIComponent(prefillEmail));
		}
		if (prefillPhone) {
			form.setValue("phone", decodeURIComponent(prefillPhone));
		}
	}, [prefillEmail, prefillPhone, form]);

	useEffect(() => {
		const fetchCountries = async () => {
			const result = await getCountriesAPIAction();
			if (result.success && result.data) {
				setCountries(result.data);
			}
		};
		fetchCountries();
	}, []);

	const selectedCountry = form.watch("country");

	return (
		<div className="w-full bg-background rounded-[10px] shadow-sm overflow-auto h-[calc(100vh-72px)]">
			<div className="flex flex-col md:flex-row flex-1">
				<div className="w-full md:w-1/2 p-12 py-16 sticky top-0 self-start h-[calc(100vh-72px)]">
					<div className="relative w-full h-full min-h-[400px] overflow-hidden bg-white rounded-lg border border-border shadow-lg">
						<Image
							src="/create-companies.png"
							alt="TimeFlow Business Account"
							fill
							className="object-cover m-auto"
						/>
					</div>
				</div>

				<div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center overflow-auto">
					{!isOtpVisible ? (
						<div className="w-full 2xl:max-w-[600px] max-w-full mx-auto">
							<h1 className="text-2xl font-bold text-gray-700 mb-2">
								<Translate
									text={
										localizationConstants.registerWelcomeTitle
									}
								/>
							</h1>
							<p className="text-[13px] text-gray-700 mb-8 ">
								<Translate
									text={
										localizationConstants.registerWelcomeSubtitle
									}
								/>
							</p>

							<Form {...form}>
								<form
									onSubmit={form.handleSubmit(onSubmit)}
									className="space-y-5 bg-white p-6 rounded-lg"
								>
									<FormInput
										control={form.control}
										name="first_name"
										label={localizationConstants.firstName}
										placeholder={
											localizationConstants.registerFirstNamePlaceholder
										}
										className="w-full items-start self-start mb-0"
									/>

									<FormInput
										control={form.control}
										name="last_name"
										label={localizationConstants.lastName}
										placeholder={
											localizationConstants.registerLastNamePlaceholder
										}
										className="w-full items-start self-start mb-0"
									/>

									<FormInput
										control={form.control}
										name="email"
										label={
											localizationConstants.registerEmailLabel
										}
										placeholder={
											localizationConstants.registerEmailPlaceholder
										}
										type="email"
										className="w-full items-start self-start mb-0"
									/>

									<FormInput
										control={form.control}
										name="phone"
										label={
											localizationConstants.registerPhoneLabel
										}
										placeholder={
											localizationConstants.registerPhonePlaceholder
										}
										className="w-full items-start self-start mb-0"
									/>

									<FormInput
										control={form.control}
										name="postalCode"
										label={
											localizationConstants.registerPostalCodeLabel
										}
										placeholder={
											localizationConstants.registerPostalCodePlaceholder
										}
										className="w-full items-start self-start mb-0"
									/>

									<FormInput
										control={form.control}
										name="address"
										label={
											localizationConstants.registerAddressLabel
										}
										placeholder={
											localizationConstants.registerAddressPlaceholder
										}
										className="w-full items-start self-start mb-0"
									/>

									<FormSelect
										control={form.control}
										name="country"
										label={
											<Translate
												text={
													localizationConstants.registerCountryLabel
												}
											/>
										}
										placeholder={
											localizationConstants.registerCountryPlaceholder
										}
										options={countries.map((c) => ({
											value: c.id,
											label: c.name,
										}))}
										className="w-full items-start self-start mb-0"
										triggerClassName="w-full  2xl:h-12 h-10"
									/>

									<FormCitySelect
										name="city"
										countryId={selectedCountry}
										label={
											<Translate
												text={
													localizationConstants.registerCityLabel
												}
											/>
										}
										placeholder={
											localizationConstants.registerCityPlaceholder
										}
										disabled={!selectedCountry}
										className="w-full items-start self-start mb-0"
										triggerClassName="w-full  2xl:h-12 h-10"
									/>

									<FormInput
										control={form.control}
										name="password"
										label={
											localizationConstants.registerPasswordLabel
										}
										placeholder={
											localizationConstants.registerPasswordPlaceholder
										}
										type="password"
										className="w-full items-start self-start mb-0"
									/>

									<FormInput
										control={form.control}
										name="confirmPassword"
										label={
											localizationConstants.registerConfirmPasswordLabel
										}
										placeholder={
											localizationConstants.registerConfirmPasswordPlaceholder
										}
										type="password"
										className="w-full items-start self-start mb-0"
									/>

									<div className="col-span-1 md:col-span-2 pt-2">
										<Button
											type="submit"
											variant="primary"
											className="w-full"
											disabled={isSubmitting}
										>
											<span className="flex items-center justify-center gap-2">
												<LogIn
													className="h-4 w-4"
													aria-hidden
												/>
												<Translate
													text={
														isSubmitting
															? localizationConstants.registerSubmitting
															: localizationConstants.registerCheckoutButton
													}
												/>
											</span>
										</Button>
									</div>

									<div className="col-span-1 md:col-span-2 flex flex-col items-center gap-2 pt-4">
										<Link
											href="/register"
											className="text-[13px] text-primary hover:underline font-medium"
										>
											<Translate
												text={
													localizationConstants.registerChangeRegistrationType
												}
											/>
										</Link>
										<Link
											href="/login"
											className="text-[13px] text-primary hover:underline font-medium"
										>
											<Translate
												text={
													localizationConstants.registerWantToLogin
												}
											/>
										</Link>
									</div>
								</form>
							</Form>
						</div>
					) : (
						<OtpScreen
							type="otp"
							isSubmitting={isSubmitting}
							onSubmit={onOtpSubmit}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
