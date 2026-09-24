"use client";

import React from "react";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { PptFileIcon } from "@/components/ui/PptFileIcon";
import { Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { KalkylDocItem } from "../types/kalkyl";

export interface KalkylDocIconProps {
	fileType?: KalkylDocItem["fileType"] | string;
	fileName?: string;
	className?: string;
}

export function KalkylDocIcon({
	fileType,
	fileName = "",
	className = "h-8 w-6 shrink-0",
}: KalkylDocIconProps) {
	const lower = (fileName || "").toLowerCase();
	const ext = lower.split(".").pop() || "";

	if (fileType === "doc" || ext === "doc" || ext === "docx") {
		return <DocFileIcon className={className} />;
	}
	if (fileType === "ppt" || ext === "ppt" || ext === "pptx") {
		return <PptFileIcon className={className} />;
	}
	if (
		fileType === "img" ||
		ext === "png" ||
		ext === "jpg" ||
		ext === "jpeg" ||
		ext === "webp" ||
		ext === "svg"
	) {
		return <ImageIcon className={cn("text-emerald-600", className)} />;
	}
	return <PdfFileIcon className={className} />;
}

export default KalkylDocIcon;
