"use client";

import React, { useState } from "react";
import Image from "next/image";
import { FileText, ChevronUp, ChevronDown } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface SupplierArticleImagesCardProps {
	readonly images?: string[];
}

const DEFAULT_SUPPLIER_IMAGES = [
	"https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80",
	"https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&auto=format&fit=crop&q=80",
	"https://images.unsplash.com/photo-1620626011761-996317b8d101?w=400&auto=format&fit=crop&q=80",
];

export function SupplierArticleImagesCard({
	images = [],
}: SupplierArticleImagesCardProps) {
	const [isOpen, setIsOpen] = useState(true);
	const displayImages = images && images.length > 0 ? images : DEFAULT_SUPPLIER_IMAGES;

	return (
		<Card className="rounded-xl border border-slate-200/90 bg-white shadow-none overflow-hidden">
			<CardHeader className="flex flex-row items-center justify-between border-b border-slate-100/80 px-6 py-4">
				<CardTitle className="text-sm font-semibold text-zinc-900 flex items-center gap-2.5">
					<FileText className="h-4 w-4 text-slate-600" />
					<Translate text={localizationConstants.supplierArticleBilderCard} />
				</CardTitle>
				<Button
					type="button"
					variant="ghost"
					size="sm"
					onClick={() => setIsOpen(!isOpen)}
					className="h-7 w-7 p-0 text-slate-500 hover:text-slate-900 hover:bg-slate-100 cursor-pointer rounded-lg"
					aria-label={isOpen ? "Collapse images" : "Expand images"}
				>
					{isOpen ? (
						<ChevronUp className="h-4 w-4" />
					) : (
						<ChevronDown className="h-4 w-4" />
					)}
				</Button>
			</CardHeader>
			{isOpen && (
				<CardContent className="px-6 py-5">
					<div className="flex flex-col gap-3">
						<span className="text-xs font-semibold text-slate-900 tracking-tight">
							<Translate text={localizationConstants.supplierArticleBilderCard} />
						</span>
						<div className="flex items-start gap-5 flex-wrap">
							{displayImages.map((img, index) => (
								<div key={index} className="flex flex-col items-center gap-1.5 w-24 sm:w-28">
									<div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl border border-slate-200/80 overflow-hidden bg-slate-50 shadow-2xs group cursor-pointer">
										<Image
											src={img}
											alt={`Photo ${index + 1}`}
											fill
											className="object-cover group-hover:scale-105 transition-transform duration-200"
											sizes="(max-width: 640px) 96px, 112px"
										/>
									</div>
									<span className="text-[11px] font-normal text-slate-400 text-center tracking-tight truncate w-full">
										<Translate text={localizationConstants.supplierArticlePhotoLabel} />
									</span>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			)}
		</Card>
	);
}

