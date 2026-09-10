"use client";

import { FileText, PlayCircle, Sheet } from "lucide-react";
import type { MessageFileKind } from "../types";

const MessageFileIcon = ({ kind }: { kind: MessageFileKind }) => {
	if (kind === "video")
		return <PlayCircle className="h-6 w-6 text-blue-500" aria-hidden />;
	if (kind === "sheet")
		return <Sheet className="h-6 w-6 text-blue-500" aria-hidden />;
	if (kind === "text")
		return <FileText className="h-6 w-6 text-blue-400" aria-hidden />;

	const label = kind === "pdf" ? "PDF" : "DOC";
	const color = kind === "pdf" ? "bg-red-600" : "bg-blue-600";
	return (
		<span className="relative inline-flex" aria-hidden>
			<FileText className="h-6 w-6 text-slate-300" />
			<span
				className={`absolute -bottom-0.5 -left-1 rounded-[3px] px-1 text-[7px] font-bold leading-3 text-white ${color}`}
			>
				{label}
			</span>
		</span>
	);
};

export default MessageFileIcon;
