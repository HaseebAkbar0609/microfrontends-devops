"use client";

import React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { BankSelectionGrid } from "./BankSelectionGrid";

export interface BankSelectionModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSelectBankForBankId: (bankName: string) => void;
	onSelectManual: () => void;
}

export function BankSelectionModal({
	isOpen,
	onClose,
	onSelectBankForBankId,
	onSelectManual,
}: BankSelectionModalProps) {
	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
				<DialogHeader className="hidden">
					<DialogTitle>Välj bank</DialogTitle>
				</DialogHeader>
				<BankSelectionGrid
					onSelectBankForBankId={onSelectBankForBankId}
					onSelectManual={onSelectManual}
				/>
			</DialogContent>
		</Dialog>
	);
}

export default BankSelectionModal;
