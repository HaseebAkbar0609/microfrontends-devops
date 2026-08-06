"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeDollarSign,
  Briefcase,
  Building2,
  CircleUserRound,
  FileText,
  Map,
  MapPin,
  Paperclip,
  PenLine,
  Pencil,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import { CompanyAccordionSection } from "./CompanyAccordionSection";
import { AvtalDetail } from "../types/avtal";

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="text-sm text-zinc-900">{value || "—"}</span>
    </div>
  );
}

function AvtalInfoCard({ data }: { data: AvtalDetail }) {
  const t = useTranslate();
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="flex items-stretch gap-5 p-4">
        <div className="flex flex-1 flex-col justify-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base font-semibold text-slate-900">{data.projektNamn}</span>
            <span className="rounded border border-zinc-200 bg-white px-1.5 py-0.5 text-xs font-medium text-zinc-700">
              {data.refNr}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            {t(localizationConstants.b2bAvtalPosted)}: {data.postedDate}
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              {t(localizationConstants.b2bAvtalDirekt)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              <Map size={10} aria-hidden={true} />
              {data.city}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
              <MapPin size={10} aria-hidden={true} />
              {data.municipality}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg bg-gray-800 px-6 py-3">
          <div className="flex items-center gap-1.5">
            <BadgeDollarSign size={14} className="text-slate-300" aria-hidden={true} />
            <span className="text-xs text-slate-300">{t(localizationConstants.b2bAvtalKontraktPanel)}</span>
          </div>
          <span className="mt-1 text-lg font-bold tabular-nums text-white">
            {formatCurrency(data.pris)}
          </span>
        </div>
      </div>
    </div>
  );
}

interface Props {
  data: AvtalDetail;
}

