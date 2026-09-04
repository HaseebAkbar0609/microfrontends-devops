"use client";

import { useState, useCallback, useEffect } from "react";
import { CompanyDetail, companyValidationSchema } from "../types/company";
import { DUMMY_COMPANY_DETAIL } from "../constants/companyMock";
import {
  getB2BCompanyDetailAction,
  updateB2BCompanyDetailAction,
  verifyB2BCompanyAction,
} from "@/api-actions/b2b/company";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";

export function useB2BCompany(companyId = "1", initialData?: CompanyDetail) {
  const t = useTranslate();
  const [data, setData] = useState<CompanyDetail>(initialData || DUMMY_COMPANY_DETAIL);
  const [formData, setFormData] = useState<CompanyDetail>(initialData || DUMMY_COMPANY_DETAIL);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getB2BCompanyDetailAction(companyId);
      if (res.success && res.data) {
        setData(res.data);
        setFormData(res.data);
      } else {
        setData(DUMMY_COMPANY_DETAIL);
        setFormData(DUMMY_COMPANY_DETAIL);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load company details";
      setError(errorMsg);
      setData(DUMMY_COMPANY_DETAIL);
      setFormData(DUMMY_COMPANY_DETAIL);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    if (!initialData) {
      fetchCompanyDetail();
    } else {
      setData(initialData);
      setFormData(initialData);
    }
  }, [initialData, fetchCompanyDetail]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => {
      if (field.startsWith("adress.")) {
        const addressKey = field.split(".")[1];
        return {
          ...prev,
          adress: {
            ...prev.adress,
            [addressKey]: value,
          },
        };
      }
      return {
        ...prev,
        [field]: value,
      };
    });

    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const toggleEditMode = () => {
    if (isEditMode) {
      // Revert changes on toggle off without save
      setFormData(data);
      setFieldErrors({});
    }
    setIsEditMode((prev) => !prev);
  };

  const handleCancelEdit = () => {
    setFormData(data);
    setFieldErrors({});
    setIsEditMode(false);
  };

  const handleSave = async () => {
    // Validate
    const validationResult = companyValidationSchema.safeParse(formData);
    if (!validationResult.success) {
      const formattedErrors: Record<string, string> = {};
      for (const issue of validationResult.error.issues) {
        const path = issue.path.join(".");
        formattedErrors[path] = issue.message;
      }
      setFieldErrors(formattedErrors);
      showToast(
        "error",
        t(localizationConstants.adminCreateValidationRequired) ||
          "Please fill all required fields correctly"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateB2BCompanyDetailAction(companyId, formData);
      if (res.success && res.data) {
        setData(res.data);
        setFormData(res.data);
        setIsEditMode(false);
        setFieldErrors({});
        showToast("success", t(localizationConstants.b2bCompanySaved) || "Business information saved");
      } else {
        showToast("error", res.error || "Failed to save business information");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to save business information";
      showToast("error", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyBusiness = async () => {
    setIsSubmitting(true);
    try {
      const res = await verifyB2BCompanyAction(companyId);
      if (res.success) {
        setData((prev) => ({ ...prev, verificationStatus: "verified" }));
        setFormData((prev) => ({ ...prev, verificationStatus: "verified" }));
        showToast("success", t(localizationConstants.b2bCompanyVerified) || "Verified");
      }
    } catch {
      showToast("error", t(localizationConstants.genericError) || "Failed to verify business");
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    data,
    formData,
    isEditMode,
    isLoading,
    isSubmitting,
    fieldErrors,
    error,
    handleFieldChange,
    toggleEditMode,
    handleCancelEdit,
    handleSave,
    handleVerifyBusiness,
    refetch: fetchCompanyDetail,
  };
}
