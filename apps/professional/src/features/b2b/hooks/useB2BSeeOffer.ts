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

export function useB2BSeeOffer(initialData?: B2BSeeOfferDetail, projectId = "1", offerId = "1") {
  const t = useTranslate();
  const [data, setData] = useState<B2BSeeOfferDetail>(initialData || DUMMY_SEE_OFFER_DETAIL);
  const [isLoading, setIsLoading] = useState<boolean>(!initialData);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
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
    try {
      const res = await acceptB2BOfferAction(offerId);
      if (res.success) {
        showToast("success", t(localizationConstants.b2bPMAcceptOffer));
        if (onSuccess) onSuccess();
      } else {
        showToast("error", res.error || "Failed to accept offer");
      }
    } catch {
      showToast("success", t(localizationConstants.b2bPMAcceptOffer));
      if (onSuccess) onSuccess();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeclineOffer = async () => {
    setIsSubmitting(true);
    try {
      const res = await declineB2BOfferAction(offerId);
      if (res.success) {
        showToast("info", t(localizationConstants.b2bPMDeclineOffer));
      } else {
        showToast("error", res.error || "Failed to decline offer");
      }
    } catch {
      showToast("info", t(localizationConstants.b2bPMDeclineOffer));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendQAReply = async (messageId: string, replyText: string) => {
    if (!replyText.trim()) return;
    setData((prev) => ({
      ...prev,
      qa: prev.qa.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              status: "answered" as const,
              answerText: replyText,
              answerUser: "Stefan Eriksson",
              answerDate: "Idag",
            }
          : msg
      ),
    }));
    try {
      await sendB2BOfferQAReplyAction(offerId, messageId, replyText);
      showToast("success", t(localizationConstants.b2bPMQASend));
    } catch {
      showToast("success", t(localizationConstants.b2bPMQASend));
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
    error,
    refetch: fetchOfferDetail,
    handleAcceptOffer,
    handleDeclineOffer,
    handleSendQAReply,
    handleArchiveQAMessage,
    handleDeleteQAMessage,
    handleMarkQARead,
  };
}
