"use client";

import { useTranslation } from "react-i18next";
import { ImageIcon, X } from "lucide-react";

import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import localizationConstants from "@/utils/translation/constants";
import type { PartnerImage } from "../constants/imageBank";
import { ImageBankDropzone } from "./ImageBankDropzone";
import { PartnerImageThumbnail } from "./PartnerImageThumbnail";

type ImageBankTabProps = {
	images: PartnerImage[];
	onAdd: (images: PartnerImage[]) => void;
	onRemove: (id: string) => void;
};

export function ImageBankTab({ images, onAdd, onRemove }: ImageBankTabProps) {
	const { t } = useTranslation();

	return (
		<div className="mb-10 flex flex-col rounded-md border border-slate-200 bg-white shadow-sm">
			<div className="flex min-h-14 items-center border-b border-[#E4E4E7] bg-slate-100 px-4 py-2">
				<h2 className="text-base font-medium text-[#09090B]">{t(localizationConstants.imageBankTab)}</h2>
			</div>

			<div className="flex flex-col gap-6 p-4">
				<ImageBankDropzone onAdd={onAdd} />

				{images.length === 0 ? (
					<div className="flex flex-col items-center gap-2 py-10 text-center">
						<ImageIcon className="h-8 w-8 text-slate-300" />
						<p className="text-sm font-medium text-slate-900">{t(localizationConstants.imageBankEmptyTitle)}</p>
						<p className="text-sm text-slate-500">{t(localizationConstants.imageBankEmptyDescription)}</p>
					</div>
				) : (
					<ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
						{images.map((image) => (
							<li key={image.id} className="relative flex flex-col gap-2">
								<PartnerImageThumbnail image={image} />
								<p className="truncate text-sm text-slate-700" title={image.name}>
									{image.name}
								</p>
								<ConfirmDialog
									title={t(localizationConstants.imageBankRemoveTitle)}
									description={t(localizationConstants.imageBankRemoveDescription, { name: image.name })}
									onConfirm={() => onRemove(image.id)}
									confirmText={t(localizationConstants.delete)}
									cancelText={t(localizationConstants.cancelLabel)}
									confirmClassName="bg-red-600 hover:bg-red-700"
									trigger={
										<button
											type="button"
											aria-label={t(localizationConstants.imageBankRemoveImage, { name: image.name })}
											className="absolute right-2 top-2 cursor-pointer rounded-full bg-white/90 p-1 text-slate-600 shadow-sm hover:bg-white hover:text-red-600"
										>
											<X className="h-4 w-4" />
										</button>
									}
								/>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
