import { AuthHeader } from "@/features/auth";
import type { ReactNode } from "react";

export default function AuthRoutesLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="min-h-screen flex flex-col">
			<AuthHeader />
			{children}
		</div>
	);
}
