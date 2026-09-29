"use client";

import { Check } from "lucide-react";
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
import { Translate } from "@/utils/translation/translate";

interface DiscardChangesDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onDiscard: () => void;
	onSave: () => void;
}

const DiscardChangesDialog = ({
	open,
	onOpenChange,
	onDiscard,
	onSave,
}: DiscardChangesDialogProps) => (
	<AlertDialog open={open} onOpenChange={onOpenChange}>
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>
					<Translate text={localizationConstants.widgetBoardDiscardTitle} />
				</AlertDialogTitle>
				<AlertDialogDescription>
					<Translate text={localizationConstants.widgetBoardDiscardBody} />
				</AlertDialogDescription>
			</AlertDialogHeader>
			<AlertDialogFooter>
				<AlertDialogCancel onClick={onDiscard} className="cursor-pointer">
					<Translate text={localizationConstants.widgetBoardDiscard} />
				</AlertDialogCancel>
				<AlertDialogAction
					onClick={onSave}
					className="cursor-pointer gap-1.5 bg-slate-900 hover:bg-slate-900/90"
				>
					<Check className="h-4 w-4" />
					<Translate text={localizationConstants.widgetBoardSaveLayout} />
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	</AlertDialog>
);

export default DiscardChangesDialog;
