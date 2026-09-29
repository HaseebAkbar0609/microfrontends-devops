export type CustomerStatus = "active" | "inactive" | "pending";

export interface PrivateCustomer {
  id: string;
  customerNumber: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  activeRequests: number;
  ongoingProjects: number;
  lastActivity: string;
  status: CustomerStatus;
}

export interface PendingCustomer {
  id: string;
  customerNumber: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  lastActivity: string;
  status: "pending";
}

export interface CustomerListResult<T = PrivateCustomer> {
  items: T[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  pageSize: number;
}

export interface CustomerListQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateCustomerFormData {
  firstName: string;
  lastName: string;
  personalNumber?: string;
  privateEmail: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

/** `GlobalAnalyticsResponse` from GET /api/v1/teams/private/analytics. */
export interface PrivateCustomersAnalytics {
  total_private_customers: number;
  active_customers: number;
  pending_customers: number;
  archived_customers: number;
  total_inquiries: number;
  open_support_tickets: number;
  total_revenue_sek: number;
}
