"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { PartnerImage } from "../constants/imageBank";

type PartnerImageThumbnailProps = {
	image: PartnerImage;
	className?: string;
};

/** Square preview of a bank image. The object URL lives only while this is mounted. */
export function PartnerImageThumbnail({ image, className }: PartnerImageThumbnailProps) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	useEffect(() => {
		const url = URL.createObjectURL(image.file);
		setPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [image.file]);

	return (
		<div className={cn("relative aspect-square w-full overflow-hidden rounded-md bg-slate-100", className)}>
			{previewUrl && (
				<Image src={previewUrl} alt={image.name} fill unoptimized sizes="200px" className="object-cover" />
			)}
		</div>
	);
}
