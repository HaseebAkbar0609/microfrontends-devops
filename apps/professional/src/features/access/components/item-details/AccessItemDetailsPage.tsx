"use client";

import { useCallback, useMemo, useState } from "react";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useAccessHolders } from "../../context/AccessHoldersContext";
import { useComingSoonToast } from "../../hooks/useComingSoonToast";
import type { AccessImage } from "../../types/accessItemDetails.types";
import type { AccessItemStatusId } from "../../types/accessItems.types";
import { findAccessItem } from "../../utils/accessItems";
import { AccessAssignedCard } from "./AccessAssignedCard";
import { AccessDocumentsCard } from "./AccessDocumentsCard";
import { AccessImageDeleteDialog } from "./AccessImageDeleteDialog";
import { AccessImagesCard } from "./AccessImagesCard";
import { AccessItemObjectCard } from "./AccessItemObjectCard";

/**
 * Item details page (TFS-1104), opened from the Access tab: Access Object,
 * Assigned Access, Documents and Images. The Edit and eye buttons and Upload show
 * the coming-soon toast; the status dropdown and removing a picture work on the mock data.
 */
export function AccessItemDetailsPage({ recordId, itemId }: { recordId: string; itemId: string }) {
	const t = useTranslate();
	const { holdersFor, extraFor, setItemStatus, deleteImage } = useAccessHolders();
	const showComingSoon = useComingSoonToast();
	const [imageTarget, setImageTarget] = useState<AccessImage | null>(null);

	const found = useMemo(() => findAccessItem(holdersFor(recordId), itemId), [holdersFor, recordId, itemId]);
	const extra = extraFor(itemId);

	const changeStatus = useCallback(
		(status: AccessItemStatusId) => setItemStatus(recordId, itemId, status),
		[setItemStatus, recordId, itemId],
	);
	const confirmRemoveImage = useCallback(
		(image: AccessImage) => {
			deleteImage(itemId, image.id);
			setImageTarget(null);
			showToast("success", t(localizationConstants.accessImageDeletedToast, { name: image.caption }));
		},
		[deleteImage, itemId, t],
	);

	if (!found) {
		return (
			<p className="m-5 rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
				<Translate text={localizationConstants.accessItemNotFound} />
			</p>
		);
	}

	return (
		<div className="flex flex-col gap-4 px-5 py-5">
			<AccessItemObjectCard item={found.item} onEdit={showComingSoon} />
			<AccessAssignedCard
				item={found.item}
				holderName={found.holder.name}
				extra={extra}
				onStatusChange={changeStatus}
				onViewDocument={showComingSoon}
				onEdit={showComingSoon}
			/>
			<AccessDocumentsCard documents={extra.documents} onView={showComingSoon} />
			<AccessImagesCard images={extra.images} onRemove={setImageTarget} />
			<AccessImageDeleteDialog target={imageTarget} onConfirm={confirmRemoveImage} onCancel={() => setImageTarget(null)} />
		</div>
	);
}
