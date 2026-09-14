"use client";

import { useState, useEffect, useCallback } from "react";
import type {
	AuthorityItem,
	AuthorityAttachment,
} from "../types/authorities.types";
import { authoritiesRepository } from "../utils/authoritiesRepository";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import localizationConstants from "@/utils/translation/constants";

export function useAuthorityDetail(id: string) {
	const { t } = useTranslation();
	const [authority, setAuthority] = useState<AuthorityItem | undefined>(undefined);
	const [isLoading, setIsLoading] = useState(true);

	const loadData = useCallback(() => {
		setIsLoading(true);
		const found = authoritiesRepository.getById(id);
		setAuthority(found);
		setIsLoading(false);
	}, [id]);

	useEffect(() => {
		loadData();
	}, [loadData]);

	const addComment = useCallback(
		(message: string, author = "Erik Eriksson") => {
			if (!message.trim()) return;
			const created = authoritiesRepository.addComment(id, message, author);
			if (created) {
				loadData();
				toast.success(t(localizationConstants.toastCommentAdded));
			}
			return created;
		},
		[id, loadData, t],
	);

	const addAttachment = useCallback(
		(att: Omit<AuthorityAttachment, "id">) => {
			const created = authoritiesRepository.addAttachment(id, att);
			if (created) {
				loadData();
				toast.success(t(localizationConstants.toastAuthorityUpdated));
			}
			return created;
		},
		[id, loadData, t],
	);

	const deleteCurrentAuthority = useCallback(() => {
		const success = authoritiesRepository.delete(id);
		if (success) {
			toast.success(t(localizationConstants.toastAuthorityDeleted));
		}
		return success;
	}, [id, t]);

	return {
		authority,
		isLoading,
		addComment,
		addAttachment,
		deleteCurrentAuthority,
		reload: loadData,
	};
}
