"use client";

import { Pencil, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/dialog/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { useTranslate } from "@/utils/translation/translate";
import type { MarketingRow, MarketingSection } from "../../types";
import { RegisterCell } from "./RegisterCell";

type RegisterTableRowProps = {
	section: MarketingSection;
	row: MarketingRow;
	onEdit: () => void;
	onDelete: () => void;
};

export function RegisterTableRow({
	section,
	row,
	onEdit,
	onDelete,
}: RegisterTableRowProps) {
	const t = useTranslate();

	return (
		<TableRow>
			{section.fields.map((field) => (
				<TableCell key={field.name} className={field.width}>
					<RegisterCell field={field} values={row.values} />
				</TableCell>
			))}
			<TableCell className="text-right">
				<div className="flex items-center justify-end gap-1">
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label={t(localizationConstants.marketingEditAction)}
						onClick={onEdit}
						className="size-8 cursor-pointer"
					>
						<Pencil className="size-4" aria-hidden />
					</Button>
					<ConfirmDialog
						title={t(localizationConstants.marketingConfirmDeleteTitle)}
						description={t(
							localizationConstants.marketingConfirmDeleteDescription,
						)}
						confirmText={t(localizationConstants.marketingConfirmLabel)}
						cancelText={t(localizationConstants.marketingCancelButton)}
						onConfirm={onDelete}
						trigger={
							<Button
								type="button"
								variant="ghost"
								size="icon"
								aria-label={t(localizationConstants.marketingDeleteAction)}
								className="size-8 cursor-pointer"
							>
								<Trash2 className="size-4" aria-hidden />
							</Button>
						}
					/>
				</div>
			</TableCell>
		</TableRow>
	);
}

export default RegisterTableRow;
