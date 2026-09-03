"use client";

import { Folders } from "lucide-react";

import {
	MultiFileUploadField,
	type PendingUploadFile,
} from "@/components/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export interface GoodsUploadCardProps {
	pendingFiles: PendingUploadFile[];
	onSelectFiles: (files: File[]) => void;
	onRemovePending: (name: string) => void;
	onUpload: () => void;
	gdprAccepted: boolean;
	onGdprChange: (accepted: boolean) => void;
}

/**
 * The frame's second card: file upload plus the GDPR consent line.
 *
 * The accepted types match the copy above the control, and the same list the
 * complaint wizard uses.
 */
export function GoodsUploadCard({
	pendingFiles,
	onSelectFiles,
	onRemovePending,
	onUpload,
	gdprAccepted,
	onGdprChange,
}: GoodsUploadCardProps) {
	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
			<CardHeader className="flex h-14 flex-row items-center border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium">
					<Folders className="h-5 w-5 text-slate-700" />
					<Translate
						text={localizationConstants.agreementDocuments}
					/>
				</CardTitle>
			</CardHeader>

			<CardContent className="p-6">
				<p className="mb-1 text-sm font-medium text-slate-900">
					<Translate
						text={localizationConstants.agreementUploadFiles}
					/>
				</p>
				<p className="mb-3 text-sm text-slate-500">
					<Translate
						text={localizationConstants.agreementFileTypes}
					/>
				</p>

				<MultiFileUploadField
					pendingFiles={pendingFiles}
					onSelectFiles={onSelectFiles}
					onRemovePending={onRemovePending}
					onUpload={onUpload}
					accept=".png,.jpg,.jpeg,.pdf"
				/>

				<label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
					<Checkbox
						checked={gdprAccepted}
						onCheckedChange={(next) => onGdprChange(!!next)}
						className="mt-0.5 border-slate-400 data-[state=checked]:border-black data-[state=checked]:bg-black"
					/>
					<span>
						<Translate
							text={localizationConstants.complaintGdprText}
						/>{" "}
						{/* Styled as a link until TFS-934, matching the complaint card's
						    fix in TFS-931: there is no privacy-policy route in
						    this app, so the text advertised a destination that
						    did not exist. */}
						<span className="font-medium text-slate-900">
							<Translate
								text={localizationConstants.complaintGdprLink}
							/>
						</span>{" "}
						<Translate
							text={localizationConstants.complaintGdprHere}
						/>
					</span>
				</label>
			</CardContent>
		</Card>
	);
}

export default GoodsUploadCard;
