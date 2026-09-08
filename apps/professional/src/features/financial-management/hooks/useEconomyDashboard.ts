"use client";

import { useState, useEffect, useCallback } from "react";
import { invoiceRepository } from "../utils/invoiceRepository";
import { expenseRepository } from "../utils/expenseRepository";
import { rotRutRepository } from "../utils/rotRutRepository";
import {
	INITIAL_ECONOMY_DASHBOARD_STATE,
	BASE_FINANCIAL_HEALTH_SCORE,
	BASE_ECONOMY_OVERVIEW,
	BASE_ACCOUNTS_RECEIVABLE,
	BASE_ACCOUNTS_PAYABLE,
	BASE_INVOICING_PIPELINE,
	BASE_RECENT_ACTIVITIES,
} from "../mock/economyDashboardMockData";
import type {
	EconomyDashboardState,
	FinancialHealthScoreData,
	EconomyOverviewData,
	AccountsReceivableAging,
	AccountsPayableSummary,
	InvoicingPipeline,
	EconomyActivityEvent,
} from "../types/economyDashboard.types";
import localizationConstants from "@/utils/translation/constants";

export function useEconomyDashboard() {
	const [dashboardState, setDashboardState] = useState<EconomyDashboardState>(
		INITIAL_ECONOMY_DASHBOARD_STATE,
	);
	const [activeAiQuestion, setActiveAiQuestion] = useState<string | null>(null);

	// Compute live metrics dynamically from sub-route repositories
	const computeDynamicState = useCallback(() => {
		try {
			const invoices = invoiceRepository.getInvoices();
			const expenses = expenseRepository.getAllExpenses();
			const rotRutItems = rotRutRepository.getAll();

			// 1. Dynamic Invoicing Pipeline
			const draftInvoices = invoices.filter((i) => i.status === "saved");
			const sentInvoices = invoices.filter((i) => i.status === "sent" || i.status === "paid" || i.status === "overdue");
			const paidInvoices = invoices.filter((i) => i.status === "paid");
			const overdueInvoices = invoices.filter((i) => i.status === "overdue");

			const dynamicPipeline: InvoicingPipeline = {
				draftCount: draftInvoices.length > 0 ? draftInvoices.length : BASE_INVOICING_PIPELINE.draftCount,
				draftAmount: draftInvoices.length > 0
					? draftInvoices.reduce((sum, i) => sum + i.total, 0)
					: BASE_INVOICING_PIPELINE.draftAmount,
				readyCount: BASE_INVOICING_PIPELINE.readyCount,
				readyAmount: BASE_INVOICING_PIPELINE.readyAmount,
				sentCount: sentInvoices.length > 0 ? sentInvoices.length : BASE_INVOICING_PIPELINE.sentCount,
				sentAmount: sentInvoices.length > 0
					? sentInvoices.reduce((sum, i) => sum + i.total, 0)
					: BASE_INVOICING_PIPELINE.sentAmount,
				creditCount: BASE_INVOICING_PIPELINE.creditCount,
				creditAmount: BASE_INVOICING_PIPELINE.creditAmount,
			};

			// 2. Dynamic Accounts Receivable (A/R)
			const openInvoices = invoices.filter((i) => i.status !== "paid");
			const totalOpenAr = openInvoices.length > 0
				? openInvoices.reduce((sum, i) => sum + i.total, 0)
				: BASE_ACCOUNTS_RECEIVABLE.totalOpen;

			const overdueArAmount = overdueInvoices.length > 0
				? overdueInvoices.reduce((sum, i) => sum + i.total, 0)
				: BASE_ACCOUNTS_RECEIVABLE.overdue1to30 + BASE_ACCOUNTS_RECEIVABLE.overdue31to60 + BASE_ACCOUNTS_RECEIVABLE.overdue60Plus;

			// Identify largest overdue customer
			let topOverdueCustomer = BASE_ACCOUNTS_RECEIVABLE.topOverdueCustomer;
			let topOverdueAmount = BASE_ACCOUNTS_RECEIVABLE.topOverdueAmount;
			if (overdueInvoices.length > 0) {
				const sortedOverdue = [...overdueInvoices].sort((a, b) => b.total - a.total);
				topOverdueCustomer = sortedOverdue[0].customer;
				topOverdueAmount = sortedOverdue[0].total;
			}

			const dynamicAr: AccountsReceivableAging = {
				totalOpen: totalOpenAr,
				notDue: Math.max(0, totalOpenAr - overdueArAmount),
				overdue1to30: Math.round(overdueArAmount * 0.45),
				overdue31to60: Math.round(overdueArAmount * 0.35),
				overdue60Plus: Math.round(overdueArAmount * 0.20),
				topOverdueCustomer,
				topOverdueAmount,
				topOverdueDays: BASE_ACCOUNTS_RECEIVABLE.topOverdueDays,
			};

			// 3. Dynamic Accounts Payable (A/P) from expenseRepository
			const unpaidExpenses = expenses.filter((e) => e.status !== "paid");
			const totalOpenAp = unpaidExpenses.length > 0
				? unpaidExpenses.reduce((sum, e) => sum + e.amount, 0)
				: BASE_ACCOUNTS_PAYABLE.totalOpen;

			const dynamicAp: AccountsPayableSummary = {
				totalOpen: totalOpenAp,
				dueNext7Days: Math.round(totalOpenAp * 0.36),
				due8to30Days: Math.round(totalOpenAp * 0.52),
				overdue: Math.round(totalOpenAp * 0.12),
				largestUpcomingPaymentSupplier: unpaidExpenses.length > 0 ? unpaidExpenses[0].supplier : BASE_ACCOUNTS_PAYABLE.largestUpcomingPaymentSupplier,
				largestUpcomingPaymentAmount: unpaidExpenses.length > 0 ? unpaidExpenses[0].amount : BASE_ACCOUNTS_PAYABLE.largestUpcomingPaymentAmount,
				largestUpcomingDueDateKey: BASE_ACCOUNTS_PAYABLE.largestUpcomingDueDateKey,
			};

			// 4. Dynamic Economy Overview (MTD)
			const liveRevenue = sentInvoices.reduce((sum, i) => sum + i.total, 0);
			const liveCosts = expenses.reduce((sum, e) => sum + e.amount, 0);
			const revenue = liveRevenue > 0 ? liveRevenue : BASE_ECONOMY_OVERVIEW.revenue;
			const costs = liveCosts > 0 ? liveCosts : BASE_ECONOMY_OVERVIEW.costs;
			const contributionMargin = revenue - costs;
			const contributionMarginPercent = revenue > 0 ? Number(((contributionMargin / revenue) * 100).toFixed(1)) : 30.2;
			const netResult = Math.round(contributionMargin * 0.35);

			const dynamicOverview: EconomyOverviewData = {
				revenue,
				costs,
				contributionMargin,
				contributionMarginPercent,
				netResult,
				openInvoicesAr: totalOpenAr,
			};

			// 5. Dynamic Health Score (factors in real A/R overdue and gross margin)
			let healthScoreVal = 72;
			if (overdueArAmount > 250000) healthScoreVal -= 8;
			else if (overdueArAmount < 100000) healthScoreVal += 5;
			if (contributionMarginPercent > 32) healthScoreVal += 4;
			healthScoreVal = Math.min(100, Math.max(0, healthScoreVal));

			const dynamicHealthScore: FinancialHealthScoreData = {
				score: healthScoreVal,
				maxScore: 100,
				statusKey: healthScoreVal >= 80
					? localizationConstants.healthScoreStatusGood
					: healthScoreVal >= 60
					? localizationConstants.healthScoreStatusMedium
					: localizationConstants.healthScoreStatusCritical,
				statusColor: healthScoreVal >= 80
					? "text-emerald-600 bg-emerald-50 border-emerald-200"
					: healthScoreVal >= 60
					? "text-amber-600 bg-amber-50 border-amber-200"
					: "text-red-600 bg-red-50 border-red-200",
				cashRunwayMonths: 2.4,
				grossMarginPercent: contributionMarginPercent,
				overdueArAmount,
				overdueInvoicesCount: overdueInvoices.length > 0 ? overdueInvoices.length : BASE_FINANCIAL_HEALTH_SCORE.overdueInvoicesCount,
				suggestedActionKey: BASE_FINANCIAL_HEALTH_SCORE.suggestedActionKey,
			};

			// 6. Dynamic Recent Activities (pull real latest events if available)
			const dynamicRecentActivities: EconomyActivityEvent[] = [...BASE_RECENT_ACTIVITIES];
			if (invoices.length > 0) {
				const latestInv = invoices[0];
				dynamicRecentActivities[0] = {
					id: `live-inv-${latestInv.id}`,
					type: "invoice_sent",
					description: `Faktura ${latestInv.invoiceNo} skickad till ${latestInv.customer}`,
					amount: latestInv.total,
					timeAgo: "Nyligen",
					iconName: "FileUp",
				};
			}

			if (rotRutItems.length > 0) {
				const latestRotRut = rotRutItems[0];
				dynamicRecentActivities[4] = {
					id: `live-rotrut-${latestRotRut.id}`,
					type: "reminder_sent",
					description: `ROT/RUT avdrag registrerat: ${latestRotRut.customerName}`,
					amount: latestRotRut.deductionAmount,
					timeAgo: "Nyligen",
					iconName: "ShieldCheck",
				};
			}

			// 7. Dynamic Cash Flow
			const liveCashIn = paidInvoices.reduce((sum, i) => sum + i.total, 0);
			const cashIn30Days = liveCashIn > 0 ? liveCashIn : INITIAL_ECONOMY_DASHBOARD_STATE.cashFlow.cashIn30Days;
			const cashOut30Days = INITIAL_ECONOMY_DASHBOARD_STATE.cashFlow.cashOut30Days;
			const dynamicCashFlow = {
				...INITIAL_ECONOMY_DASHBOARD_STATE.cashFlow,
				cashIn30Days,
				cashOut30Days,
				netCashFlow: cashIn30Days - cashOut30Days,
			};

			setDashboardState((prev) => ({
				...prev,
				healthScore: dynamicHealthScore,
				overview: dynamicOverview,
				cashFlow: dynamicCashFlow,
				invoicingPipeline: dynamicPipeline,
				accountsReceivable: dynamicAr,
				accountsPayable: dynamicAp,
				recentActivities: dynamicRecentActivities,
			}));
		} catch (error) {
			console.error("Error computing dynamic economy dashboard state:", error);
		}
	}, []);

	// Subscribe reactively to all 3 sub-route repositories
	useEffect(() => {
		computeDynamicState();

		const unsubInvoices = invoiceRepository.subscribe(() => {
			computeDynamicState();
		});
		const unsubExpenses = expenseRepository.subscribe(() => {
			computeDynamicState();
		});
		const unsubRotRut = rotRutRepository.subscribe(() => {
			computeDynamicState();
		});

		return () => {
			unsubInvoices();
			unsubExpenses();
			unsubRotRut();
		};
	}, [computeDynamicState]);

	// AI Assistant Question selector
	const handleSelectAiQuestion = useCallback((question: string) => {
		setActiveAiQuestion((prev) => (prev === question ? null : question));
	}, []);

	return {
		state: dashboardState,
		activeAiQuestion,
		handleSelectAiQuestion,
		refresh: computeDynamicState,
	};
}
