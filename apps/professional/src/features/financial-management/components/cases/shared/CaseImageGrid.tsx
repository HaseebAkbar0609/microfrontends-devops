"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { CaseDocument } from "../../../types/cases.types";

const TILE = "relative block h-24 w-32 overflow-hidden rounded-lg border border-slate-200 bg-slate-50";

export interface CaseImageGridProps {
	images: CaseDocument[];
	/** Omitted where the case is only being read. */
	onRemove?: (id: string) => void;
	/** Opens the picture; given on the screens that only show it. */
	onOpen?: (image: CaseDocument) => void;
}

/** The pictures added so far, each removable, as the frame draws them. */
export function CaseImageGrid({ images, onRemove, onOpen }: CaseImageGridProps) {
	const t = useTranslate();

	if (images.length === 0) {
		return (
			<p className="py-8 text-center text-xs text-slate-400 italic">
				<Translate text={localizationConstants.casesNoImagesYet} />
			</p>
		);
	}

	return (
		<div>
			<ul className="flex flex-wrap gap-4">
				{images.map((image) => (
					<li key={image.id} className="relative w-32">
						{onOpen && image.url ? (
							/* A tile that opens is a button, so a keyboard can reach it. */
							<button
								type="button"
								onClick={() => onOpen(image)}
								aria-label={t(localizationConstants.casesOpenImage, { name: image.name })}
								className={`${TILE} cursor-pointer hover:border-slate-300`}
							>
								<Image src={image.url} alt={image.name} fill unoptimized className="object-cover" />
							</button>
						) : (
							<div className={TILE}>
								{image.url ? (
									<Image src={image.url} alt={image.name} fill unoptimized className="object-cover" />
								) : (
									/* A case reopened later keeps the row but not the picture. */
									<span className="flex h-full items-center justify-center px-2 text-center text-[10px] text-slate-400">
										<Translate text={localizationConstants.casesAttachmentNotHeld} />
									</span>
								)}
							</div>
						)}
						{onRemove && (
							<button
								type="button"
								onClick={() => onRemove(image.id)}
								aria-label={t(localizationConstants.casesRemoveImage, { name: image.name })}
								className="absolute -right-2 -top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-slate-700 text-white hover:bg-slate-900"
							>
								<X className="h-3 w-3" aria-hidden />
							</button>
						)}
						<p className="mt-1.5 truncate text-center text-[11px] text-slate-500" title={image.name}>
							{image.name}
						</p>
					</li>
				))}
			</ul>
		</div>
	);
}

export default CaseImageGrid;
