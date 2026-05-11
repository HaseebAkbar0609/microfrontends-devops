import OfferList from "@/features/offer/components/OfferList";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Timeflow",
  description: "View and manage all your quotations and offers in one place.",
};

export default function OfferPage() {
  return (
    <Suspense fallback={null}>
      <OfferList />
    </Suspense>
  );
}
