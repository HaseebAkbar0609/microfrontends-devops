/**
 * How long a hover flyout waits before closing.
 *
 * Flyouts open to the right of the sidebar, so the pointer has to cross a gap to
 * reach them. Closing on the first mouseleave made nested menus such as
 * Modul › Affär › Försäljning vanish before they could be clicked.
 */
export const SIDEBAR_FLYOUT_CLOSE_DELAY_MS = 400;
