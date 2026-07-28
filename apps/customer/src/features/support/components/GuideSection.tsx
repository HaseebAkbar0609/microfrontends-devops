"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { GuideSidebar } from "./GuideSidebar";
import { OfferDocument } from "./documents/OfferDocument";
import { ConsultantDocument } from "./documents/ConsultantDocument";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function GuideSection() {
	const [selectedDocument, setSelectedDocument] = useState<{
		id: string;
		label: string;
	}>({ id: "offert", label: "" });
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className="relative flex flex-1 min-h-0">
			{sidebarOpen && (
				<div
					className="fixed inset-0 z-30 bg-black/30 lg:hidden"
					onClick={() => setSidebarOpen(false)}
				/>
			)}

			<div
				className={`fixed inset-y-0 left-0 z-40 w-[280px] shrink-0 border-r border-slate-200 bg-[#FAFAFA] transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
					}`}
			>
				<GuideSidebar
					selectedDocument={selectedDocument.id}
					onSelectDocument={(id, label) => {
						setSelectedDocument({ id, label });
						setSidebarOpen(false);
					}}
				/>
			</div>

			<div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-10 lg:py-6">
				<button
					type="button"
					onClick={() => setSidebarOpen(true)}
					className="mb-4 flex items-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 lg:hidden"
				>
					<Menu className="h-4 w-4" />
					Menu
				</button>

				<div className="rounded-lg bg-white px-4 py-6 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.06),-4px_0_8px_-4px_rgba(0,0,0,0.06)] sm:px-6 sm:py-7 lg:px-8 lg:py-8">
					{selectedDocument.id === "offert" && <OfferDocument />}
					{selectedDocument.id === "konsult" && <ConsultantDocument />}
					{selectedDocument.id !== "offert" && selectedDocument.id !== "konsult" && (
						<div className="pr-0 lg:pr-8">
							<h1 className="text-3xl font-bold text-slate-900">
								<Translate text={selectedDocument.label} />
							</h1>
							<div className="mt-4 space-y-1 text-sm text-slate-600">
								<p><Translate text={localizationConstants.guideDocumentation} /></p>
							</div>
							<div className="mt-8 space-y-6 text-sm text-slate-700">
								<section>
									<h2 className="text-lg font-bold text-slate-900">
										<Translate text={localizationConstants.guideAboutThisGuide} />
									</h2>
									<p className="mt-2 leading-relaxed">
										<Translate text={localizationConstants.guideWelcomeToSection} />{" "}
										<Translate text={selectedDocument.label} />.
									</p>
								</section>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
