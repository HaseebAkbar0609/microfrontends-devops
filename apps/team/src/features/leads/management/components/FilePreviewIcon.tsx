"use client";

import Image from "next/image";
import { FileText } from "lucide-react";

type FilePreviewIconProps = {
	fileType?: string;
	className?: string;
};

export default function FilePreviewIcon({
	fileType,
	className = "h-10 w-10",
}: FilePreviewIconProps) {
	const normalizedFileType = fileType?.trim().toUpperCase() || "FILE";

	if (normalizedFileType === "PDF") {
		return (
			<span className={className}>
				<Image
					alt="PDF file"
					src="/assets/icons/file-pdf-icon.svg"
					height={40}
					width={40}
				/>
			</span>
		);
	}

	return (
		<span
			className={`inline-flex ${className} flex-col items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-600`}
		>
			<FileText className="size-4" />
			<span className="mt-0.5 text-[9px] font-semibold leading-none">
				{normalizedFileType.slice(0, 4)}
			</span>
		</span>
	);
}
