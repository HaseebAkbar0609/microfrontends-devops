"use client";

import { ModuleHeader } from "@/components/layout/ModuleHeader";
import {
	ORDER_MODULE_TABS,
	ORDER_MODULE_TITLE,
} from "@/features/orders/data/orderNav.config";

export default function OrderLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<ModuleHeader
				titleKey={ORDER_MODULE_TITLE}
				items={ORDER_MODULE_TABS}
				autoHideOnSubRoutes={false}
			/>
			<div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
		</div>
	);
}
