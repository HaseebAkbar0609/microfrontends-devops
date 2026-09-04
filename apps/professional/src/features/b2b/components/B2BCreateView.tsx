"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Eye,
  MoreVertical,
  Plus,
  Send,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { OfferSendSection } from "@/features/offer/components/OfferSendSection";

const TOTAL_STEPS = 4;

type DealType = "hyra-in" | "hyra-ut" | "b2b-offert";

const DEAL_TYPE_LABELS: Record<DealType, string> = {
  "hyra-in": "Hyra IN",
  "hyra-ut": "Hyra UT",
  "b2b-offert": "B2B-Offert",
};

const DEAL_TYPE_BADGE_COLORS: Record<DealType, string> = {
  "hyra-in": "bg-blue-600",
  "hyra-ut": "bg-violet-600",
  "b2b-offert": "bg-emerald-600",
};

const DUMMY_DOCS = [
  { id: "d1", date: "2024-05-10", name: "Dockumentets namn", type: "PDF" },
  { id: "d2", date: "2024-05-10", name: "Dockumentets namn", type: "PDF" },
];

// ── Shared sub-components ──

function FieldGroup({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${className ?? ""}`}>
      <Label className="text-sm font-medium text-zinc-950">
        {label}
        {required && (
          <span className="ml-0.5 text-red-500" aria-hidden={true}>
            *
          </span>
        )}
      </Label>
      {children}
    </div>
  );
}

function GdprCheckbox() {
  const t = useTranslate();
  return (
    <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-700">
      <Checkbox className="mt-0.5 shrink-0" />
      <span>
        {t(localizationConstants.b2bCreateGdprText)}{" "}
        <a href="#" className="text-blue-600 underline hover:text-blue-800">
          {t(localizationConstants.b2bCreateGdprLink)}
        </a>{" "}
        {t(localizationConstants.b2bCreateGdprSuffix)}
      </span>
    </label>
  );
}

function FileUploadField() {
  const t = useTranslate();
  const [uploadedFiles] = useState<string[]>(["Document 1.pdf", "Document 2.doc"]);
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium text-zinc-950">
        {t(localizationConstants.offerFormUploadFiles)}
      </p>
      <p className="text-sm text-slate-500">{t(localizationConstants.offerFormFileTypesInfo)}</p>
      <div className="flex items-center gap-2">
        <div className="flex flex-1 flex-wrap items-center gap-2 rounded-md border border-input px-3 py-2">
          {uploadedFiles.map((f) => (
            <span
              key={f}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700"
            >
              {f}
              <button
                type="button"
                aria-label={f}
                className="cursor-pointer text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <Button
          type="button"
          className="shrink-0 cursor-pointer bg-zinc-900 text-sm text-white hover:bg-zinc-800"
        >
          {t(localizationConstants.uploadButton)}
        </Button>
      </div>
    </div>
  );
}

function DocTable() {
  const t = useTranslate();
  return (
    <div className="overflow-hidden rounded-md border border-slate-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500">
              {t(localizationConstants.columnDate)}
            </th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500">
              {t(localizationConstants.columnDocumentName)}
            </th>
            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-slate-500">
              {t(localizationConstants.b2bCreateDocumentFilLabel)}
            </th>
            <th scope="col" className="px-4 py-2 text-right">
              <button
                type="button"
                aria-label={t(localizationConstants.uploadButton)}
                className="cursor-pointer text-slate-500 hover:text-slate-900"
              >
                <Plus size={14} aria-hidden={true} />
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {DUMMY_DOCS.map((doc) => (
            <tr key={doc.id} className="border-b border-slate-200 last:border-0">
              <td className="px-4 py-2.5 text-slate-600">{doc.date}</td>
              <td className="px-4 py-2.5 text-slate-700">{doc.name}</td>
              <td className="px-4 py-2.5 text-slate-600">{doc.type}</td>
              <td className="px-4 py-2.5">
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    className="cursor-pointer text-sm text-blue-600 hover:text-blue-800"
                  >
                    {t(localizationConstants.viewFile)}
                  </button>
                  <button
                    type="button"
                    aria-label={t(localizationConstants.actions)}
                    className="cursor-pointer text-slate-400 hover:text-slate-700"
                  >
                    <MoreVertical size={14} aria-hidden={true} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Step 1: Kontakt information (same for all types) ──

function StepContactInfo() {
  const t = useTranslate();
  return (
    <OfferSendSection
      title={t(localizationConstants.b2bDealDetailContactInfo)}
      icon={<Image src="/assets/icons/personal-info.svg" alt="" width={20} height={20} />}
      defaultOpen
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <FieldGroup label={t(localizationConstants.firstNameLabel)} required>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t(localizationConstants.b2bCreateFirstNamePlaceholder)}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="anna">Anna</SelectItem>
              <SelectItem value="erik">Erik</SelectItem>
              <SelectItem value="maria">Maria</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.lastNameLabel)}>
          <Input placeholder={t(localizationConstants.placeholderLastName)} />
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.address)}>
          <Input placeholder={t(localizationConstants.placeholderAddress)} />
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.postalCode)}>
          <Input placeholder={t(localizationConstants.placeholderPostalCode)} />
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.emailLabel)}>
          <Input type="email" placeholder={t(localizationConstants.placeholderEmail)} />
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.phone)}>
          <div className="flex items-center gap-2">
            <span className="flex h-9 shrink-0 items-center rounded-md border border-input px-3 text-sm text-zinc-500 xl:h-10">
              +46
            </span>
            <Input
              placeholder={t(localizationConstants.placeholderPhone)}
              className="flex-1"
            />
          </div>
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.city)}>
          <Input placeholder={t(localizationConstants.placeholderCity)} />
        </FieldGroup>
      </div>
    </OfferSendSection>
  );
}

// ── Step 2: Skapa förfrågan (Jobbtyp controls the deal type) ──

function StepRequest({
  dealType,
  onDealTypeChange,
}: {
  dealType: DealType;
  onDealTypeChange: (t: DealType) => void;
}) {
  const t = useTranslate();
  const [linkType, setLinkType] = useState<"project" | "order">("project");

  return (
    <OfferSendSection
      title={t(localizationConstants.b2bCreateStepRequest)}
      icon={<Image src="/assets/icons/info.svg" alt="" width={20} height={20} />}
      defaultOpen
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <FieldGroup label={t(localizationConstants.projectName)} required>
          <Input
            placeholder={t(localizationConstants.b2bCreateProjectNamePlaceholder)}
          />
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.b2bDealDetailProjectNumber)}>
          <Input
            placeholder={t(localizationConstants.b2bCreateProjectNumberPlaceholder)}
          />
        </FieldGroup>

        <div className="col-span-2 space-y-2">
          <FieldGroup label={t(localizationConstants.b2bDealDetailProjectAddress)}>
            <Input
              placeholder={t(localizationConstants.b2bCreateProjectAddressPlaceholder)}
            />
          </FieldGroup>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
            <Checkbox />
            {t(localizationConstants.b2bCreateSameAsContact)}
          </label>
        </div>

        <FieldGroup label={t(localizationConstants.city)}>
          <Input placeholder={t(localizationConstants.placeholderCity)} />
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.postalCode)}>
          <Input placeholder={t(localizationConstants.placeholderPostalCode)} />
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.b2bDealDetailContractForm)}>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ab">AB</SelectItem>
              <SelectItem value="abt">ABT</SelectItem>
              <SelectItem value="utl">UTL</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>

        {/* Jobbtyp — controls which Step 3 renders */}
        <FieldGroup label={t(localizationConstants.b2bDealDetailJobType)}>
          <Select
            value={dealType}
            onValueChange={(v) => onDealTypeChange(v as DealType)}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hyra-in">Hyra IN</SelectItem>
              <SelectItem value="hyra-ut">Hyra UT</SelectItem>
              <SelectItem value="b2b-offert">B2B-Offert</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>

        <div className="col-span-2 grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-zinc-950">
              {t(localizationConstants.b2bCreateLinkRequest)}
            </p>
            <RadioGroup
              value={linkType}
              onValueChange={(v) => setLinkType(v as "project" | "order")}
              className="flex flex-col gap-2"
            >
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                <RadioGroupItem value="project" id="link-project" />
                {t(localizationConstants.project)}
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                <RadioGroupItem value="order" id="link-order" />
                {t(localizationConstants.order)}
              </label>
            </RadioGroup>
          </div>
          <FieldGroup label={t(localizationConstants.b2bCreateSelectProjectOrder)}>
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t(localizationConstants.b2bCreateProjectOrderPlaceholder)}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prj001">PRJ001</SelectItem>
                <SelectItem value="ord001">ORD001</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>
        </div>

        <div className="col-span-2">
          <FieldGroup label={t(localizationConstants.b2bCreateAddressOptionalLabel)}>
            <Textarea
              placeholder={t(localizationConstants.b2bCreateAddressOptionalPlaceholder)}
              className="min-h-20"
            />
          </FieldGroup>
        </div>
      </div>
    </OfferSendSection>
  );
}

// ── Step 3a: Typ Hyra IN ──

function StepTypeHyraIN() {
  const t = useTranslate();
  return (
    <OfferSendSection
      title={t(localizationConstants.b2bCreateTypeHyraIN)}
      icon={<Image src="/assets/icons/folders.svg" alt="" width={20} height={20} />}
      defaultOpen
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <FieldGroup label={t(localizationConstants.b2bAntal)}>
          <Select defaultValue="4">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.b2bDealDetailCategoryLabel)}>
          <Select defaultValue="snickare">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="snickare">Snickare</SelectItem>
              <SelectItem value="malare">Målare</SelectItem>
              <SelectItem value="elektriker">Elektriker</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.descriptionLabel)}>
          <Textarea
            placeholder={t(localizationConstants.descriptionPlaceholder)}
            className="min-h-24"
          />
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.b2bCreateBudgetLabel)}>
          <div className="flex items-center gap-2">
            <Input
              placeholder={t(localizationConstants.b2bCreateBudgetHourPlaceholder)}
              className="flex-1"
            />
            <Input
              placeholder={t(localizationConstants.b2bCreateBudgetUnitPlaceholder)}
              className="w-20 shrink-0"
            />
          </div>
        </FieldGroup>
        <div className="col-span-2">
          <FieldGroup label={t(localizationConstants.b2bCreateDatumPeriod)}>
            <div className="grid grid-cols-2 gap-3">
              <Input type="date" placeholder={t(localizationConstants.myPagesEmpFromDate)} />
              <Input type="date" placeholder={t(localizationConstants.myPagesEmpToDate)} />
            </div>
          </FieldGroup>
        </div>
        <div className="col-span-2">
          <FileUploadField />
        </div>
        <div className="col-span-2">
          <GdprCheckbox />
        </div>
        <div className="col-span-2 space-y-3">
          <p className="text-sm font-semibold text-slate-900">
            {t(localizationConstants.b2bDealDetailAttachments)}
          </p>
          <DocTable />
        </div>
      </div>
    </OfferSendSection>
  );
}

// ── Step 3b: Typ Hyra UT ──

function StepTypeHyraUT() {
  const t = useTranslate();
  return (
    <OfferSendSection
      title={t(localizationConstants.b2bCreateTypeHyraUT)}
      icon={<Image src="/assets/icons/folders.svg" alt="" width={20} height={20} />}
      defaultOpen
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <FieldGroup label={t(localizationConstants.b2bDealDetailCategoryLabel)}>
          <Select defaultValue="snickare">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="snickare">Snickare</SelectItem>
              <SelectItem value="malare">Målare</SelectItem>
              <SelectItem value="elektriker">Elektriker</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.b2bDealDetailSubcategoryLabel)}>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="snickare">Snickare</SelectItem>
              <SelectItem value="plattsattare">Plattsättare</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.b2bAntal)}>
          <Select defaultValue="4">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.b2bCreateSalesman)}>
          <Input placeholder={t(localizationConstants.placeholderSelect)} />
        </FieldGroup>
        <div className="col-span-2">
          <FieldGroup label={t(localizationConstants.b2bCreateEndCustomer)}>
            <Input placeholder={t(localizationConstants.placeholderSelect)} />
          </FieldGroup>
        </div>
        <div className="col-span-2">
          <FieldGroup label={t(localizationConstants.b2bCreateAvailablePeriod)}>
            <div className="grid grid-cols-2 gap-3">
              <Input type="date" placeholder={t(localizationConstants.myPagesEmpFromDate)} />
              <Input type="date" placeholder={t(localizationConstants.myPagesEmpToDate)} />
            </div>
          </FieldGroup>
        </div>
        <div className="col-span-2">
          <FieldGroup label={t(localizationConstants.descriptionLabel)}>
            <Textarea
              placeholder={t(localizationConstants.descriptionPlaceholder)}
              className="min-h-24"
            />
          </FieldGroup>
        </div>
        <div className="col-span-2">
          <GdprCheckbox />
        </div>
      </div>
    </OfferSendSection>
  );
}

// ── Step 3c: Typ B2B-Offert ──

function StepTypeB2BOffert() {
  const t = useTranslate();
  return (
    <OfferSendSection
      title={t(localizationConstants.b2bCreateTypeB2BOffert)}
      icon={<Image src="/assets/icons/folders.svg" alt="" width={20} height={20} />}
      defaultOpen
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <FieldGroup label={t(localizationConstants.b2bDealDetailCategoryLabel)}>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="snickare">Snickare</SelectItem>
              <SelectItem value="malare">Målare</SelectItem>
              <SelectItem value="elektriker">Elektriker</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.b2bDealDetailSubcategoryLabel)}>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t(localizationConstants.placeholderSelect)} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="snickare">Snickare</SelectItem>
              <SelectItem value="plattsattare">Plattsättare</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.descriptionLabel)}>
          <Textarea
            placeholder={t(localizationConstants.descriptionPlaceholder)}
            className="min-h-24"
          />
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.b2bCreateEndCompletion)}>
          <Input type="date" />
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.b2bDealDetailStartDate)}>
          <Input type="date" />
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.b2bDealDetailOfferDate)}>
          <Input type="date" />
        </FieldGroup>
        <div className="col-span-2">
          <FileUploadField />
        </div>
        <div className="col-span-2">
          <GdprCheckbox />
        </div>
        <div className="col-span-2 space-y-3">
          <p className="text-sm font-semibold text-slate-900">
            {t(localizationConstants.b2bDealDetailAttachments)}
          </p>
          <DocTable />
        </div>
      </div>
    </OfferSendSection>
  );
}

// ── Step 4: Ytterligare Information (same for all types) ──

function StepAdditionalInfo() {
  const t = useTranslate();
  return (
    <OfferSendSection
      title={t(localizationConstants.b2bCreateAdditionalOptional)}
      icon={<Image src="/assets/icons/info.svg" alt="" width={20} height={20} />}
      defaultOpen
    >
      <div className="space-y-4">
        <p className="text-sm font-medium text-zinc-950">
          {t(localizationConstants.b2bCreateAdditionalLabel)}{" "}
          <span className="font-normal text-slate-500">[underkategori]</span>
        </p>
        <Textarea
          placeholder={`${t(localizationConstants.b2bCreateAdditionalPlaceholder)} [underkategori]`}
          className="min-h-36"
        />
        <p className="text-sm text-slate-500">
          {t(localizationConstants.b2bCreateAdditionalHint)}
        </p>
      </div>
    </OfferSendSection>
  );
}

// ── Preview: full read-only summary ──

function PreviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full cursor-pointer items-center justify-between border-b border-slate-200 px-5 py-4"
      >
        <span className="text-base font-medium text-zinc-950">{title}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-zinc-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden={true}
        />
      </button>
      {open && (
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 px-5 py-4">{children}</div>
      )}
    </div>
  );
}

function PreviewField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-sm font-medium text-zinc-950">{value || "—"}</span>
    </div>
  );
}

function StepPreview({
  dealType,
  onBack,
  onSubmit,
}: {
  dealType: DealType;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const t = useTranslate();
  const typeLabel = DEAL_TYPE_LABELS[dealType];
  const badgeColor = DEAL_TYPE_BADGE_COLORS[dealType];

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      <div className="flex items-center gap-3 px-6 py-4">
        <button
          type="button"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={onBack}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:text-slate-950"
        >
          <ArrowLeft size={20} aria-hidden={true} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t(localizationConstants.b2bCreatePreview)}
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6">
        <div className="grid grid-cols-1 gap-5 pl-9 lg:grid-cols-[1fr_300px]">
          {/* Left: collapsible sections */}
          <div className="flex flex-col gap-4">
            <PreviewSection title={t(localizationConstants.b2bDealDetailContactInfo)}>
              <PreviewField label={t(localizationConstants.firstNameLabel)} value="Kalle Andersson" />
              <PreviewField label={t(localizationConstants.emailLabel)} value="kalle@example.test" />
              <PreviewField label={t(localizationConstants.phone)} value="070 123 45 67" />
              <PreviewField label={t(localizationConstants.postalCode)} value="168 52" />
              <PreviewField
                label={t(localizationConstants.address)}
                value="Storgatan 16, 18800 Stockholm"
              />
              <PreviewField label={t(localizationConstants.city)} value="Stockholm" />
            </PreviewSection>

            <PreviewSection title={t(localizationConstants.b2bCreateStepRequest)}>
              <PreviewField label={t(localizationConstants.projectName)} value="Köksrenoveringsjobb" />
              <PreviewField label={t(localizationConstants.b2bDealDetailProjectNumber)} value="5264-2025" />
              <PreviewField
                label={t(localizationConstants.b2bDealDetailProjectAddress)}
                value="Storgatan 16, 18800 Stockholm"
              />
              <PreviewField label={t(localizationConstants.city)} value="Stockholm" />
              <PreviewField label={t(localizationConstants.b2bDealDetailContractForm)} value="AB" />
              <PreviewField label={t(localizationConstants.b2bDealDetailJobType)} value={typeLabel} />
            </PreviewSection>

            {dealType === "hyra-in" && (
              <PreviewSection title={t(localizationConstants.b2bCreateTypeHyraIN)}>
                <PreviewField label={t(localizationConstants.b2bAntal)} value="4" />
                <PreviewField
                  label={t(localizationConstants.b2bDealDetailCategoryLabel)}
                  value="Snickare"
                />
                <PreviewField
                  label={t(localizationConstants.descriptionLabel)}
                  value="Beskrivning av uppdraget"
                />
                <PreviewField
                  label={t(localizationConstants.b2bCreateBudgetLabel)}
                  value="385 kr / tim"
                />
                <PreviewField
                  label={t(localizationConstants.myPagesEmpFromDate)}
                  value="22-09-2025"
                />
                <PreviewField
                  label={t(localizationConstants.myPagesEmpToDate)}
                  value="12-01-2026"
                />
              </PreviewSection>
            )}

            {dealType === "hyra-ut" && (
              <PreviewSection title={t(localizationConstants.b2bCreateTypeHyraUT)}>
                <PreviewField
                  label={t(localizationConstants.b2bDealDetailCategoryLabel)}
                  value="Snickare"
                />
                <PreviewField
                  label={t(localizationConstants.b2bDealDetailSubcategoryLabel)}
                  value="Plattsättare"
                />
                <PreviewField label={t(localizationConstants.b2bAntal)} value="4" />
                <PreviewField
                  label={t(localizationConstants.b2bCreateSalesman)}
                  value="Stefan Eriksson"
                />
                <PreviewField
                  label={t(localizationConstants.b2bCreateEndCustomer)}
                  value="Fastighetsbolaget AB"
                />
                <PreviewField
                  label={t(localizationConstants.b2bCreateAvailablePeriod)}
                  value="22-09-2025 – 12-01-2026"
                />
              </PreviewSection>
            )}

            {dealType === "b2b-offert" && (
              <PreviewSection title={t(localizationConstants.b2bCreateTypeB2BOffert)}>
                <PreviewField
                  label={t(localizationConstants.b2bDealDetailCategoryLabel)}
                  value="Snickare"
                />
                <PreviewField
                  label={t(localizationConstants.b2bDealDetailSubcategoryLabel)}
                  value="Plattsättare"
                />
                <PreviewField
                  label={t(localizationConstants.descriptionLabel)}
                  value="Beskrivning av projektet"
                />
                <PreviewField
                  label={t(localizationConstants.b2bCreateEndCompletion)}
                  value="05-01-2026"
                />
                <PreviewField
                  label={t(localizationConstants.b2bDealDetailStartDate)}
                  value="21-12-2024"
                />
                <PreviewField
                  label={t(localizationConstants.b2bDealDetailOfferDate)}
                  value="05-01-2026"
                />
              </PreviewSection>
            )}

            <PreviewSection title={t(localizationConstants.b2bCreateAdditionalOptional)}>
              <div className="col-span-2">
                <PreviewField
                  label={t(localizationConstants.b2bCreateAdditionalLabel)}
                  value="—"
                />
              </div>
            </PreviewSection>
          </div>

          {/* Right: deal summary card */}
          <div className="lg:sticky lg:self-start">
            <Card className="overflow-hidden rounded-lg border border-slate-200 bg-white p-0">
              <div className="flex flex-col gap-4 p-5">
                <div className="flex flex-col gap-2">
                  <span
                    className={`inline-flex self-start items-center rounded-md px-2 py-0.5 text-xs font-medium text-white ${badgeColor}`}
                  >
                    {typeLabel}
                  </span>
                  <p className="text-base font-semibold text-zinc-950">Köksrenoveringsjobb</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Ref. PRJ001</span>
                    <span>·</span>
                    <span>2025-09-22</span>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="ghost"
                    className="h-11 w-full cursor-pointer rounded-md bg-zinc-100 text-sm font-medium text-zinc-950 shadow-sm hover:bg-zinc-200"
                    onClick={onBack}
                  >
                    {t(localizationConstants.cancel)}
                  </Button>
                  <Button
                    className="h-11 w-full cursor-pointer gap-2 rounded-md bg-zinc-900 text-base font-medium text-white shadow-md hover:bg-zinc-800"
                    onClick={onSubmit}
                  >
                    <Send size={16} aria-hidden={true} />
                    {t(localizationConstants.b2bDealDetailSubmit)}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main view ──

export function B2BCreateView() {
  const t = useTranslate();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [dealType, setDealType] = useState<DealType>("b2b-offert");
  const [showPreview, setShowPreview] = useState(false);

  const isLastStep = step === TOTAL_STEPS;
  const progressPercent = (step / TOTAL_STEPS) * 100;

  if (showPreview) {
    return (
      <StepPreview
        dealType={dealType}
        onBack={() => setShowPreview(false)}
        onSubmit={() => router.back()}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4">
        <button
          type="button"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() => (step > 1 ? setStep((s) => s - 1) : router.back())}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:text-slate-950"
        >
          <ArrowLeft size={20} aria-hidden={true} />
        </button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
            {t(localizationConstants.b2bCreateTitle)}
          </h1>
          <p className="text-sm text-slate-500">
            {t(localizationConstants.b2bCreateStep)} {step}/{TOTAL_STEPS}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6">
        <div className="grid grid-cols-1 gap-5 pl-9 lg:grid-cols-[1fr_300px]">
          {/* Left: step content */}
          <div>
            {step === 1 && <StepContactInfo />}
            {step === 2 && (
              <StepRequest dealType={dealType} onDealTypeChange={setDealType} />
            )}
            {step === 3 && dealType === "hyra-in" && <StepTypeHyraIN />}
            {step === 3 && dealType === "hyra-ut" && <StepTypeHyraUT />}
            {step === 3 && dealType === "b2b-offert" && <StepTypeB2BOffert />}
            {step === 4 && <StepAdditionalInfo />}
          </div>

          {/* Right: progress + actions */}
          <div className="lg:sticky lg:self-start">
            <Card className="overflow-hidden rounded-lg border border-slate-200 bg-white p-0">
              <div className="flex flex-col gap-4 p-5">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-zinc-950">
                    {t(localizationConstants.b2bCreateStep)} {step}/{TOTAL_STEPS}
                  </p>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                    <div
                      className="h-full rounded-full bg-zinc-900 transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    variant="ghost"
                    className="h-11 w-full cursor-pointer rounded-md bg-zinc-100 text-sm font-medium text-zinc-950 shadow-sm hover:bg-zinc-200"
                    onClick={() => router.back()}
                  >
                    {t(localizationConstants.cancel)}
                  </Button>
                  {isLastStep && (
                    <Button
                      variant="outline"
                      className="h-11 w-full cursor-pointer gap-2 rounded-md border-slate-200 text-sm font-medium text-zinc-950"
                      onClick={() => setShowPreview(true)}
                    >
                      <Eye size={16} aria-hidden={true} />
                      {t(localizationConstants.b2bCreatePreview)}
                    </Button>
                  )}
                  {!isLastStep ? (
                    <Button
                      className="h-11 w-full cursor-pointer gap-2 rounded-md bg-zinc-900 text-base font-medium text-white shadow-md hover:bg-zinc-800"
                      onClick={() => setStep((s) => s + 1)}
                    >
                      {t(localizationConstants.b2bCreateNext)}
                      <ArrowRight size={16} aria-hidden={true} />
                    </Button>
                  ) : (
                    <Button
                      className="h-11 w-full cursor-pointer gap-2 rounded-md bg-zinc-900 text-base font-medium text-white shadow-md hover:bg-zinc-800"
                      onClick={() => setShowPreview(true)}
                    >
                      <Send size={16} aria-hidden={true} />
                      {t(localizationConstants.b2bDealDetailSubmit)}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
