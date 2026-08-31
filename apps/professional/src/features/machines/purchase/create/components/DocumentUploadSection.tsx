import React, { useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { showToast } from "@/lib/toast";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per file
const ALLOWED_EXTENSIONS = ["pdf", "png", "jpg", "jpeg", "doc", "docx"];
const ALLOWED_MIME_TYPES = [
	"application/pdf",
	"image/png",
	"image/jpeg",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

interface DocumentUploadSectionProps {
	stagedFiles: string[];
	onAddFiles: (files: File[]) => void;
	onRemoveStagedFile: (index: number) => void;
}

export function DocumentUploadSection({
	stagedFiles,
	onAddFiles,
	onRemoveStagedFile,
}: DocumentUploadSectionProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = e.target.files;
		if (!selectedFiles || selectedFiles.length === 0) return;

		const validFiles: File[] = [];

		for (let i = 0; i < selectedFiles.length; i++) {
			const file = selectedFiles[i];
			const ext = file.name.split(".").pop()?.toLowerCase() || "";

			// Check file size (5MB max)
			if (file.size > MAX_FILE_SIZE) {
				showToast("error", `Filen "${file.name}" överskrider maxstorleken på 5 MB`);
				continue;
			}

			// Check MIME type / extension
			if (
				!ALLOWED_EXTENSIONS.includes(ext) &&
				!ALLOWED_MIME_TYPES.includes(file.type)
			) {
				showToast(
					"error",
					`Filen "${file.name}" har ett otillåtet format. Endast PDF, PNG, JPG och DOC tillåts.`
				);
				continue;
			}

			validFiles.push(file);
		}

		if (validFiles.length > 0) {
			onAddFiles(validFiles);
		}

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleTriggerUpload = () => {
		fileInputRef.current?.click();
	};

	return (
		<div className="mb-6 flex flex-col gap-2">
			<div>
				<h4 className="text-xs font-semibold text-slate-900">
					<Translate text={localizationConstants.machinePurchaseUploadSubtitle} />
				</h4>
				<p className="text-[11px] text-slate-400">
					<Translate text={localizationConstants.machinePurchaseUploadHelper} /> (Max 5 MB)
				</p>
			</div>

			<div className="flex items-center gap-2">
				<div className="flex-1 flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 min-h-[42px]">
					{stagedFiles.length === 0 ? (
						<span className="text-xs text-slate-400 italic px-2">
							Inga filer valda ännu. Klicka på Ladda upp för att välja filer.
						</span>
					) : (
						stagedFiles.map((fileName, idx) => (
							<span
								key={`${fileName}-${idx}`}
								className="inline-flex items-center gap-1.5 rounded bg-slate-50 px-2.5 py-1 text-xs text-slate-700 border border-slate-200 shadow-2xs"
							>
								{fileName}
								<button
									type="button"
									onClick={() => onRemoveStagedFile(idx)}
									className="text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
									aria-label={`Ta bort ${fileName}`}
								>
									<X className="h-3 w-3" />
								</button>
							</span>
						))
					)}
				</div>

				<input
					type="file"
					ref={fileInputRef}
					onChange={handleFileChange}
					multiple
					accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
					className="hidden"
					aria-label="Ladda upp filer"
				/>

				<Button
					type="button"
					onClick={handleTriggerUpload}
					className="rounded-lg bg-[#111721] text-white hover:bg-slate-800 text-xs px-5 h-[42px] font-medium cursor-pointer"
				>
					<Translate text={localizationConstants.machinePurchaseUploadButton} />
				</Button>
			</div>
		</div>
	);
}
