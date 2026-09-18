"use client";

import { SidebarSubItem } from "./SidebarSubItem";
import { useExclusiveFlyout } from "./useExclusiveFlyout";
import type { NavSubItem } from "./navConfig";

interface SidebarSubItemListProps {
	items: NavSubItem[];
}

export function SidebarSubItemList({ items }: SidebarSubItemListProps) {
	const { openFlyoutId, setFlyoutOpen } = useExclusiveFlyout();

	return (
		<div className="flex flex-row self-stretch pl-5">
			<div className="flex flex-1 flex-col gap-1 border-l border-[#364157] py-1 pl-2">
				{items.map((item) => (
					<SidebarSubItem
						key={item.id}
						item={item}
						flyoutOpen={openFlyoutId === item.id}
						onFlyoutOpenChange={(open) => setFlyoutOpen(item.id, open)}
					/>
				))}
			</div>
		</div>
	);
}
