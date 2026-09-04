"use client";

import { useState, useEffect } from "react";
import { showToast } from "@/lib/toast";
import {
  B2BAgreementDetail,
  B2BAgreementClient,
  B2BAgreementSupplier,
  B2BAgreementSignature,
  b2bCreateAgreementValidationSchema,
} from "../types/agreement";
import {
  createB2BAgreementAction,
  sendB2BAgreementAction,
  uploadB2BAgreementFileAction,
  downloadB2BAgreementDocAction,
  downloadB2BAgreementTemplatesAction,
} from "@/api-actions/b2b/agreements";

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"];
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export function useB2BAgreements(initialData: B2BAgreementDetail) {
  const [data, setData] = useState<B2BAgreementDetail>(initialData);
  const [clientForm, setClientForm] = useState<B2BAgreementClient>(initialData.client);
  const [supplierForm, setSupplierForm] = useState<B2BAgreementSupplier>(initialData.supplier);
  const [signatureForm, setSignatureForm] = useState<B2BAgreementSignature>(initialData.signature);
  const [attachedDocs, setAttachedDocs] = useState<string[]>(initialData.documents.attachedDocs);
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string }[]>([]);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setData(initialData);
    setClientForm(initialData.client);
    setSupplierForm(initialData.supplier);
    setSignatureForm(initialData.signature);
    setAttachedDocs(initialData.documents.attachedDocs);
  }, [initialData]);

  const updateClientField = <K extends keyof B2BAgreementClient>(
    field: K,
    value: B2BAgreementClient[K]
  ) => {
    setClientForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[`client.${String(field)}`];
      return next;
    });
  };

  const updateSupplierField = <K extends keyof B2BAgreementSupplier>(
    field: K,
    value: B2BAgreementSupplier[K]
  ) => {
    setSupplierForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[`supplier.${String(field)}`];
      return next;
    });
  };

  const updateBestallareField = (
    field: keyof B2BAgreementSignature["bestallare"],
    value: string
  ) => {
    setSignatureForm((prev) => ({
      ...prev,
      bestallare: { ...prev.bestallare, [field]: value },
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[`signature.bestallare.${String(field)}`];
      return next;
    });
  };

  const updateEntreprenorField = (
    field: keyof B2BAgreementSignature["entreprenor"],
    value: string
  ) => {
    setSignatureForm((prev) => ({
      ...prev,
      entreprenor: { ...prev.entreprenor, [field]: value },
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[`signature.entreprenor.${String(field)}`];
      return next;
    });
  };

  const removeDocTag = (tag: string) => {
    setAttachedDocs((prev) => prev.filter((d) => d !== tag));
  };

  const addDocTag = (tag: string) => {
    if (!attachedDocs.includes(tag)) {
      setAttachedDocs((prev) => [...prev, tag]);
    }
  };

  const handleSelectClient = (client: B2BAgreementClient) => {
    setClientForm(client);
    setSignatureForm((prev) => ({
      ...prev,
      bestallare: {
        ...prev.bestallare,
        foretagsNamn: client.kund,
        namn: client.kontaktPerson || `${client.fornamn || ""} ${client.efternamn || ""}`.trim(),
        mail: client.email,
        mobil: client.telefon,
      },
    }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next["client.kund"];
      delete next["signature.bestallare.foretagsNamn"];
      delete next["signature.bestallare.namn"];
      delete next["signature.bestallare.mail"];
      delete next["signature.bestallare.mobil"];
      return next;
    });
    showToast("success", `Vald kund: ${client.kund}`);
  };

  const handleFileUpload = async (file: File) => {
    const ext = "." + (file.name.split(".").pop() || "").toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      showToast("error", "Endast PDF, DOC, DOCX, JPG och PNG-filer är tillåtna");
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      showToast("error", "Filstorleken får inte överstiga 15 MB");
      return;
    }

    if (file.size === 0) {
      showToast("error", "Filen är tom");
      return;
    }

    try {
      const uploadRes = await uploadB2BAgreementFileAction(file);
      const isDoc = file.name.endsWith(".doc") || file.name.endsWith(".docx");
      const isPdf = file.name.endsWith(".pdf");
      const type: "pdf" | "doc" | "other" = isPdf ? "pdf" : isDoc ? "doc" : "other";

      const sanitizedName = file.name.replace(/[/\\?%*:|"<>]/g, "");

      const newDocItem = {
        id: uploadRes.data?.id || `up-${Date.now()}`,
        label: sanitizedName,
        type,
        datum: new Date().toISOString().split("T")[0],
        namn: sanitizedName.replace(/\.[^/.]+$/, ""),
        url: uploadRes.data?.file_url_path,
      };

      setData((prev) => ({
        ...prev,
        documents: {
          ...prev.documents,
          uploaded: [newDocItem, ...prev.documents.uploaded],
        },
      }));

      setUploadedFiles((prev) => [...prev, { id: newDocItem.id, name: sanitizedName }]);
      showToast("success", `Filen "${sanitizedName}" har laddats upp!`);
    } catch {
      showToast("error", "Kunde inte ladda upp filen");
    }
  };

  const handleDownloadDoc = async (label: string, url?: string) => {
    try {
      showToast("success", `Laddar ner "${label}"`);
      await downloadB2BAgreementDocAction(label, url);
    } catch {
      showToast("error", "Kunde inte ladda ner filen");
    }
  };

  const handleDownloadTemplates = async (templates?: string[]) => {
    try {
      showToast("success", "Mallar laddas ner...");
      await downloadB2BAgreementTemplatesAction(templates);
      showToast("success", "Mallar har laddats ner!");
    } catch {
      showToast("error", "Kunde inte ladda ner mallar");
    }
  };

  const handleCreateAgreement = async (onSuccess?: (id: string) => void) => {
    const validationResult = b2bCreateAgreementValidationSchema.safeParse({
      client: clientForm,
      signature: signatureForm,
    });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      let firstErrorMessage = "";

      for (const issue of validationResult.error.issues) {
        const path = issue.path.join(".");
        errors[path] = issue.message;
        if (!firstErrorMessage) firstErrorMessage = issue.message;
      }

      setFieldErrors(errors);
      showToast("error", firstErrorMessage || "Vänligen fyll i alla obligatoriska fält");
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    try {
      const result = await createB2BAgreementAction({
        projectInfo: data.projectInfo,
        client: clientForm,
        supplier: supplierForm,
        attachedDocs,
        signature: signatureForm,
      });

      if (result.success && result.data) {
        showToast("success", "Avtalet har skapats framgångsrikt!");
        if (onSuccess) onSuccess(result.data.id);
      } else {
        showToast("error", result.error || "Kunde inte skapa avtalet");
      }
    } catch {
      showToast("error", "Ett oväntat fel uppstod");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendAgreement = async (
    agreementId: string,
    onSuccess?: () => void
  ) => {
    setIsSubmitting(true);
    try {
      const result = await sendB2BAgreementAction(agreementId);
      if (result.success) {
        showToast("success", "Avtalet har skickats till kunden!");
        if (onSuccess) onSuccess();
      } else {
        showToast("error", result.error || "Kunde inte skicka avtalet");
      }
    } catch {
      showToast("error", "Ett oväntat fel uppstod");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    data,
    setData,
    clientForm,
    supplierForm,
    signatureForm,
    attachedDocs,
    uploadedFiles,
    fieldErrors,
    isSubmitting,
    updateClientField,
    updateSupplierField,
    updateBestallareField,
    updateEntreprenorField,
    handleSelectClient,
    removeDocTag,
    addDocTag,
    handleFileUpload,
    handleDownloadDoc,
    handleDownloadTemplates,
    handleCreateAgreement,
    handleSendAgreement,
  };
}
