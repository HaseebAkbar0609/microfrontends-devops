"use client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import localizationConstants from "@/utils/translation/constants";
import { Translate } from "@/utils/translation/translate";

export function ConfirmRecordDelete({ open, pending, onClose, onConfirm }: {
  open: boolean; pending: boolean; onClose: () => void; onConfirm: () => Promise<unknown>;
}) {
  return <AlertDialog open={open} onOpenChange={(value) => !value && !pending && onClose()}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle><Translate text={localizationConstants.diaryDeleteConfirmTitle} /></AlertDialogTitle>
        <AlertDialogDescription><Translate text={localizationConstants.myPagesDeleteDescription} /></AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={pending}><Translate text={localizationConstants.cancel} /></AlertDialogCancel>
        <AlertDialogAction disabled={pending} onClick={(event) => { event.preventDefault(); void onConfirm(); }}><Translate text={localizationConstants.myPagesDelete} /></AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>;
}
