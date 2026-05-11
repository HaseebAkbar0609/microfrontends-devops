import RegisterForm from "@/features/auth/register/RegisterForm";
import { Metadata } from "next";

export const metadata: Metadata = {
	title: "Timeflow",
	description:
		"Get a complete overview of your campaigns, stats, and performance metrics.",
};

export default function RegisterPage() {
	return <RegisterForm />;
}
