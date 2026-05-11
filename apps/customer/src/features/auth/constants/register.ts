import type { RegisterFormValues } from "../types";

export const CATEGORY_OPTIONS = [
  { value: "cleaning", label: "Städ" },
  { value: "construction", label: "Bygg" },
  { value: "plumbing", label: "Rörmokeri" },
  { value: "other", label: "Övrigt" },
];



export const REGISTER_DEFAULT_VALUES: RegisterFormValues = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  postalCode: "",
  address: "",
  city: "",
  country: "",
  password: "",
  confirmPassword: "",
  acceptTerms: false,
};
