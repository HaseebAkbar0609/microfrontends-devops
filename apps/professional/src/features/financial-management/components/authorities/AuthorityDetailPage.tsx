"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Printer, Download, FileText, CheckCircle2 } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useAuthorityDetail } from "../../hooks/useAuthorityDetail";
import { ECONOMY_AUTHORITIES_BASE_URL } from "../../constants/authorities.constants";
import { AuthorityDetailHeaderCard } from "./AuthorityDetailHeaderCard";
import { AuthorityDetailPartiesCard } from "./AuthorityDetailPartiesCard";
import { AuthorityDetailProjectCard } from "./AuthorityDetailProjectCard";
import { AuthorityDetailLineItemsTable } from "./AuthorityDetailLineItemsTable";
import { AuthorityDetailTotalsCard } from "./AuthorityDetailTotalsCard";
import { AuthorityDetailCompanyFooter } from "./AuthorityDetailCompanyFooter";
import { AuthorityDetailCommentsCard } from "./AuthorityDetailCommentsCard";

interface AuthorityDetailPageProps {
	authorityId: string;
}

export function AuthorityDetailPage({ authorityId }: AuthorityDetailPageProps) {
	const router = useRouter();
	const { authority, isLoading, addComment } = useAuthorityDetail(authorityId);

	if (isLoading) {
		return (
			<div className="py-16 text-center text-sm text-slate-500">
				Laddar ärendeuppgifter...
			</div>
		);
	}

	if (!authority) {
		return (
			<div className="py-16 text-center space-y-4">
				<p className="text-sm font-semibold text-slate-800">
					Ärendet kunde inte hittas.
				</p>
				<Button
					variant="outline"
					size="sm"
					onClick={() => router.push(ECONOMY_AUTHORITIES_BASE_URL)}
					className="text-xs"
				>
					<ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
					Tillbaka till listan
				</Button>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Top Bar / Breadcrumb & Actions */}
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
				<div className="flex items-center gap-3">
					<button
						type="button"
						onClick={() => router.push(ECONOMY_AUTHORITIES_BASE_URL)}
						className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
					>
						<ArrowLeft className="h-4 w-4" />
					</button>
					<div>
						<div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
							<span>Hem</span>
							<span>/</span>
							<span>Ekonomi</span>
							<span>/</span>
							<button
								type="button"
								onClick={() => router.push(ECONOMY_AUTHORITIES_BASE_URL)}
								className="hover:text-slate-800 underline"
							>
								<Translate text={localizationConstants.authoritiesTitle} />
							</button>
							<span>/</span>
							<span className="text-slate-800 font-medium">#{authority.caseNr || authority.id}</span>
						</div>
						<h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
							<Translate text={localizationConstants.authorityCaseDetailsTitle} />
							<span className="text-slate-500 font-normal">#{authority.caseNr || authority.id}</span>
						</h1>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						size="sm"
						onClick={() => window.print()}
						className="h-9 gap-1.5 border-slate-200 text-xs"
					>
						<Printer className="h-3.5 w-3.5" />
						<Translate text={localizationConstants.actionPrint} />
					</Button>
					{authority.fileUrl && (
						<a
							href={authority.fileUrl}
							download={authority.fileName || `case-${authority.caseNr || authority.id}.pdf`}
							className="inline-flex items-center justify-center h-9 px-3 rounded-md bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 gap-1.5"
						>
							<Download className="h-3.5 w-3.5" />
							<Translate text={localizationConstants.actionDownloadPdf} />
						</a>
					)}
				</div>
			</div>

			{/* Main Grid: Document Preview on Left, Metadata & Activity on Right */}
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				{/* Left Document Paper Preview */}
				<div className="lg:col-span-8 space-y-6">
					<div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
						<AuthorityDetailHeaderCard authority={authority} />
						<AuthorityDetailPartiesCard
							customer={authority.customer}
							supplier={authority.supplier}
						/>
						<AuthorityDetailProjectCard
							project={authority.project}
							subject={authority.subject}
						/>
						<AuthorityDetailLineItemsTable lineItems={authority.lineItems} />
						<AuthorityDetailTotalsCard totals={authority.totals} />
						<AuthorityDetailCompanyFooter companyDetails={authority.companyDetails} />
					</div>
				</div>

				{/* Right Sidebar: Status & Comments */}
				<div className="lg:col-span-4 space-y-6">
					{/* Status Card */}
					<div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
						<h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
							Ärendestatus & Detaljer
						</h3>

						<div className="space-y-3 text-xs">
							<div className="flex justify-between items-center py-1 border-b border-slate-100">
								<span className="text-slate-500">Status</span>
								<span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
									<CheckCircle2 className="h-3 w-3" />
									{authority.status || "Godkänd"}
								</span>
							</div>

							<div className="flex justify-between items-center py-1 border-b border-slate-100">
								<span className="text-slate-500">Handläggare</span>
								<span className="font-semibold text-slate-800">
									{authority.responsiblePerson || "Erik Eriksson"}
								</span>
							</div>

							<div className="flex justify-between items-center py-1 border-b border-slate-100">
								<span className="text-slate-500">Kategori</span>
								<span className="font-semibold text-slate-800">
									{authority.category}
								</span>
							</div>

							<div className="flex justify-between items-center py-1 border-b border-slate-100">
								<span className="text-slate-500">Myndighet</span>
								<span className="font-semibold text-slate-800">
									{authority.authorityName}
								</span>
							</div>

							{authority.attachments && authority.attachments.length > 0 && (
								<div className="pt-2">
									<span className="text-slate-500 block mb-2">Bifogade dokument:</span>
									<div className="space-y-1.5">
										{authority.attachments.map((att) => (
											<div
												key={att.id}
												className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
											>
												<div className="flex items-center gap-2 truncate">
													<FileText className="h-3.5 w-3.5 text-slate-400 shrink-0" />
													<span className="truncate text-slate-700 font-medium">
														{att.name}
													</span>
												</div>
												{att.fileUrl && (
													<a
														href={att.fileUrl}
														download={att.name}
														className="text-slate-400 hover:text-slate-700"
													>
														<Download className="h-3.5 w-3.5" />
													</a>
												)}
											</div>
										))}
									</div>
								</div>
							)}
						</div>
					</div>

					{/* Comments Card */}
					<AuthorityDetailCommentsCard
						comments={authority.comments}
						onAddComment={addComment}
					/>
				</div>
			</div>
		</div>
	);
}

export default AuthorityDetailPage;
