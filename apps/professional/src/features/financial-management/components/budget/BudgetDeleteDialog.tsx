"use client";

import React from "react";
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
import type { EconomyBudgetItem } from "../../types/budget.types";

interface BudgetDeleteDialogProps {
	item: EconomyBudgetItem | null;
	isOpen: boolean;
	onClose: () => void;
	onConfirm: (id: string) => void;
}

export function BudgetDeleteDialog({
	item,
	isOpen,
	onClose,
	onConfirm,
}: BudgetDeleteDialogProps) {
	if (!item) return null;

	const handleConfirm = () => {
		onConfirm(item.id);
		onClose();
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>
						<Translate text={localizationConstants.confirmDeleteBudgetTitle} />
					</AlertDialogTitle>
					<AlertDialogDescription>
						<Translate text={localizationConstants.confirmDeleteBudgetDesc} />
						<span className="block mt-2 font-medium text-slate-900">
							{item.budgetName} (#{item.budgetnr})
						</span>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel onClick={onClose} className="cursor-pointer">
						<Translate text={localizationConstants.btnCancelBudget} />
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleConfirm}
						className="bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
					>
						<Translate text={localizationConstants.confirmDeleteBudgetBtn} />
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
