"use client";

import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  ChevronUp,
  Download,
  FilePlus,
  Glasses,
  Info,
  LayoutList,
  Loader2,
  Map,
  MapPin,
  PenTool,
  Send,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useTranslate, Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import { B2BAgreementDetail } from "../types/agreement";
import { useB2BAgreements } from "../hooks/useB2BAgreements";
import {
  useAgreementDraftFromContext,
  EMPTY_AGREEMENT_DRAFT,
} from "../hooks/useAgreementDraftFromContext";
import {
  B2B_AVAILABLE_TEMPLATES,
  B2B_STANDARD_ATTACHMENTS,
} from "../constants/agreementOptions";

function AccordionSection({
  title,
  icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-lg border border-[#E5E5E5] bg-white shadow-2xs">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            className="flex h-[56px] min-h-[56px] w-full cursor-pointer items-center justify-between px-5 py-0 text-left transition-colors hover:bg-slate-50 font-normal rounded-none shadow-none"
          >
            <div className="flex items-center gap-3">
              {icon && <span className="flex items-center shrink-0 text-slate-800">{icon}</span>}
              <span className="font-sans text-base font-medium leading-6 tracking-normal text-slate-900">
                {title}
              </span>
            </div>
            <ChevronUp
              size={18}
              className={cn(
                "text-zinc-500 transition-transform duration-200",
                !open && "rotate-180"
              )}
              aria-hidden={true}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t border-[#E5E5E5] px-5 py-4">{children}</div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
        {label}
      </span>
      <span className="font-sans text-sm font-normal leading-5 tracking-normal text-slate-500">
        {value !== undefined && value !== null ? String(value) : "—"}
      </span>
    </div>
  );
}

function FormFieldGroup({
  label,
  error,
  children,
  className,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
        {label}
      </Label>
      {children}
      {error && <span className="text-xs text-red-500 font-medium">{error}</span>}
    </div>
  );
}

function DocTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex h-[24px] w-[100px] shrink-0 items-center justify-between rounded bg-zinc-100 px-2 text-xs font-medium text-zinc-700">
      <span className="truncate">{label}</span>
      <span
        role="button"
        tabIndex={0}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onRemove();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            onRemove();
          }
        }}
        className="cursor-pointer text-zinc-500 hover:text-zinc-950 transition-colors shrink-0 ml-1 inline-flex items-center justify-center p-0.5"
        aria-label={`Ta bort ${label}`}
      >
        <X size={13} aria-hidden={true} />
      </span>
    </span>
  );
}

interface Props {
  data?: B2BAgreementDetail;
}

