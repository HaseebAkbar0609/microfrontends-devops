// ─── Sidebar Items ────────────────────────────────────────────────────────────

import localizationConstants from "@/utils/translation/constants";
import { WidgetItem } from "../components/DraggableSidebarItem";
import { Layers, User, ImageIcon, Newspaper, TrendingUp, ClipboardList, FolderOpen, ShieldCheck, CircleDollarSign, Focus, ArrowRight } from "lucide-react";

export const SIDEBAR_ITEMS: WidgetItem[] = [
    { id: "emptyPage", label: localizationConstants.emptyPageLabel, icon: Layers },
    { id: "personnel", label: localizationConstants.personnel, icon: User },
    { id: "image", label: localizationConstants.imageLabel, icon: ImageIcon },
    { id: "newsLabel", label: localizationConstants.newsLabel, icon: Newspaper },
    { id: "turnOver", label: localizationConstants.turnoverLabel, icon: TrendingUp },
    { id: "orderLabel", label: localizationConstants.ordersLabel, icon: ClipboardList },
    { id: "projectLabel", label: localizationConstants.projectsLabel, icon: FolderOpen },
    { id: "kma", label: localizationConstants.kma, icon: ShieldCheck },
    { id: "offer", label: localizationConstants.offer, icon: CircleDollarSign },
    { id: "onGoingQuotes", label: localizationConstants.ongoingQuotesLabel, icon: Focus },
    { id: "availableLabel", label: localizationConstants.availableLabel, icon: ArrowRight },
];


