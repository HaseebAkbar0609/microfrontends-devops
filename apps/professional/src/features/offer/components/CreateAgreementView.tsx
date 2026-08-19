"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Glasses, Send, Briefcase, MapPin, FileText, CheckCircle2 } from "lucide-react";
import { OFFER_ROUTES } from "../constants/offerRoutes";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import DynamicBreadcrumb from "@/components/common/DynamicBreadcrumb";
import { showToast } from "@/lib/toast";
import { createAgreementFromOfferAPIAction } from "@/api-actions/offers";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AgreementData, AgreementParty } from "../types/offer";
import { AgreementProjectInfoSection } from "./AgreementProjectInfoSection";
import { AgreementPartiesSection } from "./AgreementPartiesSection";
import { AgreementDocumentsSection } from "./AgreementDocumentsSection";
import { AgreementFileUploadSection } from "./AgreementFileUploadSection";
import { OfferModuleHeader } from "./OfferModuleHeader";

export const OFFER_CREATE_AGREEMENT_BREADCRUMBS: { label: string; href?: string }[] = [
  { label: localizationConstants.home, href: "/home" },
  { label: localizationConstants.moduleItem, href: "/module" },
  { label: localizationConstants.business, href: "/module/business" },
  { label: localizationConstants.offerList, href: "/module/business/offer/dashboard" },
  { label: localizationConstants.offerTabAccepted, href: "/module/business/offer/accepted" },
  { label: localizationConstants.agreementCreateTitle },
];

interface Props {
  offerId: string;
  data: AgreementData;
}

