"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/modal";
import localizationConstants from "@/utils/translation/constants";
import { useLifecyclePopups } from "../hooks/useLifecyclePopups";
import { LIFECYCLE_UPGRADE_PATH } from "../constants";

/**
 * Shows the oldest unacknowledged Demo/Trial reminder popup, one at a time,
 * app-wide. Title/body come pre-rendered from tfs-backend (reminder copy
 * lives server-side — see reminder_dispatch_service.py — so no translation
 * keys are needed for them here, only for the modal chrome).
 */
export function AccountLifecyclePopup() {
	const { t } = useTranslation();
	const { popups, acknowledge, isAcknowledging } = useLifecyclePopups();

	const current = popups[popups.length - 1];
	if (!current) return null;

	return (
		<ModalWrapper
			open
			onOpenChange={(open) => {
				if (!open) acknowledge(current.id);
			}}
			title={current.title}
			footer={
				<div className="flex w-full items-center justify-end gap-2">
					<Button
						size="sm"
						variant="outline"
						disabled={isAcknowledging}
						onClick={() => acknowledge(current.id)}
					>
						{t(localizationConstants.lifecyclePopupDismiss)}
					</Button>
					<Button
						asChild
						size="sm"
						onClick={() => acknowledge(current.id)}
					>
						{/* Route within this app, not the backend's deep_link, which
						currently points at a path this app doesn't have — see the
						note in AccountLifecyclePopup's summary before wiring
						deep_link through directly. */}
						<Link href={LIFECYCLE_UPGRADE_PATH}>
							{t(localizationConstants.lifecycleUpgradeCta)}
						</Link>
					</Button>
				</div>
			}
		>
			<p className="text-sm text-slate-600">{current.body}</p>
		</ModalWrapper>
	);
}
