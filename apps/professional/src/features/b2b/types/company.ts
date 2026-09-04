import { z } from "zod";

export type CompanyTeamMember = {
  id: string;
  name: string;
  role: string;
  roleColor: string;
  email: string;
  initials: string;
  avatarColor: string;
  image?: string;
};

export type CompanyReference = {
  id: string;
  projekt: string;
  kund: string;
  kommun: string;
  kontakt: string;
  telefon: string;
  pdfLabel?: string;
};

export type CompanyReview = {
  id: string;
  reviewerName: string;
  rating: number;
  date: string;
  reviewText: string;
  reviewerAvatar?: string;
  companyReply?: {
    companyInitials: string;
    companyName: string;
    replyText: string;
    date: string;
  };
};

export type CompanyDetail = {
  id: string;
  namn: string;
  orgNr: string;
  vatNr: string;
  sniKod: string;
  verificationStatus?: "verified" | "pending" | "unverified";
  logoUrl?: string;
  description?: string;
  adress: {
    postAdress: string;
    postNr: string;
    ort: string;
    besoksAdress: string;
    besoksPostNr: string;
    besoksOrt: string;
    leveransAdress: string;
    leveransPostNr: string;
    leveransOrt: string;
    vaxelNr: string;
    epost: string;
    hemsida: string;
  };
  fakturaEmail: string;
  kreditInput1?: string;
  kreditInput2?: string;
  presentationText: string;
  team: CompanyTeamMember[];
  presentationFiles: { id: string; label: string; type: string }[];
  references: CompanyReference[];
  reviews: CompanyReview[];
};

export const companyValidationSchema = z.object({
  namn: z.string().min(1, "validationRequired"),
  orgNr: z.string().min(1, "validationRequired"),
  vatNr: z.string().min(1, "validationRequired"),
  sniKod: z.string().min(1, "validationRequired"),
  adress: z.object({
    postAdress: z.string().min(1, "validationRequired"),
    postNr: z.string().min(1, "validationRequired"),
    ort: z.string().min(1, "validationRequired"),
    besoksAdress: z.string().min(1, "validationRequired"),
    besoksPostNr: z.string().min(1, "validationRequired"),
    besoksOrt: z.string().min(1, "validationRequired"),
    leveransAdress: z.string().min(1, "validationRequired"),
    leveransPostNr: z.string().min(1, "validationRequired"),
    leveransOrt: z.string().min(1, "validationRequired"),
    vaxelNr: z.string().min(1, "validationRequired"),
    epost: z.string().email("validationEmailInvalid").min(1, "validationRequired"),
    hemsida: z.string().min(1, "validationRequired"),
  }),
  fakturaEmail: z.string().email("validationEmailInvalid").min(1, "validationRequired"),
  kreditInput1: z.string().optional(),
  kreditInput2: z.string().optional(),
  presentationText: z.string().optional(),
});

export type CompanyFormValues = z.infer<typeof companyValidationSchema>;
