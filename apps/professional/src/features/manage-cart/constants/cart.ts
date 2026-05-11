import { PaymentDetailsFormValues } from "../types";

export const DEFAULT_PAYMENT_DETAILS_FORM_VALUES = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  address2: "",
  country: "",
  city: "",
  postalCode: "",
  phone: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
  discountCode: "",
  addNote: false,
  acceptTerms: false,
} as PaymentDetailsFormValues;

export const PAYMENT_MODES = {
  SAVED: "saved",
  NEW: "new",
} as const;
