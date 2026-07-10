export const SUPPLIER_DETAIL_TABS = [
  "overview",
  "projects",
  "services",
  "documents",
  "reviews",
] as const;

export type SupplierDetailTabValue = (typeof SUPPLIER_DETAIL_TABS)[number];

export interface ToolDetail {
  type: "tool";
  id: string;
  name: string;
  logoUrl: string;
  status: "connected" | "disconnected" | "pending";
  category: string;
  description: string;
  website: string;
  apiKey?: string;
  webhookUrl?: string;
  syncFrequency?: "hourly" | "daily" | "weekly";
  permissions: string[];
  activityLogs: {
    timestamp: string;
    status: "success" | "failed";
    message: string;
  }[];
}

export interface Supplier {
  id: string;
  initials: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  isTopSupplier: boolean;
  isOnline: boolean;
  phone: string;
  email: string;
  website: string;
  languages: string;
  responseTime: string;
  lastActive: string;
  completedProjects: number;
  ongoingProjects: number;
  hasRotRut: boolean;
  description: string;
  certifications: number;
  mainMunicipality: string;
  additionalMunicipalities: number;
}

export interface SupplierDetail extends Supplier {
  type: "supplier";
}

export interface SupplierService {
  id: string;
  name: string;
  isPopular: boolean;
}

export interface SupplierReview {
  id: string;
  name: string;
  initials: string;
  date: string;
  timestamp: number;
  rating: number;
  text: string;
  tags: string[];
}

export interface StarBreakdown {
  stars: number;
  count: number;
  pct: number;
}

export interface PopularTag {
  label: string;
  count: number;
  isPopular: boolean;
}
