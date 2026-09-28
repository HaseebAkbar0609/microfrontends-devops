"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  ArrowUpDown,
  BadgeDollarSign,
  ChevronUp,
  CircleUserRound,
  Download,
  Eye,
  File,
  FolderOpen,
  Info,
  LayoutList,
  Loader2,
  Map,
  MapPin,
  MoreVertical,
  PenTool,
  PencilLine,
  Printer,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PdfFileIcon } from "@/components/ui/PdfFileIcon";
import { DocFileIcon } from "@/components/ui/DocFileIcon";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslate, Translate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { formatCurrency } from "@/utils/formatCurrency";
import { B2BAgreementDetail } from "../types/agreement";
import { useB2BAgreements } from "../hooks/useB2BAgreements";
import { getB2BAgreementDetailAction } from "@/api-actions/b2b/agreements";
import { EMPTY_AGREEMENT_DRAFT } from "../hooks/useAgreementDraftFromContext";

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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xs">
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
          <div className="border-t border-slate-200 px-5 py-4">{children}</div>
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

function DocTypeBadge({ type, label }: { type?: string; label?: string }) {
  if (type === "doc" || (!type && label?.endsWith(".doc")) || label?.endsWith(".docx")) {
    return <DocFileIcon className="h-11 w-9 shrink-0" />;
  }
  return <PdfFileIcon className="h-11 w-9 shrink-0" />;
}

interface Props {
  agreementId: string;
  initialData?: B2BAgreementDetail;
}

