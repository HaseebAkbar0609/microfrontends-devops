"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuthStatus } from "@/context/AuthContext";
import { useTranslate } from "@/utils/translation/translate";
import { getContext, writeWorkflow } from "./api";
import { workflowError } from "./labels";
import type { Target, Write } from "./types";

export function useDocumentWorkflow(target: Target) {
  const { company, user } = useAuthStatus();
  const actorId = user && typeof user === "object" && "id" in user ? user.id : null;
  const cache = useQueryClient();
  const t = useTranslate();
  const context = useQuery({ queryKey: ["document-workflow", company?.id, actorId, target.projectId, target.id],
    queryFn: () => getContext(target), enabled: !!company?.id, retry: false });
  const mutation = useMutation({
    mutationFn: (write: Write) => {
      if (!context.data) throw new Error("WORKFLOW_CONTEXT_INVALID");
      return writeWorkflow(target, context.data, write);
    },
    onSuccess: async () => {
      toast.success(t("dwSaved"));
      await cache.invalidateQueries({ queryKey: ["document-workflow", company?.id, actorId, target.projectId, target.id] });
      await cache.invalidateQueries({ queryKey: ["document-workflow-history", company?.id, actorId, target.projectId, target.id] });
      await cache.invalidateQueries({ queryKey: ["professional-project-documents", company?.id, target.projectId] });
    },
    onError: async error => {
      if (workflowError(error) === "dwConflict") await context.refetch();
    },
  });
  return { context, mutation };
}
