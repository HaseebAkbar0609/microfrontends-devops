"use client";

import { useState, useCallback, useEffect } from "react";
import {
  getB2BOfferDetailAction,
  acceptB2BOfferAction,
  declineB2BOfferAction,
  sendB2BOfferQAReplyAction,
} from "@/api-actions/b2b/seeOffer";
import { B2BSeeOfferDetail } from "../types/seeOffer";
import { markProjectMarketQuestionReadAction } from "@/api-actions/b2b/projectMarket";
import { showToast } from "@/lib/toast";
import { useTranslate } from "@/utils/translation/translate";
import localizationConstants from "@/utils/translation/constants";
import { useAuthStatus, type User } from "@/context/AuthContext";

const EMPTY_SEE_OFFER_DETAIL: B2BSeeOfferDetail = {
  id: "",
  title: "",
  refNr: "",
  postedDate: "",
  city: "",
  municipality: "",
  totalOffert: 0,
  company: { id: "", name: "", email: "", telefon: "", adress: "", orgNr: "" },
  contactPerson: { name: "", email: "", mobil: "" },
  offert: { arbete: "", material: "", totalOffert: 0, betalningsvillkor: "" },
  documents: { images: [], docs: [], drawings: [] },
  qa: [],
};

export function useB2BSeeOffer(initialData?: B2BSeeOfferDetail, projectId = "1", offerId = "1") {
  const t = useTranslate();
  const { user } = useAuthStatus() as { user: User | null };
  const currentUserName =
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") || user?.email || "";
  const userInitials =
    ((user?.first_name?.[0] || "") + (user?.last_name?.[0] || "")).toUpperCase() ||
    currentUserName.slice(0, 2).toUpperCase();

  const [data, setData] = useState<B2BSeeOfferDetail>(initialData || EMPTY_SEE_OFFER_DETAIL);
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
        setError(res.error || "Failed to load offer details");
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Failed to load offer details";
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, offerId]);

  useEffect(() => {
    if (!initialData) {
      fetchOfferDetail();
    }
  }, [initialData, fetchOfferDetail]);

  /**
   * Re-read the offer without the full-page spinner. Run after accept / decline
   * so the badge and buttons show what the server now holds — they used to stay
   * on "Waiting" with both buttons until the page was reloaded.
   */
  const reloadQuietly = useCallback(async () => {
    const res = await getB2BOfferDetailAction(projectId, offerId);
    if (res.success && res.data) setData(res.data);
  }, [projectId, offerId]);

  /** Worded from the HTTP status — the API message can be a raw error code. */
  const offerActionError = (code: string | undefined, fallback: string | null) => {
    if (code === "forbidden") return t(localizationConstants.b2bErrorOfferNoPermission);
    if (code === "conflict") return t(localizationConstants.b2bErrorOfferSettled);
    if (code === "not_found") return t(localizationConstants.b2bErrorProjectGone);
    return fallback || t(localizationConstants.genericError);
  };

  const handleAcceptOffer = async (onSuccess?: () => void) => {
    setIsSubmitting(true);
    setSubmittingAction("accept");
    try {
      const res = await acceptB2BOfferAction(offerId);
      if (res.success) {
        showToast("success", t(localizationConstants.b2bPMAcceptOffer));
        await reloadQuietly();
        if (onSuccess) onSuccess();
      } else {
        showToast("error", offerActionError(res.errorCode, res.error));
        // A refused accept can still mean the offer changed (e.g. another user
        // settled it first) — show the offer as it is now.
        await reloadQuietly();
      }
    } catch {
      showToast("error", t(localizationConstants.genericError));
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
        showToast("error", offerActionError(res.errorCode, res.error));
      }
      await reloadQuietly();
    } catch {
      showToast("error", t(localizationConstants.genericError));
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

  /**
   * Mark a question as read (new → opened) in the project's shared thread.
   *
   * This used to only flip local state and toast success — nothing was saved,
   * so the question was back in "New" after a reload. Archive / delete of a
   * message had the same problem and have no backend at all, so they are gone.
   * The thread is addressed by project: the response's own `projectId`, since
   * the flat `/overview/offer/[offerId]` route has no project id of its own.
   */
  const handleMarkQARead = async (messageId: string) => {
    const threadProjectId = data.projectId || projectId;
    const res = await markProjectMarketQuestionReadAction(threadProjectId, messageId);
    if (res.success) {
      setData((prev) => ({
        ...prev,
        qa: prev.qa.map((msg) =>
          msg.id === messageId && msg.status === "new" ? { ...msg, status: "opened" } : msg
        ),
      }));
      showToast("success", t(localizationConstants.b2bPMQAMarkAsRead));
    } else {
      showToast("error", res.error || t(localizationConstants.genericError));
    }
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
    handleMarkQARead,
  };
}
