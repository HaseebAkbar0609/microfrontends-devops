/** Map file extension (e.g. from `fileType` / `type`) to public `/assets/*.svg` icon */
export function getDocumentIconMeta(fileType: string): {
	src: string;
	alt: string;
} {
	const ext = fileType.trim().toLowerCase();

	if (ext === "pdf") {
		return { src: "/assets/pdf.svg", alt: "PDF" };
	}

	const imageExtensions = new Set([
		"png",
		"jpg",
		"jpeg",
		"gif",
		"webp",
		"svg",
		"bmp",
		"heic",
		"ico",
		"avif",
	]);
	if (imageExtensions.has(ext)) {
		return { src: "/assets/image-file.svg", alt: "Image" };
	}

	const documentExtensions = new Set([
		"doc",
		"docx",
		"odt",
		"txt",
		"rtf",
		"xls",
		"xlsx",
		"ppt",
		"pptx",
		"csv",
	]);
	if (documentExtensions.has(ext)) {
		return { src: "/assets/doc-file.svg", alt: "Document" };
	}

	return { src: "/assets/pdf.svg", alt: "File" };
}
