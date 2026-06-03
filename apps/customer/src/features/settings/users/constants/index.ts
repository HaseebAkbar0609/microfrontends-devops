import { BreadcrumbItem } from "@/types/user";
import type { User, UserPermissions } from "../types/types";

import localizationConstants from "@/utils/translation/constants";

export const BREADCRUMBS: BreadcrumbItem[] = [
  { label: localizationConstants.home, href: "/home" },
  { label: localizationConstants.settings, href: "/settings" },
  { label: localizationConstants.users, href: "/settings/users" },
];

export const USERS_COLUMNS = [
  { label: localizationConstants.displayName, field: "first_name" },
  { label: localizationConstants.dateCreated, field: "date_created" },
  { label: localizationConstants.accountType, field: "account_type" },
  { label: localizationConstants.lastLogin, field: "last_login" },
  { label: localizationConstants.status, field: "status" },
  { label: localizationConstants.actions, field: "actions" },
] as const;

export const USER_PERMISSION_OPTIONS = [
  { key: "viewProjects", label: localizationConstants.userFormPermissionViewProjects },
  { key: "viewOffers", label: localizationConstants.userFormPermissionViewOffers },
  { key: "createProjects", label: localizationConstants.userFormPermissionCreateProjects },
  { key: "editProjects", label: localizationConstants.userFormPermissionEditProjects },
  { key: "approveOffers", label: localizationConstants.userFormPermissionApproveOffers },
  { key: "manageUsers", label: localizationConstants.userFormPermissionManageUsers },
] as const;

export const DEFAULT_USER_PERMISSIONS: UserPermissions = {
  viewProjects: false,
  createProjects: false,
  editProjects: false,
  viewOffers: false,
  approveOffers: false,
  manageUsers: false,
};

const ADMIN_PERMISSIONS: UserPermissions = {
  viewProjects: true,
  createProjects: true,
  editProjects: true,
  viewOffers: true,
  approveOffers: true,
  manageUsers: true,
};

// Mocked until backend user list/create/update/delete endpoints are ready.
export const DUMMY_USERS: User[] = [
  {
    id: "1",
    first_name: "John",
    last_name: "Doe",
    mobile_number: "070-123 45 67",
    private_email: "john.doe@example.com",
    address: "742 Evergreen Terrace",
    city: "Springfield",
    postal_code: "97477",
    personal_number: "19900101-1234",
    date_created: "2025-01-15",
    account_type: "admin",
    last_login: "2026-05-24T14:22:15Z",
    status: "active",
    permissions: ADMIN_PERMISSIONS,
  },
  {
    id: "2",
    first_name: "Jane",
    last_name: "Smith",
    mobile_number: "073-234 56 78",
    private_email: "jane.smith@example.com",
    address: "221B Baker Street",
    city: "London",
    postal_code: "NW1 6XE",
    personal_number: "19880518-5678",
    date_created: "2025-03-22",
    account_type: "users",
    last_login: "2026-05-25T01:10:00Z",
    status: "active",
    permissions: DEFAULT_USER_PERMISSIONS,
  },
  {
    id: "3",
    first_name: "Michael",
    last_name: "Brown",
    mobile_number: "076-345 67 89",
    private_email: "michael.b@example.com",
    address: "1600 Amphitheatre Parkway",
    city: "Mountain View",
    postal_code: "94043",
    personal_number: "19791102-2468",
    date_created: "2025-06-05",
    account_type: "users",
    last_login: "2026-05-20T09:34:11Z",
    status: "active",
    permissions: DEFAULT_USER_PERMISSIONS,
  },
  {
    id: "4",
    first_name: "Emily",
    last_name: "Davis",
    mobile_number: "079-456 78 90",
    private_email: "emily.davis@example.com",
    address: "350 Fifth Avenue",
    city: "New York",
    postal_code: "10118",
    personal_number: "19951224-1357",
    date_created: "2025-09-12",
    account_type: "users",
    last_login: "2026-04-15T23:11:45Z",
    status: "deactivated",
    permissions: DEFAULT_USER_PERMISSIONS,
  },
  {
    id: "5",
    first_name: "David",
    last_name: "Wilson",
    mobile_number: "072-567 89 01",
    private_email: "david.w@example.com",
    address: "410 Terry Ave N",
    city: "Seattle",
    postal_code: "98109",
    personal_number: "19830214-9753",
    date_created: "2025-12-01",
    account_type: "users",
    last_login: "2026-05-23T18:05:22Z",
    status: "deactivated",
    permissions: DEFAULT_USER_PERMISSIONS,
  },
];
