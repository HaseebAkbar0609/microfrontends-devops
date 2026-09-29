"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { registerAPIAction, verifyEmailAction } from "@/api-actions";
import { OtpScreen, RegisterForm } from "@/features/auth/components";
import type { OtpFormValues, RegisterFormValues } from "@/features/auth/types";
import { authStorage } from "@/lib/authStorage";
import { coerceRequiresSubscription } from "@/lib/requiresSubscriptionCookie";
import { Company, useAuthStatus, User } from "@/context/AuthContext";

export default function RegisterPage() {
	const { setUser, setAccessToken, setCompany } = useAuthStatus();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isOtpVisible, setIsOtpVisible] = useState(false);
	const [registeredEmail, setRegisteredEmail] = useState("");

	const onRegisterSubmit = async (data: RegisterFormValues) => {
		setIsSubmitting(true);
		const result = await registerAPIAction({
			email: data.email,
			password: data.password,
			first_name: data.contactFirstName,
			last_name: data.contactLastName,
			phone_number: data.phone,
			postal_code: data.postalCode,
			country: data.country,
			city: data.city,
			company_name: data.companyName,
			organisation_number: data.organisationNumber,
			company_category: data.category,
		});
		setIsSubmitting(false);
		if (result.success) {
			setRegisteredEmail(data.email);
			setIsOtpVisible(true);
		}
	};

	const onOtpSubmit = async (data: OtpFormValues) => {
		if (!registeredEmail) return;

		setIsSubmitting(true);
		const verifyResult = await verifyEmailAction({
			email: registeredEmail,
			otp_code: data.otp,
		});

		if (!verifyResult.success) {
			setIsSubmitting(false);
			return;
		}

		setIsSubmitting(false);
		setUser(authStorage.getUserData() as User);
		setAccessToken(authStorage.getAccessToken());
		setCompany(authStorage.getCompanyData() as Company);

		const needsSubscription = coerceRequiresSubscription(
			verifyResult.data?.requires_subscription,
		);
		router.push(needsSubscription ? "/manage-plans" : "/home");
	};

	return (
		<div className="w-full bg-background rounded-[10px] shadow-sm overflow-auto h-[calc(100vh-72px)]">
			<div className="flex flex-col md:flex-row flex-1">
				<div className="w-full md:w-1/2 p-6 md:p-12 md:py-16 md:sticky md:top-0 self-start h-[280px] md:h-[calc(100vh-72px)]">
					<div className="relative w-full h-full md:min-h-[400px] overflow-hidden bg-white rounded-lg border border-border shadow-lg">
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
						<RegisterForm
							isSubmitting={isSubmitting}
							onSubmit={onRegisterSubmit}
						/>
					) : (
						<OtpScreen
							type="verify_email"
							isSubmitting={isSubmitting}
							onSubmit={onOtpSubmit}
						/>
					)}
				</div>
			</div>
		</div>
	);
}
