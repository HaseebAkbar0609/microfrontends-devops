"use client";

import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import {
	CLAIMS_BASE_ROUTE,
	CREATE_CLAIM_ROUTE,
} from "../../../constants/claims.constants";
import type { ClaimItem, ClaimDocument } from "../../../types/claims.types";
import { ClaimDetailConnectionCard } from "./ClaimDetailConnectionCard";
import { ClaimDetailDeficiencyCard } from "./ClaimDetailDeficiencyCard";
import { ClaimDetailDemandCard } from "./ClaimDetailDemandCard";
import { ClaimDetailTextCard } from "./ClaimDetailTextCard";
import { ClaimDetailDocumentsCard } from "./ClaimDetailDocumentsCard";
import { DocumentViewerModal } from "../DocumentViewerModal";

interface ClaimDetailPageProps {
	item: ClaimItem;
	onEdit?: (item: ClaimItem) => void;
}

export function ClaimDetailPage({
	item,
	onEdit,
}: ClaimDetailPageProps) {
	const router = useRouter();
	const [activeTab, setActiveTab] = useState<"budget" | "docs">("budget");
	const [viewingDoc, setViewingDoc] = useState<ClaimDocument | null>(null);

	const handleBack = () => {
		router.push(CLAIMS_BASE_ROUTE);
	};

	const handleEditSection = () => {
		if (onEdit) {
			onEdit(item);
		} else {
			router.push(`${CREATE_CLAIM_ROUTE}?id=${item.id}`);
		}
	};

	const handleViewDocument = (doc: ClaimDocument) => {
		setViewingDoc(doc);
	};

	return (
		<div className="flex flex-1 flex-col bg-slate-50/50 min-h-screen">
			{/* Top Header matching Figma Screenshot 4 */}
			<div className="bg-white border-b border-slate-200 px-6 pt-5 pb-0">
				<div className="flex items-center justify-between mb-4">
					<div className="flex items-center gap-3">
						<button
							type="button"
							onClick={handleBack}
							className="p-1.5 -ml-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
						>
							<ArrowLeft className="w-5 h-5" />
						</button>
						<div>
							<h1 className="text-xl font-bold text-slate-900">
								<Translate text={localizationConstants.claimsTitleDetail} />
							</h1>
							<p className="text-xs text-slate-500 font-mono">#{item.id}</p>
						</div>
					</div>
				</div>

				{/* Tabs: Budget / Dokuments matching Figma Screenshot 4 */}
				<div className="flex items-center gap-6">
					<button
						type="button"
						onClick={() => setActiveTab("budget")}
						className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
							activeTab === "budget"
								? "text-slate-900 border-b-2 border-slate-900"
								: "text-slate-500 hover:text-slate-700"
						}`}
					>
						<Translate text={localizationConstants.claimsTabBudget} />
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("docs")}
						className={`pb-3 text-sm font-semibold transition-colors cursor-pointer ${
							activeTab === "docs"
								? "text-slate-900 border-b-2 border-slate-900"
								: "text-slate-500 hover:text-slate-700"
						}`}
					>
						<Translate text={localizationConstants.claimsTitleTabDokuments} />
					</button>
				</div>
			</div>

			{/* Main Detail Content matching Figma Screenshots 4 & 5 */}
			<div className="p-6 max-w-7xl mx-auto w-full space-y-5">
				{activeTab === "budget" ? (
					<>
						<ClaimDetailConnectionCard
							item={item}
							onEdit={handleEditSection}
						/>

						<ClaimDetailDeficiencyCard
							item={item}
							onEdit={handleEditSection}
						/>

						<ClaimDetailDemandCard
							item={item}
							onEdit={handleEditSection}
						/>

						<ClaimDetailTextCard
							item={item}
							onEdit={handleEditSection}
						/>
					</>
				) : (
					<ClaimDetailDocumentsCard
						documents={item.documents || []}
						onViewDocument={handleViewDocument}
					/>
				)}
			</div>

			<DocumentViewerModal
				isOpen={viewingDoc !== null}
				document={viewingDoc}
				onClose={() => setViewingDoc(null)}
			/>
		</div>
	);
}

export default ClaimDetailPage;
