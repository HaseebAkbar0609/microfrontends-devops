"use client";

import React, { use, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
	BankLoanDetailPage,
	bankRepository,
	BANK_BASE_ROUTE,
	CreateBankLoanModal,
	AddBankDocumentModal,
	BankDeleteDialog,
} from "@/features/financial-management";
import type { BankLoanItem, BankLoanFormData } from "@/features/financial-management";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface PageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function BankLoanDetailPageWrapper({ params }: PageProps) {
	const { id } = use(params);
	const router = useRouter();
	const { t } = useTranslation();
	const [loan, setLoan] = useState<BankLoanItem | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isAddDocOpen, setIsAddDocOpen] = useState(false);
	const [docToDelete, setDocToDelete] = useState<{ id: string; title: string } | null>(null);

	const loadLoan = useCallback(() => {
		const found = bankRepository.getLoanById(id);
		setLoan(found ? { ...found } : null);
	}, [id]);

	useEffect(() => {
		loadLoan();
	}, [loadLoan]);

	if (!loan) {
		return (
			<div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
				<p className="text-base font-semibold text-slate-800 mb-2">
					<Translate text={localizationConstants.bankLoanNotFound} /> (#{id})
				</p>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push(`${BANK_BASE_ROUTE}?tab=lan-finansiering`)}
					className="gap-2 text-xs"
				>
					<ArrowLeft className="w-4 h-4" />
					<Translate text={localizationConstants.btnBackToList} />
				</Button>
			</div>
		);
	}

	const handleUpdateLoan = (data: Partial<BankLoanFormData>) => {
		const updated = bankRepository.updateLoan(loan.id, data);
		if (updated) {
			setLoan({ ...updated });
			toast.success(t(localizationConstants.toastLoanUpdated));
		}
		setIsEditModalOpen(false);
	};

	const handleAddDocument = (doc: {
		name: string;
		date: string;
		fileType: string;
		loanId?: string;
		fileSize?: string;
	}) => {
		bankRepository.addDocument({ ...doc, loanId: loan.id });
		loadLoan();
		setIsAddDocOpen(false);
		toast.success(t(localizationConstants.toastDocumentAdded));
	};

	const handleDeleteDocument = (docId: string) => {
		bankRepository.deleteDocument(docId);
		loadLoan();
		setDocToDelete(null);
		toast.success(t(localizationConstants.toastItemDeleted));
	};

	return (
		<>
			<BankLoanDetailPage
				loan={loan}
				onBack={() => router.push(`${BANK_BASE_ROUTE}?tab=lan-finansiering`)}
				onEditLoan={() => setIsEditModalOpen(true)}
				onEditContact={() => setIsEditModalOpen(true)}
				onAddDocument={() => setIsAddDocOpen(true)}
				onDeleteDocument={(docId, title) => setDocToDelete({ id: docId, title })}
			/>

			<CreateBankLoanModal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				onSubmit={handleUpdateLoan}
				initialData={loan}
			/>

			<AddBankDocumentModal
				isOpen={isAddDocOpen}
				onClose={() => setIsAddDocOpen(false)}
				onSubmit={handleAddDocument}
				defaultLoanId={loan.id}
			/>

			<BankDeleteDialog
				item={docToDelete ? { id: docToDelete.id, title: docToDelete.title, type: "document" } : null}
				isOpen={docToDelete !== null}
				onClose={() => setDocToDelete(null)}
				onConfirm={(docId) => handleDeleteDocument(docId)}
			/>
		</>
	);
}
