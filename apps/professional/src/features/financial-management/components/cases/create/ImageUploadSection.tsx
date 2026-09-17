"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { Image as ImageIcon, X, ChevronDown, Plus } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { CaseDocument } from "../../../types/cases.types";

interface ImageUploadSectionProps {
	images: CaseDocument[];
	onAddImage: (img: CaseDocument) => void;
	onRemoveImage: (id: string) => void;
}

function formatBytes(bytes: number): string {
	if (bytes === 0) return "0 B";
	const k = 1024;
	const sizes = ["B", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function ImageUploadSection({
	images,
	onAddImage,
	onRemoveImage,
}: ImageUploadSectionProps) {
	const imageInputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;

		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const newImg: CaseDocument = {
				id: crypto.randomUUID(),
				name: file.name,
				date: new Date().toISOString().split("T")[0],
				fileType: file.type || "image/png",
				fileSize: formatBytes(file.size),
				url: URL.createObjectURL(file),
				category: "image",
			};
			onAddImage(newImg);
		}

		if (imageInputRef.current) {
			imageInputRef.current.value = "";
		}
	};

	return (
		<div className="bg-white border border-slate-200 rounded-xl p-6 shadow-2xs space-y-4">
			<div className="flex items-center gap-2 border-b border-slate-100 pb-3">
				<ImageIcon className="w-4 h-4 text-slate-700" />
				<h2 className="text-sm font-bold text-slate-900">
					<Translate text={localizationConstants.casesImagesSectionTitle} />
				</h2>
			</div>

			<div className="space-y-0.5">
				<p className="text-xs font-semibold text-slate-800">
					<Translate text={localizationConstants.casesUploadImages} />
				</p>
				<p className="text-[11px] text-slate-400">
					<Translate text={localizationConstants.casesImageFormats} />
				</p>
			</div>

			<input
				ref={imageInputRef}
				type="file"
				multiple
				accept="image/*"
				className="hidden"
				onChange={handleImageChange}
			/>

			{/* Image picker selector button matching Figma */}
			<div className="flex flex-wrap items-center gap-3 pt-1">
				<button
					type="button"
					onClick={() => imageInputRef.current?.click()}
					className="flex-1 min-w-[280px] h-[38px] px-3 bg-white border border-slate-200 hover:border-slate-300 rounded-lg flex items-center justify-between gap-2 text-xs text-slate-600 cursor-pointer transition-colors"
				>
					<span className="flex items-center gap-1.5 text-slate-500">
						<Plus className="w-3.5 h-3.5 text-slate-400" />
						<Translate text={localizationConstants.casesSelectImages} />
					</span>
					<ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
				</button>

				<button
					type="button"
					onClick={() => imageInputRef.current?.click()}
					className="h-[38px] px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
				>
					<Translate text={localizationConstants.casesBtnUpload} />
				</button>
			</div>

			{/* Thumbnail card gallery matching Figma Image 4 */}
			<div className="pt-2 space-y-2">
				<p className="text-xs font-semibold text-slate-800">
					<Translate text={localizationConstants.casesTabDocuments} />
				</p>
				{images.length === 0 ? (
					<div className="p-6 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
						<Translate text={localizationConstants.casesNoAttachments} />
					</div>
				) : (
					<div className="flex flex-wrap gap-4">
						{images.map((img) => (
							<div
								key={img.id}
								className="relative group w-32 border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-2xs"
							>
								<button
									type="button"
									onClick={() => onRemoveImage(img.id)}
									className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center cursor-pointer transition-colors"
									aria-label="Remove image"
								>
									<X className="w-3 h-3" />
								</button>

								<div className="relative h-24 bg-slate-200 flex items-center justify-center overflow-hidden">
									{img.url ? (
										<Image
											src={img.url}
											alt={img.name}
											fill
											unoptimized
											className="object-cover"
										/>
									) : (
										<div className="w-full h-full bg-slate-300 flex items-center justify-center text-slate-500">
											<ImageIcon className="w-8 h-8 opacity-40" />
										</div>
									)}
								</div>
								<div className="p-2 bg-white text-center border-t border-slate-100">
									<span className="text-[11px] text-slate-700 font-medium truncate block">
										{img.name}
									</span>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

export default ImageUploadSection;
