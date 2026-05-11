export {};

declare global {
  interface Window {
    Trustpilot?: {
      loadFromElement: (element: HTMLElement, reinit: boolean) => void;
    };
  }
}
