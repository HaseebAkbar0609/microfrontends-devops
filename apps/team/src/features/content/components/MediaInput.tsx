"use client";

import { useRef } from "react";
import Image from "next/image";
import { ImagePlus, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showToast } from "@/lib/toast";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import {
	IMAGE_ACCEPT,
	VIDEO_ACCEPT,
} from "../constants/content.constants";
import { readMediaFiles } from "../utils/mediaValues";

type MediaInputProps = {
	id?: string;
	/** Data URLs. Never the prototype's `"|||"`-joined string. */
	value: string[];
	onChange: (value: string[]) => void;
	multiple?: boolean;
	kind?: "image" | "video";
	/** Overrides the default "upload image(s)" button label. */
	uploadLabelKey?: TranslationKeys;
};

function defaultLabelKey(kind: "image" | "video", multiple: boolean) {
	if (kind === "video") return localizationConstants.contentUploadVideo;
	return multiple
		? localizationConstants.contentUploadImages
		: localizationConstants.contentUploadImage;
}

/**
 * File picker with inline previews. Files are held as data URLs because there
 * is no upload endpoint yet; oversized ones are rejected with a toast rather
 * than silently bloating React state.
 */
export function MediaInput({
	id,
	value,
	onChange,
	multiple = false,
	kind = "image",
	uploadLabelKey,
}: MediaInputProps) {
	const inputRef = useRef<HTMLInputElement>(null);
	const t = useTranslate();
	const buttonLabel = t(uploadLabelKey ?? defaultLabelKey(kind, multiple));
	const removeLabel = t(localizationConstants.contentRemoveMedia);

	const handleFiles = async (files: FileList | null) => {
		if (!files?.length) return;
		const { dataUrls, rejected } = await readMediaFiles(files);
		if (rejected.length > 0) {
			showToast(
				"error",
				`${t(localizationConstants.contentMediaTooLargeToast)}: ${rejected.join(", ")}`,
			);
		}
		if (dataUrls.length === 0) return;
		onChange(multiple ? [...value, ...dataUrls] : dataUrls.slice(0, 1));
	};

	return (
		<div className="flex flex-col gap-3">
			<input
				id={id}
				ref={inputRef}
				type="file"
				accept={kind === "video" ? VIDEO_ACCEPT : IMAGE_ACCEPT}
				multiple={multiple}
				className="hidden"
				onChange={(event) => {
					void handleFiles(event.target.files);
					event.target.value = "";
				}}
			/>

			<Button
				type="button"
				variant="outline"
				size="sm"
				className="w-fit cursor-pointer"
				onClick={() => inputRef.current?.click()}
			>
				{kind === "video" ? (
					<Video className="size-4" aria-hidden />
				) : (
					<ImagePlus className="size-4" aria-hidden />
				)}
				{buttonLabel}
			</Button>

			{value.length > 0 && (
				<ul className="flex flex-wrap gap-2">
					{value.map((source, index) => (
						<li key={source.slice(-32) + index} className="relative">
							{kind === "video" ? (
								<video
									src={source}
									controls
									className="h-24 w-40 rounded-md border border-slate-200 object-cover"
								/>
							) : (
								<Image
									src={source}
									alt={`${buttonLabel} ${index + 1}`}
									width={96}
									height={96}
									unoptimized
									className="size-24 rounded-md border border-slate-200 object-cover"
								/>
							)}
							<Button
								type="button"
								variant="outline"
								size="icon"
								aria-label={removeLabel}
								className="absolute -top-2 -right-2 size-6 cursor-pointer rounded-full bg-white"
								onClick={() =>
									onChange(value.filter((_, position) => position !== index))
								}
							>
								<X className="size-3" aria-hidden />
							</Button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

export default MediaInput;
