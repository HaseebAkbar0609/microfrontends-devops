"use client";

import { useState, useEffect, useCallback } from "react";
import {
	PersonalProcessItem,
	PersonalProcessFormData,
	ProcessChecklistItem,
	ProcessDocumentItem,
	ProcessCategory,
} from "../types/personalProcess.types";
import { DEFAULT_CHECKLIST_TEMPLATE } from "../constants/personalProcess.mock";

interface UsePersonalProcessFormProps {
	initialProcess: PersonalProcessItem | null;
	onSave: (data: PersonalProcessFormData) => void;
	onCancel: () => void;
}

export function usePersonalProcessForm({
	initialProcess,
	onSave,
	onCancel,
}: UsePersonalProcessFormProps) {
	const isEditMode = Boolean(initialProcess);

	const [id, setId] = useState("");
	const [title, setTitle] = useState("");
	const [date, setDate] = useState("");
	const [category, setCategory] = useState<ProcessCategory>("onboarding");
	const [checklist, setChecklist] = useState<ProcessChecklistItem[]>([]);
	const [documents, setDocuments] = useState<ProcessDocumentItem[]>([]);
	const [uploadTags, setUploadTags] = useState<string[]>(["Document 1.pdf", "Document 2.doc"]);

	useEffect(() => {
		if (initialProcess) {
			setId(initialProcess.id);
			setTitle(initialProcess.title);
			setDate(initialProcess.date);
			setCategory(initialProcess.category);
			setChecklist(initialProcess.checklist.map((item) => ({ ...item })));
			setDocuments(initialProcess.documents.map((doc) => ({ ...doc })));
		} else {
			const randomSuffix = Math.floor(100 + Math.random() * 900);
			setId(`M${randomSuffix}`);
			setTitle("");
			setDate(new Date().toISOString().split("T")[0]);
			setCategory("onboarding");
			setChecklist(DEFAULT_CHECKLIST_TEMPLATE.map((item) => ({ ...item })));
			setDocuments([
				{ id: `pdoc_${Date.now()}_1`, date: "2024-05-10", name: "Arbetsbeskrivning", fileFormat: "PDF", fileSize: "1.2 MB" },
				{ id: `pdoc_${Date.now()}_2`, date: "2024-05-10", name: "Policy", fileFormat: "PDF", fileSize: "850 KB" },
				{ id: `pdoc_${Date.now()}_3`, date: "2024-05-10", name: "Policy", fileFormat: "PDF", fileSize: "920 KB" },
			]);
		}
		setUploadTags(["Document 1.pdf", "Document 2.doc"]);
	}, [initialProcess]);

	const handleToggleChecklist = useCallback((itemId: string) => {
		const today = new Date().toISOString().split("T")[0];
		setChecklist((prev) =>
			prev.map((item) => {
				if (item.id !== itemId) return item;
				const nextCompleted = !item.isCompleted;
				return {
					...item,
					isCompleted: nextCompleted,
					completedDate: nextCompleted ? today : undefined,
				};
			})
		);
	}, []);

	const handleUpdateChecklistTitle = useCallback((itemId: string, newTitle: string) => {
		setChecklist((prev) =>
			prev.map((item) => (item.id === itemId ? { ...item, title: newTitle } : item))
		);
	}, []);

	const handleAddChecklistRow = useCallback(() => {
		const newItem: ProcessChecklistItem = {
			id: `chk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
			title: "",
			isCompleted: false,
		};
		setChecklist((prev) => [...prev, newItem]);
	}, []);

	const handleDeleteChecklistRow = useCallback((itemId: string) => {
		setChecklist((prev) => prev.filter((item) => item.id !== itemId));
	}, []);

	const handleRemoveUploadTag = useCallback((tag: string) => {
		setUploadTags((prev) => prev.filter((t) => t !== tag));
	}, []);

	const handleAddFiles = useCallback((files: FileList | File[]) => {
		const newNames: string[] = [];
		Array.from(files).forEach((file) => {
			if (file.name && !uploadTags.includes(file.name)) {
				newNames.push(file.name);
			}
		});
		if (newNames.length > 0) {
			setUploadTags((prev) => [...prev, ...newNames]);
		}
	}, [uploadTags]);

	const handleUploadDocuments = useCallback(() => {
		if (uploadTags.length === 0) return;
		const today = new Date().toISOString().split("T")[0];
		const newDocs: ProcessDocumentItem[] = uploadTags.map((name, idx) => ({
			id: `pdoc_${Date.now()}_${idx}`,
			date: today,
			name: name.replace(/\.[^/.]+$/, ""),
			fileFormat: name.toLowerCase().endsWith(".doc") ? "DOC" : "PDF",
			fileSize: "1.0 MB",
		}));
		setDocuments((prev) => [...prev, ...newDocs]);
		setUploadTags([]);
	}, [uploadTags]);

	const handleDeleteDocument = useCallback((docId: string) => {
		setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave({
			id,
			title: title.trim(),
			date,
			category,
			checklist,
			documents,
		});
	};

	return {
		isEditMode,
		id,
		title,
		setTitle,
		date,
		setDate,
		category,
		setCategory,
		checklist,
		documents,
		uploadTags,
		handleToggleChecklist,
		handleUpdateChecklistTitle,
		handleAddChecklistRow,
		handleDeleteChecklistRow,
		handleRemoveUploadTag,
		handleAddFiles,
		handleUploadDocuments,
		handleDeleteDocument,
		handleSubmit,
		onCancel,
	};
}
