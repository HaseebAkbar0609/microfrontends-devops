"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getB2BOfferDetailAction,
  acceptB2BOfferAction,
  declineB2BOfferAction,
  sendB2BOfferQAReplyAction,
} from "@/api-actions/b2b/seeOffer";
import { B2BSeeOfferDetail } from "../types/seeOffer";
import { DUMMY_SEE_OFFER_DETAIL } from "../constants/seeOfferMock";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useAuthStatus, type User } from "@/context/AuthContext";

export function useB2BSeeOffer(initialData?: B2BSeeOfferDetail, projectId = "1", offerId = "1") {
  const t = useTranslate();
  const { user } = useAuthStatus() as { user: User | null };
  const currentUserName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "Stefan Eriksson";
  const userInitials =
    ((user?.first_name?.[0] || "") + (user?.last_name?.[0] || "")).toUpperCase() ||
    currentUserName.slice(0, 2).toUpperCase() ||
    "SE";

  const [data, setData] = useState<B2BSeeOfferDetail>(initialData || DUMMY_SEE_OFFER_DETAIL);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittingAction, setSubmittingAction] = useState<"accept" | "decline" | "reply" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchOfferDetail = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getB2BOfferDetailAction(projectId, offerId);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        setData(DUMMY_SEE_OFFER_DETAIL);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load offer details";
      setError(errorMsg);
      setData(DUMMY_SEE_OFFER_DETAIL);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, offerId]);

  useEffect(() => {
    if (!initialData) {
      fetchOfferDetail();
    }
  }, [initialData, fetchOfferDetail]);

  const handleAcceptOffer = async (onSuccess?: () => void) => {
    setIsSubmitting(true);
    setSubmittingAction("accept");
    try {
      const res = await acceptB2BOfferAction(offerId);
      if (res.success) {
        showToast("success", t(localizationConstants.b2bPMAcceptOffer));
        if (onSuccess) onSuccess();
      } else {
        showToast("error", res.error || "Failed to accept offer");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to accept offer";
      showToast("error", errorMsg);
    } finally {
      setIsSubmitting(false);
      setSubmittingAction(null);
    }
  };

  const handleDeclineOffer = async () => {
    setIsSubmitting(true);
    setSubmittingAction("decline");
    try {
      const res = await declineB2BOfferAction(offerId);
      if (res.success) {
        showToast("info", t(localizationConstants.b2bPMDeclineOffer));
      } else {
        showToast("error", res.error || "Failed to decline offer");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to decline offer";
      showToast("error", errorMsg);
    } finally {
      setIsSubmitting(false);
      setSubmittingAction(null);
    }
  };

  const handleSendQAReply = async (messageId: string, replyText: string) => {
    const sanitizedReply = replyText.replace(/<[^>]*>?/gm, "").trim();
    if (!sanitizedReply) return;

    setIsSubmitting(true);
    setSubmittingAction("reply");

    setData((prev) => ({
      ...prev,
      qa: prev.qa.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              status: "answered" as const,
              answerText: sanitizedReply,
              answerUser: currentUserName,
              answerDate: t(localizationConstants.planningToday) || "Idag",
            }
          : msg
      ),
    }));

    try {
      const res = await sendB2BOfferQAReplyAction(offerId, messageId, sanitizedReply);
      if (res.success) {
        showToast("success", t(localizationConstants.b2bPMQASend));
      } else {
        showToast("error", res.error || "Failed to send reply");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to send reply";
      showToast("error", errorMsg);
    } finally {
      setIsSubmitting(false);
      setSubmittingAction(null);
    }
  };

  const handleArchiveQAMessage = (messageId: string) => {
    setData((prev) => ({
      ...prev,
      qa: prev.qa.filter((msg) => msg.id !== messageId),
    }));
    showToast("success", t(localizationConstants.b2bPMQAArkivera));
  };

  const handleDeleteQAMessage = (messageId: string) => {
    setData((prev) => ({
      ...prev,
      qa: prev.qa.filter((msg) => msg.id !== messageId),
    }));
    showToast("success", t(localizationConstants.b2bPMQARadera));
  };

  const handleMarkQARead = (messageId: string) => {
    setData((prev) => ({
      ...prev,
      qa: prev.qa.map((msg) =>
        msg.id === messageId ? { ...msg, status: "opened" as const } : msg
      ),
    }));
    showToast("success", t(localizationConstants.b2bPMQAMarkAsRead));
  };

  return {
    data,
    isLoading,
    isSubmitting,
    submittingAction,
    error,
    currentUserName,
    userInitials,
    refetch: fetchOfferDetail,
    handleAcceptOffer,
    handleDeclineOffer,
    handleSendQAReply,
    handleArchiveQAMessage,
    handleDeleteQAMessage,
    handleMarkQARead,
  };
}
