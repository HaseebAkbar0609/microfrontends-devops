import { openSafeUrl, safeExternalUrl } from "@/lib/safeUrl";

const FRAME_ID = "record-print-frame";

/* Laid out but unseen: Chrome never starts its viewer in a `display: none`
   frame, and Firefox's viewer needs real height to print — so not 0×0 either. */
const FRAME_STYLE = "position:fixed;left:0;top:0;width:1px;height:100px;opacity:0;border:0;pointer-events:none";

/**
 * Removes the print frame. Each print does this first, and the page calls it
 * on unmount, so no viewer outlives the section. It is not removed when the
 * print dialog closes: the frame may still be in use then.
 */
export function disposePrintFrame(): void {
	document.getElementById(FRAME_ID)?.remove();
}

/**
 * Prints one stored file rather than the page around it — the ⋮ "Skriv ut" of
 * a record's row.
 *
 * A `blob:` URL the section's store minted is same-origin, so it loads into a
 * hidden frame whose own print runs the browser's viewer on just that file. A
 * fresh frame per print, printed on its own load, so a quick second press
 * never prints a half-loaded file or prints twice. Where the browser shows no
 * PDF inline (a frame would download the file and print a blank page), or the
 * URL is not a `blob:`, the file opens in a new tab through `openSafeUrl`'s
 * allow-list, where the reader prints it.
 *
 * Call straight from the click, so that tab is not blocked. Returns `false`
 * when there is nothing safe to print; `onFailed` runs if the browser then
 * refuses to print the loaded frame.
 *
 * The frame must never be sandboxed — that blocks `print()` — and only renders
 * a file served as a type the browser can show, which `mintTypedUrl` sets.
 */
export function printStoredFile(url: string | undefined, onFailed: () => void): boolean {
	const safe = safeExternalUrl(url);
	if (!safe) return false;
	if (!safe.startsWith("blob:") || navigator.pdfViewerEnabled === false) return openSafeUrl(safe);

	disposePrintFrame();
	const frame = document.createElement("iframe");
	frame.id = FRAME_ID;
	frame.tabIndex = -1;
	frame.setAttribute("aria-hidden", "true");
	frame.style.cssText = FRAME_STYLE;
	frame.addEventListener(
		"load",
		() => {
			try {
				frame.contentWindow?.print();
			} catch {
				frame.remove();
				onFailed();
			}
		},
		{ once: true },
	);
	/* Before insertion, so the frame's initial blank page never reaches the listener. */
	frame.src = safe;
	document.body.appendChild(frame);
	return true;
}
