"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, Building2, Map, MapPin, Paperclip, PenLine, Truck, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import { CompanyAccordionSection } from "./CompanyAccordionSection";
import { AvtalDetail } from "../types/avtal";

const TEMPLATE_FILES = [
  { id: "t1", label: "Document 1.pdf", type: "pdf" },
  { id: "t2", label: "Document 2.doc", type: "doc" },
];

function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-4">{children}</div>;
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-zinc-700">{label}</Label>
      {children}
    </div>
  );
}

function DocTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
      {label}
      <button type="button" onClick={onRemove} className="cursor-pointer text-slate-400 hover:text-slate-700" aria-label="Remove">
        <X size={12} aria-hidden={true} />
      </button>
    </span>
  );
}

function TemplateFileRow({ label, type, downloadLabel }: { label: string; type: string; downloadLabel: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-slate-200 bg-slate-50 px-3 py-2">
      <div className="flex items-center gap-2">
        {type === "pdf" ? (
          <Image src="/file-type-pdf.png" alt={label} width={20} height={20} className="h-5 w-5 object-contain" />
        ) : (
          <Image src="/file-type-doc.png" alt={label} width={20} height={20} className="h-5 w-5 object-contain" />
        )}
        <span className="text-sm text-zinc-700">{label}</span>
      </div>
      <Button variant="outline" size="sm" className="h-7 cursor-pointer px-3 text-xs">
        {downloadLabel}
      </Button>
    </div>
  );
}

interface Props {
  data: AvtalDetail;
}

