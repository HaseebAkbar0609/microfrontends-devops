import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

export const checkoutSchema = z.object({
  email: z
    .string()
    .min(1, localizationConstants.manageCartCheckoutValidationEmailRequired)
    .email(localizationConstants.manageCartCheckoutValidationEmailInvalid),
  firstName: z
    .string()
    .min(
      1,
      localizationConstants.manageCartCheckoutValidationFirstNameRequired
    ),
  lastName: z
    .string()
    .min(1, localizationConstants.manageCartCheckoutValidationLastNameRequired),
  address: z
    .string()
    .min(1, localizationConstants.manageCartCheckoutValidationAddressRequired),
  address2: z.string(),
  country: z
    .string()
    .min(1, localizationConstants.manageCartCheckoutValidationCountryRequired),
  city: z
    .string()
    .min(1, localizationConstants.manageCartCheckoutValidationCityRequired),
  postalCode: z
    .string()
    .min(
      1,
      localizationConstants.manageCartCheckoutValidationPostalCodeRequired
    ),
  phone: z.string(),

  // kept for form shape; not used for Stripe UI now
  cardNumber: z.string(),
  expiry: z.string(),
  cvc: z.string(),

  discountCode: z.string(),
  addNote: z.boolean(),
  acceptTerms: z.boolean(),
});
