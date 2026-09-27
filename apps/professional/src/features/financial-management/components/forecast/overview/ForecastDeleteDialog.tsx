"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import type { ForecastListRow } from "../../../types/forecastList.types";

export interface ForecastDeleteDialogProps {
	row: ForecastListRow | null;
	open: boolean;
	onClose: () => void;
	onConfirm: (row: ForecastListRow) => void;
}

/** Ta bort's confirmation, naming the forecast by its Objekt and project. */
export function ForecastDeleteDialog({ row, open, onClose, onConfirm }: ForecastDeleteDialogProps) {
	const t = useTranslate();

	return (
		<AlertDialog open={open && row !== null} onOpenChange={(next) => !next && onClose()}>
			{row && (
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							<Translate text={localizationConstants.forecastDeleteTitle} />
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t(localizationConstants.forecastDeleteDescription, { object: row.objectNo, project: row.projectName })}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer">
							<Translate text={localizationConstants.cancel} />
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								onConfirm(row);
								onClose();
							}}
							className="cursor-pointer bg-red-600 text-white hover:bg-red-700"
						>
							<Translate text={localizationConstants.forecastDelete} />
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			)}
		</AlertDialog>
	);
}

export default ForecastDeleteDialog;
