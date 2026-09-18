"use client";

import { useState } from "react";
import { SidebarSubItem } from "./SidebarSubItem";
import type { NavSubItem } from "./navConfig";

interface SidebarSubItemListProps {
	items: NavSubItem[];
}

export function SidebarSubItemList({ items }: SidebarSubItemListProps) {
	const [openFlyoutId, setOpenFlyoutId] = useState<string | null>(null);

	return (
		<div className="flex flex-row self-stretch pl-5">
			<div className="flex flex-1 flex-col gap-1 border-l border-[#364157] py-1 pl-2">
				{items.map((item) => (
					<SidebarSubItem
						key={item.id}
						item={item}
						flyoutOpen={openFlyoutId === item.id}
						onFlyoutOpenChange={(open) =>
							setOpenFlyoutId((currentId) => {
								if (open) return item.id;
								// A late close from an item the pointer already left must
								// not shut the flyout that has opened since.
								return currentId === item.id ? null : currentId;
							})
						}
					/>
				))}
			</div>
		</div>
	);
}
