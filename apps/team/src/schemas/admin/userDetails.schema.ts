import { z } from "zod";

export const userDetailsSchema = z.object({
  isAdmin: z.boolean(),
  group: z.string(),
  role: z.string(),
  type: z.string(),
  reports: z.boolean(),
  registerImportant: z.boolean(),
  permSalesSell: z.boolean(),
  permSalesMarknad: z.boolean(),
  permSalesAll: z.boolean(),
  permEconEkonomi: z.boolean(),
  permEconFaktura: z.boolean(),
  permEconPersonal: z.boolean(),
  permEconJuridik: z.boolean(),
  permEconPrognoser: z.boolean(),
  permEconAll: z.boolean(),
  permBizAvtal: z.boolean(),
  permBizDataIT: z.boolean(),
  permBizKMA: z.boolean(),
  permBizMailet: z.boolean(),
  permBizLedningsstod: z.boolean(),
  permBizAll: z.boolean(),
});

export type UserDetailsFormValues = z.infer<typeof userDetailsSchema>;
