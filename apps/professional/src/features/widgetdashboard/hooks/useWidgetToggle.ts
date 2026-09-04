"use client";

import { useRef, useState } from "react";
import { PlacedWidgetEntry, WidgetProps } from "../types/dashboard";

export function useWidgetToggle(
	widgetMap: Record<string, WidgetProps>,
	initialWidgets: PlacedWidgetEntry[],
) {
	const [placedWidgets, setPlacedWidgets] =
		useState<PlacedWidgetEntry[]>(initialWidgets);
	const [widgetsVisible, setWidgetsVisible] = useState(true);
	const savedLayoutRef = useRef<PlacedWidgetEntry[] | null>(null);

	const handleWidgetsToggle = () => {
		if (widgetsVisible) {
			savedLayoutRef.current = placedWidgets;
			setPlacedWidgets((widgets) =>
				widgets.map((widget) => ({
					...widget,
					sidebarId: "emptyPage",
					widgetProps: widgetMap.emptyPage,
				})),
			);
		} else if (savedLayoutRef.current) {
			setPlacedWidgets(savedLayoutRef.current);
			savedLayoutRef.current = null;
		}
		setWidgetsVisible((prev) => !prev);
	};

	const resumeAfterDrop = () => {
		if (!widgetsVisible) {
			savedLayoutRef.current = null;
			setWidgetsVisible(true);
		}
	};

	return {
		placedWidgets,
		setPlacedWidgets,
		widgetsVisible,
		handleWidgetsToggle,
		resumeAfterDrop,
	};
}
