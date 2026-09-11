"use client";

import { useState, useMemo, useCallback } from "react";
import type {
	BankTabType,
	BankAccountItem,
	BankLoanItem,
	BankDocumentItem,
	BankAccountFormData,
	BankLoanFormData,
	BankSortField,
	SortOrder,
} from "../types/bank.types";
import { bankRepository } from "../utils/bankRepository";
import { BANK_DEFAULT_PAGE_SIZE } from "../constants/bank.constants";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";

export function useBank(initialTab: BankTabType = "bankkonton") {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<BankTabType>(initialTab);

	// Data states
	const [accounts, setAccounts] = useState<BankAccountItem[]>(() =>
		bankRepository.getAccounts(),
	);
	const [loans, setLoans] = useState<BankLoanItem[]>(() =>
		bankRepository.getLoans(),
	);
	const [documents, setDocuments] = useState<BankDocumentItem[]>(() =>
		bankRepository.getDocuments(),
	);

	// Filters & Pagination for Loans
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [sortBy, setSortBy] = useState<BankSortField>("loanNr");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(BANK_DEFAULT_PAGE_SIZE);

	// Modals
	const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
	const [isCreateLoanOpen, setIsCreateLoanOpen] = useState(false);
	const [isAddDocOpen, setIsAddDocOpen] = useState(false);
	const [editingAccount, setEditingAccount] = useState<BankAccountItem | null>(null);
	const [editingLoan, setEditingLoan] = useState<BankLoanItem | null>(null);
	const [itemToDelete, setItemToDelete] = useState<{
		id: string;
		title: string;
		type: "loan" | "document";
	} | null>(null);

	const refreshData = useCallback(() => {
		setAccounts(bankRepository.getAccounts());
		setLoans(bankRepository.getLoans());
		setDocuments(bankRepository.getDocuments());
	}, []);

	// Filtered loans
	const filteredLoans = useMemo(() => {
		return loans.filter((loan) => {
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matchNr = loan.loanNr.toLowerCase().includes(q);
				const matchTitle = loan.title.toLowerCase().includes(q);
				const matchBank = loan.bank.toLowerCase().includes(q);
				const matchType = loan.loanType.toLowerCase().includes(q);
				if (!matchNr && !matchTitle && !matchBank && !matchType) return false;
			}
			if (statusFilter !== "all" && loan.status !== statusFilter) return false;
			return true;
		});
	}, [loans, searchQuery, statusFilter]);

	// Sorted loans
	const sortedLoans = useMemo(() => {
		return [...filteredLoans].sort((a, b) => {
			let valA: string | number = "";
			let valB: string | number = "";

			switch (sortBy) {
				case "loanNr":
					valA = a.loanNr;
					valB = b.loanNr;
					break;
				case "title":
					valA = a.title.toLowerCase();
					valB = b.title.toLowerCase();
					break;
				case "loanType":
					valA = a.loanType.toLowerCase();
					valB = b.loanType.toLowerCase();
					break;
				case "bank":
					valA = a.bank.toLowerCase();
					valB = b.bank.toLowerCase();
					break;
				case "startDate":
					valA = a.startDate;
					valB = b.startDate;
					break;
				case "endDate":
					valA = a.endDate;
					valB = b.endDate;
					break;
				case "status":
					valA = a.status;
					valB = b.status;
					break;
				default:
					return 0;
			}

			if (valA < valB) return sortOrder === "asc" ? -1 : 1;
			if (valA > valB) return sortOrder === "asc" ? 1 : -1;
			return 0;
		});
	}, [filteredLoans, sortBy, sortOrder]);

	// Paginated loans
	const totalCount = sortedLoans.length;
	const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
	const paginatedLoans = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return sortedLoans.slice(start, start + pageSize);
	}, [sortedLoans, currentPage, pageSize]);

	const handleSort = useCallback(
		(field: BankSortField) => {
			if (sortBy === field) {
				setSortOrder((prev: SortOrder) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setSortBy(field);
				setSortOrder("asc");
			}
		},
		[sortBy],
	);

	// Mutations
	const createAccount = useCallback(
		(formData: BankAccountFormData) => {
			const created = bankRepository.createAccount(formData);
			refreshData();
			setIsCreateAccountOpen(false);
			toast.success(t(localizationConstants.toastAccountCreated));
			return created;
		},
		[refreshData, t],
	);

	const updateAccount = useCallback(
		(id: string, formData: Partial<BankAccountFormData>) => {
			const updated = bankRepository.updateAccount(id, formData);
			refreshData();
			setEditingAccount(null);
			toast.success(t(localizationConstants.toastAccountUpdated));
			return updated;
		},
		[refreshData, t],
	);

	const createLoan = useCallback(
		(formData: BankLoanFormData) => {
			const created = bankRepository.createLoan(formData);
			refreshData();
			setIsCreateLoanOpen(false);
			toast.success(t(localizationConstants.toastLoanCreated));
			return created;
		},
		[refreshData, t],
	);

	const updateLoan = useCallback(
		(id: string, formData: Partial<BankLoanFormData>) => {
			const updated = bankRepository.updateLoan(id, formData);
			refreshData();
			setEditingLoan(null);
			toast.success(t(localizationConstants.toastLoanUpdated));
			return updated;
		},
		[refreshData, t],
	);

	const deleteLoan = useCallback(
		(id: string) => {
			const success = bankRepository.deleteLoan(id);
			if (success) {
				refreshData();
				toast.success(t(localizationConstants.toastItemDeleted));
			}
			return success;
		},
		[refreshData, t],
	);

	const addDocument = useCallback(
		(doc: Omit<BankDocumentItem, "id">) => {
			const created = bankRepository.addDocument(doc);
			refreshData();
			setIsAddDocOpen(false);
			toast.success(t(localizationConstants.toastDocumentAdded));
			return created;
		},
		[refreshData, t],
	);

	const deleteDocument = useCallback(
		(id: string) => {
			const success = bankRepository.deleteDocument(id);
			if (success) {
				refreshData();
				toast.success(t(localizationConstants.toastItemDeleted));
			}
			return success;
		},
		[refreshData, t],
	);

	return {
		activeTab,
		setActiveTab,
		accounts,
		loans: paginatedLoans,
		allLoans: loans,
		documents,
		totalCount,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		totalPages,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		sortBy,
		sortOrder,
		handleSort,
		// Modals
		isCreateAccountOpen,
		setIsCreateAccountOpen,
		isCreateLoanOpen,
		setIsCreateLoanOpen,
		isAddDocOpen,
		setIsAddDocOpen,
		editingAccount,
		setEditingAccount,
		editingLoan,
		setEditingLoan,
		itemToDelete,
		setItemToDelete,
		// Actions
		createAccount,
		updateAccount,
		createLoan,
		updateLoan,
		deleteLoan,
		addDocument,
		deleteDocument,
	};
}
