"use client";

import { ChevronDown, ImageIcon, ImageUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useComingSoonToast } from "../../hooks/useComingSoonToast";
import type { AccessImage } from "../../types/accessItemDetails.types";
import { AccessSectionCard } from "../details/AccessSectionCard";

/**
 * "Images" card. The Figma shows an upload field with a dark Upload button and a
 * gallery with an x on each picture, but not how choosing and uploading files works,
 * so the field and Upload show the coming-soon toast. Removing a picture asks first.
 */
export function AccessImagesCard({ images, onRemove }: { images: AccessImage[]; onRemove: (image: AccessImage) => void }) {
	const t = useTranslate();
	const showComingSoon = useComingSoonToast();

	return (
		<AccessSectionCard icon={<ImageUp className="h-5 w-5" aria-hidden />} title={localizationConstants.accessItemSectionImages}>
			<div className="flex flex-col gap-6 p-4">
				<div>
					<p className="text-sm font-medium text-slate-950">
						<Translate text={localizationConstants.accessImagesUploadLabel} />
					</p>
					<p className="text-sm text-slate-500">
						<Translate text={localizationConstants.accessImagesHint} />
					</p>
					<div className="mt-1 flex items-center gap-3">
						<button
							type="button"
							onClick={showComingSoon}
							className="flex min-h-9 flex-1 cursor-pointer items-center justify-between rounded-md border border-slate-200 bg-white px-3 text-left text-sm text-slate-500 shadow-xs"
						>
							<Translate text={localizationConstants.accessImagesSelectPlaceholder} />
							<ChevronDown className="h-5 w-5" aria-hidden />
						</button>
						<Button type="button" className="h-9 cursor-pointer bg-zinc-900 px-4 text-white hover:bg-zinc-800" onClick={showComingSoon}>
							<Translate text={localizationConstants.accessImagesUploadButton} />
						</Button>
					</div>
				</div>

				<div>
					<p className="mb-2 text-sm font-medium text-slate-950">
						<Translate text={localizationConstants.accessItemSectionImages} />
					</p>
					{images.length === 0 ? (
						<p className="text-sm text-slate-500">
							<Translate text={localizationConstants.accessImagesEmpty} />
						</p>
					) : (
						<ul className="flex flex-wrap gap-4">
							{images.map((image) => (
								<li key={image.id} className="w-[100px]">
									<div className="relative flex h-[100px] w-[100px] items-center justify-center rounded-md bg-slate-100 text-slate-400">
										<ImageIcon className="h-8 w-8" aria-hidden />
										<button
											type="button"
											onClick={() => onRemove(image)}
											aria-label={t(localizationConstants.accessImageRemoveLabel, { name: image.caption })}
											className="absolute right-1 top-1 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-slate-600/80 text-white hover:bg-slate-700"
										>
											<X className="h-3 w-3" aria-hidden />
										</button>
									</div>
									<p className="mt-1 truncate text-center text-xs text-slate-500">{image.caption}</p>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</AccessSectionCard>
	);
}
