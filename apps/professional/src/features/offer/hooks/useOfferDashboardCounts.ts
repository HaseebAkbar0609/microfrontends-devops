import { useCallback, useEffect, useState } from "react";
import { useAuthStatus, type User } from "@/context/AuthContext";
import {
	invalidateOfferCounts,
	loadOfferCounts,
	offerCountsScope,
	type OfferDashboardCounts,
} from "../services/offerDashboardCounts";

type Snapshot = { scope: string; loading: boolean; counts: OfferDashboardCounts | null };

export function useOfferDashboardCounts() {
	const { company, user, isReady } = useAuthStatus();
	const companyId = company?.id ?? "";
	const actorId = (user as User | null)?.id ?? "";
	const scope = companyId && actorId ? offerCountsScope(companyId, actorId) : "";
	const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
	const [revision, setRevision] = useState(0);

	useEffect(() => {
		if (!isReady || !scope) return;
		let cancelled = false;
		setSnapshot({ scope, loading: true, counts: null });
		loadOfferCounts(companyId, actorId)
			.then((counts) => {
				if (!cancelled) setSnapshot({ scope, loading: false, counts });
			})
			.catch(() => {
				if (!cancelled) setSnapshot({ scope, loading: false, counts: null });
			});
		return () => { cancelled = true; };
	}, [companyId, actorId, scope, isReady, revision]);

	const refresh = useCallback(() => {
		if (!scope) return;
		invalidateOfferCounts(companyId, actorId);
		setSnapshot({ scope, loading: true, counts: null });
		setRevision((value) => value + 1);
	}, [companyId, actorId, scope]);

	return {
		loading: !isReady || Boolean(scope && (snapshot?.scope !== scope || snapshot.loading)),
		counts: scope && snapshot?.scope === scope ? snapshot.counts : null,
		refresh,
	};
}
