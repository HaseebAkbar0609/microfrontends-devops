"use client";

import Link from "next/link";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import localizationConstants from "@/utils/translation/constants";
import { useCanCreateContent } from "../hooks/useAccountLifecycle";
import { LIFECYCLE_UPGRADE_PATH } from "../constants";

interface ContentCreationGuardProps {
	children: React.ReactNode;
}

/**
 * Wrap a "create new X" page/form with this. Renders a blocked state instead
 * of the form once the Demo/Trial account can no longer create content.
 *
 * This is a UX convenience, not the enforcement boundary — the backend
 * rejects the write regardless (ACCOUNT_EXPIRED_READ_ONLY, see
 * axiosInstance.ts). Only wired onto CreateInvoicePage so far as a
 * demonstrated pattern; other "create" entry points should adopt the same
 * wrapper — see tfs-backend/docs/account-lifecycle-design.md's rollout
 * checklist for the equivalent backend-side list.
 */
export function ContentCreationGuard({ children }: ContentCreationGuardProps) {
	const canCreateContent = useCanCreateContent();
	const { t } = useTranslation();

	if (canCreateContent) return <>{children}</>;

	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-4 bg-slate-50 px-6 py-24 text-center">
			<div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
				<Lock className="h-6 w-6" />
			</div>
			<h2 className="text-lg font-semibold text-slate-900">
				{t(localizationConstants.lifecycleReadOnlyGuardTitle)}
			</h2>
			<p className="max-w-md text-sm text-slate-600">
				{t(localizationConstants.lifecycleReadOnlyGuardMessage)}
			</p>
			<Button asChild>
				<Link href={LIFECYCLE_UPGRADE_PATH}>
					{t(localizationConstants.lifecycleUpgradeCta)}
				</Link>
			</Button>
		</div>
	);
}
