"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";
import {
	InvoiceItem,
	ReminderItem,
	InvoiceSortField,
	ReminderSortField,
	SortOrder,
} from "../types/invoice.types";
import { invoiceRepository } from "../utils/invoiceRepository";

export function useInvoiceList() {
	const { t } = useTranslation();
	const [activeTab, setActiveTab] = useState<"fakturalista" | "påminnelser">("fakturalista");

	// Search & Filter state
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [objectFilter, setObjectFilter] = useState<string>("all");

	// Invoice Sorting
	const [sortBy, setSortBy] = useState<InvoiceSortField>("invoiceNo");
	const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

	// Reminders Sorting
	const [reminderSortBy, setReminderSortBy] = useState<ReminderSortField>("id");
	const [reminderSortOrder, setReminderSortOrder] = useState<SortOrder>("asc");

	// Selection state for multi-select
	const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<Set<string>>(new Set());

	// Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(10);

	const [invoices, setInvoices] = useState<InvoiceItem[]>([]);
	const [reminders, _setReminders] = useState<ReminderItem[]>([]);

	const loadData = useCallback(() => {
		setInvoices(invoiceRepository.getInvoices());
		_setReminders(invoiceRepository.getReminders());
	}, []);

	// Load stored invoices on mount and subscribe to repository changes
	useEffect(() => {
		loadData();

		const unsubscribe = invoiceRepository.subscribe(() => {
			loadData();
		});

		return () => {
			unsubscribe();
		};
	}, [loadData]);

	// Toggle row selection
	const toggleSelectInvoice = useCallback((id: string) => {
		setSelectedInvoiceIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	}, []);

	// Toggle all rows selection
	const toggleSelectAllInvoices = useCallback((allIds: string[]) => {
		setSelectedInvoiceIds((prev) => {
			if (prev.size === allIds.length && allIds.length > 0) {
				return new Set();
			}
			return new Set(allIds);
		});
	}, []);

	// Invoice Sort Handler
	const handleSort = useCallback((field: InvoiceSortField) => {
		setSortBy((prevField) => {
			if (prevField === field) {
				setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
				return field;
			}
			setSortOrder("asc");
			return field;
		});
	}, []);

	// Reminder Sort Handler
	const handleReminderSort = useCallback((field: ReminderSortField) => {
		setReminderSortBy((prevField) => {
			if (prevField === field) {
				setReminderSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
				return field;
			}
			setReminderSortOrder("asc");
			return field;
		});
	}, []);

	// Filtered invoices
	const filteredInvoices = useMemo(() => {
		let result = [...invoices];

		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter(
				(inv) =>
					inv.invoiceNo.toLowerCase().includes(q) ||
					inv.ocr.toLowerCase().includes(q) ||
					inv.customer.toLowerCase().includes(q) ||
					inv.projectLeader.toLowerCase().includes(q) ||
					inv.location.toLowerCase().includes(q) ||
					inv.contractType.toLowerCase().includes(q) ||
					inv.costCenter.toLowerCase().includes(q),
			);
		}

		if (statusFilter !== "all") {
			result = result.filter((inv) => inv.status === statusFilter);
		}

		if (objectFilter !== "all") {
			result = result.filter((inv) => inv.object.toLowerCase() === objectFilter.toLowerCase());
		}

		// Sort
		result.sort((a, b) => {
			const valA = a[sortBy] ?? "";
			const valB = b[sortBy] ?? "";

			if (typeof valA === "number" && typeof valB === "number") {
				return sortOrder === "asc" ? valA - valB : valB - valA;
			}

			const strA = String(valA).toLowerCase();
			const strB = String(valB).toLowerCase();

			return sortOrder === "asc"
				? strA.localeCompare(strB, "sv")
				: strB.localeCompare(strA, "sv");
		});

		return result;
	}, [invoices, searchQuery, statusFilter, objectFilter, sortBy, sortOrder]);

	// Paginated Invoices
	const totalInvoicePages = Math.max(1, Math.ceil(filteredInvoices.length / pageSize));
	const paginatedInvoices = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredInvoices.slice(start, start + pageSize);
	}, [filteredInvoices, currentPage, pageSize]);

	// Filtered Reminders
	const filteredReminders = useMemo(() => {
		let result = [...reminders];

		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase().trim();
			result = result.filter(
				(rem) =>
					rem.id.toLowerCase().includes(q) ||
					rem.customer.toLowerCase().includes(q) ||
					rem.email.toLowerCase().includes(q),
			);
		}

		if (statusFilter !== "all") {
			result = result.filter((rem) => rem.status === statusFilter);
		}

		// Sort
		result.sort((a, b) => {
			const valA = a[reminderSortBy] ?? "";
			const valB = b[reminderSortBy] ?? "";

			if (typeof valA === "number" && typeof valB === "number") {
				return reminderSortOrder === "asc" ? valA - valB : valB - valA;
			}

			const strA = String(valA).toLowerCase();
			const strB = String(valB).toLowerCase();

			return reminderSortOrder === "asc"
				? strA.localeCompare(strB, "sv")
				: strB.localeCompare(strA, "sv");
		});

		return result;
	}, [reminders, searchQuery, statusFilter, reminderSortBy, reminderSortOrder]);

	const totalReminderPages = Math.max(1, Math.ceil(filteredReminders.length / pageSize));
	const paginatedReminders = useMemo(() => {
		const start = (currentPage - 1) * pageSize;
		return filteredReminders.slice(start, start + pageSize);
	}, [filteredReminders, currentPage, pageSize]);

	// Actions
	const sendSelectedInvoices = useCallback(() => {
		if (selectedInvoiceIds.size === 0) return;
		invoiceRepository.sendInvoice(Array.from(selectedInvoiceIds));
		toast.success(
			`${selectedInvoiceIds.size} ${t(localizationConstants.invoiceSendSuccess)}`,
		);
		setSelectedInvoiceIds(new Set());
	}, [selectedInvoiceIds, t]);

	const archiveInvoice = useCallback(
		(id: string) => {
			invoiceRepository.archiveInvoice(id);
			toast.success(t(localizationConstants.invoiceArchiveSuccess));
		},
		[t],
	);

	const deleteInvoice = useCallback(
		(id: string) => {
			invoiceRepository.deleteInvoice(id);
			toast.success(t(localizationConstants.invoiceDeleteSuccess));
		},
		[t],
	);

	return {
		activeTab,
		setActiveTab,
		searchQuery,
		setSearchQuery,
		statusFilter,
		setStatusFilter,
		objectFilter,
		setObjectFilter,
		sortBy,
		sortOrder,
		handleSort,
		reminderSortBy,
		reminderSortOrder,
		handleReminderSort,
		selectedInvoiceIds,
		toggleSelectInvoice,
		toggleSelectAllInvoices,
		currentPage,
		setCurrentPage,
		pageSize,
		setPageSize,
		filteredInvoices,
		paginatedInvoices,
		totalInvoicePages,
		filteredReminders,
		paginatedReminders,
		totalReminderPages,
		sendSelectedInvoices,
		archiveInvoice,
		deleteInvoice,
	};
}

export default useInvoiceList;
