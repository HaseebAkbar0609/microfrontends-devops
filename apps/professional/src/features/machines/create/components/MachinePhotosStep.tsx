"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Folder, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { showToast } from "@/lib/toast";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { ACCEPTED_IMAGE_TYPES } from "../data/newMachine.config";
import type {
	MachinePhotoItem,
	PendingMachineFile,
} from "../types/newMachine.types";

interface MachinePhotosStepProps {
	photos: MachinePhotoItem[];
	onAddPhotos: (files: PendingMachineFile[]) => void;
	onRemovePhoto: (id: string) => void;
}

/**
 * Third tab of the wizard: upload machine images and review them as a gallery.
 * Mirrors the Dokument tab's picker, with a thumbnail grid instead of tables.
 *
 * Note: the design titles this card "Dokument" like the Dokument tab — kept as
 * designed rather than renamed, since that is a content decision for the
 * designer rather than an obvious typo.
 */
export function MachinePhotosStep({
	photos,
	onAddPhotos,
	onRemovePhoto,
}: MachinePhotosStepProps) {
	const t = useTranslate();
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [pending, setPending] = useState<PendingMachineFile[]>([]);

	// Object URLs are only valid while the page lives; release the pending ones
	// when they are cleared or the step unmounts.
	useEffect(() => {
		return () => {
			pending.forEach((file) => {
				if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
			});
		};
	}, [pending]);

	const handleFilesPicked = (event: React.ChangeEvent<HTMLInputElement>) => {
		const picked = Array.from(event.target.files ?? []).map((file, index) => ({
			id: `${file.name}-${index}-${file.size}`,
			name: file.name,
			previewUrl: URL.createObjectURL(file),
		}));
		setPending((prev) => [...prev, ...picked]);
		event.target.value = "";
	};

	const handleUpload = () => {
		if (pending.length === 0) {
			showToast("error", t(localizationConstants.machineCreateNoPhotosPicked));
			return;
		}
		onAddPhotos(pending);
		// Ownership of the object URLs moves to the gallery, so drop them here
		// without revoking.
		setPending([]);
		showToast("success", t(localizationConstants.machineCreatePhotosUploaded));
	};

	return (
		<Card>
			<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium">
					<Folder className="h-5 w-5 text-slate-700" />
					<Translate text={localizationConstants.machineCreateDocumentsCard} />
				</CardTitle>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				<div className="flex flex-col gap-1">
					<p className="text-sm font-medium text-slate-900">
						<Translate
							text={localizationConstants.machineCreateUploadImagesLabel}
						/>
					</p>
					<p className="text-xs text-slate-500">
						<Translate
							text={localizationConstants.machineCreateUploadImagesHint}
						/>
					</p>

					<div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="flex min-h-10 flex-1 cursor-pointer flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-left"
						>
							{pending.length === 0 ? (
								<span className="text-sm text-slate-400">
									<Translate
										text={localizationConstants.machineCreateChoosePhotos}
									/>
								</span>
							) : (
								pending.map((file) => (
									<span
										key={file.id}
										className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
									>
										{file.name}
										<span
											role="button"
											tabIndex={0}
											aria-label={t(localizationConstants.actionDelete)}
											onClick={(event) => {
												event.stopPropagation();
												setPending((prev) =>
													prev.filter((f) => f.id !== file.id)
												);
											}}
											onKeyDown={(event) => {
												if (event.key === "Enter" || event.key === " ") {
													event.stopPropagation();
													setPending((prev) =>
														prev.filter((f) => f.id !== file.id)
													);
												}
											}}
											className="cursor-pointer text-slate-500 hover:text-slate-900"
										>
											<X className="h-3 w-3" />
										</span>
									</span>
								))
							)}
						</button>

						<input
							ref={fileInputRef}
							type="file"
							multiple
							accept={ACCEPTED_IMAGE_TYPES}
							onChange={handleFilesPicked}
							className="hidden"
						/>

						<Button
							type="button"
							onClick={handleUpload}
							className="h-10 cursor-pointer bg-[#111721] px-5 text-sm font-medium text-white hover:bg-slate-800"
						>
							<Translate
								text={localizationConstants.machineCreateUploadButton}
							/>
						</Button>
					</div>
				</div>

				<div className="flex flex-col gap-3 border-t border-slate-200 pt-5">
					<h3 className="text-sm font-medium text-slate-900">
						<Translate text={localizationConstants.machineCreateImagesSection} />
					</h3>

					{photos.length === 0 ? (
						<p className="py-8 text-center text-sm text-slate-500">
							<Translate text={localizationConstants.machineCreateNoPhotos} />
						</p>
					) : (
						<ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
							{photos.map((photo) => (
								<li key={photo.id} className="flex flex-col items-center gap-1">
									<div className="relative w-full">
										<div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100">
											{photo.previewUrl ? (
												<Image
													src={photo.previewUrl}
													alt={photo.name}
													width={160}
													height={120}
													unoptimized
													className="h-full w-full object-cover"
												/>
											) : (
												<ImageIcon className="h-7 w-7 text-slate-400" />
											)}
										</div>
										<button
											type="button"
											aria-label={t(
												localizationConstants.machineCreateRemovePhoto
											)}
											onClick={() => onRemovePhoto(photo.id)}
											className="absolute -right-2 -top-2 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-slate-700 text-white shadow-sm hover:bg-slate-900"
										>
											<X className="h-3 w-3" />
										</button>
									</div>
									<span className="truncate text-xs text-slate-600">
										{photo.name}
									</span>
								</li>
							))}
						</ul>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
