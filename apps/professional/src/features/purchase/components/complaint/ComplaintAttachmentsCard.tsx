"use client";

import Image from "next/image";
import { FileText, Image as ImageIcon, Upload } from "lucide-react";

import { PermissionGate } from "@/components/common/PermissionGate";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { openSafeUrl } from "@/lib/safeUrl";
import { showToast } from "@/lib/toast";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type {
	PurchaseComplaintAttachment,
	PurchaseComplaintAttachmentCategory,
} from "../../types/purchase.types";

/** Follows the offer module's gallery, which already solved this three-section shape. */
function documentIconSrc(name: string): string {
	const extension = name.split(".").pop()?.toLowerCase();
	return extension === "doc" || extension === "docx"
		? "/file-type-doc.png"
		: "/file-type-pdf.png";
}

const SECTIONS: {
	category: PurchaseComplaintAttachmentCategory;
	titleKey: TranslationKeys;
}[] = [
	{
		category: "image",
		titleKey: localizationConstants.offerDetailImagesTitle,
	},
	{
		category: "document",
		titleKey: localizationConstants.offerDetailDocumentTitle,
	},
	{
		category: "drawing",
		titleKey: localizationConstants.offerDetailDrawingTitle,
	},
];

function AttachmentTile({
	attachment,
	onOpen,
}: {
	attachment: PurchaseComplaintAttachment;
	onOpen: (attachment: PurchaseComplaintAttachment) => void;
}) {
	const isImage = attachment.category === "image";

	return (
		<button
			type="button"
			onClick={() => onOpen(attachment)}
			className="flex w-[108px] cursor-pointer flex-col items-center rounded-md focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:outline-none"
		>
			{isImage ? (
				<div className="flex h-[88px] w-[108px] items-center justify-center overflow-hidden rounded-md border border-slate-200 bg-slate-100">
					{attachment.thumbnailUrl ? (
						<Image
							src={attachment.thumbnailUrl}
							alt=""
							width={108}
							height={88}
							className="h-full w-full object-cover"
							unoptimized
						/>
					) : (
						<ImageIcon
							className="h-6 w-6 text-slate-400"
							aria-hidden
						/>
					)}
				</div>
			) : (
				<div className="flex h-[72px] w-[108px] items-center justify-center rounded-md">
					{/^.+\.(pdf|doc|docx)$/i.test(attachment.name) ? (
						<Image
							src={documentIconSrc(attachment.name)}
							alt=""
							width={40}
							height={40}
							className="h-10 w-10 object-contain"
						/>
					) : (
						<FileText
							className="h-10 w-10 text-slate-300"
							aria-hidden
						/>
					)}
				</div>
			)}
			<span className="mt-2 w-full truncate text-center text-xs leading-5 font-normal text-slate-500">
				{attachment.name}
			</span>
		</button>
	);
}

export interface ComplaintAttachmentsCardProps {
	attachments: PurchaseComplaintAttachment[];
}

/**
 * The record's Dokument och Bilder gallery, grouped as the frame draws it.
 *
 * Uploading has no endpoint, so the header button is shown and honestly
 * disabled rather than doing nothing; it is gated on `EDIT_PURCHASE` anyway so
 * enabling it later cannot skip the permission.
 */
export function ComplaintAttachmentsCard({
	attachments,
}: ComplaintAttachmentsCardProps) {
	const t = useTranslate();

	/**
	 * Attachment URLs go through the shared allow-list rather than a bare
	 * `window.open` — the shape TFS-925's review flagged and TFS-931 had to fix
	 * in the sibling card.
	 */
	const handleOpen = (attachment: PurchaseComplaintAttachment) => {
		if (openSafeUrl(attachment.fileUrl)) return;
		// Same shape as the wizard's rejected-file toast: the name, then why
		// nothing happened. A bare filename says nothing on its own.
		showToast(
			"info",
			`${attachment.name} — ${t(localizationConstants.complaintCreateUnavailable)}`,
		);
	};

	const populated = SECTIONS.filter((section) =>
		attachments.some((file) => file.category === section.category),
	);

	return (
		<Card className="rounded-lg border border-slate-200 bg-white shadow-none">
			<CardHeader className="flex h-14 flex-row items-center justify-between border-b border-slate-200 px-6 py-0 [.border-b]:pb-0">
				<CardTitle className="flex items-center gap-2 text-base font-medium text-slate-900">
					<FileText className="h-5 w-5 text-slate-700" aria-hidden />
					<Translate
						text={
							localizationConstants.purchaseComplaintDocsSection
						}
					/>
				</CardTitle>

				<PermissionGate permission="EDIT_PURCHASE">
					{/* Drawn in the frame, but there is no upload endpoint for a
					    saved complaint yet — shown, and honestly disabled. */}
					<Button
						type="button"
						disabled
						aria-disabled
						title={t(
							localizationConstants.complaintCreateUnavailable,
						)}
						aria-label={`${t(localizationConstants.agreementUpload)} — ${t(
							localizationConstants.complaintCreateUnavailable,
						)}`}
						className="h-10 gap-2 rounded-md bg-[#111721] px-5 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<Upload className="h-4 w-4" aria-hidden />
						<Translate
							text={localizationConstants.agreementUpload}
						/>
					</Button>
				</PermissionGate>
			</CardHeader>

			<CardContent className="p-6">
				{populated.length === 0 ? (
					<p className="py-4 text-sm text-slate-500">
						<Translate
							text={localizationConstants.agreementNoDocuments}
						/>
					</p>
				) : (
					<div className="space-y-8">
						{populated.map((section, index) => (
							<div key={section.category}>
								{index > 0 && (
									<div className="mb-8 h-px w-full bg-slate-200" />
								)}
								<section>
									<p className="mb-4 text-sm leading-5 font-medium text-slate-900">
										<Translate text={section.titleKey} />
									</p>
									<div
										className={
											section.category === "image"
												? "flex flex-wrap gap-6"
												: "flex flex-wrap gap-3"
										}
									>
										{attachments
											.filter(
												(file) =>
													file.category ===
													section.category,
											)
											.map((file) => (
												<AttachmentTile
													key={file.id}
													attachment={file}
													onOpen={handleOpen}
												/>
											))}
									</div>
								</section>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
}

export default ComplaintAttachmentsCard;
