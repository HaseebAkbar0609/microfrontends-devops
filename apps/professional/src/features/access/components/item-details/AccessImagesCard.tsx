"use client";

import { ImageIcon, ImageUp, X } from "lucide-react";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { AccessImage } from "../../types/accessItemDetails.types";
import { AccessSectionCard } from "../details/AccessSectionCard";
import { AccessUploadRow } from "./AccessUploadRow";

/**
 * "Images" card: the upload row (coming-soon toast, since the Figma does not show how
 * choosing and uploading files works) and a gallery with an x on each picture.
 * Removing a picture asks first.
 */
export function AccessImagesCard({ images, onRemove }: { images: AccessImage[]; onRemove: (image: AccessImage) => void }) {
	const t = useTranslate();

	return (
		<AccessSectionCard icon={<ImageUp className="h-5 w-5" aria-hidden />} title={localizationConstants.accessItemSectionImages}>
			<div className="flex flex-col gap-6 p-4">
				<AccessUploadRow
					label={localizationConstants.accessImagesUploadLabel}
					hint={localizationConstants.accessImagesHint}
					placeholder={localizationConstants.accessImagesSelectPlaceholder}
				/>

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
