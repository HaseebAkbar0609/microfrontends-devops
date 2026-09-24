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
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface DeleteDocumentDialogProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => Promise<void>;
	isDeleting: boolean;
}

export function DeleteDocumentDialog({
	isOpen,
	onClose,
	onConfirm,
	isDeleting,
}: DeleteDocumentDialogProps) {
	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent className="bg-white sm:max-w-md">
				<AlertDialogHeader>
					<AlertDialogTitle>
						<Translate text={localizationConstants.calcDetailDocDeleteConfirmTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription>
						<Translate text={localizationConstants.calcDetailDocDeleteConfirmDesc} />
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isDeleting} onClick={onClose}>
						<Translate text={localizationConstants.cancel} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={(e) => {
							e.preventDefault();
							onConfirm();
						}}
						disabled={isDeleting}
						className="bg-slate-900 text-white hover:bg-slate-800"
					>
						<Translate text={localizationConstants.calcArchiveDelete} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
