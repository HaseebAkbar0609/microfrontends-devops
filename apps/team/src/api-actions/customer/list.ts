import axiosInstance from "@/lib/axiosInstance";
import type {
  CustomerListQueryParams,
  CustomerListResult,
  PrivateCustomer,
} from "@/features/customers/types/types";

const MOCK_ENABLE = false;
const CUSTOMERS_LIST_PATH = "/api/v1/teams/private/customers/active";
const DEFAULT_PAGE_SIZE = 10;

const MOCK_CUSTOMERS: PrivateCustomer[] = [
  {
    id: "1",
    customerNumber: "2025-01",
    name: "Anna Larsson",
    email: "anna@example.com",
    phone: "940 987 6574",
    city: "Stockholm",
    activeRequests: 1,
    ongoingProjects: 1,
    lastActivity: "2025-02-10",
    status: "active",
  },
  {
    id: "2",
    customerNumber: "2025-02",
    name: "Erik Svensson",
    email: "erik@example.com",
    phone: "940 987 6574",
    city: "Göteborg",
    activeRequests: 2,
    ongoingProjects: 2,
    lastActivity: "2025-02-10",
    status: "active",
  },
  {
    id: "3",
    customerNumber: "2025-03",
    name: "Maria Johansson",
    email: "maria@example.com",
    phone: "940 987 6574",
    city: "Malmö",
    activeRequests: 3,
    ongoingProjects: 3,
    lastActivity: "2025-02-10",
    status: "active",
  },
  {
    id: "4",
    customerNumber: "2025-04",
    name: "Johan Berg",
    email: "johan@example.com",
    phone: "940 987 6574",
    city: "Uppsala",
    activeRequests: 1,
    ongoingProjects: 1,
    lastActivity: "2025-02-10",
    status: "active",
  },
  {
    id: "5",
    customerNumber: "2025-05",
    name: "Sofia Lindqvist",
    email: "sofia@example.com",
    phone: "940 987 6574",
    city: "Västerås",
    activeRequests: 2,
    ongoingProjects: 1,
    lastActivity: "2025-02-09",
    status: "active",
  },
  {
    id: "6",
    customerNumber: "2025-06",
    name: "Magnus Karlsson",
    email: "magnus@example.com",
    phone: "940 987 6574",
    city: "Örebro",
    activeRequests: 0,
    ongoingProjects: 2,
    lastActivity: "2025-02-08",
    status: "active",
  },
  {
    id: "7",
    customerNumber: "2025-07",
    name: "Lena Nilsson",
    email: "lena@example.com",
    phone: "940 987 6574",
    city: "Linköping",
    activeRequests: 1,
    ongoingProjects: 0,
    lastActivity: "2025-02-07",
    status: "active",
  },
  {
    id: "8",
    customerNumber: "2025-08",
    name: "Patrik Eriksson",
    email: "patrik@example.com",
    phone: "940 987 6574",
    city: "Helsingborg",
    activeRequests: 3,
    ongoingProjects: 2,
    lastActivity: "2025-02-06",
    status: "active",
  },
  {
    id: "9",
    customerNumber: "2025-09",
    name: "Karin Andersson",
    email: "karin@example.com",
    phone: "940 987 6574",
    city: "Jönköping",
    activeRequests: 1,
    ongoingProjects: 1,
    lastActivity: "2025-02-05",
    status: "active",
  },
  {
    id: "10",
    customerNumber: "2025-10",
    name: "Anders Pettersson",
    email: "anders@example.com",
    phone: "940 987 6574",
    city: "Norrköping",
    activeRequests: 2,
    ongoingProjects: 3,
    lastActivity: "2025-02-04",
    status: "active",
  },
  {
    id: "11",
    customerNumber: "2025-11",
    name: "Ingrid Gustafsson",
    email: "ingrid@example.com",
    phone: "940 987 6574",
    city: "Umeå",
    activeRequests: 0,
    ongoingProjects: 1,
    lastActivity: "2025-02-03",
    status: "active",
  },
  {
    id: "12",
    customerNumber: "2025-12",
    name: "Lars Björk",
    email: "lars@example.com",
    phone: "940 987 6574",
    city: "Lund",
    activeRequests: 1,
    ongoingProjects: 2,
    lastActivity: "2025-02-02",
    status: "active",
  },
];

export interface CustomerListApiResponse {
  data: {
    items: Record<string, unknown>[];
    total_pages?: number;
    total_items?: number;
    current_page?: number;
    page_size?: number;
  };
  total_pages?: number;
  total_items?: number;
  current_page?: number;
  page_size?: number;
}

export async function listPrivateCustomersAPIAction(
  params: CustomerListQueryParams = {}
): Promise<CustomerListResult> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, search = "" } = params;

  if (MOCK_ENABLE) {
    let filtered = MOCK_CUSTOMERS;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = MOCK_CUSTOMERS.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.customerNumber.toLowerCase().includes(q)
      );
    }
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);
    return { items, totalPages, totalItems, currentPage: page, pageSize };
  }

  const response = await axiosInstance.get<CustomerListApiResponse>(
    CUSTOMERS_LIST_PATH,
    { params: { page, page_size: pageSize, search: search || undefined } }
  );

  const resData = response.data;
  const rawItems = Array.isArray(resData?.data)
    ? resData.data
    : resData?.data?.items ?? [];

  const mappedItems: PrivateCustomer[] = rawItems.map((item: Record<string, unknown>) => ({
    id: String(item.id ?? ""),
    customerNumber: String(item.customer_no || item.customerNumber || item.id || ""),
    name: String(item.name || `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() || "Unnamed"),
    email: String(item.email || "-"),
    phone: String(item.phone || "-"),
    city: String(item.city || "-"),
    activeRequests: Number(item.active_requests ?? item.activeRequests ?? 0),
    ongoingProjects: Number(item.ongoing_projects ?? item.ongoingProjects ?? 0),
    lastActivity: String(item.last_activity || item.lastActivity || "-"),
    status: (item.status as PrivateCustomer["status"]) || "active",
  }));

  return {
    items: mappedItems,
    totalPages: resData?.total_pages ?? resData?.data?.total_pages ?? 1,
    totalItems: resData?.total_items ?? resData?.data?.total_items ?? mappedItems.length,
    currentPage: resData?.current_page ?? resData?.data?.current_page ?? page,
    pageSize: resData?.page_size ?? resData?.data?.page_size ?? pageSize,
  };
}
