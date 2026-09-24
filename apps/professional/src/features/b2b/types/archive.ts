export type B2BArchiveTyp = "B2B-Hyra UT" | "B2B-Offert" | "B2B-Hyra IN";

export type B2BArchiveItem = {
  id: string;
  refNr: string;
  projekt: string;
  datum: string;
  typ: B2BArchiveTyp;
  forfragningar: string;
  kommun: string;
  lagstOffert: number;
  /** Whether this company sent an offer — "View quote" is offered only then. */
  hasOffer: boolean;
};
