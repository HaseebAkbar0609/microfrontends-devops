export interface Discount {
  id: string;
  supplier: string;
  category: string;
  title: string;
  description: string;
  discountPct: number;
  brandInitials: string;
  thumbnailUrl?: string;
  logoUrl?: string;
}
