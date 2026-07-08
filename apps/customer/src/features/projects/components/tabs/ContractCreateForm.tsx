"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronDown, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Translate, useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

interface ContractFormData {
  firstName: string;
  lastName: string;
  mobile: string;
  privateEmail: string;
  address: string;
  city: string;
  postalCode: string;
  projectName: string;
  isExpress: boolean | null;
  orderNumber: string;
  category: string;
  sameAsContact: boolean;
  projectAddress: string;
  projectCity: string;
  projectPostalCode: string;
  directions: string;
  supplier: string;
  orgNo: string;
  supplierAddress: string;
  supplierPostalCode: string;
  supplierCity: string;
  contactPerson: string;
  contactMobile: string;
  contactEmail: string;
}

interface StagedDocument {
  id: string;
  name: string;
  validity: string;
  fileType: string;
}

interface ContractCreateFormProps {
  onBack: () => void;
  onNext: () => void;
}

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#09090B] mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function SectionHeader({
  iconSrc,
  title,
}: {
  iconSrc: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 px-4 py-[14px] border-b border-[#E4E4E7]">
      <Image src={iconSrc} alt="" width={20} height={20} className="shrink-0" />
      <h3 className="text-base font-medium text-[#09090B]">{title}</h3>
    </div>
  );
}

