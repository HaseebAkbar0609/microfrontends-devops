"use client";

import React from "react";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
interface DropZoneProps {
	dropZoneRef: React.RefObject<HTMLDivElement | null>;
	className?: string;
	labelKey?: string;
}

export const DropZone = ({
	dropZoneRef,
	className,
	labelKey = localizationConstants.placeHere,
}: DropZoneProps) => {
	return (
		<div
			ref={dropZoneRef}
			className={`border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center min-h-[100px] bg-white/60 transition-all duration-200 ${className ?? ""}`}
		>
			<span className="text-slate-400 text-sm font-medium">
				<Translate text={labelKey} />
			</span>
		</div>
	);
};
