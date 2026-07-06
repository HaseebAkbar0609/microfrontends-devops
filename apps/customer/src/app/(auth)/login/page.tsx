import { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/features/auth/login/LoginForm";

export const metadata: Metadata = {
	title: "Timeflow",
	description:
		"Get a complete overview of your campaigns, stats, and performance metrics.",
};

export default function LoginPage() {
	return (
		<Suspense>
			<LoginForm />
		</Suspense>
	);
}
