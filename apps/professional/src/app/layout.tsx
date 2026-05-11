import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/utils";

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
	// Avoid Chrome warning: `<link rel=preload as=font>` unused when the face is
	// applied mainly via `--font-inter`; the font still loads via @font-face in CSS.
	preload: false,
});

export const metadata: Metadata = {
	title: "TimeFlow",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={cn(inter.variable, inter.className)}
		>
			<body>
				<Providers>
					<AppShell>{children}</AppShell>
				</Providers>
				<Toaster />
			</body>
		</html>
	);
}
