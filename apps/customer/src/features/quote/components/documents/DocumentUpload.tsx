import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { useTranslate, Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useState, useRef } from "react";
import { ProjectDocument } from "../../types/types";

interface DocumentUploadProps {
	onUpload: (docs: ProjectDocument[]) => void;
}

export function DocumentUpload({ onUpload }: DocumentUploadProps) {
	const t = useTranslate();
	const [files, setFiles] = useState<File[]>([]);
	const [comments, setComments] = useState("");
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
		}
	};

	const removeFile = (index: number) => {
		setFiles((prev) => prev.filter((_, i) => i !== index));
	};

	const handleSave = () => {
		if (files.length === 0) return;

		const newDocs: ProjectDocument[] = files.map((file) => ({
			id: Math.random().toString(36).substr(2, 9),
			date: new Date().toISOString().split("T")[0],
			name: file.name,
			comments: comments,
			fileType: file.name.split(".").pop()?.toUpperCase() || "FILE",
		}));

		onUpload(newDocs);
		setFiles([]);
		setComments("");
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	return (
		<div className="space-y-4">
			<div className="space-y-1">
				<label className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.uploadYourFilesLabel} />
				</label>
				<p className="text-sm text-slate-500">
					<Translate text={localizationConstants.allowedFilesLabel} />
				</p>
			</div>

			<div className="flex items-center gap-4">
				{/* Hidden File Input */}
				<input
					type="file"
					multiple
					ref={fileInputRef}
					onChange={handleFileSelect}
					className="hidden"
					accept=".pdf,.png,.jpg,.jpeg"
				/>

				{/* File Display Area */}
				<div className="flex-1 flex items-center justify-between min-h-[44px] border border-slate-200 rounded-md px-3 bg-white">
					<div className="flex flex-wrap gap-2 py-1.5">
						{files.length > 0 ? (
							files.map((file, index) => (
								<span
									key={index}
									className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-xs font-medium text-slate-700"
								>
									{file.name}
									<X
										className="h-3 w-3 cursor-pointer text-slate-400 hover:text-slate-600"
										onClick={(e) => {
											e.stopPropagation();
											removeFile(index);
										}}
									/>
								</span>
							))
						) : (
							<span className="text-sm text-slate-400">
								<Translate text={localizationConstants.noFileChosen} />
							</span>
						)}
					</div>
					<ChevronDown className="h-4 w-4 text-slate-400 mr-1" />
				</div>

				<Button
					className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-8 rounded-md font-medium"
					onClick={() => fileInputRef.current?.click()}
				>
					<Translate text={localizationConstants.upload} />
				</Button>
			</div>

			<div className="space-y-2 pt-2">
				<label className="text-sm font-semibold text-slate-900">
					<Translate text={localizationConstants.comments} />
				</label>
				<Textarea
					placeholder={t(localizationConstants.writeDescriptionPlaceholder)}
					className="min-h-[100px] resize-none border-slate-200"
					value={comments}
					onChange={(e) => setComments(e.target.value)}
				/>
			</div>

			<div className="flex justify-end pt-2">
				<Button
					className="bg-slate-900 hover:bg-slate-800 text-white h-11 px-8 rounded-md font-medium"
					onClick={handleSave}
					disabled={files.length === 0}
				>
					<Translate text={localizationConstants.save} />
				</Button>
			</div>
		</div>
	);
}
