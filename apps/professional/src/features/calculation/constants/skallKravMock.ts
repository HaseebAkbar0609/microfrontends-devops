import type { SkallKravDoc } from "../types/kalkyl";

export const DUMMY_SKALL_KRAV_LIST: SkallKravDoc[] = [
	{
		id: "skk-1",
		datum: "2025-09-01",
		typ: "Referenslista",
		filename: "filename.pdf",
		fileUrl: "/mock/filename.pdf",
		fileSize: "1.2 MB",
	},
	{
		id: "skk-2",
		datum: "2025-09-01",
		typ: "SKV 4820",
		filename: "filename.pdf",
		fileUrl: "/mock/filename.pdf",
		fileSize: "840 KB",
	},
	{
		id: "skk-3",
		datum: "2025-09-01",
		typ: "Försäkringsbrev",
		filename: "filename.pdf",
		fileUrl: "/mock/filename.pdf",
		fileSize: "2.1 MB",
	},
];
