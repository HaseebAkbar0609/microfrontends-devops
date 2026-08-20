export const OFFER_ROUTES = {
  request: (offerId: string) => `/module/business/offer/${offerId}/request`,
  quoted: () => `/module/business/offer/quoted`,
  accepted: (offerId: string) => `/module/business/offer/${offerId}/accepted`,
  agreed: (offerId: string) => `/module/business/offer/${offerId}/agreed`,
  createAgreement: (offerId: string) =>
    `/module/business/offer/${offerId}/agreed/create`,
  archived: (offerId: string) => `/module/business/offer/${offerId}/archived`,
} as const;