export function ContractCreateForm({ onBack, onNext }: ContractCreateFormProps) {
  const t = useTranslate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ContractFormData>({
    firstName: "Anna",
    lastName: "Andersson",
    mobile: "070-560 50 50",
    privateEmail: "anna@gmail.com",
    address: "Stengatan 10",
    city: "Solna",
    postalCode: "171 63",
    projectName: "Bathroom",
    isExpress: false,
    orderNumber: "0012",
    category: "Painter",
    sameAsContact: false,
    projectAddress: "Stengatan 10",
    projectCity: "Solna",
    projectPostalCode: "171 63",
    directions: "",
    supplier: "Nolen Contractor",
    orgNo: "556456357375",
    supplierAddress: "Storgatan 115",
    supplierPostalCode: "171 63",
    supplierCity: "Solna",
    contactPerson: "Peter Svensson",
    contactMobile: "0730998800",
    contactEmail: "pelle@gmail.com",
  });

  const [documents, setDocuments] = useState<StagedDocument[]>([
    { id: "1", name: "MaNescriptive", validity: "2026-01-01", fileType: "PDF" },
    { id: "2", name: "Policy", validity: "2026-08-04", fileType: "PDF" },
  ]);

  const [stagedFiles, setStagedFiles] = useState<File[]>([]);

  const set = (key: keyof ContractFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setStagedFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    e.target.value = "";
  };

  const handleUpload = () => {
    if (!stagedFiles.length) return;
    const newDocs: StagedDocument[] = stagedFiles.map((f, i) => ({
      id: `new-${Date.now()}-${i}`,
      name: f.name.replace(/\.[^.]+$/, ""),
      validity: "",
      fileType: (f.name.split(".").pop() ?? "FILE").toUpperCase(),
    }));
    setDocuments((prev) => [...newDocs, ...prev]);
    setStagedFiles([]);
  };

  const removeDoc = (id: string) =>
    setDocuments((prev) => prev.filter((d) => d.id !== id));

  const inputClass =
    "h-9 text-sm border-[#E4E4E7] bg-white shadow-[0px_1px_2px_rgba(16,24,40,0.05)] placeholder:text-[#A1A1AA] focus-visible:ring-1 focus-visible:ring-slate-300 rounded-md";

  return (
    <div className="flex items-start gap-5 pb-12 bg-[#F8FAFC] min-h-screen px-4 pt-6">

      {/* ── Left: main form column ── */}
      <div className="flex-1 min-w-0">

        {/* Page header */}
        <div className="flex items-start gap-3 mb-6">
          <button
            type="button"
            onClick={onBack}
            className="text-[#64748B] hover:text-[#09090B] mt-1 cursor-pointer transition-colors shrink-0"
            aria-label="Back"
          >
            <Image src="/assets/icons/arrow-left.svg" alt="Back" width={20} height={20} />
          </button>
          <div>
            <h2 className="text-base font-semibold text-[#09090B]">
              <Translate text={localizationConstants.projectCreateNewLabel} />
            </h2>
            <p className="text-xs text-[#71717A] mt-0.5">
              <Translate text={localizationConstants.contractCreateSubtitle} />
            </p>
          </div>
        </div>

        <div className="space-y-4">

          {/* ── Personal Details ── */}
          <div className="bg-white border border-[#E5E5E5] rounded-lg">
            <SectionHeader
              iconSrc="/assets/icons/personal-info.svg"
              title={t(localizationConstants.contractPersonalDetailsTitle)}
            />
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label={t(localizationConstants.contractFirstNameLabel)}>
                  <Input
                    value={form.firstName}
                    onChange={(e) => set("firstName", e.target.value)}
                    placeholder="Anna"
                    className={inputClass}
                  />
                </FormField>
                <FormField label={t(localizationConstants.contractLastNameLabel)}>
                  <Input
                    value={form.lastName}
                    onChange={(e) => set("lastName", e.target.value)}
                    placeholder="Andersson"
                    className={inputClass}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label={t(localizationConstants.contractMobileLabel)}>
                  <Input
                    value={form.mobile}
                    onChange={(e) => set("mobile", e.target.value)}
                    placeholder="070-560 50 50"
                    className={inputClass}
                  />
                </FormField>
                <FormField label={t(localizationConstants.contractPrivateEmailLabel)}>
                  <Input
                    value={form.privateEmail}
                    onChange={(e) => set("privateEmail", e.target.value)}
                    placeholder="anna@gmail.com"
                    className={inputClass}
                  />
                </FormField>
              </div>
              <FormField label={t(localizationConstants.contractAddressLabel)}>
                <Input
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                  placeholder="Stengatan 10"
                  className={inputClass}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label={t(localizationConstants.contractCityLabel)}>
                  <div className="relative">
                    <Input
                      value={form.city}
                      onChange={(e) => set("city", e.target.value)}
                      placeholder="Solna"
                      className={`${inputClass} pr-8`}
                    />
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A] pointer-events-none" />
                  </div>
                </FormField>
                <FormField label={t(localizationConstants.contractPostalCodeLabel)}>
                  <Input
                    value={form.postalCode}
                    onChange={(e) => set("postalCode", e.target.value)}
                    placeholder="171 63"
                    className={inputClass}
                  />
                </FormField>
              </div>
            </div>
          </div>

          {/* ── Project Information ── */}
          <div className="bg-white border border-[#E5E5E5] rounded-lg">
            <SectionHeader
              iconSrc="/assets/icons/project-info.svg"
              title={t(localizationConstants.contractProjectInfoTitle)}
            />
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label={t(localizationConstants.contractProjectNameLabel)}>
                  <Input
                    value={form.projectName}
                    onChange={(e) => set("projectName", e.target.value)}
                    placeholder="Bathroom"
                    className={inputClass}
                  />
                </FormField>
                <FormField label={t(localizationConstants.contractExpressJobLabel)}>
                  <div className="flex items-center gap-6 h-9 pt-1">
                    {(["Yes", "No"] as const).map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-1.5 cursor-pointer text-sm font-medium text-[#09090B]"
                      >
                        <input
                          type="radio"
                          name="isExpress"
                          checked={form.isExpress === (opt === "Yes")}
                          onChange={() => set("isExpress", opt === "Yes")}
                          className="accent-[#18181B]"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label={t(localizationConstants.contractOrderNumberLabel)}>
                  <Input
                    value={form.orderNumber}
                    onChange={(e) => set("orderNumber", e.target.value)}
                    placeholder="0012"
                    className={inputClass}
                  />
                </FormField>
                <FormField label={t(localizationConstants.contractCategoryLabel)}>
                  <Input
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    placeholder="Painter"
                    className={inputClass}
                  />
                </FormField>
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-[#09090B] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.sameAsContact}
                  onChange={(e) => set("sameAsContact", e.target.checked)}
                  className="rounded accent-[#18181B]"
                />
                <Translate text={localizationConstants.contractSameAsContactLabel} />
              </label>
              <FormField label={t(localizationConstants.contractProjectAddressLabel)}>
                <Input
                  value={form.projectAddress}
                  onChange={(e) => set("projectAddress", e.target.value)}
                  placeholder="Stengatan 10"
                  className={inputClass}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label={t(localizationConstants.contractCityLabel)}>
                  <div className="relative">
                    <Input
                      value={form.projectCity}
                      onChange={(e) => set("projectCity", e.target.value)}
                      placeholder="Solna"
                      className={`${inputClass} pr-8`}
                    />
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A] pointer-events-none" />
                  </div>
                </FormField>
                <FormField label={t(localizationConstants.contractPostalCodeLabel)}>
                  <Input
                    value={form.projectPostalCode}
                    onChange={(e) => set("projectPostalCode", e.target.value)}
                    placeholder="171 63"
                    className={inputClass}
                  />
                </FormField>
              </div>
              <FormField label={t(localizationConstants.contractDirectionsLabel)} required>
                <textarea
                  value={form.directions}
                  onChange={(e) => set("directions", e.target.value)}
                  placeholder="3rd street from the Ikea store"
                  rows={3}
                  className="w-full rounded-md border border-[#E4E4E7] bg-white px-3 py-2 text-sm shadow-[0px_1px_2px_rgba(16,24,40,0.05)] placeholder:text-[#A1A1AA] focus:outline-none focus:ring-1 focus:ring-slate-300 resize-none"
                />
              </FormField>
            </div>
          </div>

          {/* ── Supplier Information ── */}
          <div className="bg-white border border-[#E5E5E5] rounded-lg">
            <SectionHeader
              iconSrc="/assets/icons/project-info.svg"
              title={t(localizationConstants.contractSupplierInfoTitle)}
            />
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField label={t(localizationConstants.contractSupplierInfoTitle).split(" ")[0]}>
                  <div className="relative">
                    <Input
                      value={form.supplier}
                      onChange={(e) => set("supplier", e.target.value)}
                      placeholder="Nolen Contractor"
                      className={`${inputClass} pr-8`}
                    />
                    <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A] pointer-events-none" />
                  </div>
                </FormField>
                <FormField label={t(localizationConstants.contractOrgNoLabel)}>
                  <Input
                    value={form.orgNo}
                    onChange={(e) => set("orgNo", e.target.value)}
                    placeholder="556456357375"
                    className={inputClass}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label={t(localizationConstants.contractAddressLabel)}>
                  <Input
                    value={form.supplierAddress}
                    onChange={(e) => set("supplierAddress", e.target.value)}
                    placeholder="Storgatan 115"
                    className={inputClass}
                  />
                </FormField>
                <FormField label={t(localizationConstants.contractPostalCodeLabel)}>
                  <Input
                    value={form.supplierPostalCode}
                    onChange={(e) => set("supplierPostalCode", e.target.value)}
                    placeholder="171 63"
                    className={inputClass}
                  />
                </FormField>
              </div>
              <FormField label={t(localizationConstants.contractCityLabel)}>
                <Input
                  value={form.supplierCity}
                  onChange={(e) => set("supplierCity", e.target.value)}
                  placeholder="Solna"
                  className={inputClass}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label={t(localizationConstants.contractContactPersonLabel)}>
                  <Input
                    value={form.contactPerson}
                    onChange={(e) => set("contactPerson", e.target.value)}
                    placeholder="Peter Svensson"
                    className={inputClass}
                  />
                </FormField>
                <FormField label={t(localizationConstants.contractMobileLabel)}>
                  <Input
                    value={form.contactMobile}
                    onChange={(e) => set("contactMobile", e.target.value)}
                    placeholder="0730998800"
                    className={inputClass}
                  />
                </FormField>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField label={t(localizationConstants.contractEmailLabel)}>
                  <Input
                    value={form.contactEmail}
                    onChange={(e) => set("contactEmail", e.target.value)}
                    placeholder="pelle@gmail.com"
                    className={inputClass}
                  />
                </FormField>
                <FormField label={`${t(localizationConstants.contractMobileLabel)} 2`}>
                  <Input placeholder="0730998800" className={inputClass} />
                </FormField>
              </div>
            </div>
          </div>

          {/* ── Project Document ── */}
          <div className="bg-white border border-[#E5E5E5] rounded-lg">
            <SectionHeader
              iconSrc="/assets/icons/folders.svg"
              title={t(localizationConstants.contractProjectDocTitle)}
            />

            <div className="p-4 space-y-4">
              {/* Upload area */}
              <div>
                <p className="text-sm font-medium text-[#09090B] mb-1">
                  <Translate text={localizationConstants.projectUploadFilesLabel} />
                </p>
                <p className="text-xs text-[#A1A1AA] mb-3">
                  PNG-, JPG- och PDF-filer är tillåtna.
                </p>
                <div className="flex gap-2">
                  <div
                    className="flex-1 flex items-center gap-2 flex-wrap border border-[#E4E4E7] rounded-md px-3 py-2 min-h-[36px] cursor-pointer hover:bg-slate-50 transition-colors shadow-[0px_1px_2px_rgba(16,24,40,0.05)]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {stagedFiles.length === 0 ? (
                      <span className="text-sm text-[#A1A1AA] select-none">
                        Select files...
                      </span>
                    ) : (
                      stagedFiles.map((file, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 bg-slate-100 text-xs text-slate-700 px-2 py-0.5 rounded"
                        >
                          {file.name}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setStagedFiles((prev) =>
                                prev.filter((_, idx) => idx !== i),
                              );
                            }}
                            className="text-slate-400 hover:text-slate-700 leading-none"
                          >
                            ×
                          </button>
                        </span>
                      ))
                    )}
                    <ChevronDown className="h-4 w-4 text-[#71717A] ml-auto shrink-0" />
                  </div>
                  <Button
                    type="button"
                    onClick={handleUpload}
                    disabled={stagedFiles.length === 0}
                    className="bg-[#18181B] hover:bg-[#18181B]/90 text-white text-sm font-medium px-5 h-9 rounded-md"
                  >
                    <Translate text={localizationConstants.projectUploadFilesLabel} />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.xlsx,.png,.jpg,.jpeg"
                  />
                </div>
              </div>

              {/* Specification table */}
              <div>
                <p className="text-sm font-medium text-[#09090B] mb-3">
                  <Translate text={localizationConstants.projectSpecificationLabel} />
                </p>
                <div className="border border-[#E5E5E5] rounded-lg overflow-hidden">
                  <div className="grid grid-cols-[140px_1fr_140px_80px_40px] border-b border-[#E2E8F0]">
                    {[
                      localizationConstants.projectFileDateLabel,
                      localizationConstants.projectDocNameLabel,
                      localizationConstants.contractValidityLabel,
                      localizationConstants.projectFileLabel,
                    ].map((key) => (
                      <button
                        key={key}
                        type="button"
                        className="flex items-center gap-1 h-11 px-3 text-sm font-medium text-[#64748B] text-left whitespace-nowrap"
                      >
                        <Translate text={key} />
                      </button>
                    ))}
                    <div className="h-11" />
                  </div>
                  {documents.length === 0 ? (
                    <div className="py-10 text-center text-sm text-slate-400">
                      No documents yet
                    </div>
                  ) : (
                    documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="grid grid-cols-[140px_1fr_140px_80px_40px] items-stretch border-b border-[#E2E8F0] last:border-0 hover:bg-slate-50 transition-colors"
                      >
                        <span className="h-12 flex items-center px-3 text-sm text-[#020617]">
                          {new Date().toISOString().split("T")[0]}
                        </span>
                        <div className="h-12 flex items-center px-3 gap-2 min-w-0 overflow-hidden">
                          <Image
                            src="/assets/icons/file-pdf-icon.svg"
                            alt="PDF"
                            width={24}
                            height={24}
                            className="shrink-0"
                          />
                          <span className="text-sm text-[#020617] truncate min-w-0">
                            {doc.name}
                          </span>
                        </div>
                        <span className="h-12 flex items-center px-3 text-sm text-[#020617]">
                          {doc.validity || "—"}
                        </span>
                        <span className="h-12 flex items-center px-3 text-sm text-[#020617]">
                          {doc.fileType}
                        </span>
                        <div className="h-12 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeDoc(doc.id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-[#E2E8F0]">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-9 px-5 text-sm font-medium border-[#E2E8F0] text-[#09090B]"
          >
            <Translate text={localizationConstants.contractBackLabel} />
          </Button>
          <Button
            type="button"
            onClick={onNext}
            className="h-9 px-5 text-sm font-medium bg-[#18181B] hover:bg-[#18181B]/90 text-white"
          >
            <Translate text={localizationConstants.contractNextStepLabel} />
            &nbsp;→
          </Button>
        </div>
      </div>

      {/* ── Right: Step indicator sidebar ── */}
      <div className="shrink-0 w-80 pt-16">
        <div className="bg-white border border-[#E2E8F0] rounded-lg overflow-hidden">
          {/* Step section */}
          <div className="flex flex-col gap-2 p-5 border-b border-[#E2E8F0]">
            <p className="text-sm font-medium text-[#09090B]">Step 1/2</p>
            <div className="relative w-full h-2 rounded bg-[#E4E4E7]">
              <div className="absolute left-0 top-0 h-2 w-1/2 bg-[#18181B] rounded" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
