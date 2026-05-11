import { Folders } from "lucide-react";
import { DocumentUpload } from "./documents/DocumentUpload";
import { DocumentList } from "./documents/DocumentList";
import { DUMMY_DOCUMENTS } from "../constants";

import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { useState } from "react";
import { ProjectDocument } from "../types/types";

export function ProjectDocumentsTab() {
	const [documents, setDocuments] =
		useState<readonly ProjectDocument[]>(DUMMY_DOCUMENTS);

	const handleAddDocuments = (newDocs: ProjectDocument[]) => {
		setDocuments((prev) => [...newDocs, ...prev]);
	};

	const handleDeleteDocument = (id: string) => {
		setDocuments((prev) => prev.filter((doc) => doc.id !== id));
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
				<DocumentUpload onUpload={handleAddDocuments} />

				<hr className="border-slate-100" />

				<DocumentList
					documents={documents}
					onDelete={handleDeleteDocument}
				/>
			</div>
		</div>
	);
}
