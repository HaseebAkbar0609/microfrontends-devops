"use client";

import { usePathname, useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DynamicSubSidebarItem } from "@/components/layout/sidebar/DynamicSubSidebar";
import { Translate } from "@/utils/translation/translate";
import { cn } from "@/lib/utils";

interface RouteTabsProps {
	items: DynamicSubSidebarItem[];
	className?: string;
}

export function isRouteTabActive(
	item: DynamicSubSidebarItem,
	pathname: string,
) {
	return item.exact
		? pathname === item.href
		: pathname === item.href || pathname.startsWith(`${item.href}/`);
}

export function RouteTabs({ items, className }: RouteTabsProps) {
	const pathname = usePathname();
	const router = useRouter();

	const activeItem = items.find((item) => isRouteTabActive(item, pathname));

	const handleValueChange = (value: string) => {
		const item = items.find((tab) => tab.id === value);
		if (item && item.href !== pathname) {
			router.push(item.href);
		}
	};

	return (
		<Tabs
			value={activeItem?.id ?? ""}
			onValueChange={handleValueChange}
			className="w-full"
		>
			<TabsList
				variant="line"
				className={cn(
					"h-auto gap-0 rounded-none bg-transparent p-0",
					className,
				)}
			>
				{items.map((item) => (
					<TabsTrigger
						key={item.id}
						value={item.id}
						className="cursor-pointer rounded-none px-4 py-3 text-sm text-slate-600 data-[state=active]:text-slate-900"
					>
						{item.labelKey ? (
							<Translate text={item.labelKey} />
						) : (
							item.label
						)}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}
