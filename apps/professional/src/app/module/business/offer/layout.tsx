"use client";

import { useEffect } from "react";
import DynamicSubSidebar from "@/components/layout/sidebar/DynamicSubSidebar";
import { offerSidebarItems } from "@/features/offer/constants";
import localizationConstants from "@/utils/translation/constants";

export default function OfferLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		document.body.classList.add("offer-layout");
		return () => {
			document.body.classList.remove("offer-layout");
		};
	}, []);

	return (
		<div className="flex h-full overflow-hidden">
			<DynamicSubSidebar
				titleKey={localizationConstants.offer}
				items={offerSidebarItems}
			/>
			<div className="flex-1 overflow-auto bg-white">{children}</div>
		</div>
	);
}
