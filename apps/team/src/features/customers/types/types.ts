export type CustomerStatus = "active" | "inactive";

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

export interface CustomerListResult {
  items: PrivateCustomer[];
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
  personalNumber: string;
  privateEmail: string;
  address: string;
  city: string;
  postalCode: string;
}
