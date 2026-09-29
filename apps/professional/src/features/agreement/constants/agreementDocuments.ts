import { BreadcrumbItem } from "@/types/common";
import localizationConstants from "@/utils/translation/constants";
import type {
	AgreementDocumentItem,
	AvailableDocumentOption,
} from "../types/agreementDocuments";

export const AGREEMENT_DOCUMENTS_BREADCRUMBS: BreadcrumbItem[] = [
	{ label: localizationConstants.home, href: "/" },
	{ label: localizationConstants.modulesTitle },
	{ label: localizationConstants.businessSupportCategory },
	{
		label: localizationConstants.agreement,
		href: "/module/business-support/agreement/dashboard",
	},
	{ label: localizationConstants.documentCenterItem },
];

export const INITIAL_AGREEMENT_DOCUMENTS: AgreementDocumentItem[] = [
	{
		id: "doc_init_1",
		date: "2024-05-10",
		name: "Regler för juppsägning.pdf",
		fileName: "Regler för juppsägning.pdf",
		fileType: "pdf",
		url: "/mock/regler-for-juppsagning.pdf",
		size: "1.2 MB",
	},
	{
		id: "doc_init_2",
		date: "2024-05-10",
		name: "Arkiv regler för avtal .pdf",
		fileName: "Arkiv regler för avtal .pdf",
		fileType: "pdf",
		url: "/mock/arkiv-regler-for-avtal.pdf",
		size: "850 KB",
	},
];

export const AVAILABLE_AGREEMENT_DOCUMENTS: AvailableDocumentOption[] = [
	{
		id: "avail_doc_1",
		name: "Standardavtal B2B.pdf",
		fileType: "pdf",
	},
	{
		id: "avail_doc_2",
		name: "Sekretessavtal (NDA).pdf",
		fileType: "pdf",
	},
	{
		id: "avail_doc_3",
		name: "Samarbetsavtal 2024.docx",
		fileType: "doc",
	},
	{
		id: "avail_doc_4",
		name: "Allmänna villkor.pdf",
		fileType: "pdf",
	},
];

export const ALLOWED_DOCUMENT_FILE_EXTENSIONS = ".png,.jpg,.jpeg,.pdf,.doc,.docx";
export const AGREEMENT_DOCUMENTS_STORAGE_KEY = "tfs_agreement_documents_center_v1";
