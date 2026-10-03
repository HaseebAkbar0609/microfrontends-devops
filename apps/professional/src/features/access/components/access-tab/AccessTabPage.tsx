"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/toast";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { useAccessHolders } from "../../context/AccessHoldersContext";
import { accessItemUrl } from "../../data/accessNav.config";
import { AccessHolderSection } from "./AccessHolderSection";
import { AccessItemDeleteDialog, type AccessDeleteTarget } from "./AccessItemDeleteDialog";

/**
 * "Access" tab of the details page (TFS-1103): an accordion per person with
 * their items. The eye icon opens the item's details page (TFS-1104).
 */
export function AccessTabPage({ recordId }: { recordId: string }) {
	const t = useTranslate();
	const { holdersFor, deleteItem, deleteHolder } = useAccessHolders();
	const router = useRouter();
	const [target, setTarget] = useState<AccessDeleteTarget | null>(null);
	const holders = holdersFor(recordId);

	const confirmDelete = useCallback(
		(confirmed: AccessDeleteTarget) => {
			if (confirmed.kind === "item") {
				deleteItem(recordId, confirmed.item.id);
				showToast("success", t(localizationConstants.accessItemDeletedToast, { id: confirmed.item.nycId }));
			} else {
				deleteHolder(recordId, confirmed.holder.id);
				showToast("success", t(localizationConstants.accessHolderDeletedToast, { name: confirmed.holder.name }));
			}
			setTarget(null);
		},
		[recordId, deleteItem, deleteHolder, t],
	);

	return (
		<div className="flex flex-col gap-4 px-5 py-5">
			{holders.length === 0 ? (
				<p className="rounded-xl border border-slate-200 bg-white px-4 py-8 text-center text-sm text-slate-500">
					<Translate text={localizationConstants.accessHoldersEmpty} />
				</p>
			) : (
				holders.map((holder, index) => (
					<AccessHolderSection
						key={holder.id}
						holder={holder}
						defaultOpen={index === 0}
						onViewItem={(item) => router.push(accessItemUrl(recordId, item.id))}
						onDeleteItem={(item) => setTarget({ kind: "item", holder, item })}
						onDeleteAll={() => setTarget({ kind: "holder", holder })}
					/>
				))
			)}
			<AccessItemDeleteDialog target={target} onConfirm={confirmDelete} onCancel={() => setTarget(null)} />
		</div>
	);
}
