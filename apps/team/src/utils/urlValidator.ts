const ALLOWED_HOSTNAMES = [
	process.env.NEXT_PUBLIC_API_URL
		? new URL(process.env.NEXT_PUBLIC_API_URL).hostname
		: null,
	...(process.env.NEXT_PUBLIC_ALLOWED_DOCUMENT_HOSTS ?? "")
		.split(",")
		.map((h) => h.trim())
		.filter(Boolean),
].filter(Boolean) as string[];

export function isSafeUrl(url: string): boolean {
	let parsed: URL;
	try {
		parsed = new URL(url);
	} catch {
		return false;
	}
	if (parsed.protocol !== "https:") return false;
	return ALLOWED_HOSTNAMES.some(
		(host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`),
	);
}
