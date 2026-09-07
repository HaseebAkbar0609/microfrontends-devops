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
		<div className="flex flex-1 flex-col overflow-hidden min-h-0">
			<ModuleHeader
				titleKey={ORDER_MODULE_TITLE}
				items={ORDER_MODULE_TABS}
			/>
			<div className="flex flex-1 flex-col overflow-y-auto min-h-0">{children}</div>
		</div>
	);
}
