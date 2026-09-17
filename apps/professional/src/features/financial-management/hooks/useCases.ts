"use client";

import { useState, useEffect, useCallback } from "react";
import { casesRepository } from "../utils/casesRepository";
import type {
	CaseItem,
	CaseFormData,
	CaseStatus,
	CaseMessage,
	CaseDocument,
} from "../types/cases.types";

export function useCases() {
	const [cases, setCases] = useState<CaseItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const sync = () => {
			setCases(casesRepository.getAll());
			setIsLoading(false);
		};

		sync();
		const unsubscribe = casesRepository.subscribe(sync);
		return unsubscribe;
	}, []);

	const getCaseById = useCallback((id: string) => {
		return casesRepository.getById(id);
	}, []);

	const createCase = useCallback((data: CaseFormData) => {
		return casesRepository.create(data);
	}, []);

	const updateCase = useCallback((id: string, updates: Partial<CaseFormData>) => {
		return casesRepository.update(id, updates);
	}, []);

	const updateStatus = useCallback((id: string, status: CaseStatus) => {
		return casesRepository.updateStatus(id, status);
	}, []);

	const deleteCase = useCallback((id: string) => {
		return casesRepository.delete(id);
	}, []);

	const addMessage = useCallback(
		(caseId: string, message: Omit<CaseMessage, "id" | "caseId" | "createdAt">) => {
			return casesRepository.addMessage(caseId, message);
		},
		[]
	);

	const addDocument = useCallback((caseId: string, doc: Omit<CaseDocument, "id">) => {
		return casesRepository.addDocument(caseId, doc);
	}, []);

	const removeDocument = useCallback((caseId: string, docId: string) => {
		return casesRepository.removeDocument(caseId, docId);
	}, []);

	const addImage = useCallback((caseId: string, img: Omit<CaseDocument, "id">) => {
		return casesRepository.addImage(caseId, img);
	}, []);

	const removeImage = useCallback((caseId: string, imgId: string) => {
		return casesRepository.removeImage(caseId, imgId);
	}, []);

	const getNextCaseNumber = useCallback(() => {
		return casesRepository.getNextCaseNumber();
	}, []);

	return {
		cases,
		isLoading,
		getCaseById,
		createCase,
		addCase: createCase,
		updateCase,
		updateStatus,
		updateCaseStatus: updateStatus,
		deleteCase,
		addMessage,
		addDocument,
		removeDocument,
		addImage,
		removeImage,
		getNextCaseNumber,
	};
}

