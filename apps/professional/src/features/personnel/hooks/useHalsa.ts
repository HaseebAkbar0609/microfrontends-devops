"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import {
	HalsaSubView,
	FriskvardData,
	RehabData,
	RehabDocumentItem,
} from "../types/halsa.types";
import { INITIAL_FRISKVARDS_DATA, INITIAL_REHAB_DATA } from "../constants/halsa.mock";
import localizationConstants from "@/utils/translation/constants";

export function useHalsa() {
	const [subView, setSubView] = useState<HalsaSubView>("friskvard");
	const [friskvardData, setFriskvardData] = useState<FriskvardData>(INITIAL_FRISKVARDS_DATA);
	const [rehabData, setRehabData] = useState<RehabData>(INITIAL_REHAB_DATA);
	const [isEditFriskvardOpen, setIsEditFriskvardOpen] = useState(false);
	const [isEditRehabOpen, setIsEditRehabOpen] = useState(false);
	const [previewDocName, setPreviewDocName] = useState<string | null>(null);

	const handleSetSubView = useCallback((view: HalsaSubView) => {
		setSubView(view);
	}, []);

	const handleOpenEditFriskvard = useCallback(() => {
		setIsEditFriskvardOpen(true);
	}, []);

	const handleCloseEditFriskvard = useCallback(() => {
		setIsEditFriskvardOpen(false);
	}, []);

	const handleSaveFriskvard = useCallback((updated: FriskvardData) => {
		setFriskvardData(updated);
		setIsEditFriskvardOpen(false);
		toast.success(localizationConstants.friskvardToastSaved);
	}, []);

	const handleOpenEditRehab = useCallback(() => {
		setIsEditRehabOpen(true);
	}, []);

	const handleCloseEditRehab = useCallback(() => {
		setIsEditRehabOpen(false);
	}, []);

	const handleSaveRehab = useCallback((updated: Partial<RehabData>) => {
		setRehabData((prev) => ({
			...prev,
			...updated,
		}));
		setIsEditRehabOpen(false);
		toast.success(localizationConstants.rehabToastSaved);
	}, []);

	const handleAddRehabDoc = useCallback((docInfo: { name: string; fileFormat: string; fileSize?: string }) => {
		const newDoc: RehabDocumentItem = {
			id: `rehab_doc_${Date.now()}`,
			date: new Date().toISOString().split("T")[0],
			name: docInfo.name,
			fileFormat: docInfo.fileFormat,
			fileSize: docInfo.fileSize || "1.0 MB",
		};
		setRehabData((prev) => ({
			...prev,
			documents: [newDoc, ...prev.documents],
		}));
		toast.success(localizationConstants.rehabToastDocUploaded);
	}, []);

	const handleDeleteDoc = useCallback((docId: string) => {
		setRehabData((prev) => ({
			...prev,
			documents: prev.documents.filter((d) => d.id !== docId),
		}));
		toast.success(localizationConstants.rehabToastDocDeleted);
	}, []);

	const handlePreviewDoc = useCallback((docName: string) => {
		setPreviewDocName(docName);
	}, []);

	const handleClosePreviewDoc = useCallback(() => {
		setPreviewDocName(null);
	}, []);

	return {
		subView,
		friskvardData,
		rehabData,
		isEditFriskvardOpen,
		isEditRehabOpen,
		previewDocName,
		handleSetSubView,
		handleOpenEditFriskvard,
		handleCloseEditFriskvard,
		handleSaveFriskvard,
		handleOpenEditRehab,
		handleCloseEditRehab,
		handleSaveRehab,
		handleAddRehabDoc,
		handleDeleteDoc,
		handlePreviewDoc,
		handleClosePreviewDoc,
	};
}
