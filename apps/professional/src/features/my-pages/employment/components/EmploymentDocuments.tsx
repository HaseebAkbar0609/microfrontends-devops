"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import localizationConstants from "@/utils/translation/constants";
import { Translate, useTranslate } from "@/utils/translation/translate";
import { MyPagesQueryState, useMyPagesAction } from "../../shared/feedback";
import type { EmploymentDocument } from "../constants/data";
import { acknowledgeDocument, DOCUMENT_PAGE_SIZE, useEmploymentDocuments } from "../services/employmentService";

const TITLE = {
  contract: localizationConstants.myPagesEmpTabContract,
  payslip: localizationConstants.myPagesEmpTabPayslip,
  document: localizationConstants.myPagesEmpTabDocuments,
};

export default function EmploymentDocuments({ kind }: { kind: EmploymentDocument["kind"] }) {
  const t = useTranslate();
  const [page, setPage] = useState(1);
  const [year, setYear] = useState("");
  const [confirm, setConfirm] = useState<EmploymentDocument | null>(null);
  const action = useMyPagesAction();
  const validYear = /^\d{4}$/.test(year) && Number(year) >= 1900 ? Number(year) : undefined;
  const query = useEmploymentDocuments(kind, page, validYear);
  const items = query.data?.items ?? [];
  const acknowledge = async () => {
    if (confirm && await action.run(() => acknowledgeDocument(confirm.id), localizationConstants.myPagesAcknowledged)) setConfirm(null);
  };
  return <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-200/60 px-5 py-3">
      <h2 className="text-base font-semibold"><Translate text={TITLE[kind]} /></h2>
      {kind === "payslip" && <label className="flex items-center gap-2 text-sm">
        <Translate text={localizationConstants.myPagesYear} />
        <Input type="number" min={1900} max={9999} value={year} className="w-28"
          onChange={(event) => { setYear(event.target.value); setPage(1); }} />
      </label>}
    </div>
    <MyPagesQueryState query={query} />
    {!query.isPending && !query.isError && items.length === 0 && <p className="p-5 text-sm text-slate-500">
      <Translate text={kind === "contract" ? localizationConstants.myPagesNoContract : localizationConstants.myPagesNoDocuments} />
    </p>}
    {items.length > 0 && <div className="overflow-x-auto"><Table className="min-w-[40rem]">
      <TableHeader><TableRow>
        <TableHead><Translate text={localizationConstants.myPagesEmpDocCol} /></TableHead>
        <TableHead><Translate text={kind === "payslip" ? localizationConstants.myPagesEmpPayslipMonthCol : localizationConstants.myPagesEmpVersionCol} /></TableHead>
        <TableHead><Translate text={localizationConstants.myPagesEmpFileCol} /></TableHead>
        <TableHead><Translate text={localizationConstants.myPagesEmpLeaveColStatus} /></TableHead>
        <TableHead><Translate text={localizationConstants.economyActionCol} /></TableHead>
      </TableRow></TableHeader>
      <TableBody>{items.map((document) => <TableRow key={document.id}>
        <TableCell>{document.title}</TableCell>
        <TableCell>{kind === "payslip" ? document.period : document.version}</TableCell>
        <TableCell><span className="flex items-center gap-2"><FileText className="size-4 shrink-0" />{document.fileName}</span></TableCell>
        <TableCell><Translate text={document.acknowledgedAt ? localizationConstants.myPagesAcknowledged :
          document.readAt ? localizationConstants.myPagesEmpDocRead : localizationConstants.myPagesEmpDocNotOpened} /></TableCell>
        <TableCell><div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="secondary"><Link href={`/tools/my-pages/employment/contract?id=${document.id}`}>
            <FileText className="mr-1 size-4" /><Translate text={localizationConstants.myPagesEmpOpenBadge} />
          </Link></Button>
          {document.requiresAcknowledgement && !document.acknowledgedAt && <Button type="button" size="sm" variant="outline"
            disabled={!document.readAt || action.pending} onClick={() => setConfirm(document)}>
            <Translate text={localizationConstants.myPagesAcknowledge} />
          </Button>}
        </div></TableCell>
      </TableRow>)}</TableBody>
    </Table></div>}
    {(query.data?.total ?? 0) > DOCUMENT_PAGE_SIZE && <div className="flex items-center justify-end gap-3 border-t p-3">
      <Button type="button" variant="outline" size="icon" disabled={page <= 1 || query.isFetching} aria-label={t(localizationConstants.myPagesPrevious)} onClick={() => setPage(page - 1)}><ChevronLeft /></Button>
      <span>{page} / {Math.ceil((query.data?.total ?? 0) / DOCUMENT_PAGE_SIZE)}</span>
      <Button type="button" variant="outline" size="icon" disabled={page * DOCUMENT_PAGE_SIZE >= (query.data?.total ?? 0) || query.isFetching} aria-label={t(localizationConstants.myPagesNext)} onClick={() => setPage(page + 1)}><ChevronRight /></Button>
    </div>}
    <AlertDialog open={!!confirm} onOpenChange={(value) => !value && !action.pending && setConfirm(null)}>
      <AlertDialogContent><AlertDialogHeader>
        <AlertDialogTitle><Translate text={localizationConstants.myPagesAcknowledgeTitle} /></AlertDialogTitle>
        <AlertDialogDescription><Translate text={localizationConstants.myPagesAcknowledgeDescription} /></AlertDialogDescription>
      </AlertDialogHeader><AlertDialogFooter>
        <AlertDialogCancel disabled={action.pending}><Translate text={localizationConstants.cancel} /></AlertDialogCancel>
        <AlertDialogAction disabled={action.pending} onClick={(event) => { event.preventDefault(); void acknowledge(); }}><Translate text={localizationConstants.myPagesAcknowledge} /></AlertDialogAction>
      </AlertDialogFooter></AlertDialogContent>
    </AlertDialog>
  </div>;
}
