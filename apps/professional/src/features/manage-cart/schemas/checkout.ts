import { z } from "zod";
import localizationConstants from "@/utils/translation/constants";

const trimmedRequired = (message: string, max: number) =>
	z.string().trim().min(1, message).max(max, message);

export const checkoutSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, localizationConstants.manageCartCheckoutValidationEmailRequired)
    .email(localizationConstants.manageCartCheckoutValidationEmailInvalid)
    .max(254, localizationConstants.manageCartCheckoutValidationEmailInvalid),
  firstName: trimmedRequired(
    localizationConstants.manageCartCheckoutValidationFirstNameRequired,
    100,
  ),
  lastName: trimmedRequired(
    localizationConstants.manageCartCheckoutValidationLastNameRequired,
    100,
  ),
  address: trimmedRequired(
    localizationConstants.manageCartCheckoutValidationAddressRequired,
    200,
  ),
  address2: z.string().trim().max(200),
  country: trimmedRequired(
    localizationConstants.manageCartCheckoutValidationCountryRequired,
    64,
  ),
  city: trimmedRequired(
    localizationConstants.manageCartCheckoutValidationCityRequired,
    64,
  ),
  postalCode: z
    .string()
    .trim()
    .min(
      1,
      localizationConstants.manageCartCheckoutValidationPostalCodeRequired
    )
    .max(16)
    .regex(/^[A-Za-z0-9 -]+$/),
  phone: z.string().trim().max(32).regex(/^[0-9+() .-]*$/),

  // kept for form shape; not used for Stripe UI now
  cardNumber: z.string(),
  expiry: z.string(),
  cvc: z.string(),

  discountCode: z.string().trim().max(64),
  addNote: z.boolean(),
  // Terms are accepted on the cart confirmation step before this payment form.
  // Keep the field in the form shape, but do not silently block Pay here.
  acceptTerms: z.boolean(),
});
