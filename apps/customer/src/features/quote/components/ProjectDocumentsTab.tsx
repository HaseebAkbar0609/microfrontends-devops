"use client";

import { useEffect, useState, useCallback } from "react";
import { Folders, Loader2 } from "lucide-react";
import { DocumentUpload } from "./documents/DocumentUpload";
import { DocumentList } from "./documents/DocumentList";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import type { ProjectDocument } from "../types/types";
import { getProjectDocumentsAPIAction, deleteProjectDocumentAPIAction, type ApiProjectDocumentItem } from "@/api-actions";
import { showToast } from "@/lib/toast";

interface ProjectDocumentsTabProps {
	projectId: string;
	initialDocuments?: ApiProjectDocumentItem[];
}

export function ProjectDocumentsTab({ projectId }: ProjectDocumentsTabProps) {
	const [documents, setDocuments] = useState<readonly ProjectDocument[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchDocuments = useCallback(async () => {
		if (!projectId) return;
		setLoading(true);
		const res = await getProjectDocumentsAPIAction(projectId);
		if (res.success && res.data) {
			const mapped = res.data.map((doc: ApiProjectDocumentItem) => ({
				id: doc.id,
				date: doc.date ? new Date(doc.date).toISOString().split("T")[0] : "-",
				name: doc.name || "Document",
				comments: (doc.comment as string) || "",
				fileType: doc.type || "PDF",
				url: doc.fileUrl,
			}));
			setDocuments(mapped);
		} else {
			showToast("error", res.error || "Failed to fetch project documents");
		}
		setLoading(false);
	}, [projectId]);

	useEffect(() => {
		void fetchDocuments();
	}, [fetchDocuments]);

	const handleDeleteDocument = async (id: string) => {
		if (!projectId) return;
		const res = await deleteProjectDocumentAPIAction(projectId, id);
		if (res.success) {
			showToast("success", "Document deleted successfully");
			void fetchDocuments();
		} else {
			showToast("error", res.error || "Failed to delete document");
		}
	};

	return (
		<div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
			{/* Header */}
			<div className="flex items-center gap-2 px-6 py-4 border-b border-slate-200 bg-white">
				<Folders className="h-5 w-5 text-slate-700" />
				<h2 className="text-base font-semibold text-slate-900">
					<Translate
						text={localizationConstants.projectDocumentsSection}
					/>
				</h2>
			</div>

			<div className="p-6 space-y-8">
				<DocumentUpload projectId={projectId} onUploadSuccess={fetchDocuments} />

				<hr className="border-slate-100" />

				{loading ? (
					<div className="flex items-center justify-center py-10">
						<Loader2 className="w-6 h-6 animate-spin text-slate-600" />
					</div>
				) : (
					<DocumentList
						documents={documents}
						onDelete={handleDeleteDocument}
					/>
				)}
			</div>
		</div>
	);
}
