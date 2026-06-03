"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { I18nextProvider } from "react-i18next";
import { ReactNode } from "react";
import i18n from "@/utils/localization";
import { AuthProvider } from "@/context/AuthContext";
import queryClient from "@/lib/queryClient";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<AuthProvider>
			<I18nextProvider i18n={i18n}>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</I18nextProvider>
		</AuthProvider>
	);
}