export function B2BCreateAvtalView({ data }: Props) {
  const router = useRouter();
  const t = useTranslate();
  const [attachedDocs, setAttachedDocs] = useState(["Document 1", "Document 2"]);

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header — same pattern as B2BAvtalDetailView */}
      <div className="flex items-center gap-3 px-4 py-4">
        <button
          type="button"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() => router.back()}
          className="flex h-8 w-8 cursor-pointer items-center justify-center text-slate-700 hover:text-slate-950"
        >
          <ArrowLeft size={20} aria-hidden={true} />
        </button>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
          {t(localizationConstants.b2bAvtalSkapaTitle)}
        </h1>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-5 px-6 py-4 lg:grid-cols-[1fr_280px]">

          {/* Left column */}
          <div className="space-y-4">

            {/* Projekt information */}
            <CompanyAccordionSection
              title={t(localizationConstants.b2bAvtalSectionProjekt)}
              icon={<Briefcase size={20} />}
            >
              <div className="flex flex-col gap-4">
                <FieldRow>
                  <FieldGroup label={t(localizationConstants.b2bAvtalProjektNamn)}>
                    <Input className="h-9 text-sm" placeholder="Kök Reno Job" />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalProjektNummer)}>
                    <Input className="h-9 text-sm" placeholder="PRJ092 / OF2025-001" />
                  </FieldGroup>
                </FieldRow>
                <FieldRow>
                  <FieldGroup label={t(localizationConstants.b2bAvtalAdress)}>
                    <Input className="h-9 text-sm" placeholder="Storgatan 1, Stockholm" />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalKontraktTyp)}>
                    <Input className="h-9 text-sm" placeholder="ABT92 (AB06)" />
                  </FieldGroup>
                </FieldRow>
                <FieldRow>
                  <FieldGroup label={t(localizationConstants.b2bAvtalKund)}>
                    <Input className="h-9 text-sm" placeholder="Anna Andersson" />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalPris)}>
                    <Input className="h-9 text-sm" placeholder="550 000" />
                  </FieldGroup>
                </FieldRow>
                <FieldRow>
                  <FieldGroup label={t(localizationConstants.b2bAvtalStartDatum)}>
                    <Input className="h-9 text-sm" placeholder="23-10-2024" />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalSlutDatum)}>
                    <Input className="h-9 text-sm" placeholder="23-02-2025" />
                  </FieldGroup>
                </FieldRow>
              </div>
            </CompanyAccordionSection>

            {/* Kund */}
            <CompanyAccordionSection
              title={t(localizationConstants.b2bAvtalSectionKund)}
              icon={<Building2 size={20} />}
            >
              <div className="flex flex-col gap-4">
                <FieldRow>
                  <FieldGroup label={t(localizationConstants.b2bAvtalKundTyp)}>
                    <Input className="h-9 text-sm" placeholder="Fastighetsbolaget AB" />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalKontraktPerson)}>
                    <Input className="h-9 text-sm" placeholder="Kalle Andersson" />
                  </FieldGroup>
                </FieldRow>
                <FieldRow>
                  <FieldGroup label={t(localizationConstants.b2bAvtalOrgNr)}>
                    <Input className="h-9 text-sm" placeholder="1974-05-05-1010" />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalTelefon)}>
                    <Input className="h-9 text-sm" placeholder="076-000005" />
                  </FieldGroup>
                </FieldRow>
                <FieldRow>
                  <FieldGroup label={t(localizationConstants.b2bAvtalPersonNummer)}>
                    <Input className="h-9 text-sm" placeholder="19710505-1010" />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalEmail)}>
                    <Input className="h-9 text-sm" type="email" placeholder="jason@example.com" />
                  </FieldGroup>
                </FieldRow>
                <FieldGroup label={t(localizationConstants.b2bAvtalAdress)}>
                  <Input className="h-9 text-sm" placeholder="Sveavägen 34, lgh 204, 11350 Stockholm, Sverige" />
                </FieldGroup>
              </div>
            </CompanyAccordionSection>

            {/* Leverantör */}
            <CompanyAccordionSection
              title={t(localizationConstants.b2bAvtalSectionLeverantor)}
              icon={<Truck size={20} />}
            >
              <div className="flex flex-col gap-4">
                <FieldRow>
                  <FieldGroup label={t(localizationConstants.b2bAvtalForetag)}>
                    <Input className="h-9 text-sm" placeholder="Byggbolaget AB" />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalFirmatecknare)}>
                    <Input className="h-9 text-sm" placeholder="Stefan Svensson" />
                  </FieldGroup>
                </FieldRow>
                <FieldRow>
                  <FieldGroup label={t(localizationConstants.b2bAvtalOrgNr)}>
                    <Input className="h-9 text-sm" placeholder="551010-5050" />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalPersonNummer)}>
                    <Input className="h-9 text-sm" placeholder="19710505-1010" />
                  </FieldGroup>
                </FieldRow>
                <FieldRow>
                  <FieldGroup label={t(localizationConstants.b2bAvtalTelefon)}>
                    <Input className="h-9 text-sm" placeholder="076-000000" />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalEmail)}>
                    <Input className="h-9 text-sm" type="email" placeholder="jason@example.com" />
                  </FieldGroup>
                </FieldRow>
                <FieldGroup label={t(localizationConstants.b2bAvtalAdress)}>
                  <Input className="h-9 text-sm" placeholder="Sveavägen 34, lgh 204, 11350 Stockholm, Sverige" />
                </FieldGroup>
              </div>
            </CompanyAccordionSection>

            {/* Documents */}
            <CompanyAccordionSection
              title={t(localizationConstants.b2bAvtalSectionDokument)}
              icon={<Paperclip size={20} />}
            >
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-zinc-700">{t(localizationConstants.b2bAvtalBifogaBilagor)}</p>
                  <div className="flex flex-wrap gap-2">
                    {attachedDocs.map((doc) => (
                      <DocTag
                        key={doc}
                        label={doc}
                        onRemove={() => setAttachedDocs((prev) => prev.filter((d) => d !== doc))}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-zinc-700">{t(localizationConstants.b2bAvtalLaddaNerMallar)}</p>
                  <div className="flex flex-col gap-2">
                    {TEMPLATE_FILES.map((f) => (
                      <TemplateFileRow
                        key={f.id}
                        label={f.label}
                        type={f.type}
                        downloadLabel={t(localizationConstants.b2bAvtalDownload)}
                      />
                    ))}
                  </div>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-medium text-zinc-700">{t(localizationConstants.b2bAvtalLaddaUppFiler)}</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      className="block w-full text-sm text-slate-500 file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-slate-700 hover:file:bg-slate-200"
                    />
                    <Button variant="outline" className="h-9 shrink-0 cursor-pointer text-sm">
                      {t(localizationConstants.b2bAvtalSubmit)}
                    </Button>
                  </div>
                  <p className="text-xs text-slate-400">{t(localizationConstants.b2bAvtalFilerNote)}</p>
                </div>
              </div>
            </CompanyAccordionSection>

            {/* Underskrift av kontrakt */}
            <CompanyAccordionSection
              title={t(localizationConstants.b2bAvtalSectionUnderskrift)}
              icon={<PenLine size={20} />}
            >
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t(localizationConstants.b2bAvtalBestellare)}
                  </p>
                  <p className="text-sm font-semibold text-zinc-900">{data.underskrift.bestellare.foretagsNamn}</p>
                  <FieldGroup label={t(localizationConstants.b2bAvtalNamn)}>
                    <Input className="h-9 text-sm" defaultValue={data.underskrift.bestellare.namn} />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalEmail)}>
                    <Input className="h-9 text-sm" type="email" defaultValue={data.underskrift.bestellare.mail} />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalMobil)}>
                    <Input className="h-9 text-sm" defaultValue={data.underskrift.bestellare.mobil} />
                  </FieldGroup>
                </div>
                <div className="flex flex-col gap-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t(localizationConstants.b2bAvtalEntreprenor)}
                  </p>
                  <p className="text-sm font-semibold text-zinc-900">{data.underskrift.entreprenor.foretagsNamn}</p>
                  <FieldGroup label={t(localizationConstants.b2bAvtalNamn)}>
                    <Input className="h-9 text-sm" defaultValue={data.underskrift.entreprenor.namn} />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalEmail)}>
                    <Input className="h-9 text-sm" type="email" defaultValue={data.underskrift.entreprenor.mail} />
                  </FieldGroup>
                  <FieldGroup label={t(localizationConstants.b2bAvtalMobil)}>
                    <Input className="h-9 text-sm" defaultValue={data.underskrift.entreprenor.mobil} />
                  </FieldGroup>
                </div>
              </div>
            </CompanyAccordionSection>
          </div>

          {/* Right column — same card style as detail view, no dark Kontrakt card */}
          <div className="flex flex-col gap-4">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-900">{data.projektNamn}</p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                <span className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-xs font-medium text-zinc-700">
                  {data.refNr}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <Map size={10} aria-hidden={true} />
                  {data.city}
                </span>
                <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  <MapPin size={10} aria-hidden={true} />
                  {data.municipality}
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                {t(localizationConstants.b2bAvtalPosted)}: {data.postedDate}
              </p>
              <div className="mt-2 h-px bg-slate-100" />
              <p className="mt-2 text-xs text-slate-500">{t(localizationConstants.b2bAvtalKontraktPanel)}</p>
              <p className="text-base font-bold tabular-nums text-slate-900">{formatCurrency(data.pris)}</p>
            </div>
            <Button
              variant="outline"
              className="h-10 w-full cursor-pointer border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => router.back()}
            >
              {t(localizationConstants.b2bAvtalAvbryt)}
            </Button>
            <Button
              variant="outline"
              className="h-10 w-full cursor-pointer border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => router.push(`/module/business/b2b/agreements/${data.id}`)}
            >
              {t(localizationConstants.b2bAvtalSeAvtal)}
            </Button>
            <Button className="h-11 w-full cursor-pointer bg-zinc-950 text-sm font-medium text-white hover:bg-zinc-800">
              {t(localizationConstants.b2bAvtalSkicka)}
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
