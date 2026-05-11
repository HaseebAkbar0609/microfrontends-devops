import React from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface DropZoneProps {
	dropZoneRef: React.RefObject<HTMLDivElement | null>;
	className?: string;
}

export const DropZone = ({ dropZoneRef, className }: DropZoneProps) => {
	return (
		<div
			ref={dropZoneRef}
			className={`border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center min-h-[100px] bg-white/60 transition-all duration-200 ${className ?? ""}`}
		>
			<span className="text-slate-400 text-sm font-medium">
				<Translate text={localizationConstants.placeHere} />
			</span>
		</div>
	);
};
