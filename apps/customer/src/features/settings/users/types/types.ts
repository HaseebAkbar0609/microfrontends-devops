export type UserStatus = "active" | "deactivated";

export type UserAccountType = "admin" | "users";

export type UserPermissionKey =
  | "viewProjects"
  | "createProjects"
  | "editProjects"
  | "viewOffers"
  | "approveOffers"
  | "manageUsers";

export type UserPermissions = Record<UserPermissionKey, boolean>;

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  mobile_number: string;
  private_email: string;
  address: string;
  city: string;
  city_id?: string | null;
  country_id?: string | null;
  postal_code: string;
  personal_number: string;
  profile_photo?: string | null;
  date_created: string;
  account_type: UserAccountType;
  last_login: string;
  status: UserStatus;
  permissions: UserPermissions;
  created_by?: string | null;
}

export type UserColumnField = keyof User | "actions";
