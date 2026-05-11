import { Metadata } from "next";
import { LoginForm } from "@/features/auth/login/LoginForm";

export const metadata: Metadata = {
	title: "Timeflow",
	description:
		"Get a complete overview of your campaigns, stats, and performance metrics.",
};

export default function LoginPage() {
	return <LoginForm />;
}
