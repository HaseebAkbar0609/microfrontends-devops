"use client";

import React from "react";
import { RouteTabs } from "@/components/layout/RouteTabs";
import { dataItNavItems } from "@/features/data-it/constants/dataItNav.config";

export default function DataItLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col">
			{/* Level 2 Sub-Module Navigation Tabs (Line Tabs matching Image 1 Pattern) */}
			<div className="border-b border-slate-200 bg-white px-6">
				<RouteTabs items={dataItNavItems} />
			</div>
			<div className="flex flex-1 flex-col">{children}</div>
		</div>
	);
}
