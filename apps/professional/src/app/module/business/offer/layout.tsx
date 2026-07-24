"use client";

import { useEffect } from "react";

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

	return <>{children}</>;
}
