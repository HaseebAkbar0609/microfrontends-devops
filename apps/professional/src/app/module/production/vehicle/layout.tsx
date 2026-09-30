"use client";

import React from "react";
import { ModuleHeader } from "@/components/layout/ModuleHeader";
import {
	VEHICLE_MODULE_TABS,
	VEHICLE_MODULE_TITLE,
} from "@/features/vehicle/data/vehicleNav.config";

export default function VehicleLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<ModuleHeader
				titleKey={VEHICLE_MODULE_TITLE}
				items={VEHICLE_MODULE_TABS}
				autoHideOnSubRoutes={false}
			/>
			<div className="flex flex-1 flex-col overflow-y-auto min-h-0 bg-blue-gray-50/50">
				{children}
			</div>
		</div>
	);
}
