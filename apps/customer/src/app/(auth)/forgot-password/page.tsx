import { Metadata } from "next";
import { ForgotPasswordWrapper } from "@/features/auth/forgot-password/ForgotPasswordWrapper";

export const metadata: Metadata = {
	title: "Timeflow",
	description:
		"Get a complete overview of your campaigns, stats, and performance metrics.",
};

export default function ForgotPasswordPage() {
	return <ForgotPasswordWrapper />;
}
