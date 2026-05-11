"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  forgotPasswordAPIAction,
  resetPasswordAction,
  validateOTPAction,
} from "@/api-actions";
import {
  ForgotPasswordForm,
  OtpScreen,
  ResetPasswordScreen,
} from "@/features/auth/components";
import type {
  ForgotPasswordFormValues,
  OtpFormValues,
  ResetPasswordFormValues,
} from "@/features/auth/types";
import { OTP_TYPE } from "@/constants/constant";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOtpVisible, setIsOtpVisible] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    const result = await forgotPasswordAPIAction({ email: data.email });
    if (result.success) {
      setEmail(data.email);
      setIsOtpVisible(true);
    }
    setIsSubmitting(false);
  };

  const onOtpSubmit = async (data: OtpFormValues) => {
    if (!email) return;

    setIsSubmitting(true);
    const result = await validateOTPAction({
      email,
      otp_code: data.otp,
      otp_type: OTP_TYPE.FORGOT_PASSWORD,
    });
    if (result.success) {
      setOtpCode(data.otp);
      setIsOtpVerified(true);
    }
    setIsSubmitting(false);
  };

  const onResetPasswordSubmit = async (data: ResetPasswordFormValues) => {
    if (!email || !otpCode) return;

    setIsSubmitting(true);
    const result = await resetPasswordAction({
      email,
      otp_code: otpCode,
      password: data.newPassword,
    });
    if (result.success) router.push("/login");
    setIsSubmitting(false);
  };

  return (
    <div className="w-full bg-background rounded-[10px] shadow-sm overflow-hidden flex flex-col md:flex-row flex-1">
      <div className="relative w-full md:w-1/2 flex items-center justify-center p-12 py-16 md:flex">
        <div className="relative w-full h-full min-h-[400px] overflow-hidden bg-white rounded-lg border border-border shadow-lg">
          <Image
            src="/forgot-password-banner.png"
            alt="TimeFlow Forgot Password"
            fill
            className="object-cover m-auto "
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
        {!isOtpVisible ? (
          <ForgotPasswordForm isSubmitting={isSubmitting} onSubmit={onSubmit} />
        ) : !isOtpVerified ? (
          <OtpScreen
            type="otp"
            isSubmitting={isSubmitting}
            onSubmit={onOtpSubmit}
          />
        ) : (
          <ResetPasswordScreen
            isSubmitting={isSubmitting}
            onSubmit={onResetPasswordSubmit}
          />
        )}
      </div>
    </div>
  );
}
