import { useCallback, useState } from "react";

/** Tracks which of several hover flyouts is open, so opening one closes the rest. */
export function useExclusiveFlyout() {
	const [openFlyoutId, setOpenFlyoutId] = useState<string | null>(null);

	const setFlyoutOpen = useCallback((id: string, open: boolean) => {
		setOpenFlyoutId((currentId) => {
			if (open) return id;
			// A late close from a flyout the pointer already left must not shut
			// the one that has opened since.
			return currentId === id ? null : currentId;
		});
	}, []);

	return { openFlyoutId, setOpenFlyoutId, setFlyoutOpen };
}
