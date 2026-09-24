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
    sourceUnavailable?: boolean;
    badge?: React.ReactNode;
    /** This card's own surface, when a dashboard mixes shapes; otherwise the dashboard's. */
    variant?: WidgetCardVariant;
}

/**
 * A card's surface. `default` is the white card with its status dot and quick
 * Expand / Refresh buttons; `muted` is the grey card of the Prognos frame, whose
 * header keeps only the icon tile, the lock chip and the ⋮ menu; `kpi` is the
 * Analys frame's figure card — no icon tile and no quick buttons, its title a
 * label above the figure.
 */
export type WidgetCardVariant = "default" | "muted" | "kpi";

export interface PlacedWidgetEntry {
    uid: string;
    /** The id from SIDEBAR_ITEMS if this widget originated from there */
    sidebarId?: string;
    /** Tailwind column-span class applied to the DraggableGridCard wrapper */
    colSpanClass: string;
    widgetProps: WidgetProps;
}

