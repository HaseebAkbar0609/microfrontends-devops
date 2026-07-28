import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getProjectListAPIAction } from "@/api-actions";

export function useResolvedProjectId(redirectPath: string) {
	const searchParams = useSearchParams();
	const router = useRouter();
	const queryProjectId = searchParams?.get("projectId") ?? "";
	const [projectId, setProjectId] = useState<string>(queryProjectId);
	const [loading, setLoading] = useState<boolean>(!queryProjectId);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (queryProjectId) {
			setProjectId(queryProjectId);
			setError(null);
			setLoading(false);
			return;
		}
		let cancelled = false;

		const resolveProject = async () => {
			setError(null);
			try {
				const res = await getProjectListAPIAction({ pageSize: 50 });
				if (cancelled) return;
				if (res.success && res.data && res.data.quotes.length > 0) {
					const firstId = res.data.quotes[0].id;
					setProjectId(firstId);
					router.replace(`${redirectPath}?projectId=${encodeURIComponent(firstId)}`);
				} else if (!res.success) {
					setError(res.error || "Failed to load projects");
				}
			} catch (err: unknown) {
				if (cancelled) return;
				const message = err instanceof Error ? err.message : "Failed to load projects";
				setError(message);
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		void resolveProject();

		return () => {
			cancelled = true;
		};
	}, [queryProjectId, redirectPath, router]);

	return { projectId, loading, error };
}
