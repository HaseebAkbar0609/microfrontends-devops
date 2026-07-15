"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { GuideSidebar } from "./GuideSidebar";
import { OfferDocument } from "./documents/OfferDocument";
import { ConsultantDocument } from "./documents/ConsultantDocument";

export function GuideSection() {
	const [selectedDocument, setSelectedDocument] = useState("offert");
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
				className={`fixed inset-y-0 left-0 z-40 w-[280px] shrink-0 border-r border-slate-200 bg-[#FAFAFA] transition-transform duration-200 lg:static lg:translate-x-0 ${
					sidebarOpen ? "translate-x-0" : "-translate-x-full"
				}`}
			>
				<GuideSidebar
					selectedDocument={selectedDocument}
					onSelectDocument={(doc) => {
						setSelectedDocument(doc);
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
					{selectedDocument === "offert" && <OfferDocument />}
					{selectedDocument === "konsult" && <ConsultantDocument />}
				</div>
			</div>
		</div>
	);
}
