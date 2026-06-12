import axiosInstance from "@/lib/axiosInstance";
import type {
  CustomerListQueryParams,
  CustomerListResult,
  PendingCustomer,
} from "@/features/customers/types/types";

const MOCK_ENABLE = true; // TODO: set to false when real API is available
const PENDING_CUSTOMERS_LIST_PATH = "/api/v1/teams/customer/private/pending/list";
const DEFAULT_PAGE_SIZE = 10;

const MOCK_PENDING_CUSTOMERS: PendingCustomer[] = [
  { id: "p1", customerNumber: "2025-13", name: "Björn Lindström", email: "bjorn@example.com", phone: "940 987 6574", city: "Stockholm", lastActivity: "2025-03-01", status: "pending" },
  { id: "p2", customerNumber: "2025-14", name: "Cecilia Holm", email: "cecilia@example.com", phone: "940 987 6574", city: "Göteborg", lastActivity: "2025-03-02", status: "pending" },
  { id: "p3", customerNumber: "2025-15", name: "David Sjöberg", email: "david@example.com", phone: "940 987 6574", city: "Malmö", lastActivity: "2025-03-03", status: "pending" },
  { id: "p4", customerNumber: "2025-16", name: "Emma Forsberg", email: "emma@example.com", phone: "940 987 6574", city: "Uppsala", lastActivity: "2025-03-04", status: "pending" },
  { id: "p5", customerNumber: "2025-17", name: "Fredrik Lundgren", email: "fredrik@example.com", phone: "940 987 6574", city: "Västerås", lastActivity: "2025-03-05", status: "pending" },
  { id: "p6", customerNumber: "2025-18", name: "Gabriella Mäkinen", email: "gabriella@example.com", phone: "940 987 6574", city: "Örebro", lastActivity: "2025-03-06", status: "pending" },
  { id: "p7", customerNumber: "2025-19", name: "Henrik Söderberg", email: "henrik@example.com", phone: "940 987 6574", city: "Linköping", lastActivity: "2025-03-07", status: "pending" },
  { id: "p8", customerNumber: "2025-20", name: "Isabella Nyström", email: "isabella@example.com", phone: "940 987 6574", city: "Helsingborg", lastActivity: "2025-03-08", status: "pending" },
  { id: "p9", customerNumber: "2025-21", name: "Jonas Ekström", email: "jonas@example.com", phone: "940 987 6574", city: "Jönköping", lastActivity: "2025-03-09", status: "pending" },
  { id: "p10", customerNumber: "2025-22", name: "Klara Hedberg", email: "klara@example.com", phone: "940 987 6574", city: "Norrköping", lastActivity: "2025-03-10", status: "pending" },
  { id: "p11", customerNumber: "2025-23", name: "Lars-Erik Viklund", email: "larse@example.com", phone: "940 987 6574", city: "Umeå", lastActivity: "2025-03-11", status: "pending" },
  { id: "p12", customerNumber: "2025-24", name: "Maja Strand", email: "maja@example.com", phone: "940 987 6574", city: "Lund", lastActivity: "2025-03-12", status: "pending" },
];

interface PendingCustomerListApiResponse {
  data: {
    items: PendingCustomer[];
    total_pages: number;
    total_items: number;
    current_page: number;
    page_size: number;
  };
}

export async function listPendingCustomersAPIAction(
  params: CustomerListQueryParams = {}
): Promise<CustomerListResult<PendingCustomer>> {
  const { page = 1, pageSize = DEFAULT_PAGE_SIZE, search = "" } = params;

  if (MOCK_ENABLE) {
    let filtered = MOCK_PENDING_CUSTOMERS;
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = MOCK_PENDING_CUSTOMERS.filter(
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

  const response = await axiosInstance.get<PendingCustomerListApiResponse>(
    PENDING_CUSTOMERS_LIST_PATH,
    { params: { page, page_size: pageSize, search: search || undefined } }
  );
  const payload = response.data.data;
  return {
    items: payload.items ?? [],
    totalPages: payload.total_pages ?? 1,
    totalItems: payload.total_items ?? 0,
    currentPage: payload.current_page ?? page,
    pageSize: payload.page_size ?? pageSize,
  };
}
