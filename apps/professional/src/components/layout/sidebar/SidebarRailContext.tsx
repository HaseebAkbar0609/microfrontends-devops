"use client";

import { createContext, useContext } from "react";

/** When true, auto-collapse rail stays expanded (flyout open or pointer over flyout). */
export type SetSidebarRailFlyoutOpen = (open: boolean) => void;

export const SidebarRailFlyoutContext =
	createContext<SetSidebarRailFlyoutOpen | null>(null);

export function useSidebarRailFlyoutLock(): SetSidebarRailFlyoutOpen | null {
	return useContext(SidebarRailFlyoutContext);
}
