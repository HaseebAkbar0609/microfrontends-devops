"use client";

import { useState } from "react";
import { Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import type { FinanceSubTab, FinanceView, PaymentPlan, PaymentPlanStatus } from "./finance/types";
import { DUMMY_BUDGETS, DUMMY_PAYMENT_PLANS } from "./finance/data";
import { BudgetList, BudgetCreateForm } from "./finance/BudgetTab";
import { InvoiceList } from "./finance/InvoiceTab";
import { PaymentPlanList, PaymentPlanCreate, PaymentPlanViewEdit } from "./finance/PaymentPlanTab";
import { ATAList, ATACreateForm } from "./finance/ATATab";

// ─── Sub-tab config ───────────────────────────────────────────────────────────

const FINANCE_SUB_TABS: { value: FinanceSubTab; label: string }[] = [
  { value: "budget",       label: localizationConstants.financeSubTabBudget },
  { value: "invoices",     label: localizationConstants.financeSubTabInvoices },
  { value: "payment-plan", label: localizationConstants.financeSubTabPaymentPlan },
  { value: "add-eat",      label: localizationConstants.financeSubTabAddEat },
];

const subTabTriggerClass =
  "h-9 rounded-lg px-4 text-sm font-medium transition-colors text-[#64748B] hover:text-[#020617] cursor-pointer";
const subTabActiveClass =
  "h-9 rounded-lg px-4 text-sm font-medium bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0] cursor-pointer";

// ─── FinanceTab ───────────────────────────────────────────────────────────────

export function FinanceTab() {
  const [view, setView] = useState<FinanceView>({ sub: "budget", mode: "list" });
  const [plans, setPlans] = useState<PaymentPlan[]>(DUMMY_PAYMENT_PLANS);

  const activeSubTab = view.sub;

  function goToSubTab(sub: FinanceSubTab) {
    setView({ sub, mode: "list" } as FinanceView);
  }

  function handlePlanStatusChange(id: string, status: PaymentPlanStatus) {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  }

  function handlePlanSave(updated: PaymentPlan) {
    setPlans((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setView({ sub: "payment-plan", mode: "list" });
  }

  function handlePlanCreate(plan: PaymentPlan) {
    setPlans((prev) => [...prev, plan]);
    setView({ sub: "payment-plan", mode: "list" });
  }

  const showSubTabs = view.mode === "list";

  const activePlan =
    view.sub === "payment-plan" && "planId" in view
      ? plans.find((p) => p.id === view.planId)
      : undefined;

  return (
    <div className="pb-4">
      {showSubTabs && (
        <div className="inline-flex items-center gap-1 rounded-xl bg-[#F1F5F9] p-1 mb-6">
          {FINANCE_SUB_TABS.map((tab) => (
            <button key={tab.value} type="button" onClick={() => goToSubTab(tab.value)}
              className={activeSubTab === tab.value ? subTabActiveClass : subTabTriggerClass}>
              <Translate text={tab.label} />
            </button>
          ))}
        </div>
      )}

      {view.sub === "budget" && view.mode === "list" && (
        <BudgetList
          onCreateNew={() => setView({ sub: "budget", mode: "create" })}
          onView={(id) => setView({ sub: "budget", mode: "view", budgetId: id })}
        />
      )}
      {view.sub === "budget" && view.mode === "create" && (
        <BudgetCreateForm onBack={() => setView({ sub: "budget", mode: "list" })} />
      )}
      {view.sub === "budget" && view.mode === "view" && (
        <BudgetCreateForm
          key={view.budgetId}
          budget={DUMMY_BUDGETS.find((b) => b.id === view.budgetId)}
          onBack={() => setView({ sub: "budget", mode: "list" })}
        />
      )}

      {view.sub === "invoices" && view.mode === "list" && <InvoiceList />}

      {view.sub === "payment-plan" && view.mode === "list" && (
        <PaymentPlanList
          plans={plans}
          onView={(id) => setView({ sub: "payment-plan", mode: "view", planId: id })}
          onEdit={(id) => setView({ sub: "payment-plan", mode: "edit", planId: id })}
          onCreateNew={() => setView({ sub: "payment-plan", mode: "create" })}
          onStatusChange={handlePlanStatusChange}
        />
      )}
      {view.sub === "payment-plan" && view.mode === "create" && (
        <PaymentPlanCreate
          onBack={() => setView({ sub: "payment-plan", mode: "list" })}
          onCreate={handlePlanCreate}
          plansCount={plans.length}
        />
      )}
      {view.sub === "payment-plan" && (view.mode === "view" || view.mode === "edit") && activePlan && (
        <PaymentPlanViewEdit
          key={activePlan.id + view.mode}
          plan={activePlan}
          mode={view.mode}
          onBack={() => setView({ sub: "payment-plan", mode: "list" })}
          onSave={handlePlanSave}
          onStatusChange={(status) => {
            handlePlanStatusChange(activePlan.id, status);
            setView({ sub: "payment-plan", mode: "list" });
          }}
          onSwitchToEdit={() => setView({ sub: "payment-plan", mode: "edit", planId: activePlan.id })}
        />
      )}

      {view.sub === "add-eat" && view.mode === "list" && (
        <ATAList onCreateNew={() => setView({ sub: "add-eat", mode: "create" })} />
      )}
      {view.sub === "add-eat" && view.mode === "create" && (
        <ATACreateForm onBack={() => setView({ sub: "add-eat", mode: "list" })} />
      )}
    </div>
  );
}
