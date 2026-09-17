"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
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

	// Filters & Pagination for Documents
	const [docSearchQuery, setDocSearchQuery] = useState("");
	const [docFileTypeFilter, setDocFileTypeFilter] = useState<string>("all");
	const [docSortBy, setDocSortBy] = useState<import("../types/bank.types").BankDocSortField>("date");
	const [docSortOrder, setDocSortOrder] = useState<SortOrder>("desc");
	const [docCurrentPage, setDocCurrentPage] = useState(1);
	const [docPageSize, setDocPageSize] = useState(BANK_DEFAULT_PAGE_SIZE);

	// Modals
	const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
	const [isCreateLoanOpen, setIsCreateLoanOpen] = useState(false);
	const [isAddDocOpen, setIsAddDocOpen] = useState(false);
	const [isSelectBankOpen, setIsSelectBankOpen] = useState(false);
	const [isBankIdModalOpen, setIsBankIdModalOpen] = useState(false);
	const [selectedBankForConnect, setSelectedBankForConnect] = useState<string>("SEB (Skandinaviska Enskilda Banken)");
	const [editingAccount, setEditingAccount] = useState<BankAccountItem | null>(null);
	const [editingLoan, setEditingLoan] = useState<BankLoanItem | null>(null);
	const [itemToDelete, setItemToDelete] = useState<{
		id: string;
		title: string;
		type: "loan" | "document" | "account";
	} | null>(null);

	const refreshData = useCallback(() => {
		setAccounts(bankRepository.getAccounts());
		setLoans(bankRepository.getLoans());
		setDocuments(bankRepository.getDocuments());
	}, []);

	// Subscribe to bankRepository changes for real-time sync across pages
	useEffect(() => {
		const unsubscribe = bankRepository.subscribe(refreshData);
		return () => unsubscribe();
	}, [refreshData]);

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

	// Filtered documents
	const filteredDocs = useMemo(() => {
		return documents.filter((doc) => {
			if (docSearchQuery.trim()) {
				const q = docSearchQuery.toLowerCase();
				const matchName = doc.name.toLowerCase().includes(q);
				const matchDate = doc.date.toLowerCase().includes(q);
				const matchType = doc.fileType.toLowerCase().includes(q);
				if (!matchName && !matchDate && !matchType) return false;
			}
			if (docFileTypeFilter !== "all" && doc.fileType.toUpperCase() !== docFileTypeFilter.toUpperCase()) {
				return false;
			}
			return true;
		});
	}, [documents, docSearchQuery, docFileTypeFilter]);

	// Sorted documents
	const sortedDocs = useMemo(() => {
		return [...filteredDocs].sort((a, b) => {
			let valA = "";
			let valB = "";
			switch (docSortBy) {
				case "date":
					valA = a.date;
					valB = b.date;
					break;
				case "name":
					valA = a.name.toLowerCase();
					valB = b.name.toLowerCase();
					break;
				case "fileType":
					valA = a.fileType.toLowerCase();
					valB = b.fileType.toLowerCase();
					break;
				default:
					return 0;
			}
			if (valA < valB) return docSortOrder === "asc" ? -1 : 1;
			if (valA > valB) return docSortOrder === "asc" ? 1 : -1;
			return 0;
		});
	}, [filteredDocs, docSortBy, docSortOrder]);

	// Paginated documents
	const docTotalCount = sortedDocs.length;
	const docTotalPages = Math.max(1, Math.ceil(docTotalCount / docPageSize));
	const paginatedDocuments = useMemo(() => {
		const start = (docCurrentPage - 1) * docPageSize;
		return sortedDocs.slice(start, start + docPageSize);
	}, [sortedDocs, docCurrentPage, docPageSize]);

	const handleDocSort = useCallback(
		(field: import("../types/bank.types").BankDocSortField) => {
			if (docSortBy === field) {
				setDocSortOrder((prev: SortOrder) => (prev === "asc" ? "desc" : "asc"));
			} else {
				setDocSortBy(field);
				setDocSortOrder("asc");
			}
		},
		[docSortBy],
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

	const connectWithBankId = useCallback(
		(bankName: string, personalNumber?: string) => {
			const randomAccNum = `5${Math.floor(100 + Math.random() * 900)} ${Math.floor(1000000 + Math.random() * 9000000)}`;
			const cleanIban = `SE${Math.floor(10 + Math.random() * 89)} 5000 0000 ${randomAccNum.replace(/\s+/g, "")}`;
			const created = bankRepository.createAccount({
				title: `${bankName.split(" ")[0]} Företagskonto`,
				bankName: bankName,
				accountType: "Företagskonto",
				accountNumber: randomAccNum,
				iban: cleanIban,
				swiftBic: "ESSESESS",
				currency: "SEK",
				balance: 1500000,
				isConnected: true,
				connectionType: "bankid",
				autoDailySync: true,
				contactPerson: {
					name: personalNumber ? `Verifierad användare (${personalNumber.slice(0, 8)}-****)` : "Verifierad BankID Användare",
					role: "Kontoinnehavare",
					email: "kontakt@foretaget.se",
					phone: "+46 8 123 45 67",
				},
			});
			refreshData();
			setIsBankIdModalOpen(false);
			setIsSelectBankOpen(false);
			toast.success(t(localizationConstants.bankIdSuccessTitle));
			return created;
		},
		[refreshData, t],
	);

	const syncAccount = useCallback(
		(id: string) => {
			const updated = bankRepository.updateAccount(id, {
				lastSync: new Date().toISOString(),
				syncStatus: "synced",
			});
			refreshData();
			toast.success(t(localizationConstants.lblSyncedStatus));
			return updated;
		},
		[refreshData, t],
	);

	const deleteAccount = useCallback(
		(id: string) => {
			const success = bankRepository.deleteAccount(id);
			if (success) {
				refreshData();
				toast.success(t(localizationConstants.toastItemDeleted));
			}
			return success;
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
		// Loans
		loans: paginatedLoans,
		allLoans: loans,
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
		// Documents
		documents: paginatedDocuments,
		allDocuments: documents,
		docTotalCount,
		docCurrentPage,
		setDocCurrentPage,
		docPageSize,
		setDocPageSize,
		docTotalPages,
		docSearchQuery,
		setDocSearchQuery,
		docFileTypeFilter,
		setDocFileTypeFilter,
		docSortBy,
		docSortOrder,
		handleDocSort,
		// Modals
		isCreateAccountOpen,
		setIsCreateAccountOpen,
		isCreateLoanOpen,
		setIsCreateLoanOpen,
		isAddDocOpen,
		setIsAddDocOpen,
		isSelectBankOpen,
		setIsSelectBankOpen,
		isBankIdModalOpen,
		setIsBankIdModalOpen,
		selectedBankForConnect,
		setSelectedBankForConnect,
		editingAccount,
		setEditingAccount,
		editingLoan,
		setEditingLoan,
		itemToDelete,
		setItemToDelete,
		// Actions
		createAccount,
		updateAccount,
		deleteAccount,
		connectWithBankId,
		syncAccount,
		createLoan,
		updateLoan,
		deleteLoan,
		addDocument,
		deleteDocument,
	};
}
