"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Eye, Plus, Send, MoreVertical } from "lucide-react";
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

type FieldGroupProps = {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
};

function FieldGroup({ label, required, children, className }: FieldGroupProps) {
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

const DUMMY_DOCS = [
  { id: "d1", date: "2024-05-10", name: "Dockumentets namn", type: "PDF" },
  { id: "d2", date: "2024-05-10", name: "Dockumentets namn", type: "PDF" },
];

function StepContactInfo() {
  const t = useTranslate();
  return (
    <OfferSendSection
      title={t(localizationConstants.b2bDealDetailContactInfo)}
      icon={
        <Image
          src="/assets/icons/personal-info.svg"
          alt=""
          width={20}
          height={20}
        />
      }
      defaultOpen
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        <FieldGroup label={t(localizationConstants.firstNameLabel)} required>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={t(
                  localizationConstants.b2bCreateFirstNamePlaceholder,
                )}
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
          <Input
            type="email"
            placeholder={t(localizationConstants.placeholderEmail)}
          />
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

function StepRequest() {
  const t = useTranslate();
  const [linkType, setLinkType] = useState<"project" | "order">("project");

  return (
    <OfferSendSection
      title={t(localizationConstants.b2bCreateStepRequest)}
      icon={
        <Image src="/assets/icons/info.svg" alt="" width={20} height={20} />
      }
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
            placeholder={t(
              localizationConstants.b2bCreateProjectNumberPlaceholder,
            )}
          />
        </FieldGroup>

        {/* Project address + checkbox */}
        <div className="col-span-2 space-y-2">
          <FieldGroup label={t(localizationConstants.b2bDealDetailProjectAddress)}>
            <Input
              placeholder={t(
                localizationConstants.b2bCreateProjectAddressPlaceholder,
              )}
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
              <SelectValue
                placeholder={t(localizationConstants.placeholderSelect)}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ab">AB</SelectItem>
              <SelectItem value="abt">ABT</SelectItem>
              <SelectItem value="utl">UTL</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>
        <FieldGroup label={t(localizationConstants.b2bDealDetailJobType)}>
          <Select defaultValue="b2b-offert">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="b2b-offert">
                B2B-offert | Hyra IN | Hyra Ut
              </SelectItem>
              <SelectItem value="hyra-in">Hyra IN</SelectItem>
              <SelectItem value="hyra-ut">Hyra UT</SelectItem>
            </SelectContent>
          </Select>
        </FieldGroup>

        {/* Link request radio + project/order select */}
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
          <FieldGroup
            label={t(localizationConstants.b2bCreateSelectProjectOrder)}
          >
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={t(
                    localizationConstants.b2bCreateProjectOrderPlaceholder,
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="prj001">PRJ001</SelectItem>
                <SelectItem value="ord001">ORD001</SelectItem>
              </SelectContent>
            </Select>
          </FieldGroup>
        </div>

        {/* Address optional textarea */}
        <div className="col-span-2">
          <FieldGroup
            label={t(localizationConstants.b2bCreateAddressOptionalLabel)}
          >
            <Textarea
              placeholder={t(
                localizationConstants.b2bCreateAddressOptionalPlaceholder,
              )}
              className="min-h-20"
            />
          </FieldGroup>
        </div>
      </div>
    </OfferSendSection>
  );
}

function StepType() {
  const t = useTranslate();
  const [uploadedFiles] = useState<string[]>([
    "Document 1.pdf",
    "Document 2.doc",
  ]);

  return (
    <OfferSendSection
      title={t(localizationConstants.b2bDealDetailType)}
      icon={
        <Image src="/assets/icons/folders.svg" alt="" width={20} height={20} />
      }
      defaultOpen
    >
      <div className="grid grid-cols-2 gap-x-6 gap-y-5">
        {/* Antal */}
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

        {/* Välj kategori */}
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

        {/* Beskrivning */}
        <div className="col-span-1">
          <FieldGroup label={t(localizationConstants.descriptionLabel)}>
            <Textarea
              placeholder={t(localizationConstants.descriptionPlaceholder)}
              className="min-h-24"
            />
          </FieldGroup>
        </div>

        {/* Budget Tim/pris */}
        <div className="col-span-1">
          <FieldGroup label={t(localizationConstants.b2bCreateBudgetLabel)}>
            <div className="flex items-center gap-2">
              <Input
                placeholder={t(
                  localizationConstants.b2bCreateBudgetHourPlaceholder,
                )}
                className="flex-1"
              />
              <Input
                placeholder={t(
                  localizationConstants.b2bCreateBudgetUnitPlaceholder,
                )}
                className="w-20 shrink-0"
              />
            </div>
          </FieldGroup>
        </div>

        {/* Datum - Period */}
        <div className="col-span-2">
          <FieldGroup label={t(localizationConstants.b2bCreateDatumPeriod)}>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="date"
                placeholder={t(localizationConstants.myPagesEmpFromDate)}
              />
              <Input
                type="date"
                placeholder={t(localizationConstants.myPagesEmpToDate)}
              />
            </div>
          </FieldGroup>
        </div>

        {/* File upload */}
        <div className="col-span-2 space-y-2">
          <p className="text-sm font-medium text-zinc-950">
            {t(localizationConstants.offerFormUploadFiles)}
          </p>
          <p className="text-sm text-slate-500">
            {t(localizationConstants.offerFormFileTypesInfo)}
          </p>
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

        {/* GDPR */}
        <div className="col-span-2">
          <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-700">
            <Checkbox className="mt-0.5 shrink-0" />
            <span>
              {t(localizationConstants.b2bCreateGdprText)}{" "}
              <a
                href="#"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {t(localizationConstants.b2bCreateGdprLink)}
              </a>{" "}
              {t(localizationConstants.b2bCreateGdprSuffix)}
            </span>
          </label>
        </div>

        {/* Bifogade dokument */}
        <div className="col-span-2 space-y-3">
          <p className="text-sm font-semibold text-slate-900">
            {t(localizationConstants.b2bDealDetailAttachments)}
          </p>
          <div className="overflow-hidden rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-slate-500"
                  >
                    {t(localizationConstants.columnDate)}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-slate-500"
                  >
                    {t(localizationConstants.columnDocumentName)}
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-xs font-medium text-slate-500"
                  >
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
                  <tr
                    key={doc.id}
                    className="border-b border-slate-200 last:border-0"
                  >
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
        </div>
      </div>
    </OfferSendSection>
  );
}

function StepAdditionalInfo() {
  const t = useTranslate();
  return (
    <OfferSendSection
      title={t(localizationConstants.b2bCreateAdditionalOptional)}
      icon={
        <Image src="/assets/icons/info.svg" alt="" width={20} height={20} />
      }
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

export function B2BCreateView() {
  const t = useTranslate();
  const router = useRouter();
  const [step, setStep] = useState(1);

  const isLastStep = step === TOTAL_STEPS;
  const progressPercent = (step / TOTAL_STEPS) * 100;

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4">
        <button
          type="button"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() =>
            step > 1 ? setStep((s) => s - 1) : router.back()
          }
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
            {step === 2 && <StepRequest />}
            {step === 3 && <StepType />}
            {step === 4 && <StepAdditionalInfo />}
          </div>

          {/* Right: progress + actions */}
          <div className="lg:sticky lg:self-start">
            <Card className="overflow-hidden rounded-lg border border-slate-200 bg-white p-0">
              <div className="flex flex-col gap-4 p-5">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-zinc-950">
                    {t(localizationConstants.b2bCreateStep)} {step}/
                    {TOTAL_STEPS}
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
                    <Button className="h-11 w-full cursor-pointer gap-2 rounded-md bg-zinc-900 text-base font-medium text-white shadow-md hover:bg-zinc-800">
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
