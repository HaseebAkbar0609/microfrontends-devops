// ─── Types ───────────────────────────────────────────────────────────────────

import { LucideIcon } from "lucide-react";

export interface WidgetProps {
    title: string;
    icon: LucideIcon;
    subtitle?: React.ReactNode;
    content?: React.ReactNode;
    isLocked?: boolean;
    expandedContent?: React.ReactNode;
    emptyTitle?: string;
    emptyDescription?: string;
    emptyActionLabel?: string;
    onEmptyAction?: () => void;
    onRefresh?: () => Promise<void> | void;
    isDisabled?: boolean;
    isLoading?: boolean;
    isEmpty?: boolean;
    badge?: React.ReactNode;
}

export interface PlacedWidgetEntry {
    uid: string;
    /** The id from SIDEBAR_ITEMS if this widget originated from there */
    sidebarId?: string;
    /** Tailwind column-span class applied to the DraggableGridCard wrapper */
    colSpanClass: string;
    widgetProps: WidgetProps;
}