export function B2BCreateAgreementView({ data: initialData = EMPTY_AGREEMENT_DRAFT }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([
    "Document 1.pdf",
    "Document 2.doc",
  ]);

  const queryProjectId = searchParams.get("projectId") || undefined;
  const queryOfferId = searchParams.get("offerId") || undefined;

  const { draft, isLoading: isDraftLoading } = useAgreementDraftFromContext(
    queryProjectId,
    queryOfferId
  );
  const resolvedData = queryProjectId || queryOfferId ? draft : initialData;

  const addTemplateTag = (tag: string) => {
    if (!selectedTemplates.includes(tag)) {
      setSelectedTemplates((prev) => [...prev, tag]);
    }
  };

  const removeTemplateTag = (tag: string) => {
    setSelectedTemplates((prev) => prev.filter((t) => t !== tag));
  };

  const {
    data,
    clientForm,
    supplierForm,
    signatureForm,
    attachedDocs,
    fieldErrors,
    isSubmitting,
    updateClientField,
    updateSupplierField,
    updateBestallareField,
    updateEntreprenorField,
    removeDocTag,
    addDocTag,
    handleFileUpload,
    handleDownloadTemplates,
    handleCreateAgreement,
  } = useB2BAgreements(resolvedData, queryProjectId);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      setSelectedFileName(files[0].name);
    }
  };

  const onSubmitFile = () => {
    if (fileInputRef.current?.files?.[0]) {
      handleFileUpload(fileInputRef.current.files[0]);
      setSelectedFileName("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleBackToOffer = () => {
    router.push(
      `/module/business/b2b/overview/${queryProjectId || "1"}/offer/${queryOfferId || "1"}`
    );
  };

  const onSendAgreement = () => {
    handleCreateAgreement((newId) => {
      router.push(
        `/module/business/b2b/agreements/${newId || data.id}?projectId=${queryProjectId || data.projectInfo.refNr || "1"}&offerId=${queryOfferId || "1"}`
      );
    });
  };

  if (isDraftLoading) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" aria-hidden={true} />
      </div>
    );
  }

  return (
    <div className="min-h-full w-full bg-slate-50 flex flex-1 flex-col">
      {/* Subheader with Back Button */}
      <div className="flex shrink-0 flex-col gap-1 px-4 pt-6 pb-6">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={t(localizationConstants.goBackButton)}
            onClick={handleBackToOffer}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-900 hover:bg-slate-200/60 transition-colors p-0"
          >
            <ArrowLeft size={20} aria-hidden={true} />
          </Button>
          <h1 className="font-sans text-2xl font-semibold leading-none tracking-[-0.6px] text-slate-950">
            {t(localizationConstants.b2bAvtalSkapaTitle)}
          </h1>
        </div>
        <p className="pl-10 font-sans text-sm font-normal leading-5 tracking-normal text-slate-500">
          {t(localizationConstants.b2bAvtalDescription)}
        </p>
      </div>

      {/* Main scrolling wrapper */}
      <div className="flex flex-1 flex-col pl-4 sm:pl-6 md:pl-11 pr-4 sm:pr-5 md:pr-6 pb-10">
        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_480px] min-[1440px]:grid-cols-[1fr_514px] items-start">
          {/* Left Column (Accordion Cards) */}
          <div className="flex flex-col gap-4">
            {/* 1. Projekt information */}
            <AccordionSection
              title={t(localizationConstants.b2bAvtalSectionProjekt)}
              icon={<Info className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                <InfoItem
                  label={t(localizationConstants.b2bAvtalProjektNamn)}
                  value={data.projectInfo.projektNamn}
                />
                <InfoItem
                  label={t(localizationConstants.b2bAvtalProjektNummer)}
                  value={`${data.projectInfo.projektNummer} / ${data.projectInfo.offertNr}`}
                />
                <InfoItem
                  label={t(localizationConstants.b2bAvtalAdress)}
                  value={data.projectInfo.adress}
                />
                <InfoItem
                  label={t(localizationConstants.b2bAvtalKontraktTyp)}
                  value={data.projectInfo.kontraktTyp}
                />
                <InfoItem
                  label={t(localizationConstants.b2bAvtalKund)}
                  value={data.projectInfo.kund}
                />
                <InfoItem
                  label={t(localizationConstants.b2bAvtalPris)}
                  value={formatCurrency(data.projectInfo.pris)}
                />
                <InfoItem
                  label={t(localizationConstants.b2bAvtalStartDatum)}
                  value={data.projectInfo.startDatum}
                />
                <InfoItem
                  label={t(localizationConstants.b2bAvtalSlutDatum)}
                  value={data.projectInfo.slutDatum}
                />
              </div>
            </AccordionSection>

            {/* 2. Kund */}
            <AccordionSection
              title={t(localizationConstants.b2bAvtalSectionKund)}
              icon={<Building2 className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormFieldGroup label={t(localizationConstants.b2bAvtalKund)} error={fieldErrors["client.kund"]}>
                  <Input
                    className={cn(
                      "h-10 rounded-lg border-slate-200 bg-white text-sm",
                      fieldErrors["client.kund"] && "border-red-500 focus-visible:ring-red-500"
                    )}
                    placeholder={t(localizationConstants.b2bAvtalCompanyOrPersonPlaceholder)}
                    value={clientForm.kund}
                    onChange={(e) => updateClientField("kund", e.target.value)}
                  />
                </FormFieldGroup>
                <FormFieldGroup label={t(localizationConstants.b2bAvtalKontraktPerson)}>
                  <Input
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                    placeholder={t(localizationConstants.b2bAvtalPlaceholderKontaktPerson)}
                    value={clientForm.kontaktPerson}
                    onChange={(e) => updateClientField("kontaktPerson", e.target.value)}
                  />
                </FormFieldGroup>
                <FormFieldGroup label={t(localizationConstants.b2bAvtalOrgNr)}>
                  <Input
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                    placeholder={t(localizationConstants.b2bAvtalPlaceholderOrgNr)}
                    value={clientForm.orgNr}
                    onChange={(e) => updateClientField("orgNr", e.target.value)}
                  />
                </FormFieldGroup>
                <FormFieldGroup label={t(localizationConstants.b2bAvtalTelefon)}>
                  <Input
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                    placeholder={t(localizationConstants.b2bAvtalPlaceholderTelefon)}
                    value={clientForm.telefon}
                    onChange={(e) => updateClientField("telefon", e.target.value)}
                  />
                </FormFieldGroup>
                <FormFieldGroup label={t(localizationConstants.b2bAvtalPersonNummer)}>
                  <Input
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                    placeholder={t(localizationConstants.b2bAvtalPlaceholderPersonNummer)}
                    value={clientForm.personNummer}
                    onChange={(e) => updateClientField("personNummer", e.target.value)}
                  />
                </FormFieldGroup>
                <FormFieldGroup label={t(localizationConstants.b2bAvtalEmail)}>
                  <Input
                    type="email"
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                    placeholder={t(localizationConstants.b2bAvtalPlaceholderEmail)}
                    value={clientForm.email}
                    onChange={(e) => updateClientField("email", e.target.value)}
                  />
                </FormFieldGroup>
                <FormFieldGroup
                  label={t(localizationConstants.b2bAvtalAdress)}
                  className="sm:col-span-2"
                >
                  <Input
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                    placeholder={t(localizationConstants.b2bAvtalPlaceholderAdress)}
                    value={clientForm.adress}
                    onChange={(e) => updateClientField("adress", e.target.value)}
                  />
                </FormFieldGroup>
              </div>
            </AccordionSection>

            {/* 3. Leverantör */}
            <AccordionSection
              title={t(localizationConstants.b2bAvtalSectionLeverantor)}
              icon={<LayoutList className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormFieldGroup label={t(localizationConstants.b2bAvtalForetag)}>
                  <Input
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                    placeholder={t(localizationConstants.b2bAvtalPlaceholderForetag)}
                    value={supplierForm.foretag}
                    onChange={(e) => updateSupplierField("foretag", e.target.value)}
                  />
                </FormFieldGroup>
                <FormFieldGroup label={t(localizationConstants.b2bAvtalFirmatecknare)}>
                  <Input
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                    placeholder={t(localizationConstants.b2bAvtalPlaceholderFirmatecknare)}
                    value={supplierForm.firmatecknare}
                    onChange={(e) => updateSupplierField("firmatecknare", e.target.value)}
                  />
                </FormFieldGroup>
                <FormFieldGroup label={t(localizationConstants.b2bAvtalOrgNr)}>
                  <Input
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                    placeholder={t(localizationConstants.b2bAvtalPlaceholderSupplierOrgNr)}
                    value={supplierForm.orgNr}
                    onChange={(e) => updateSupplierField("orgNr", e.target.value)}
                  />
                </FormFieldGroup>
                <FormFieldGroup label={t(localizationConstants.b2bAvtalPersonNummer)}>
                  <Input
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                    placeholder={t(localizationConstants.b2bAvtalPlaceholderPersonNummer)}
                    value={supplierForm.personNummer}
                    onChange={(e) => updateSupplierField("personNummer", e.target.value)}
                  />
                </FormFieldGroup>
                <FormFieldGroup label={t(localizationConstants.b2bAvtalTelefon)}>
                  <Input
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                    placeholder={t(localizationConstants.b2bAvtalPlaceholderTelefon)}
                    value={supplierForm.telefon}
                    onChange={(e) => updateSupplierField("telefon", e.target.value)}
                  />
                </FormFieldGroup>
                <FormFieldGroup label={t(localizationConstants.b2bAvtalEmail)}>
                  <Input
                    type="email"
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                    placeholder={t(localizationConstants.b2bAvtalPlaceholderEmail)}
                    value={supplierForm.email}
                    onChange={(e) => updateSupplierField("email", e.target.value)}
                  />
                </FormFieldGroup>
                <FormFieldGroup
                  label={t(localizationConstants.b2bAvtalAdress)}
                  className="sm:col-span-2"
                >
                  <Input
                    className="h-10 rounded-lg border-slate-200 bg-white text-sm"
                    placeholder={t(localizationConstants.b2bAvtalPlaceholderAdress)}
                    value={supplierForm.adress}
                    onChange={(e) => updateSupplierField("adress", e.target.value)}
                  />
                </FormFieldGroup>
              </div>
            </AccordionSection>

            {/* 4. Documents */}
            <AccordionSection
              title={t(localizationConstants.b2bAvtalSectionDokument)}
              icon={<FilePlus className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="flex flex-col gap-4">
                <FormFieldGroup label={t(localizationConstants.b2bAvtalBifogaBilagor)}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div
                        role="button"
                        tabIndex={0}
                        className="flex min-h-[42px] h-auto w-full items-center justify-between rounded-lg border border-slate-200 bg-white p-2 text-left cursor-pointer hover:border-slate-300 transition-colors shadow-none font-normal"
                      >
                        <div className="flex flex-wrap items-center gap-1.5">
                          {attachedDocs.length === 0 ? (
                            <span className="text-xs text-slate-400">
                              {t(localizationConstants.b2bAvtalSelectAttachmentsPlaceholder)}
                            </span>
                          ) : (
                            attachedDocs.map((doc) => (
                              <DocTag
                                key={doc}
                                label={doc}
                                onRemove={() => removeDocTag(doc)}
                              />
                            ))
                          )}
                        </div>
                        <ChevronUp size={16} className="text-zinc-500 rotate-180 shrink-0 ml-2" aria-hidden={true} />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-[320px] rounded-lg bg-white p-1 shadow-lg border border-slate-200">
                      {B2B_STANDARD_ATTACHMENTS.map((item) => {
                        const isSelected = attachedDocs.includes(item);
                        return (
                          <DropdownMenuItem
                            key={item}
                            onClick={() => (isSelected ? removeDocTag(item) : addDocTag(item))}
                            className="flex items-center justify-between px-3 py-2 text-xs cursor-pointer hover:bg-slate-50 rounded-md"
                          >
                            <span className="text-slate-900">{item}</span>
                            {isSelected ? (
                              <span className="text-xs font-semibold text-emerald-600">
                                {t(localizationConstants.b2bAvtalSelectedBadge)}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400">
                                {t(localizationConstants.b2bAvtalAddAttachment)}
                              </span>
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </FormFieldGroup>

                <FormFieldGroup label={t(localizationConstants.b2bAvtalLaddaNerMallar)}>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0 w-full">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <div
                          role="button"
                          tabIndex={0}
                          className="flex min-h-[42px] h-auto flex-1 min-w-0 items-center justify-between rounded-lg border border-slate-200 bg-white p-2 text-left cursor-pointer hover:border-slate-300 transition-colors shadow-none font-normal"
                        >
                          <div className="flex flex-wrap items-center gap-1.5">
                            {selectedTemplates.length === 0 ? (
                              <span className="text-xs text-slate-400">
                                {t(localizationConstants.b2bAvtalSelectAttachmentsPlaceholder)}
                              </span>
                            ) : (
                              selectedTemplates.map((tmpl) => (
                                <DocTag
                                  key={tmpl}
                                  label={tmpl}
                                  onRemove={() => removeTemplateTag(tmpl)}
                                />
                              ))
                            )}
                          </div>
                          <ChevronUp size={16} className="text-zinc-500 rotate-180 shrink-0 ml-2" aria-hidden={true} />
                        </div>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-[320px] rounded-lg bg-white p-1 shadow-lg border border-slate-200">
                        {B2B_AVAILABLE_TEMPLATES.map((tmpl) => {
                          const isSelected = selectedTemplates.includes(tmpl.label);
                          return (
                            <DropdownMenuItem
                              key={tmpl.id}
                              onClick={() => (isSelected ? removeTemplateTag(tmpl.label) : addTemplateTag(tmpl.label))}
                              className="flex items-center justify-between px-3 py-2 text-xs cursor-pointer hover:bg-slate-50 rounded-md"
                            >
                              <div className="flex flex-col">
                                <span className="text-slate-900 font-medium">{tmpl.namn}</span>
                                <span className="text-[11px] text-slate-400">{tmpl.label}</span>
                              </div>
                              {isSelected ? (
                                <span className="text-xs font-semibold text-emerald-600">
                                  {t(localizationConstants.b2bAvtalSelectedBadge)}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">
                                  {t(localizationConstants.b2bAvtalAddAttachment)}
                                </span>
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                      type="button"
                      onClick={() => handleDownloadTemplates(selectedTemplates)}
                      className="h-[42px] cursor-pointer gap-2 bg-slate-900 px-4 text-sm font-medium text-white hover:bg-slate-800 rounded-lg shadow-xs transition-colors shrink-0"
                    >
                      <Download size={15} aria-hidden={true} />
                      <span>{t(localizationConstants.b2bAvtalDownload)}</span>
                    </Button>
                  </div>
                </FormFieldGroup>
              </div>
            </AccordionSection>

            {/* 5. File Upload */}
            <AccordionSection
              title={t(localizationConstants.b2bAvtalLaddaUppFiler)}
              icon={<Upload className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label className="font-sans text-sm font-medium leading-5 tracking-normal text-slate-900">
                    {t(localizationConstants.b2bAvtalLaddaUppFiler)}
                  </Label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 min-w-0 w-full">
                    <div className="flex flex-1 min-w-0 h-10 items-center rounded-lg border border-slate-200 bg-white px-3 overflow-hidden">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => fileInputRef.current?.click()}
                        className="h-auto cursor-pointer bg-transparent border-0 text-sm font-medium text-slate-700 hover:text-slate-950 p-0 focus:outline-none shrink-0 hover:bg-transparent shadow-none"
                      >
                        {t(localizationConstants.b2bAvtalLaddaUpp)}
                      </Button>
                      <span
                        className="ml-3 text-sm text-slate-700 font-normal truncate min-w-0 flex-1"
                        title={selectedFileName || undefined}
                      >
                        {selectedFileName || t(localizationConstants.b2bAvtalNoFileChosen)}
                      </span>
                      <Input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={onFileChange}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={onSubmitFile}
                      className="h-10 cursor-pointer bg-slate-900 px-5 text-sm font-medium text-white hover:bg-slate-800 rounded-lg shadow-xs shrink-0"
                    >
                      {t(localizationConstants.b2bAvtalSubmit)}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400 font-normal">
                    {t(localizationConstants.b2bAvtalFilerNote)}
                  </p>
                </div>
                {/* Empty column 2 */}
                <div className="hidden sm:block" />
              </div>
            </AccordionSection>

            {/* 6. Underskrift av kontrakt */}
            <AccordionSection
              title={t(localizationConstants.b2bAvtalSectionUnderskrift)}
              icon={<PenTool className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Beställare */}
                <div className="flex flex-col gap-3.5">
                  <FormFieldGroup
                    label={t(localizationConstants.b2bAvtalBestellare)}
                    error={fieldErrors["signature.bestallare.foretagsNamn"]}
                  >
                    <Input
                      className={cn(
                        "h-10 rounded-lg border-slate-200 bg-white text-sm",
                        fieldErrors["signature.bestallare.foretagsNamn"] && "border-red-500 focus-visible:ring-red-500"
                      )}
                      placeholder={t(localizationConstants.b2bAvtalPlaceholderForetag)}
                      value={signatureForm.bestallare.foretagsNamn}
                      onChange={(e) => updateBestallareField("foretagsNamn", e.target.value)}
                    />
                  </FormFieldGroup>
                  <FormFieldGroup
                    label={t(localizationConstants.b2bAvtalNamn)}
                    error={fieldErrors["signature.bestallare.namn"]}
                  >
                    <Input
                      className={cn(
                        "h-10 rounded-lg border-slate-200 bg-white text-sm",
                        fieldErrors["signature.bestallare.namn"] && "border-red-500 focus-visible:ring-red-500"
                      )}
                      placeholder={t(localizationConstants.b2bAvtalPlaceholderStefanLarsson)}
                      value={signatureForm.bestallare.namn}
                      onChange={(e) => updateBestallareField("namn", e.target.value)}
                    />
                  </FormFieldGroup>
                  <FormFieldGroup
                    label={t(localizationConstants.b2bAvtalEmail)}
                    error={fieldErrors["signature.bestallare.mail"]}
                  >
                    <Input
                      type="email"
                      className={cn(
                        "h-10 rounded-lg border-slate-200 bg-white text-sm",
                        fieldErrors["signature.bestallare.mail"] && "border-red-500 focus-visible:ring-red-500"
                      )}
                      placeholder={t(localizationConstants.b2bAvtalPlaceholderStefanEmail)}
                      value={signatureForm.bestallare.mail}
                      onChange={(e) => updateBestallareField("mail", e.target.value)}
                    />
                  </FormFieldGroup>
                  <FormFieldGroup
                    label={t(localizationConstants.b2bAvtalMobil)}
                    error={fieldErrors["signature.bestallare.mobil"]}
                  >
                    <Input
                      className={cn(
                        "h-10 rounded-lg border-slate-200 bg-white text-sm",
                        fieldErrors["signature.bestallare.mobil"] && "border-red-500 focus-visible:ring-red-500"
                      )}
                      placeholder={t(localizationConstants.b2bAvtalPlaceholderStefanMobil)}
                      value={signatureForm.bestallare.mobil}
                      onChange={(e) => updateBestallareField("mobil", e.target.value)}
                    />
                  </FormFieldGroup>
                </div>

                {/* Entreprenör */}
                <div className="flex flex-col gap-3.5">
                  <FormFieldGroup
                    label={t(localizationConstants.b2bAvtalEntreprenor)}
                    error={fieldErrors["signature.entreprenor.foretagsNamn"]}
                  >
                    <Input
                      className={cn(
                        "h-10 rounded-lg border-slate-200 bg-white text-sm",
                        fieldErrors["signature.entreprenor.foretagsNamn"] && "border-red-500 focus-visible:ring-red-500"
                      )}
                      placeholder={t(localizationConstants.b2bAvtalPlaceholderByggbolaget)}
                      value={signatureForm.entreprenor.foretagsNamn}
                      onChange={(e) => updateEntreprenorField("foretagsNamn", e.target.value)}
                    />
                  </FormFieldGroup>
                  <FormFieldGroup
                    label={t(localizationConstants.b2bAvtalNamn)}
                    error={fieldErrors["signature.entreprenor.namn"]}
                  >
                    <Input
                      className={cn(
                        "h-10 rounded-lg border-slate-200 bg-white text-sm",
                        fieldErrors["signature.entreprenor.namn"] && "border-red-500 focus-visible:ring-red-500"
                      )}
                      placeholder={t(localizationConstants.b2bAvtalPlaceholderKontaktPerson)}
                      value={signatureForm.entreprenor.namn}
                      onChange={(e) => updateEntreprenorField("namn", e.target.value)}
                    />
                  </FormFieldGroup>
                  <FormFieldGroup
                    label={t(localizationConstants.b2bAvtalEmail)}
                    error={fieldErrors["signature.entreprenor.mail"]}
                  >
                    <Input
                      type="email"
                      className={cn(
                        "h-10 rounded-lg border-slate-200 bg-white text-sm",
                        fieldErrors["signature.entreprenor.mail"] && "border-red-500 focus-visible:ring-red-500"
                      )}
                      placeholder={t(localizationConstants.b2bAvtalPlaceholderKalleEmail)}
                      value={signatureForm.entreprenor.mail}
                      onChange={(e) => updateEntreprenorField("mail", e.target.value)}
                    />
                  </FormFieldGroup>
                  <FormFieldGroup
                    label={t(localizationConstants.b2bAvtalMobil)}
                    error={fieldErrors["signature.entreprenor.mobil"]}
                  >
                    <Input
                      className={cn(
                        "h-10 rounded-lg border-slate-200 bg-white text-sm",
                        fieldErrors["signature.entreprenor.mobil"] && "border-red-500 focus-visible:ring-red-500"
                      )}
                      placeholder={t(localizationConstants.b2bAvtalPlaceholderKalleMobil)}
                      value={signatureForm.entreprenor.mobil}
                      onChange={(e) => updateEntreprenorField("mobil", e.target.value)}
                    />
                  </FormFieldGroup>
                </div>
              </div>
            </AccordionSection>
          </div>

          {/* Right Column (Summary & Action Card) */}
          <div className="flex flex-col gap-4 self-start">
            <div className="overflow-hidden rounded-lg border border-[#E5E5E5] bg-white p-3.5 sm:p-4 shadow-2xs">
              <div className="flex items-start justify-between gap-2">
                <span className="font-sans text-sm font-semibold leading-5 tracking-normal text-slate-900">
                  {data.projectInfo.projektNamn}
                </span>
                <span className="shrink-0 rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700">
                  {data.projectInfo.refNr}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-0.5 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <Map size={10} aria-hidden={true} />
                  {data.projectInfo.city}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  <MapPin size={10} aria-hidden={true} />
                  {data.projectInfo.municipality}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                {t(localizationConstants.b2bDealCreatedDate)}: {data.projectInfo.postedDate}
              </p>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xs font-medium text-slate-500">
                  <Translate text={localizationConstants.b2bArchiveTotalOffer} />
                </span>
                <span className="text-base font-bold tabular-nums text-slate-900">
                  {formatCurrency(data.projectInfo.totalOffert)}
                </span>
              </div>

              {/* Separator line below price */}
              <div className="my-3.5 -mx-3.5 sm:-mx-4 border-b border-[#E5E5E5]" />

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBackToOffer}
                  className="h-10 w-full cursor-pointer rounded-lg bg-zinc-100 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors shadow-none"
                >
                  {t(localizationConstants.cancel)}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/module/business/b2b/agreements/${data.id}?projectId=${queryProjectId || data.projectInfo.refNr || "1"}&offerId=${queryOfferId || "1"}`
                    )
                  }
                  className="h-10 w-full cursor-pointer gap-2 border border-slate-200 bg-white text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors rounded-lg shadow-2xs"
                >
                  <Glasses size={17} aria-hidden={true} />
                  <span>{t(localizationConstants.b2bAvtalSeTitle)}</span>
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={onSendAgreement}
                  className="h-10 w-full cursor-pointer gap-2 bg-slate-900 text-sm font-medium text-white hover:bg-slate-800 transition-colors rounded-lg shadow-xs"
                >
                  <Send size={15} aria-hidden={true} />
                  <span>{t(localizationConstants.b2bAvtalSkicka)}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
