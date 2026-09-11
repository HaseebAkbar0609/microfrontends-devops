"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { InfoField } from "@/features/purchase/components/shared/InfoFieldGrid";
import localizationConstants, {
	type TranslationKeys,
} from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { ORGANISATION_COLUMNS } from "../organisationColumns";
import type { OrganisationMember } from "../types";

export interface OrganisationDetailsDialogProps {
	member: OrganisationMember | null;
	onClose: () => void;
}

/**
 * "Öppna" — the row, read-only.
 *
 * There is nothing to save and no confirm: an organisation row carries no id
 * linking it to a supplier or customer register, so there is nowhere to
 * navigate and nothing to edit from here. Built like
 * `create/components/OrganisationInfoDialog`, whose read-only shape this is.
 *
 * The fields come from the same list the table's columns do, so the dialog
 * cannot show a field the table does not, or label one differently.
 */
export function OrganisationDetailsDialog({
	member,
	onClose,
}: OrganisationDetailsDialogProps) {
	const t = useTranslate();

	return (
		<Dialog
			open={Boolean(member)}
			onOpenChange={(open) => !open && onClose()}
		>
			<DialogContent
				showCloseButton={false}
				className="max-h-[85vh] w-[calc(100vw-2rem)] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-xl sm:w-[560px] sm:max-w-[560px] sm:p-7"
			>
				<DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
					<DialogTitle className="text-xl font-semibold text-slate-900">
						<Translate
							text={
								localizationConstants.projectCreateOrgInfoTitle
							}
						/>
					</DialogTitle>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						onClick={onClose}
						aria-label={t(localizationConstants.closeButton)}
						className="h-8 w-8 cursor-pointer text-slate-500 hover:text-slate-900"
					>
						<X className="h-4 w-4" />
					</Button>
				</DialogHeader>

				{member && (
					<dl className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
						{ORGANISATION_COLUMNS.map((column) => (
							<InfoField
								key={column.key}
								labelKey={column.label as TranslationKeys}
								value={
									member[
										column.key as keyof OrganisationMember
									]
								}
							/>
						))}
					</dl>
				)}
			</DialogContent>
		</Dialog>
	);
}

export default OrganisationDetailsDialog;
