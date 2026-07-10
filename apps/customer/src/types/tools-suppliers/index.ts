import type { SupplierDetail, ToolDetail } from "@/api-actions";

export type { SupplierDetail, ToolDetail };

export const SUPPLIER_DETAIL_TABS = [
  "overview",
  "projects",
  "services",
  "documents",
  "reviews",
] as const;

export type SupplierDetailTabValue = (typeof SUPPLIER_DETAIL_TABS)[number];

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
