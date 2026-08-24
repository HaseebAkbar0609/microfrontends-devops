export const OFFER_ROUTES = {
  request: (offerId?: string) =>
    offerId ? `/module/business/offer/${offerId}/request` : `/module/business/offer/request`,
  requestDetail: (requestId: string) => `/module/business/offer/request/${requestId}`,
  quoted: () => `/module/business/offer/quoted`,
  accepted: (offerId?: string) =>
    offerId ? `/module/business/offer/${offerId}/accepted` : `/module/business/offer/accepted`,
  agreed: (offerId?: string) =>
    offerId ? `/module/business/offer/${offerId}/agreed` : `/module/business/offer/agreed`,
  agreedProject: (projectId: string, offerId?: string) =>
    offerId
      ? `/module/business/offer/${offerId}/agreed/project/${projectId}`
      : `/module/business/offer/agreed/project/${projectId}`,
  createAgreement: (offerId: string) =>
    `/module/business/offer/${offerId}/agreed/create`,
  archived: (offerId?: string) =>
    offerId ? `/module/business/offer/${offerId}/archived` : `/module/business/offer/archived`,
  archivedProject: (projectId: string, offerId?: string) =>
    offerId
      ? `/module/business/offer/${offerId}/archived/project/${projectId}`
      : `/module/business/offer/archived/project/${projectId}`,
} as const;
