import SuppliersFeature from "@/features/suppliers/components/Index";
import { Metadata } from "next";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "TimeFlow",
  description: "View and manage your suppliers.",
};

export default function SuppliersPage() {
  return <SuppliersFeature />;
}