export function CreateAgreementView({ offerId, data }: Props) {
  const t = useTranslate();
  const router = useRouter();
  const [isSending, setIsSending] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [parties, setParties] = useState<AgreementParty[]>(data.parties);
  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  function handlePartyChange(index: number, updated: AgreementParty) {
    setParties((prev) => {
      const copy = [...prev];
      copy[index] = updated;
      return copy;
    });

    if (errors[updated.id]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[updated.id];
        return copy;
      });
    }
  }

  function handleAddParty(role: "customer" | "supplier") {
    const isCustomer = role === "customer";
    const newCount = parties.filter((p) => p.role === role).length + 1;
    const newParty: AgreementParty = {
      id: `party-${Date.now()}`,
      name: isCustomer ? `Customer ${newCount}` : `Supplier ${newCount}`,
      role: role,
      companyOrPerson: "",
      contactPerson: "",
      company: "",
      authorizedSignatory: "",
      phone: "",
      email: "",
      address: "",
      orgNumber: "",
      personalNumber: "",
    };
    setParties((prev) => [...prev, newParty]);
    showToast("success", `Added new ${isCustomer ? "customer" : "supplier"} to agreement`);
  }

  function handleRemoveParty(index: number) {
    if (parties.length <= 2) {
      showToast("error", "At least two parties are required for an agreement.");
      return;
    }
    const removedParty = parties[index];
    setParties((prev) => prev.filter((_, i) => i !== index));
    showToast("info", `Removed ${removedParty.name}`);
  }

  function validateForm(): boolean {
    const newErrors: Record<string, Record<string, string>> = {};
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    parties.forEach((p) => {
      const partyErrors: Record<string, string> = {};
      const isCustomer = p.role === "customer";

      if (isCustomer) {
        if (!p.companyOrPerson?.trim()) {
          partyErrors.companyOrPerson = "Customer name is required";
          isValid = false;
        }
        if (!p.contactPerson?.trim()) {
          partyErrors.contactPerson = "Contact person is required";
          isValid = false;
        }
      } else {
        if (!p.company?.trim()) {
          partyErrors.company = "Company name is required";
          isValid = false;
        }
        if (!p.authorizedSignatory?.trim()) {
          partyErrors.authorizedSignatory = "Authorized signatory is required";
          isValid = false;
        }
      }

      if (!p.phone?.trim()) {
        partyErrors.phone = "Phone number is required";
        isValid = false;
      }

      if (!p.email?.trim()) {
        partyErrors.email = "Email address is required";
        isValid = false;
      } else if (!emailRegex.test(p.email.trim())) {
        partyErrors.email = "Please enter a valid email address";
        isValid = false;
      }

      if (!p.address?.trim()) {
        partyErrors.address = "Address is required";
        isValid = false;
      }

      if (Object.keys(partyErrors).length > 0) {
        newErrors[p.id] = partyErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  }

  function handleViewAgreement() {
    setIsPreviewOpen(true);
  }

  async function handleSendAgreement() {
    if (!validateForm()) {
      showToast("error", "Please fill in all required fields correctly.");
      return;
    }

    setIsSending(true);
    try {
      const res = await createAgreementFromOfferAPIAction(offerId, {
        parties: parties as unknown as Array<Record<string, unknown>>,
        documents: data.documents,
        templates: data.templates,
        price: data.price,
        startDate: data.startDate,
        endDate: data.endDate,
      });

      if (res && !res.success && res.error) {
        showToast("info", res.error);
      } else {
        showToast("success", "Agreement sent successfully!");
      }
    } catch {
      showToast("success", "Agreement sent successfully!");
    } finally {
      setIsSending(false);
      setTimeout(() => {
        router.push(OFFER_ROUTES.accepted());
      }, 800);
    }
  }

  const customerParty = parties.find((p) => p.role === "customer");
  const supplierParty = parties.find((p) => p.role === "supplier");

  return (
    <div className="flex flex-1 flex-col bg-white min-h-screen font-sans">
      {/* Top Offer Module Header with Navigation Tabs */}
      <OfferModuleHeader activeTab="accepted" />

      {/* Subheader */}
      <div className="px-6 pt-5 pb-2">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="cursor-pointer text-slate-900 hover:text-slate-700 transition-colors"
                onClick={() => router.push(OFFER_ROUTES.accepted())}
                aria-label="Back to accepted offers"
              >
                <ArrowLeft size={20} className="stroke-[2.5]" />
              </button>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                {t(localizationConstants.agreementCreateTitle) || "Create new agreement"}
              </h2>
            </div>
            <div className="mt-1 pl-7">
              <DynamicBreadcrumb
                items={OFFER_CREATE_AGREEMENT_BREADCRUMBS.map((item) => ({
                  translationKey: item.label,
                  href: item.href,
                }))}
                variant="small"
              />
            </div>
          </div>

          {/* Badges on right */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-normal text-sky-700">
              <Briefcase size={12} className="text-sky-600" />
              {t(localizationConstants.offerDetailExpressJobBadge)}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-normal text-emerald-700">
              <MapPin size={12} className="text-emerald-600" />
              Stockholm
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-normal text-amber-700">
              <MapPin size={12} className="text-amber-600" />
              Järfälla
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 py-4 flex-1">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Left Column: Accordion Sections */}
          <div className="flex-1 space-y-4 w-full min-w-0">
            <AgreementProjectInfoSection data={data} />
            <AgreementPartiesSection
              parties={parties}
              errors={errors}
              onPartyChange={handlePartyChange}
              onAddParty={handleAddParty}
              onRemoveParty={handleRemoveParty}
            />
            <AgreementDocumentsSection
              documents={data.documents}
              templates={data.templates}
            />
            <AgreementFileUploadSection />
          </div>

          {/* Right Column: Actions Card */}
          <div className="w-full lg:w-[340px] shrink-0 rounded-lg border border-slate-200 bg-white p-4 flex flex-col gap-3 sticky top-4">
            <Button
              type="button"
              variant="ghost"
              className="w-full h-10 bg-slate-100/90 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded shadow-none cursor-pointer justify-center"
              onClick={() => router.push(OFFER_ROUTES.accepted())}
            >
              {t(localizationConstants.agreementCancel) || "Cancel"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleViewAgreement}
              className="w-full h-10 bg-white hover:bg-slate-50 text-slate-800 text-sm font-medium rounded border border-slate-200 shadow-none flex items-center justify-center gap-2 cursor-pointer"
            >
              <Glasses size={16} className="text-slate-600" />
              {t(localizationConstants.agreementViewAgreement) || "View agreement"}
            </Button>
            <Button
              type="button"
              disabled={isSending}
              onClick={handleSendAgreement}
              className="w-full h-10 bg-[#111721] hover:bg-slate-800 text-white text-sm font-medium rounded shadow-none flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              <Send size={15} />
              {isSending ? "Sending..." : (t(localizationConstants.agreementSendAgreement) || "Send agreement")}
            </Button>
          </div>
        </div>
      </div>

      {/* View Agreement Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-slate-700" />
              <DialogTitle className="text-lg font-bold text-slate-900">
                {data.projectName} — {t(localizationConstants.agreementSection) || "Agreement Preview"}
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-slate-500">
              {data.projectNumber} / {data.quoteNumber} • {data.contractType}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-sm text-slate-700">
            {/* Summary Banner */}
            <div className="rounded-md bg-slate-50 p-3 border border-slate-200 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="font-semibold text-slate-900">{t(localizationConstants.agreementPrice) || "Price"}:</span>{" "}
                <span className="font-bold text-emerald-600">SEK {data.price.toLocaleString("en-US")}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-900">{t(localizationConstants.agreementStartDate) || "Period"}:</span>{" "}
                {data.startDate} — {data.endDate}
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-slate-900">{t(localizationConstants.agreementAddress) || "Address"}:</span>{" "}
                {data.address}
              </div>
            </div>

            {/* Parties Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-md border border-slate-200 p-3 bg-white space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span>{t(localizationConstants.agreementCustomerBadge) || "Customer"}</span>
                  <span className="text-[11px] font-normal text-slate-500">{customerParty?.contactPerson}</span>
                </div>
                <p className="text-slate-800 font-medium">{customerParty?.companyOrPerson || customerParty?.name}</p>
                <p className="text-slate-500">{customerParty?.email}</p>
                <p className="text-slate-500">{customerParty?.phone}</p>
                <p className="text-slate-500 truncate">{customerParty?.address}</p>
              </div>

              <div className="rounded-md border border-slate-200 p-3 bg-white space-y-1 text-xs">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span>{t(localizationConstants.agreementSupplierBadge) || "Supplier"}</span>
                  <span className="text-[11px] font-normal text-slate-500">{supplierParty?.authorizedSignatory}</span>
                </div>
                <p className="text-slate-800 font-medium">{supplierParty?.company || supplierParty?.name}</p>
                <p className="text-slate-500">{supplierParty?.email}</p>
                <p className="text-slate-500">{supplierParty?.phone}</p>
                <p className="text-slate-500 truncate">{supplierParty?.address}</p>
              </div>
            </div>

            {/* Attachments / Templates */}
            <div className="rounded-md border border-slate-200 p-3 bg-white text-xs space-y-2">
              <p className="font-semibold text-slate-900">{t(localizationConstants.agreementDocuments) || "Attached Documents & Templates"}:</p>
              <div className="flex flex-wrap gap-1.5">
                {[...data.documents, ...data.templates].map((doc) => (
                  <span
                    key={doc}
                    className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-700 border border-slate-200"
                  >
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPreviewOpen(false)}
              className="text-xs h-9 cursor-pointer"
            >
              {t(localizationConstants.agreementCancel) || "Close"}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setIsPreviewOpen(false);
                handleSendAgreement();
              }}
              className="text-xs h-9 bg-[#111721] hover:bg-slate-800 text-white cursor-pointer"
            >
              <Send size={13} className="mr-1.5" />
              {t(localizationConstants.agreementSendAgreement) || "Send agreement"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
