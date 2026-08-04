"use client";

import { Check, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";
import { CompanyMessage } from "../constants/mockData";

const initials = (name: string) =>
	name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((part) => part[0]?.toUpperCase())
		.join("");

const ViewMessageDialog = ({
	message,
	onClose,
}: {
	message: CompanyMessage | null;
	onClose: () => void;
}) => (
	<Dialog open={!!message} onOpenChange={(value) => !value && onClose()}>
		<DialogContent className="max-h-[90vh] max-w-xl overflow-y-auto rounded-lg bg-white p-7">
			{message && (
				<div className="flex flex-col gap-4">
					<DialogTitle className="text-2xl font-bold text-slate-900">
						<Translate
							text={localizationConstants.companyMsgViewTitle}
						/>
					</DialogTitle>

					<div className="flex items-center justify-between gap-3">
						<p className="text-sm text-slate-500">
							<Translate
								text={localizationConstants.companyMsgSentAt}
							/>{" "}
							{message.sentTime} | {message.sentDate}
						</p>
						{message.status === "read" && (
							<span className="flex items-center gap-1 rounded-full border border-green-400 px-2.5 py-0.5 text-xs font-medium text-green-600">
								<Check className="h-3 w-3" />
								<Translate
									text={
										localizationConstants.companyMsgStatusRead
									}
								/>
							</span>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium text-slate-900">
							<Translate
								text={localizationConstants.companyMsgRecipient}
							/>
						</Label>
						<div className="flex h-11 items-center justify-between gap-2 rounded-md border border-slate-200 px-3">
							<span className="flex items-center gap-2 text-sm">
								<span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-[10px] font-semibold text-orange-500">
									{initials(message.recipientName)}
								</span>
								<span className="font-medium text-slate-900">
									{message.recipientName}
								</span>
								<span className="text-slate-500">
									{message.recipientHandle}
								</span>
							</span>
							<ChevronDown className="h-4 w-4 text-slate-500" />
						</div>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium text-slate-900">
							<Translate
								text={localizationConstants.myPagesEmpMessageLabel}
							/>
						</Label>
						<Textarea
							value={message.body}
							readOnly
							rows={4}
							className="border-slate-200 text-sm"
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<Label className="text-sm font-medium text-slate-900">
							<Translate
								text={localizationConstants.companyMsgFiles}
							/>
						</Label>
						<div className="flex flex-wrap items-center gap-2 rounded-md border border-slate-200 px-3 py-2.5">
							{message.files.map((file) => (
								<span
									key={file}
									className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-700"
								>
									{file}
									<X className="h-3 w-3 text-slate-400" />
								</span>
							))}
						</div>
					</div>

					<div className="flex justify-end">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="h-11 rounded-md border-slate-200 bg-white px-7 text-sm font-medium text-slate-900 hover:bg-slate-50"
						>
							<Translate text={localizationConstants.confirmClose} />
						</Button>
					</div>
				</div>
			)}
		</DialogContent>
	</Dialog>
);

export default ViewMessageDialog;
