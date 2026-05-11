// ─── Types ───────────────────────────────────────────────────────────────────

import { LucideIcon } from "lucide-react";

export interface WidgetProps {
    title: string;
    icon: LucideIcon;
    subtitle?: React.ReactNode;
    content?: React.ReactNode;
}

export interface PlacedWidgetEntry {
    uid: string;
    /** The id from SIDEBAR_ITEMS if this widget originated from there */
    sidebarId?: string;
    /** Tailwind column-span class applied to the DraggableGridCard wrapper */
    colSpanClass: string;
    widgetProps: WidgetProps;
}

