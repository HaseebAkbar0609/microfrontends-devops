"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getProfileSettings } from "@/features/my-pages/profile-settings/api/profileSettings.api";

export default function MyPagesLayout({ children }: { children: React.ReactNode }) {
	const queryClient = useQueryClient();

	useEffect(() => {
		document.body.classList.add("mypages-layout");
		return () => {
			document.body.classList.remove("mypages-layout");
		};
	}, []);

	useEffect(() => {
		queryClient.prefetchQuery({
			queryKey: ["profile-settings"],
			queryFn: getProfileSettings,
		});
	}, [queryClient]);

	return (
		<div className="flex h-full overflow-hidden">
			<div className="flex-1 overflow-auto bg-white">{children}</div>
		</div>
	);
}