export function B2BAvtalDetailView({ data }: Props) {
  const router = useRouter();
  const t = useTranslate();

  return (
    <div className="flex flex-1 flex-col bg-slate-50">
      {/* Header — same pattern as B2BArchiveOfferDetailView */}
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
          {t(localizationConstants.b2bAvtalSeTitle)}
        </h1>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-5 px-6 py-4 lg:grid-cols-[1fr_280px]">

          {/* Left column */}
          <div className="space-y-4">
            <AvtalInfoCard data={data} />

            {/* Kunduppgifter */}
            <CompanyAccordionSection
              title={t(localizationConstants.b2bAvtalSectionKunduppgifter)}
              icon={<Building2 size={20} />}
            >
              <div className="grid grid-cols-2 gap-4">
                <InfoField label={t(localizationConstants.b2bAvtalKund)} value={data.kunduppgifter.kund} />
                <InfoField label={t(localizationConstants.b2bAvtalAdress)} value={data.kunduppgifter.adress} />
                <InfoField label={t(localizationConstants.b2bAvtalPostNr)} value={data.kunduppgifter.postNr} />
                <InfoField label={t(localizationConstants.b2bAvtalOrt)} value={data.kunduppgifter.ort} />
                <InfoField label={t(localizationConstants.b2bAvtalEmail)} value={data.kunduppgifter.mail} />
                <InfoField label={t(localizationConstants.b2bAvtalTelefon)} value={data.kunduppgifter.telefon} />
                <div className="col-span-2">
                  <InfoField label={t(localizationConstants.b2bAvtalOrgNr)} value={data.kunduppgifter.orgNr} />
                </div>
              </div>
            </CompanyAccordionSection>

            {/* Kontaktperson */}
            <CompanyAccordionSection
              title={t(localizationConstants.b2bAvtalSectionKontaktperson)}
              icon={<CircleUserRound size={20} />}
            >
              <div className="grid grid-cols-2 gap-4">
                <InfoField label={t(localizationConstants.b2bAvtalFornamn)} value={data.kontaktperson.fornamn} />
                <InfoField label={t(localizationConstants.b2bAvtalEfternamn)} value={data.kontaktperson.efternamn} />
                <InfoField label={t(localizationConstants.b2bAvtalEmail)} value={data.kontaktperson.mail} />
                <InfoField label={t(localizationConstants.b2bAvtalMobil)} value={data.kontaktperson.mobil} />
                <InfoField label={t(localizationConstants.b2bAvtalRoll)} value={data.kontaktperson.roll} />
              </div>
            </CompanyAccordionSection>

            {/* Leverantör */}
            <CompanyAccordionSection
              title={t(localizationConstants.b2bAvtalSectionLeverantor)}
              icon={<Building2 size={20} />}
            >
              <div className="grid grid-cols-2 gap-4">
                <InfoField label={t(localizationConstants.b2bAvtalForetag)} value={data.leverantor.foretag} />
                <InfoField label={t(localizationConstants.b2bAvtalFirmatecknare)} value={data.leverantor.firmatecknare} />
                <InfoField label={t(localizationConstants.b2bAvtalOrgNr)} value={data.leverantor.orgNr} />
                <InfoField label={t(localizationConstants.b2bAvtalPersonNummer)} value={data.leverantor.personNummer} />
                <InfoField label={t(localizationConstants.b2bAvtalTelefon)} value={data.leverantor.telefon} />
                <InfoField label={t(localizationConstants.b2bAvtalEmail)} value={data.leverantor.email} />
                <div className="col-span-2">
                  <InfoField label={t(localizationConstants.b2bAvtalAdress)} value={data.leverantor.adress} />
                </div>
              </div>
            </CompanyAccordionSection>

            {/* Projekt information */}
            <CompanyAccordionSection
              title={t(localizationConstants.b2bAvtalSectionProjekt)}
              icon={<Briefcase size={20} />}
            >
              <div className="grid grid-cols-2 gap-4">
                <InfoField label={t(localizationConstants.b2bAvtalProjektNamn)} value={data.projektNamn} />
                <InfoField
                  label={t(localizationConstants.b2bAvtalProjektNummer)}
                  value={`${data.projektNummer} / ${data.offertNr}`}
                />
                <InfoField label={t(localizationConstants.b2bAvtalAdress)} value={data.adress} />
                <InfoField label={t(localizationConstants.b2bAvtalKontraktTyp)} value={data.kontraktTyp} />
                <InfoField label={t(localizationConstants.b2bAvtalKund)} value={data.kunduppgifter.kund} />
                <InfoField label={t(localizationConstants.b2bAvtalPris)} value={formatCurrency(data.pris)} />
                <InfoField label={t(localizationConstants.b2bAvtalStartDatum)} value={data.startDatum} />
                <InfoField label={t(localizationConstants.b2bAvtalSlutDatum)} value={data.slutDatum} />
              </div>
            </CompanyAccordionSection>

            {/* Documents */}
            <CompanyAccordionSection
              title={t(localizationConstants.b2bAvtalSectionDokument)}
              icon={<Paperclip size={20} />}
              noPadding
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-5 py-2.5 text-left text-xs font-medium text-slate-500">
                      {t(localizationConstants.b2bAvtalDatum)}
                    </th>
                    <th className="px-5 py-2.5 text-left text-xs font-medium text-slate-500">
                      {t(localizationConstants.b2bAvtalDokumentNamn)}
                    </th>
                    <th className="px-5 py-2.5 text-left text-xs font-medium text-slate-500">
                      {t(localizationConstants.b2bAvtalFil)}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.documents.map((doc) => (
                    <tr key={doc.id} className="border-b border-slate-100 last:border-0">
                      <td className="px-5 py-3 text-slate-500">{doc.datum}</td>
                      <td className="px-5 py-3 text-zinc-900">{doc.namn}</td>
                      <td className="px-5 py-3">
                        {doc.type === "pdf" ? (
                          <Image
                            src="/file-type-pdf.png"
                            alt={doc.fil}
                            width={20}
                            height={20}
                            className="h-5 w-5 object-contain"
                          />
                        ) : doc.type === "doc" ? (
                          <Image
                            src="/file-type-doc.png"
                            alt={doc.fil}
                            width={20}
                            height={20}
                            className="h-5 w-5 object-contain"
                          />
                        ) : (
                          <FileText size={18} className="text-slate-300" aria-hidden={true} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CompanyAccordionSection>

            {/* Underskrift av kontrakt */}
            <CompanyAccordionSection
              title={t(localizationConstants.b2bAvtalSectionUnderskrift)}
              icon={<PenLine size={20} />}
            >
              <div className="grid grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t(localizationConstants.b2bAvtalBestellare)}
                  </p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {data.underskrift.bestellare.foretagsNamn}
                  </p>
                  <InfoField label={t(localizationConstants.b2bAvtalNamn)} value={data.underskrift.bestellare.namn} />
                  <InfoField label={t(localizationConstants.b2bAvtalEmail)} value={data.underskrift.bestellare.mail} />
                  <InfoField label={t(localizationConstants.b2bAvtalMobil)} value={data.underskrift.bestellare.mobil} />
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {t(localizationConstants.b2bAvtalEntreprenor)}
                  </p>
                  <p className="text-sm font-semibold text-zinc-900">
                    {data.underskrift.entreprenor.foretagsNamn}
                  </p>
                  <InfoField label={t(localizationConstants.b2bAvtalNamn)} value={data.underskrift.entreprenor.namn} />
                  <InfoField label={t(localizationConstants.b2bAvtalEmail)} value={data.underskrift.entreprenor.mail} />
                  <InfoField label={t(localizationConstants.b2bAvtalMobil)} value={data.underskrift.entreprenor.mobil} />
                </div>
              </div>
            </CompanyAccordionSection>
          </div>

          {/* Right column */}
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
              className="h-10 w-full cursor-pointer gap-2 border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50"
              onClick={() => router.push(`/module/business/b2b/agreements/create`)}
            >
              <Pencil size={14} aria-hidden={true} />
              {t(localizationConstants.b2bAvtalRedigera)}
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
