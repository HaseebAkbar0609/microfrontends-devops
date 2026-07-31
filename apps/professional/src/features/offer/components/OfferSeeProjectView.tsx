"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  FileText,
  MoreVertical,
  Download,
  User,
  ShoppingBag,
  Info,
  Folder,
  Check,
  BadgeDollarSign,
  Map,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import { ProjectData } from "../types/offer";

interface Props {
  offerId: string;
  data: ProjectData;
}

type AccordionKey = "customer" | "contact" | "order" | "orderInfo" | "documents";

function InfoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-zinc-950">{label}</span>
      <span className="text-sm text-zinc-500">{value || "—"}</span>
    </div>
  );
}

function AccordionSection({
  icon,
  title,
  open,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white">
      <button
        type="button"
        aria-expanded={open}
        className={cn(
          "flex w-full cursor-pointer items-center gap-4 p-4",
          open && "border-b border-zinc-200",
        )}
        onClick={onToggle}
      >
        <span className="shrink-0">{icon}</span>
        <span className="flex-1 text-left text-base font-medium text-zinc-950">
          {title}
        </span>
        {open ? (
          <ChevronUp size={16} className="shrink-0 text-zinc-400" />
        ) : (
          <ChevronDown size={16} className="shrink-0 text-zinc-400" />
        )}
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

function CreateOrderProjectModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslate();
  const [selected, setSelected] = useState<"project" | "order">("project");

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-110 gap-4 rounded-xl border border-zinc-200 p-6 shadow-lg">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-lg font-semibold text-zinc-950">
            {t(localizationConstants.createOrderOrProjectTitle)}
          </DialogTitle>
          <div className="border-t border-slate-200" />
          <div className="flex flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="create-type"
                value="project"
                checked={selected === "project"}
                onChange={() => setSelected("project")}
                className="sr-only"
              />
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-900 bg-white shadow-sm">
                {selected === "project" && (
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-900" />
                )}
              </div>
              <span className="text-sm font-medium text-zinc-950">
                {t(localizationConstants.createProjectOption)}
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="create-type"
                value="order"
                checked={selected === "order"}
                onChange={() => setSelected("order")}
                className="sr-only"
              />
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-900 bg-white shadow-sm">
                {selected === "order" && (
                  <div className="h-2.5 w-2.5 rounded-full bg-zinc-900" />
                )}
              </div>
              <span className="text-sm font-medium text-zinc-950">
                {t(localizationConstants.createOrderOption)}
              </span>
            </label>
          </div>
        </DialogHeader>
        <div className="flex justify-end gap-2.5">
          <Button
            className="h-9 cursor-pointer bg-zinc-100 px-4 text-sm font-medium text-zinc-950 shadow-sm hover:bg-zinc-200"
            onClick={onClose}
          >
            {t(localizationConstants.cancel)}
          </Button>
          <Button
            className="h-9 cursor-pointer gap-2 bg-zinc-900 px-4 text-sm font-medium text-white shadow-sm hover:bg-zinc-700"
            onClick={onClose}
          >
            <Check size={14} aria-hidden={true} />
            {t(localizationConstants.goToButton)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function OfferSeeProjectView({ offerId: _offerId, data }: Props) {
  const t = useTranslate();
  const router = useRouter();

  const [open, setOpen] = useState<Record<AccordionKey, boolean>>({
    customer: true,
    contact: true,
    order: true,
    orderInfo: true,
    documents: true,
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);

  function toggleSection(key: AccordionKey) {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="-mb-6 flex flex-1 flex-col overflow-hidden bg-slate-50">
      {/* Header bar */}
      <div className="px-6 py-4">
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 text-2xl font-semibold tracking-tight text-slate-950 hover:text-slate-700"
          onClick={() => router.back()}
        >
          <ArrowLeft size={20} />
          {t(localizationConstants.offerAgreedViewProject)}
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="flex flex-col gap-6 pl-9">

          {/* Project summary card */}
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-5">
              {/* Left: title + tag + date + status badges */}
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-semibold text-slate-800">
                    {data.title}
                  </span>
                  {data.jobType && (
                    <span className="rounded-md border border-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-950">
                      {data.jobType}
                    </span>
                  )}
                </div>
                {data.postedDate && (
                  <span className="text-sm text-slate-500">{data.postedDate}</span>
                )}
                <div className="flex items-center gap-5">
                  {data.statusBadge && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <Map size={12} aria-hidden={true} />
                      {data.statusBadge}
                    </span>
                  )}
                  {data.municipality && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-yellow-50 px-2 py-0.5 text-xs font-medium text-yellow-700">
                      <MapPin size={12} aria-hidden={true} />
                      {data.municipality}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: dark budget card */}
              <div className="flex w-44 shrink-0 flex-col gap-1 rounded-lg bg-gray-800 p-4">
                <div className="flex items-center gap-2">
                  <BadgeDollarSign
                    size={24}
                    className="shrink-0 text-slate-200"
                    aria-hidden={true}
                  />
                  <span className="text-base text-slate-200">
                    {t(localizationConstants.seeProjectBudget)}
                  </span>
                </div>
                <div className="pl-8 text-xl font-semibold tabular-nums text-slate-50">
                  {formatCurrency(data.budget)}
                </div>
              </div>
            </div>
          </div>

          {/* Separator */}
          <div className="-my-3 border-t border-slate-200" />

          {/* Detaljerad information */}
          <div className="flex flex-col gap-4">
            <p className="text-2xl font-semibold tracking-tight text-slate-950">
              {t(localizationConstants.seeProjectDetailedInfo)}
            </p>

            <div className="flex flex-col gap-6">
              {/* Customer info */}
              <AccordionSection
                icon={<User size={24} className="text-slate-700" aria-hidden={true} />}
                title={t(localizationConstants.seeProjectCustomerInfo)}
                open={open.customer}
                onToggle={() => toggleSection("customer")}
              >
                <InfoGrid>
                  <InfoField
                    label={t(localizationConstants.seeProjectCustomerName)}
                    value={data.customer.name}
                  />
                  <InfoField
                    label={t(localizationConstants.agreementAddress)}
                    value={data.customer.address}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectPostNr)}
                    value={data.customer.postalCode}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectCity)}
                    value={data.customer.city}
                  />
                  <InfoField
                    label={t(localizationConstants.agreementEmail)}
                    value={data.customer.email}
                  />
                  <InfoField
                    label={t(localizationConstants.agreementPhoneNumber)}
                    value={data.customer.phone}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectOrgPersonNr)}
                    value={data.customer.orgPersonNr}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectInfo)}
                    value={data.customer.info}
                  />
                </InfoGrid>
              </AccordionSection>

              {/* Contact person */}
              <AccordionSection
                icon={<Image src="/assets/icons/personal-info.svg" alt="" width={24} height={24} />}
                title={t(localizationConstants.agreementContactPerson)}
                open={open.contact}
                onToggle={() => toggleSection("contact")}
              >
                <InfoGrid>
                  <InfoField
                    label={t(localizationConstants.seeProjectFirstName)}
                    value={data.contactPerson.firstName}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectLastName)}
                    value={data.contactPerson.lastName}
                  />
                  <InfoField
                    label={t(localizationConstants.agreementEmail)}
                    value={data.contactPerson.email}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectMobile)}
                    value={data.contactPerson.mobile}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectRole)}
                    value={data.contactPerson.role}
                  />
                </InfoGrid>
              </AccordionSection>

              {/* Order */}
              <AccordionSection
                icon={<ShoppingBag size={24} className="text-slate-700" aria-hidden={true} />}
                title="Order"
                open={open.order}
                onToggle={() => toggleSection("order")}
              >
                <InfoGrid>
                  <InfoField
                    label={t(localizationConstants.seeProjectSerialNr)}
                    value={data.order.serialNr}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectOrderName)}
                    value={data.order.orderName}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectBlockName)}
                    value={data.order.blockName}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectOrderAddress)}
                    value={data.order.orderAddress}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectPostNr)}
                    value={data.order.postalCode}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectCity)}
                    value={data.order.city}
                  />
                </InfoGrid>
              </AccordionSection>

              {/* Order information */}
              <AccordionSection
                icon={<Info size={24} className="text-slate-700" aria-hidden={true} />}
                title={t(localizationConstants.seeProjectTypeInformation)}
                open={open.orderInfo}
                onToggle={() => toggleSection("orderInfo")}
              >
                <InfoGrid>
                  <InfoField
                    label={t(localizationConstants.seeProjectType)}
                    value={data.orderInfo.type}
                  />
                  <InfoField
                    label={t(localizationConstants.offerQuotedCategory)}
                    value={data.orderInfo.category}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectDepartment)}
                    value={data.orderInfo.department}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectContractNr)}
                    value={data.orderInfo.contractNr}
                  />
                  <InfoField
                    label={t(localizationConstants.seeProjectOfferNr)}
                    value={data.orderInfo.offerNr}
                  />
                  <InfoField
                    label={t(localizationConstants.agreementStartDate)}
                    value={data.orderInfo.startDate}
                  />
                  <InfoField
                    label={t(localizationConstants.agreementEndDate)}
                    value={data.orderInfo.endDate}
                  />
                </InfoGrid>
              </AccordionSection>

              {/* Documents */}
              <AccordionSection
                icon={<Folder size={24} className="text-slate-700" aria-hidden={true} />}
                title={t(localizationConstants.agreementDocuments)}
                open={open.documents}
                onToggle={() => toggleSection("documents")}
              >
                <div className="overflow-x-auto rounded-md border border-zinc-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-zinc-200 bg-slate-50">
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500">
                          {t(localizationConstants.seeProjectDocDate)}
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500">
                          {t(localizationConstants.seeProjectDocName)}
                        </th>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500">
                          {t(localizationConstants.seeProjectDocFile)}
                        </th>
                        <th scope="col" className="w-10 px-2 py-2" />
                      </tr>
                    </thead>
                    <tbody>
                      {data.documents.map((doc) => (
                        <tr
                          key={doc.id}
                          className="border-b border-zinc-200 last:border-0 hover:bg-slate-50"
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                            {doc.date}
                          </td>
                          <td className="px-4 py-3 text-zinc-950">{doc.name}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <FileText
                                size={14}
                                className={
                                  doc.fileType === "pdf"
                                    ? "text-red-500"
                                    : "text-blue-500"
                                }
                                aria-hidden={true}
                              />
                              <span className="text-zinc-500">{doc.fileLabel}</span>
                            </div>
                          </td>
                          <td className="px-2 py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  aria-label={t(localizationConstants.actions)}
                                  className="h-7 w-7 cursor-pointer p-0"
                                >
                                  <MoreVertical size={14} aria-hidden={true} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-40">
                                <DropdownMenuItem
                                  className="cursor-pointer gap-2"
                                  onClick={() => {
                                    if (doc.fileLabel.startsWith("https://")) {
                                      window.open(doc.fileLabel, "_blank", "noopener,noreferrer");
                                    }
                                  }}
                                >
                                  <Download size={13} aria-hidden={true} />
                                  {t(localizationConstants.offerDownloadPdf)}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionSection>
            </div>
          </div>
        </div>
      </div>

      {/* Footer action bar */}
      <div className="flex items-center justify-end gap-2 border-t border-slate-200 bg-white px-6 py-3">
        <Button
          variant="outline"
          className="h-9 cursor-pointer px-5 text-sm"
          onClick={() => router.back()}
        >
          {t(localizationConstants.cancel)}
        </Button>
        <Button
          className="h-9 cursor-pointer bg-neutral-950 px-5 text-sm text-white hover:bg-neutral-800"
          onClick={() => setCreateModalOpen(true)}
        >
          {t(localizationConstants.createOrderOrProjectTitle)}
        </Button>
      </div>

      <CreateOrderProjectModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
