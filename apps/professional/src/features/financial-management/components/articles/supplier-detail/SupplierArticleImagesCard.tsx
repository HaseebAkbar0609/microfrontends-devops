"use client";

import React from "react";
import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface SupplierArticleImagesCardProps {
	readonly images?: string[];
}

export function SupplierArticleImagesCard({
	images = [],
}: SupplierArticleImagesCardProps) {
	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-2xs">
			<CardHeader className="border-b border-slate-100 px-4 sm:px-6 py-3">
				<CardTitle className="text-sm font-semibold text-zinc-950 flex items-center gap-2">
					<ImageIcon className="h-4 w-4 text-slate-500" />
					<Translate text={localizationConstants.productImagesSectionTitle} />
				</CardTitle>
			</CardHeader>
			<CardContent className="px-4 sm:px-6 py-4">
				{images.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-8 text-slate-400">
						<ImageIcon className="h-8 w-8 mb-2 opacity-50" />
						<p className="text-xs">
							<Translate text={localizationConstants.noImagesUploaded} />
						</p>
					</div>
				) : (
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{images.map((img, index) => (
							<div
								key={index}
								className="relative aspect-square rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group"
							>
								<Image
									src={img}
									alt={`Product Image ${index + 1}`}
									fill
									className="object-cover group-hover:scale-105 transition-transform duration-200"
								/>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