export function B2BContractDetailView({ agreementId, initialData }: Props) {
  const router = useRouter();
  const t = useTranslate();

  const [data, setData] = useState<B2BAgreementDetail>(initialData || EMPTY_AGREEMENT_DRAFT);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchAgreement = async () => {
    setIsLoading(true);
    setLoadError(null);
    const res = await getB2BAgreementDetailAction(agreementId);
    if (res.success && res.data) {
      setData(res.data);
    } else {
      setLoadError(res.error || "Failed to load agreement");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!initialData) {
      fetchAgreement();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agreementId]);

  const { isSubmitting, handleDownloadDoc } = useB2BAgreements(data);
  const [sortField, setSortField] = useState<"datum" | "namn" | "fil" | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const sortedDocuments = useMemo(() => {
    const docs = [...data.documents.uploaded];
    if (!sortField || !sortOrder) return docs;
    return docs.sort((a, b) => {
      let valA = "";
      let valB = "";
      if (sortField === "datum") {
        valA = a.datum || "";
        valB = b.datum || "";
      } else if (sortField === "namn") {
        valA = a.namn || a.label || "";
        valB = b.namn || b.label || "";
      } else if (sortField === "fil") {
        valA = a.label || "";
        valB = b.label || "";
      }
      const cmp = valA.localeCompare(valB, "sv", { numeric: true, sensitivity: "base" });
      return sortOrder === "asc" ? cmp : -cmp;
    });
  }, [data.documents.uploaded, sortField, sortOrder]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-1 items-center justify-center bg-slate-50">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" aria-hidden={true} />
      </div>
    );
  }

  if (loadError && !data.id) {
    return (
      <div className="flex min-h-screen flex-1 flex-col items-center justify-center gap-3 bg-slate-50 px-4 text-center">
        <p className="text-sm text-slate-500">{loadError}</p>
        <Button variant="outline" size="sm" onClick={() => fetchAgreement()} className="cursor-pointer">
          {t(localizationConstants.retry)}
        </Button>
      </div>
    );
  }

  const handlePrintContract = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleSort = (field: "datum" | "namn" | "fil") => {
    if (sortField === field) {
      if (sortOrder === "asc") setSortOrder("desc");
      else if (sortOrder === "desc") {
        setSortField(null);
        setSortOrder(null);
      }
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-full w-full bg-slate-50 flex flex-1 flex-col">
      {/* Subheader with Back Button */}
      <div className="flex shrink-0 items-center gap-2 px-4 pt-6 pb-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t(localizationConstants.goBackButton)}
          onClick={() => router.back()}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-900 hover:bg-slate-200/60 transition-colors p-0"
        >
          <ArrowLeft size={20} aria-hidden={true} />
        </Button>
        <h1 className="font-sans text-2xl font-semibold leading-none tracking-[-0.6px] text-slate-950">
          {t(localizationConstants.b2bAvtalSeTitle)}
        </h1>
      </div>

      {/* Main scrolling wrapper */}
      <div className="flex flex-1 flex-col pl-4 sm:pl-6 md:pl-11 pr-4 sm:pr-5 md:pr-6 pb-10">
        {/* Content Grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_480px] min-[1440px]:grid-cols-[1fr_514px] items-start">
          {/* Left Column */}
          <div className="flex flex-col gap-4">
            {/* Top Project & Kontrakt Header Card */}
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3.5 sm:p-4 shadow-xs">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-slate-900">
                      {data.projectInfo.projektNamn}
                    </span>
                    <span className="rounded border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700">
                      {data.projectInfo.refNr || t(localizationConstants.b2bAvtalDirectBadge)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {t(localizationConstants.b2bDealCreatedDate)}: {data.projectInfo.postedDate}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="inline-flex items-center gap-0.5 rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                      <Map size={10} aria-hidden={true} />
                      {data.projectInfo.city}
                    </span>
                    <span className="inline-flex items-center gap-0.5 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                      <MapPin size={10} aria-hidden={true} />
                      {data.projectInfo.municipality}
                    </span>
                  </div>
                </div>

                {/* Dark Kontrakt Box */}
                <div className="w-full sm:w-[309px] h-[88px] rounded-xl bg-slate-950 px-6 py-4 text-white shadow-md flex items-start gap-3.5 box-border shrink-0 self-start sm:self-auto">
                  <BadgeDollarSign className="h-6 w-6 text-slate-300 shrink-0 mt-0.5" strokeWidth={1.75} />
                  <div className="flex flex-col justify-center gap-0.5">
                    <span className="font-sans font-normal text-base leading-6 tracking-normal text-slate-300">
                      {t(localizationConstants.b2bPMContractPanel)}
                    </span>
                    <span className="font-sans font-semibold text-xl leading-7 tracking-normal text-white tabular-nums">
                      {formatCurrency(data.projectInfo.totalOffert)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtitle */}
            <h3 className="font-sans text-base font-semibold text-slate-900">
              {t(localizationConstants.b2bAvtalDetaljInfo)}
            </h3>

            {/* Accordion 1: Kunduppgifter */}
            <AccordionSection
              title={t(localizationConstants.b2bAvtalSectionKunduppgifter)}
              icon={<UserPlus className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                <InfoItem label={t(localizationConstants.b2bAvtalKund)} value={data.client.kund} />
                <InfoItem label={t(localizationConstants.b2bAvtalAdress)} value={data.client.adress} />
                <InfoItem label={t(localizationConstants.b2bAvtalPostNr)} value={data.client.postNr} />
                <InfoItem label={t(localizationConstants.b2bAvtalOrt)} value={data.client.ort} />
                <InfoItem label={t(localizationConstants.b2bAvtalEmail)} value={data.client.email} />
                <InfoItem label={t(localizationConstants.b2bAvtalTelefon)} value={data.client.telefon} />
                <div className="sm:col-span-2">
                  <InfoItem label={t(localizationConstants.b2bAvtalOrgNr)} value={data.client.orgNr} />
                </div>
              </div>
            </AccordionSection>

            {/* Accordion 2: Kontaktperson */}
            <AccordionSection
              title={t(localizationConstants.b2bAvtalSectionKontaktperson)}
              icon={<CircleUserRound className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                <InfoItem label={t(localizationConstants.b2bAvtalFornamn)} value={data.client.fornamn} />
                <InfoItem label={t(localizationConstants.b2bAvtalEfternamn)} value={data.client.efternamn} />
                <InfoItem label={t(localizationConstants.b2bAvtalEmail)} value={data.client.email} />
                <InfoItem label={t(localizationConstants.b2bAvtalMobil)} value={data.client.telefon} />
                <InfoItem label={t(localizationConstants.b2bAvtalRoll)} value={data.client.roll} />
              </div>
            </AccordionSection>

            {/* Accordion 4: Leverantör */}
            <AccordionSection
              title={t(localizationConstants.b2bAvtalSectionLeverantor)}
              icon={<LayoutList className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                <InfoItem label={t(localizationConstants.b2bAvtalForetag)} value={data.supplier.foretag} />
                <InfoItem label={t(localizationConstants.b2bAvtalFirmatecknare)} value={data.supplier.firmatecknare} />
                <InfoItem label={t(localizationConstants.b2bAvtalOrgNr)} value={data.supplier.orgNr} />
                <InfoItem label={t(localizationConstants.b2bAvtalPersonNummer)} value={data.supplier.personNummer} />
                <InfoItem label={t(localizationConstants.b2bAvtalTelefon)} value={data.supplier.telefon} />
                <InfoItem label={t(localizationConstants.b2bAvtalEmail)} value={data.supplier.email} />
                <div className="sm:col-span-2">
                  <InfoItem label={t(localizationConstants.b2bAvtalAdress)} value={data.supplier.adress} />
                </div>
              </div>
            </AccordionSection>

            {/* Accordion 5: Projekt information */}
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

            {/* Accordion 6: Documents */}
            <AccordionSection
              title={t(localizationConstants.b2bAvtalSectionDokument)}
              icon={<File className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="overflow-x-auto">
                <table className="w-full table-fixed text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-xs font-medium text-slate-500">
                      <th className="w-[120px] pb-2.5 font-normal">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleSort("datum")}
                          className="inline-flex h-auto p-0 items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer font-normal hover:bg-transparent shadow-none text-xs"
                        >
                          <span>{t(localizationConstants.b2bAvtalDatum)}</span>
                          {sortField === "datum" ? (
                            sortOrder === "asc" ? (
                              <ArrowUp size={13} className="text-slate-900" />
                            ) : (
                              <ArrowDown size={13} className="text-slate-900" />
                            )
                          ) : (
                            <ArrowUpDown size={13} className="text-slate-400 opacity-60" />
                          )}
                        </Button>
                      </th>
                      <th className="w-[150px] pb-2.5 font-normal">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleSort("namn")}
                          className="inline-flex h-auto p-0 items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer font-normal hover:bg-transparent shadow-none text-xs"
                        >
                          <span>{t(localizationConstants.b2bAvtalDokumentNamn)}</span>
                          {sortField === "namn" ? (
                            sortOrder === "asc" ? (
                              <ArrowUp size={13} className="text-slate-900" />
                            ) : (
                              <ArrowDown size={13} className="text-slate-900" />
                            )
                          ) : (
                            <ArrowUpDown size={13} className="text-slate-400 opacity-60" />
                          )}
                        </Button>
                      </th>
                      <th className="pb-2.5 font-normal">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleSort("fil")}
                          className="inline-flex h-auto p-0 items-center gap-1 hover:text-slate-900 transition-colors cursor-pointer font-normal hover:bg-transparent shadow-none text-xs"
                        >
                          <span>{t(localizationConstants.b2bAvtalFil)}</span>
                          {sortField === "fil" ? (
                            sortOrder === "asc" ? (
                              <ArrowUp size={13} className="text-slate-900" />
                            ) : (
                              <ArrowDown size={13} className="text-slate-900" />
                            )
                          ) : (
                            <ArrowUpDown size={13} className="text-slate-400 opacity-60" />
                          )}
                        </Button>
                      </th>
                      <th className="w-[48px] pb-2.5 text-right font-normal"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {sortedDocuments.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="w-[120px] py-2 text-slate-500 text-xs truncate">
                          {doc.datum || "2024-06-10"}
                        </td>
                        <td className="w-[150px] py-2 pr-3">
                          <span
                            title={doc.namn || t(localizationConstants.b2bAvtalDocNamnPlaceholder)}
                            className="flex h-[34px] w-full max-w-[150px] items-center rounded border border-slate-200 bg-white px-2.5 text-xs text-slate-800 font-normal leading-none truncate"
                          >
                            {doc.namn || t(localizationConstants.b2bAvtalDocNamnPlaceholder)}
                          </span>
                        </td>
                        <td className="py-2 pr-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <DocTypeBadge type={doc.type} label={doc.label} />
                            <span
                              title={doc.label}
                              className="text-xs font-medium text-slate-900 truncate min-w-0 flex-1"
                            >
                              {doc.label}
                            </span>
                          </div>
                        </td>
                        <td className="w-[48px] py-2 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg text-slate-700 hover:bg-slate-100"
                              >
                                <MoreVertical size={15} aria-hidden={true} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36 rounded-lg bg-white p-1 shadow-lg border border-slate-200">
                              <DropdownMenuItem
                                onClick={() => handleDownloadDoc(doc.label)}
                                className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer"
                              >
                                <Eye size={14} />
                                <span>{t(localizationConstants.b2bAvtalVisa)}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDownloadDoc(doc.label)}
                                className="flex items-center gap-2 text-xs text-slate-800 cursor-pointer"
                              >
                                <Download size={14} />
                                <span>{t(localizationConstants.b2bAvtalDownload)}</span>
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

            {/* Accordion 7: Underskrift av kontrakt */}
            <AccordionSection
              title={t(localizationConstants.b2bAvtalSectionUnderskrift)}
              icon={<PenTool className="h-6 w-6 size-6 text-slate-800 shrink-0" strokeWidth={1.75} />}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-12">
                <div className="flex flex-col gap-3">
                  <InfoItem
                    label={t(localizationConstants.b2bAvtalBestellare)}
                    value={data.signature.bestallare.foretagsNamn}
                  />
                  <InfoItem
                    label={t(localizationConstants.b2bAvtalNamn)}
                    value={data.signature.bestallare.namn}
                  />
                  <InfoItem
                    label={t(localizationConstants.b2bAvtalEmail)}
                    value={data.signature.bestallare.mail}
                  />
                  <InfoItem
                    label={t(localizationConstants.b2bAvtalMobil)}
                    value={data.signature.bestallare.mobil}
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <InfoItem
                    label={t(localizationConstants.b2bAvtalEntreprenor)}
                    value={data.signature.entreprenor.foretagsNamn}
                  />
                  <InfoItem
                    label={t(localizationConstants.b2bAvtalNamn)}
                    value={data.signature.entreprenor.namn}
                  />
                  <InfoItem
                    label={t(localizationConstants.b2bAvtalEmail)}
                    value={data.signature.entreprenor.mail}
                  />
                  <InfoItem
                    label={t(localizationConstants.b2bAvtalMobil)}
                    value={data.signature.entreprenor.mobil}
                  />
                </div>
              </div>
            </AccordionSection>
          </div>

          {/* Right Column (Summary & Action Card) */}
          <div className="flex flex-col gap-4 self-start">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3.5 sm:p-4 shadow-2xs">
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
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-500">{t(localizationConstants.status)}</span>
                <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white shadow-xs">
                  <FolderOpen size={13} className="shrink-0 text-white" aria-hidden={true} />
                  {t(localizationConstants.b2bAvtalStatusOpened)}
                </span>
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {t(localizationConstants.b2bDealCreatedDate)}: {data.projectInfo.postedDate}
              </p>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-xs font-medium text-slate-500">
                  <Translate text={localizationConstants.b2bArchiveTotalOffer} />:
                </span>
                <span className="text-base font-bold tabular-nums text-slate-900">
                  {formatCurrency(data.projectInfo.totalOffert)}
                </span>
              </div>

              {/* Separator line below price */}
              <div className="my-3.5 -mx-3.5 sm:-mx-4 border-b border-slate-200" />

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => router.back()}
                  className="h-10 w-full cursor-pointer rounded-lg bg-zinc-100 text-sm font-medium text-slate-700 hover:bg-slate-200 transition-colors shadow-none"
                >
                  {t(localizationConstants.b2bAvtalAvbryt)}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push(
                      `/module/business/b2b/overview`
                    )
                  }
                  className="h-10 w-full cursor-pointer gap-2 border border-slate-200 bg-white text-sm font-medium text-slate-900 hover:bg-slate-50 transition-colors rounded-lg shadow-2xs"
                >
                  <PencilLine size={15} aria-hidden={true} />
                  <span>{t(localizationConstants.b2bAvtalRedigera)}</span>
                </Button>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handlePrintContract}
                  className="h-11 w-full cursor-pointer gap-2 bg-slate-950 text-sm font-semibold text-white hover:bg-slate-800 transition-colors rounded-lg shadow-xs flex items-center justify-center"
                >
                  <Printer size={15} aria-hidden={true} />
                  <span>{t(localizationConstants.b2bAvtalSkrivUt)}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
