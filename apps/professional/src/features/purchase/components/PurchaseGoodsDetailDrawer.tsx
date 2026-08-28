"use client";

import Image from "next/image";
import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type {
	PurchaseGoodsAttachment,
	PurchaseGoodsReceptionRow,
} from "../types/purchase.types";
import { PurchaseGoodsCategoryBadge } from "./PurchaseBadges";

export interface PurchaseGoodsDetailDrawerProps {
	reception: PurchaseGoodsReceptionRow | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/** SEK, because every other money value in this app is SEK. */
const priceFormatter = new Intl.NumberFormat("sv-SE", {
	style: "currency",
	currency: "SEK",
	maximumFractionDigits: 0,
});

/**
 * Attachments come from the mock today and from an API later, so the href is
 * checked before it is rendered: only http(s) and the blob: URLs a session
 * upload produces become links. Anything else — `javascript:` above all — falls
 * back to plain text.
 */
function safeAttachmentHref(url?: string): string | undefined {
	if (!url) return undefined;
	try {
		const { protocol } = new URL(url, window.location.origin);
		return ["http:", "https:", "blob:"].includes(protocol)
			? url
			: undefined;
	} catch {
		return undefined;
	}
}

function Field({
	label,
	children,
}: {
	label: TranslationKeys;
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col gap-1 py-2">
			<dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">
				<Translate text={label} />
			</dt>
			<dd className="text-sm text-slate-900">{children}</dd>
		</div>
	);
}

function Section({
	title,
	children,
}: {
	title: TranslationKeys;
	children: React.ReactNode;
}) {
	return (
		<section className="border-t border-slate-200 px-6 py-4 first:border-t-0">
			<h3 className="mb-1 text-sm font-semibold text-slate-900">
				<Translate text={title} />
			</h3>
			<dl className="divide-y divide-slate-100">{children}</dl>
		</section>
	);
}

function AttachmentRow({
	attachment,
	downloadLabel,
}: {
	attachment: PurchaseGoodsAttachment;
	downloadLabel: string;
}) {
	const href = safeAttachmentHref(attachment.url);

	return (
		<li className="flex items-center justify-between gap-3 py-2">
			<span className="flex min-w-0 items-center gap-2">
				<Image
					src={
						attachment.fileType === "pdf"
							? "/file-type-pdf.png"
							: "/file-type-doc.png"
					}
					alt=""
					width={28}
					height={32}
					className="h-8 w-7 shrink-0 object-contain"
				/>
				<span className="truncate text-sm text-slate-700">
					{attachment.name}
				</span>
			</span>

			{href ? (
				<Button
					asChild
					variant="outline"
					size="sm"
					className="h-8 shrink-0 cursor-pointer rounded-md border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-100"
				>
					<a
						href={href}
						target="_blank"
						rel="noopener noreferrer"
						aria-label={`${downloadLabel} ${attachment.name}`}
					>
						<Download className="h-3.5 w-3.5" aria-hidden />
						<Translate
							text={localizationConstants.purchaseGoodsDownload}
						/>
					</a>
				</Button>
			) : (
				<span className="shrink-0 text-xs text-slate-400 uppercase">
					{attachment.fileType}
				</span>
			)}
		</li>
	);
}

/**
 * Goods detail panel, per the ticket description's "Item Details (Drawer)":
 * general info, pricing and logistics, attachments.
 *
 * Built on the shared `Dialog` primitives — this app has no sheet component —
 * so it keeps the focus trap, escape handling and overlay, and only the
 * positioning is overridden.
 */
export function PurchaseGoodsDetailDrawer({
	reception,
	open,
	onOpenChange,
}: PurchaseGoodsDetailDrawerProps) {
	const t = useTranslate();

	if (!reception) return null;

	const downloadLabel = t(localizationConstants.purchaseGoodsDownload);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="top-0 right-0 left-auto h-full max-h-screen w-full max-w-md translate-x-0 translate-y-0 gap-0 overflow-y-auto rounded-none border-l bg-white p-0 sm:max-w-md">
				<DialogHeader className="border-b border-slate-200 px-6 py-4">
					<DialogTitle className="text-base font-semibold text-slate-900">
						{reception.name}
					</DialogTitle>
					<DialogDescription className="text-sm text-slate-500">
						{reception.purchaseNo} · {reception.supplier}
					</DialogDescription>
				</DialogHeader>

				<Section
					title={localizationConstants.purchaseGoodsGeneralInfo}
				>
					<Field label={localizationConstants.purchaseColName}>
						{reception.name}
					</Field>
					<Field
						label={localizationConstants.purchaseGoodsColDescription}
					>
						{reception.description}
					</Field>
					<Field
						label={localizationConstants.purchaseGoodsColCategory}
					>
						<PurchaseGoodsCategoryBadge
							category={reception.category}
						/>
					</Field>
					<Field label={localizationConstants.purchaseGoodsColSku}>
						{reception.sku}
					</Field>
				</Section>

				<Section
					title={localizationConstants.purchaseGoodsPricingLogistics}
				>
					<Field
						label={localizationConstants.purchaseGoodsColUnitPrice}
					>
						{priceFormatter.format(reception.unitPrice)}
					</Field>
					<Field
						label={localizationConstants.purchaseGoodsBulkDiscounts}
					>
						{reception.bulkDiscounts.length === 0 ? (
							<span className="text-slate-400">
								<Translate
									text={
										localizationConstants.purchaseGoodsNoDiscounts
									}
								/>
							</span>
						) : (
							<ul className="space-y-1">
								{reception.bulkDiscounts.map((tier) => (
									<li key={tier.quantity}>
										{tier.quantity}{" "}
										<Translate
											text={
												localizationConstants.purchaseGoodsUnitsShort
											}
										/>{" "}
										· −{tier.percentage}&nbsp;%
									</li>
								))}
							</ul>
						)}
					</Field>
					<Field
						label={localizationConstants.purchaseGoodsColLeadTime}
					>
						{reception.leadTimeDays}{" "}
						<Translate
							text={localizationConstants.purchaseGoodsDays}
						/>
					</Field>
					<Field label={localizationConstants.purchaseGoodsColMoq}>
						{reception.minimumOrderQuantity}{" "}
						<Translate
							text={localizationConstants.purchaseGoodsUnitsShort}
						/>
					</Field>
					<Field
						label={
							localizationConstants.purchaseGoodsReceptionColExpectedDelivery
						}
					>
						{reception.expectedDelivery}
					</Field>
				</Section>

				<Section
					title={localizationConstants.purchaseGoodsAttachments}
				>
					{reception.attachments.length === 0 ? (
						<p className="py-2 text-sm text-slate-400">
							<Translate
								text={
									localizationConstants.purchaseGoodsNoAttachments
								}
							/>
						</p>
					) : (
						<ul className="divide-y divide-slate-100">
							{reception.attachments.map((attachment) => (
								<AttachmentRow
									key={attachment.id}
									attachment={attachment}
									downloadLabel={downloadLabel}
								/>
							))}
						</ul>
					)}
				</Section>
			</DialogContent>
		</Dialog>
	);
}

export default PurchaseGoodsDetailDrawer;
