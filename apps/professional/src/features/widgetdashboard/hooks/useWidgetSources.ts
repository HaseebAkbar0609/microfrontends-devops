import { useEffect, useState } from "react";
import { getWidgetSourcesAction } from "@/api-actions/widgets/widgets";
import { useAuthStatus } from "@/context/AuthContext";

export function useWidgetSources(location: string) {
	const { company } = useAuthStatus();
	const [liveWidgetIds, setLiveWidgetIds] = useState<string[]>([]);
	const [loadedFor, setLoadedFor] = useState<string | null>(null);
	const [error, setError] = useState(false);
	const sourceKey = `${company?.id ?? ""}:${location}`;

	useEffect(() => {
		if (!company?.id) return;
		let cancelled = false;
		getWidgetSourcesAction(location).then((result) => {
			if (cancelled) return;
			const data = result.data;
			const valid = result.success && data?.location === location &&
				Array.isArray(data.live_widget_ids) &&
				data.live_widget_ids.every((id) => typeof id === "string");
			setLiveWidgetIds(valid && data ? data.live_widget_ids : []);
			setError(!valid);
			setLoadedFor(sourceKey);
		});
		return () => { cancelled = true; };
	}, [company?.id, location, sourceKey]);

	return {
		liveWidgetIds: loadedFor === sourceKey ? liveWidgetIds : [],
		loading: loadedFor !== sourceKey,
		error: loadedFor === sourceKey && error,
	};
}
