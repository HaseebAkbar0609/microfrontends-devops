export type AdminUserRole = "owner" | "manage" | "worker";
export type AdminUserStatus = "active" | "inactive" | "deactivated" | "pending" | "invited";
export type AdminUserAction = "edit" | "activate" | "deactivate" | "resend" | "delete";
export type AdminUserSort = "created_at" | "first_name" | "last_name" | "email" | "department" | "position" | "role" | "status" | "last_login";

export interface AdminUsersParams {
  skip?: number;
  limit?: number;
  search?: string;
  role?: AdminUserRole;
  status?: AdminUserStatus;
  department?: string;
  sort_by?: AdminUserSort;
  sort_dir?: "asc" | "desc";
}

export interface AdminOption { id: string; name: string }
export interface AdminResponse<T> { data: T; success?: boolean; message?: string; allowed_roles?: AdminUserRole[] }
export interface AdminUsersResponse extends AdminResponse<AdminUser[]> {
  total_items: number;
  total_pages: number;
  current_page: number;
  page_size: number;
  available_actions?: string[];
}

export interface AdminUser {
  id: string;
  first_name: string;
  last_name: string;
  display_name: string;
  email: string;
  pending_email?: string | null;
  role: AdminUserRole;
  status: AdminUserStatus;
  department?: string | null;
  department_id?: string | null;
  position?: string | null;
  position_id?: string | null;
  phone_number?: string | null;
  personal_id?: string | null;
  user_credentials?: string | null;
  permission_role_name?: string | null;
  permission_role_id?: string | null;
  groups?: (AdminOption | string)[] | null;
  avatar_url?: string | null;
  created_at?: string | number | null;
  last_login?: string | number | null;
  available_actions: AdminUserAction[];
  editable_fields: (keyof UpdateAdminUserRequest)[];
  allowed_roles: AdminUserRole[];
}

export interface AdminUserDetail extends AdminUser {
  language_preference?: string | null;
  sms_authentication: boolean;
  auto_logout?: number | null;
  module_permissions?: Record<string, boolean> | null;
}

export interface UpdateAdminUserRequest {
  first_name?: string;
  last_name?: string;
  email?: string;
  user_credentials?: string | null;
  phone_number?: string | null;
  personal_id?: string | null;
  language?: string | null;
  role?: AdminUserRole;
  department?: string | null;
  position_id?: string | null;
  permission_role_id?: string | null;
  sms_authentication?: boolean;
  auto_logout?: number | null;
  module_permissions?: Record<string, boolean>;
}

export interface CreateAdminUserRequest extends UpdateAdminUserRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: AdminUserRole;
  active: boolean;
  send_invitation: boolean;
}

export interface AdminModule {
  id: string;
  name: string;
  name_sv?: string;
  icon?: string;
}
export interface AdminModuleCategory { category: string; modules: AdminModule[] }
