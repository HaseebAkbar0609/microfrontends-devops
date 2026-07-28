"use client";

import { Suspense } from "react";
import { CreateRutForm } from "@/features/rotRut/components/CreateRutForm";
import { useResolvedProjectId } from "@/features/rotRut/hooks/useResolvedProjectId";
import { Loader2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

function CreateRutFormContent() {
	const { projectId, loading } = useResolvedProjectId("/rotRut/rut/create");

	if (loading) {
		return (
			<div className="flex flex-1 items-center justify-center min-h-screen bg-white">
				<Loader2 className="h-8 w-8 animate-spin text-slate-500" />
			</div>
		);
	}

	if (!projectId) {
		return (
			<div className="flex flex-1 items-center justify-center min-h-screen bg-white">
				<p className="text-slate-600 font-medium">
					<Translate text={localizationConstants.projectNoProjectsFound} />
				</p>
			</div>
		);
	}

	return <CreateRutForm projectId={projectId} />;
}

export default function CreateRutPage() {
	return (
		<Suspense
			fallback={
				<div className="flex flex-1 items-center justify-center min-h-screen bg-white">
					<Loader2 className="h-8 w-8 animate-spin text-slate-500" />
				</div>
			}
		>
			<CreateRutFormContent />
		</Suspense>
	);
}


